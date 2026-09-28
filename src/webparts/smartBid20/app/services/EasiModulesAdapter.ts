/**
 * EasiModulesAdapter — ponte entre os dados reais do SMART BID 2.0 e os módulos
 * portados do EASI (@easi/smartbid-modules).
 *
 * Os módulos consomem linhas "planas" (Cost_Element / Opportunity / Labor_Element).
 * Aqui nós lemos os BIDs reais (BidService → lista smartbid-tracker, coluna jsondata)
 * e ACHATAMOS a estrutura aninhada do IBid nessas linhas.
 *
 * Registrado uma única vez no bootstrap (SmartBid20WebPart.onInit) via
 * configureSmartBidModules({ adapter: new EasiModulesAdapter() }).
 */
import type {
  SmartBidDataAdapter,
  BenchmarkDataset,
} from "@easi/smartbid-modules";
import { BidService } from "./BidService";
import { IBid } from "../models";

type ScopeItem = NonNullable<IBid["scopeItems"]>[number];
type AssetItem = NonNullable<IBid["assetBreakdown"]>[number];
type HoursItem = NonNullable<
  IBid["hoursSummary"]["onshoreHours"]["items"]
>[number];

type RawRow = Record<string, unknown>;

/** Deriva o `type_raw` (modalidade + CAPEX/OPEX) a partir do asset breakdown. */
function deriveTypeRaw(asset: AssetItem): string {
  const avail = String(asset.availabilityStatus || "").trim();
  const low = avail.toLowerCase();
  // In House / Onboard → ZERO PRICE; mantém o rótulo original.
  if (low.indexOf("house") !== -1 || low.indexOf("onboard") !== -1) return avail;
  // Sem modalidade clara: usa a categoria de custo para separar CAPEX/OPEX.
  if (!avail || low.indexOf("not available") !== -1) {
    if (asset.costCategory === "OPEX") return "Rental";
    if (asset.costCategory === "CAPEX") return "Purchase";
    return avail;
  }
  return avail;
}

export class EasiModulesAdapter implements SmartBidDataAdapter {
  private _cache: Promise<IBid[]> | undefined;

  private _bids(): Promise<IBid[]> {
    if (!this._cache) {
      // Se a lista não existir neste site (dados em outro SharePoint) ou a leitura
      // falhar, degradamos para vazio: as páginas mostram um empty state nativo em
      // vez de propagar o erro cru para dentro do módulo.
      this._cache = BidService.getAll().catch((err) => {
        console.warn(
          "[EASI modules] não foi possível carregar os BIDs; exibindo estado vazio.",
          err,
        );
        return [] as IBid[];
      });
    }
    return this._cache;
  }

  private _costRows(bids: IBid[]): RawRow[] {
    const rows: RawRow[] = [];
    for (const bid of bids) {
      const scopeById = new Map<string, ScopeItem>();
      for (const s of bid.scopeItems || []) scopeById.set(s.id, s);

      for (const asset of bid.assetBreakdown || []) {
        const scope = scopeById.get(asset.scopeItemId);
        if (!scope || scope.isSection) continue;
        const qty =
          (scope.qtyOperational || 0) + (scope.qtySpare || 0) || 1;
        rows.push({
          opportunity_id: bid.bidNumber,
          description: scope.description || "",
          pn: scope.partNumber || "",
          category_final: scope.resourceType || "",
          group: scope.resourceSubType || "",
          et_text: scope.clientRequirement || "",
          type_raw: deriveTypeRaw(asset),
          unit_price: asset.unitCostUSD || 0,
          quantity: qty,
          currency: "USD",
          premisses: asset.notes || "",
        });
      }
    }
    return rows;
  }

  private _opportunityRows(bids: IBid[]): RawRow[] {
    return bids.map((bid) => {
      const opp = bid.opportunityInfo;
      const project = (opp && opp.projectName) || bid.bidNumber;
      return {
        opportunity_id: bid.bidNumber,
        project,
        title: project,
        name: project,
        client: (opp && opp.client) || "",
        country: (opp && opp.region) || "",
        currency: (opp && opp.currency) || "USD",
        status: bid.currentStatus || "",
        project_domain: bid.division || "",
      };
    });
  }

  private _laborRows(bids: IBid[]): RawRow[] {
    const rows: RawRow[] = [];
    const push = (bid: IBid, item: HoursItem): void => {
      if (item.isSeparator) return;
      const totalHours = item.totalHours || 0;
      rows.push({
        opportunity_id: bid.bidNumber,
        function: item.function || "",
        phase: item.phase || "",
        hh_per_day: item.hoursPerDay,
        people_qty: item.pplQty,
        days: item.workDays,
        utilization: item.utilizationPercent,
        total_hh: totalHours,
        cost_rate: totalHours ? (item.costBRL || 0) / totalHours : null,
        currency_original: "BRL",
      });
    };
    for (const bid of bids) {
      const hs = bid.hoursSummary;
      if (!hs) continue;
      for (const item of (hs.onshoreHours && hs.onshoreHours.items) || [])
        push(bid, item);
      for (const item of (hs.offshoreHours && hs.offshoreHours.items) || [])
        push(bid, item);
    }
    return rows;
  }

  public async getBenchmarkDataset(): Promise<BenchmarkDataset> {
    const bids = await this._bids();
    return {
      cost: this._costRows(bids),
      opportunities: this._opportunityRows(bids),
      labor: this._laborRows(bids),
    };
  }

  public async getCostElementsRaw(): Promise<RawRow[]> {
    return this._costRows(await this._bids());
  }

  public async getOpportunitiesRaw(): Promise<RawRow[]> {
    return this._opportunityRows(await this._bids());
  }

  // Índice de estoque/fornecedores não existe no jsondata dos BIDs;
  // o módulo Suppliers fica para uma etapa futura.
  public async getSupplyIndex(): Promise<RawRow[]> {
    return [];
  }
}
