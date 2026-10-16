/**
 * useSupplierStore — Supplier register (smartbid-suppliers) shared by the
 * Suppliers page and every quotation entry point, so a supplier typed or
 * extracted on a quotation is registered once and reused afterwards.
 */
import { create } from "zustand";
import { SupplierService } from "../services/SupplierService";
import { AIAnalysisService } from "../services/AIAnalysisService";
import {
  ISupplier,
  ISupplierInput,
  ISupplierProfile,
  ISupplierProfileSuggestion,
} from "../models";
import { isAiConfigured } from "../config/ai.config";
import { useConfigStore } from "./useConfigStore";
import { useQuotationStore } from "./useQuotationStore";
import {
  findSupplierMatch,
  normalizeSupplierName,
} from "../utils/supplierMatching";
import {
  buildSupplierProfileText,
  groupQuotationsBySupplier,
  resolveServiceTypes,
} from "../utils/supplierProfile";

/** A supplier name used on a quotation. */
export interface ISupplierEntry {
  name: string;
  /** Name as written on the source document (learned as an alias). */
  sourceName?: string;
  /** What the quotation document says about the company (AI profile input). */
  about?: string;
}

export interface IEnsureSuppliersResult {
  created: ISupplier[];
  /** Names of existing suppliers that learned a new alias. */
  aliased: string[];
}

interface SupplierState {
  suppliers: ISupplier[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  /** Load once; concurrent callers share the same request. */
  loadSuppliers: () => Promise<void>;
  refreshSuppliers: () => Promise<void>;

  /** Registers missing suppliers and learns new aliases for existing ones. */
  ensureSuppliersForQuotations: (
    entries: ISupplierEntry[],
    options?: { autoProfile?: boolean },
  ) => Promise<IEnsureSuppliersResult>;

  /** Asks the AI for a profile from SmartBid data (no web access). */
  suggestProfile: (
    supplier: ISupplier,
    about?: string,
  ) => Promise<ISupplierProfileSuggestion>;

  saveProfile: (id: number, profile: ISupplierProfile) => Promise<void>;
}

let loadPromise: Promise<void> | undefined;

const byName = (a: ISupplier, b: ISupplier): number =>
  a.name.localeCompare(b.name);

function blankSupplier(name: string, aliases: string[]): ISupplierInput {
  return {
    name,
    aliases,
    country: "",
    description: "",
    keywords: [],
    serviceTypes: [],
    partNumbers: [],
    contacts: [],
    notes: "",
    active: true,
  };
}

function hasProfile(p: ISupplierProfileSuggestion): boolean {
  return !!p.description || p.keywords.length > 0 || p.serviceTypes.length > 0;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  loadSuppliers: () => {
    if (get().isLoaded) return Promise.resolve();
    if (!loadPromise) {
      // refreshSuppliers never rejects; it records the error in state.
      loadPromise = get()
        .refreshSuppliers()
        .then(() => {
          loadPromise = undefined;
        });
    }
    return loadPromise;
  },

  refreshSuppliers: async () => {
    set({ isLoading: true, error: null });
    try {
      const suppliers = await SupplierService.getAll();
      set({ suppliers, isLoaded: true, isLoading: false });
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      set({
        isLoading: false,
        error:
          "Could not load suppliers. Check that the smartbid-suppliers list exists on this site.",
      });
    }
  },

  ensureSuppliersForQuotations: async (entries, options) => {
    await get().loadSuppliers();
    // Without the current register every name would look new and be duplicated.
    if (!get().isLoaded) throw new Error(get().error || "Suppliers not loaded");
    let list = get().suppliers.slice();
    const created: ISupplier[] = [];
    const aliased: string[] = [];
    const aboutById: Record<number, string> = {};

    for (const entry of entries) {
      const name = (entry.name || "").trim();
      const key = normalizeSupplierName(name);
      if (!key) continue;
      const source = (entry.sourceName || "").trim();
      const sourceKey = normalizeSupplierName(source);
      const match = findSupplierMatch(name, list);

      if (!match) {
        const aliases = source && sourceKey !== key ? [source] : [];
        const input = blankSupplier(name, aliases);
        const id = await SupplierService.create(input);
        const supplier: ISupplier = { ...input, id };
        list.push(supplier);
        created.push(supplier);
        if (entry.about) aboutById[id] = entry.about;
        continue;
      }

      const known = [match.name]
        .concat(match.aliases)
        .some((n) => normalizeSupplierName(n) === sourceKey);
      if (!sourceKey || known) continue;
      const aliases = match.aliases.concat(source);
      if (await SupplierService.updateAliases(match.id, aliases)) {
        list = list.map((s) => (s.id === match.id ? { ...s, aliases } : s));
        if (aliased.indexOf(match.name) < 0) aliased.push(match.name);
      }
    }

    set({ suppliers: list.sort(byName) });

    const autoProfile = !options || options.autoProfile !== false;
    if (created.length > 0 && autoProfile && isAiConfigured()) {
      // Background: the quotation is already saved and must not wait for the AI.
      void (async () => {
        for (const supplier of created) {
          try {
            const profile = await get().suggestProfile(
              supplier,
              aboutById[supplier.id],
            );
            if (hasProfile(profile))
              await get().saveProfile(supplier.id, profile);
          } catch (err) {
            console.warn(`Supplier profile skipped for ${supplier.name}`, err);
          }
        }
      })();
    }

    return { created, aliased };
  },

  suggestProfile: async (supplier, about) => {
    const quotationStore = useQuotationStore.getState();
    await quotationStore.loadQuotations();
    const config = useConfigStore.getState().config;
    const groups = config?.favoriteGroups || [];
    const quotations =
      groupQuotationsBySupplier([supplier], useQuotationStore.getState().items)[
        supplier.id
      ] || [];
    const dossier = buildSupplierProfileText(
      supplier,
      quotations,
      groups,
      about,
    );
    const { active } = resolveServiceTypes(config?.supplierServiceTypes);
    return AIAnalysisService.suggestSupplierProfile(
      dossier,
      supplier.name,
      active,
    );
  },

  saveProfile: async (id, profile) => {
    await SupplierService.updateProfile(id, profile);
    set({
      suppliers: get().suppliers.map((s) =>
        s.id === id
          ? {
              ...s,
              description: profile.description,
              keywords: profile.keywords,
              serviceTypes: profile.serviceTypes,
            }
          : s,
      ),
    });
  },
}));
