/**
 * CurrencyService — Fetches exchange rates from the Banco Central do Brasil
 * PTAX API (official rates). Static singleton pattern.
 *
 * BCB PTAX endpoints:
 *   - CotacaoDolarDia: USD/BRL rate
 *   - CotacaoMoedaDia: other currency rates (returns paridade = USD parity)
 *
 * All rates are returned in "units-per-USD" format (e.g. BRL 5.16 means 1 USD = 5.16 BRL)
 * to stay compatible with the existing convertToUSD helper.
 */

const BCB_BASE =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata";

/** BCB currency type: A = rate is units-per-USD, B = rate is USD-per-unit */
const BCB_CURRENCY_TYPES: Record<string, "A" | "B"> = {
  AUD: "B",
  CAD: "A",
  CHF: "A",
  DKK: "A",
  EUR: "B",
  GBP: "B",
  JPY: "A",
  NOK: "A",
  SEK: "A",
};

interface IBCBDollarResponse {
  value: Array<{
    cotacaoCompra: number;
    cotacaoVenda: number;
    dataHoraCotacao: string;
  }>;
}

interface IBCBCurrencyResponse {
  value: Array<{
    paridadeCompra: number;
    paridadeVenda: number;
    cotacaoCompra: number;
    cotacaoVenda: number;
    dataHoraCotacao: string;
    tipoBoletim: string;
  }>;
}

export interface ICurrencyRate {
  currency: string;
  /** Units of this currency per 1 USD (e.g. BRL=5.16, NOK=9.73, GBP=0.76) */
  rate: number;
  /** Date/time string from BCB */
  timestamp: string;
}

export class CurrencyService {
  /**
   * Format a date as MM-DD-YYYY for the BCB API query parameter.
   * If no date provided, uses today.
   */
  private static formatDateForBCB(d?: Date): string {
    const dt = d || new Date();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  }

  /**
   * Fetch USD/BRL rate from CotacaoDolarDia endpoint.
   * Returns the selling rate (cotacaoVenda).
   */
  public static async getUsdBrl(date?: Date): Promise<ICurrencyRate | null> {
    const dateStr = CurrencyService.formatDateForBCB(date);
    const url =
      `${BCB_BASE}/CotacaoDolarDia(dataCotacao=@d)?` +
      `@d='${dateStr}'&$top=1&$format=json`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = (await resp.json()) as IBCBDollarResponse;
      if (!data.value || data.value.length === 0) return null;
      const entry = data.value[0];
      return {
        currency: "BRL",
        rate: Math.round(entry.cotacaoVenda * 100000) / 100000,
        timestamp: entry.dataHoraCotacao,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch a single non-USD currency rate via CotacaoMoedaDia.
   * Returns rate in units-per-USD format.
   */
  public static async getCurrencyRate(
    currency: string,
    date?: Date,
  ): Promise<ICurrencyRate | null> {
    const cur = currency.toUpperCase().trim();
    if (cur === "USD") return { currency: "USD", rate: 1, timestamp: "" };
    if (cur === "BRL") return CurrencyService.getUsdBrl(date);

    const dateStr = CurrencyService.formatDateForBCB(date);
    const url =
      `${BCB_BASE}/CotacaoMoedaDia(moeda=@m,dataCotacao=@d)?` +
      `@m='${cur}'&@d='${dateStr}'` +
      `&$top=1&$orderby=dataHoraCotacao%20desc&$format=json`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = (await resp.json()) as IBCBCurrencyResponse;
      if (!data.value || data.value.length === 0) return null;
      const entry = data.value[0];
      const tipo = BCB_CURRENCY_TYPES[cur];
      let unitsPerUSD: number;
      if (tipo === "A") {
        // Type A: paridadeVenda IS already units-per-USD
        unitsPerUSD = entry.paridadeVenda;
      } else {
        // Type B: paridadeVenda is USD-per-unit, invert to get units-per-USD
        unitsPerUSD =
          entry.paridadeVenda > 0
            ? Math.round((1 / entry.paridadeVenda) * 100000) / 100000
            : 0;
      }
      return {
        currency: cur,
        rate: unitsPerUSD,
        timestamp: entry.dataHoraCotacao,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch rates for multiple currencies at once.
   * Returns an array of rates (skips currencies that fail).
   */
  public static async getRates(
    currencies: string[],
    date?: Date,
  ): Promise<ICurrencyRate[]> {
    const results: ICurrencyRate[] = [];
    // Fetch sequentially to avoid hitting BCB rate limits
    for (let i = 0; i < currencies.length; i++) {
      const cur = currencies[i];
      const result = await CurrencyService.getCurrencyRate(cur, date);
      if (result) results.push(result);
    }
    return results;
  }

  /**
   * Fetch all rates from BCB, falling back to previous day if today has
   * no data yet (weekends / holidays / before market open).
   */
  public static async getRatesWithFallback(
    currencies: string[],
  ): Promise<ICurrencyRate[]> {
    // Try today first
    const today = new Date();
    let rates = await CurrencyService.getRates(currencies, today);
    if (rates.length > 0) return rates;

    // Fallback: try previous business days (up to 5 days back)
    for (let daysBack = 1; daysBack <= 5; daysBack++) {
      const fallback = new Date(today);
      fallback.setDate(fallback.getDate() - daysBack);
      rates = await CurrencyService.getRates(currencies, fallback);
      if (rates.length > 0) return rates;
    }
    return [];
  }
}
