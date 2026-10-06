import * as React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Search, Sparkles, X } from "lucide-react";
import styles from "./SuppliersRegistry.module.scss";
import { SupplierService, validateLogo } from "../services/SupplierService";
import {
  ISupplier,
  ISupplierContact,
  ISupplierInput,
  ISupplierProfileSuggestion,
  SupplierProfileBasis,
} from "../models";
import { useUIStore } from "../stores/useUIStore";
import { useSupplierStore } from "../stores/useSupplierStore";
import { useQuotationStore } from "../stores/useQuotationStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useSupplierServiceTypes } from "../hooks/useSupplierServiceTypes";
import { usePageAccess } from "../hooks/usePageAccess";
import { MultiSelectDropdown } from "../components/insights/MultiSelectDropdown";
import { SupplierDrawer } from "../components/suppliers/SupplierDrawer";
import { isAiConfigured } from "../config/ai.config";
import { ROUTES } from "../config/routes.config";
import {
  buildSupplierKeyIndex,
  findPossibleMatch,
  findSupplierMatch,
  normalizeSupplierName,
  toTradeName,
} from "../utils/supplierMatching";
import {
  getSupplyCategories,
  groupQuotationsBySupplier,
} from "../utils/supplierProfile";
import { matchesAnyOf, normalizeText } from "../utils/pastBidHelpers";
import { countFacets, withCounts } from "../utils/facetHelpers";

const emptyContact = (): ISupplierContact => ({
  name: "",
  email: "",
  phone: "",
});

interface FormState {
  name: string;
  aliasesText: string;
  country: string;
  description: string;
  keywordsText: string;
  serviceTypes: string[];
  pnsText: string;
  contacts: ISupplierContact[];
  notes: string;
  active: boolean;
}

const emptyForm = (): FormState => ({
  name: "",
  aliasesText: "",
  country: "",
  description: "",
  keywordsText: "",
  serviceTypes: [],
  pnsText: "",
  contacts: [emptyContact()],
  notes: "",
  active: true,
});

const formFromSupplier = (s: ISupplier): FormState => ({
  name: s.name,
  aliasesText: s.aliases.join("\n"),
  country: s.country,
  description: s.description,
  keywordsText: s.keywords.join(", "),
  serviceTypes: s.serviceTypes.slice(),
  pnsText: s.partNumbers.join("\n"),
  contacts: s.contacts.length
    ? s.contacts.map((c) => ({ ...c }))
    : [emptyContact()],
  notes: s.notes,
  active: s.active,
});

const splitCommas = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const splitLines = (raw: string): string[] =>
  raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

const splitLinesOnly = (raw: string): string[] =>
  raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

/** Case-insensitive union that keeps the first spelling seen. */
const mergeUnique = (base: string[], extra: string[]): string[] => {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  base.concat(extra).forEach((v) => {
    const key = v.trim().toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    out.push(v.trim());
  });
  return out;
};

const hasSuggestion = (s: ISupplierProfileSuggestion): boolean =>
  !!s.description || s.keywords.length > 0 || s.serviceTypes.length > 0;

const BASIS_LABELS: Record<SupplierProfileBasis, string> = {
  quotations: "Based on this supplier's quotations",
  document: "Based on its quotation document",
  "general-knowledge": "Based on general knowledge - please review",
  mixed: "Based on quotations and general knowledge - please review",
  none: "Not enough information - fields left blank",
};

const MAX_CARD_KEYWORDS = 6;

interface Filters {
  serviceTypes: string[];
  supplyCategories: string[];
  keywords: string[];
  countries: string[];
  statuses: string[];
}

const EMPTY_FILTERS: Filters = {
  serviceTypes: [],
  supplyCategories: [],
  keywords: [],
  countries: [],
  statuses: [],
};

interface SyncRow {
  key: string;
  /** Distinct spellings found on quotations, most used first. */
  variants: string[];
  count: number;
  action: "create" | "alias" | "skip";
  name: string;
  aliasOf: number | "";
}

interface EnrichRow {
  supplier: ISupplier;
  status: "waiting" | "running" | "done" | "error";
  suggestion?: ISupplierProfileSuggestion;
  accept: boolean;
}

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const SupplierLogo: React.FC<{ name: string; url?: string | null }> = ({
  name,
  url,
}) =>
  url ? (
    <img className={styles.logo} src={url} alt={`Logo ${name}`} />
  ) : (
    <span className={styles.logoFallback}>{initials(name)}</span>
  );

/**
 * Cadastro nativo de fornecedores (list smartbid-suppliers): formulário +
 * tabela com editar/excluir, no visual do SMART BID 2.0.
 */
export const SuppliersRegistry: React.FC = () => {
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();
  const { canEdit } = usePageAccess();

  const suppliers = useSupplierStore((s) => s.suppliers);
  const isLoaded = useSupplierStore((s) => s.isLoaded);
  const isLoading = useSupplierStore((s) => s.isLoading);
  const error = useSupplierStore((s) => s.error);
  const loadSuppliers = useSupplierStore((s) => s.loadSuppliers);
  const refreshSuppliers = useSupplierStore((s) => s.refreshSuppliers);
  const ensureSuppliers = useSupplierStore(
    (s) => s.ensureSuppliersForQuotations,
  );
  const suggestProfile = useSupplierStore((s) => s.suggestProfile);
  const saveProfile = useSupplierStore((s) => s.saveProfile);

  const quotations = useQuotationStore((s) => s.items);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);
  const favoriteGroups = useConfigStore((s) => s.config?.favoriteGroups);
  const groups = React.useMemo(() => favoriteGroups || [], [favoriteGroups]);
  const serviceTypes = useSupplierServiceTypes();
  const aiEnabled = isAiConfigured();

  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // editing: null = form fechado; "new" = criando; número = editando aquele Id.
  const [editing, setEditing] = React.useState<"new" | number | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [generatedBasis, setGeneratedBasis] =
    React.useState<SupplierProfileBasis | null>(null);

  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [syncRows, setSyncRows] = React.useState<SyncRow[] | null>(null);
  const [syncBusy, setSyncBusy] = React.useState(false);

  const [enrichRows, setEnrichRows] = React.useState<EnrichRow[] | null>(null);
  const [enrichRunning, setEnrichRunning] = React.useState(false);
  const [enrichSaving, setEnrichSaving] = React.useState(false);
  const enrichCancelRef = React.useRef(false);

  // Object URLs from the file picker must be released when replaced.
  React.useEffect(() => {
    if (!logoPreview || logoPreview.indexOf("blob:") !== 0) return undefined;
    return () => URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  React.useEffect(() => {
    void loadSuppliers();
    void loadQuotations();
  }, [loadSuppliers, loadQuotations]);

  React.useEffect(
    () => () => {
      enrichCancelRef.current = true;
    },
    [],
  );

  const quotesBySupplier = React.useMemo(
    () => groupQuotationsBySupplier(suppliers, quotations),
    [suppliers, quotations],
  );

  const supplyBySupplier = React.useMemo(() => {
    const map: Record<number, string[]> = {};
    suppliers.forEach((s) => {
      map[s.id] = getSupplyCategories(quotesBySupplier[s.id] || [], groups);
    });
    return map;
  }, [suppliers, quotesBySupplier, groups]);

  const serviceTypeLabel = React.useCallback(
    (id: string): string => {
      const opt = serviceTypes.byId[id];
      return opt ? opt.label : "";
    },
    [serviceTypes],
  );

  const set = (patch: Partial<FormState>): void =>
    setForm((f) => ({ ...f, ...patch }));

  const setContact = (i: number, patch: Partial<ISupplierContact>): void =>
    setForm((f) => ({
      ...f,
      contacts: f.contacts.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c,
      ),
    }));

  const addContactRow = (): void =>
    setForm((f) => ({ ...f, contacts: [...f.contacts, emptyContact()] }));

  const removeContactRow = (i: number): void =>
    setForm((f) => ({
      ...f,
      contacts:
        f.contacts.length > 1
          ? f.contacts.filter((_, idx) => idx !== i)
          : f.contacts,
    }));

  const toggleFormServiceType = (id: string): void =>
    setForm((f) => ({
      ...f,
      serviceTypes:
        f.serviceTypes.indexOf(id) >= 0
          ? f.serviceTypes.filter((t) => t !== id)
          : f.serviceTypes.concat(id),
    }));

  const resetLogo = (url: string | null): void => {
    setLogoFile(null);
    setLogoPreview(url);
    setRemoveLogo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pickLogo = (file: File | undefined): void => {
    if (!file) return;
    const error = validateLogo(file);
    if (error) {
      addToast({ type: "warning", title: error });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setRemoveLogo(false);
  };

  const clearLogo = (): void => {
    resetLogo(null);
    setRemoveLogo(true);
  };

  const openNew = (): void => {
    setForm(emptyForm());
    resetLogo(null);
    setGeneratedBasis(null);
    setEditing("new");
  };

  const openEdit = (s: ISupplier): void => {
    setForm(formFromSupplier(s));
    resetLogo(s.logoUrl || null);
    setGeneratedBasis(null);
    setEditing(s.id);
  };

  const closeForm = (): void => {
    setEditing(null);
    setForm(emptyForm());
    resetLogo(null);
    setGeneratedBasis(null);
  };

  const formToInput = (f: FormState): ISupplierInput => ({
    name: f.name.trim(),
    aliases: mergeUnique([], splitLinesOnly(f.aliasesText)),
    country: f.country,
    description: f.description,
    keywords: mergeUnique([], splitCommas(f.keywordsText)),
    // Ids of deleted service types are dropped on save.
    serviceTypes: f.serviceTypes.filter((id) => !!serviceTypes.byId[id]),
    partNumbers: splitLines(f.pnsText),
    contacts: f.contacts,
    notes: f.notes,
    active: f.active,
  });

  const generateProfile = async (): Promise<void> => {
    if (!form.name.trim()) {
      addToast({ type: "warning", title: "Enter the supplier name first." });
      return;
    }
    setGenerating(true);
    try {
      const draft: ISupplier = {
        ...formToInput(form),
        id: typeof editing === "number" ? editing : -1,
      };
      const suggestion = await suggestProfile(draft);
      setGeneratedBasis(suggestion.basis);
      if (!hasSuggestion(suggestion)) {
        addToast({
          type: "info",
          title:
            "Not enough information about this supplier - fields left blank",
        });
        return;
      }
      const current = form.description.trim();
      const replaceDescription =
        !!suggestion.description &&
        (!current ||
          current === suggestion.description ||
          window.confirm(
            "Replace the current description with the AI suggestion?",
          ));
      setForm((f) => ({
        ...f,
        description: replaceDescription
          ? suggestion.description
          : f.description,
        keywordsText: mergeUnique(
          splitCommas(f.keywordsText),
          suggestion.keywords,
        ).join(", "),
        serviceTypes: mergeUnique(f.serviceTypes, suggestion.serviceTypes),
      }));
    } catch (err) {
      addToast({
        type: "error",
        title: err instanceof Error ? err.message : "AI suggestion failed",
      });
    } finally {
      setGenerating(false);
    }
  };

  const submit = async (): Promise<void> => {
    if (!form.name.trim()) {
      addToast({ type: "warning", title: "Enter the supplier name." });
      return;
    }
    const others = suppliers.filter((s) => s.id !== editing);
    const duplicate = findSupplierMatch(form.name, others);
    if (duplicate) {
      addToast({
        type: "warning",
        title: `"${duplicate.name}" is already registered. Edit it instead of adding a duplicate.`,
      });
      return;
    }
    setSaving(true);
    const input = formToInput(form);
    try {
      if (editing === "new") {
        await SupplierService.create(input, logoFile);
        addToast({ type: "success", title: "Supplier added." });
      } else if (typeof editing === "number") {
        await SupplierService.update(editing, input, logoFile, removeLogo);
        addToast({ type: "success", title: "Supplier updated." });
      }
      closeForm();
      await refreshSuppliers();
    } catch (err) {
      console.error("[Suppliers] falha ao salvar", err);
      addToast({
        type: "error",
        title: "Could not save the supplier.",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: ISupplier): Promise<void> => {
    if (!window.confirm(`Remove supplier "${s.name}"?`)) return;
    setDeletingId(s.id);
    try {
      await SupplierService.remove(s.id);
      addToast({ type: "info", title: "Supplier removed." });
      if (editing === s.id) closeForm();
      if (selectedId === s.id) setSelectedId(null);
      await refreshSuppliers();
    } catch (err) {
      console.error("[Suppliers] falha ao remover", err);
      addToast({
        type: "error",
        title: "Could not remove the supplier.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  /* ---- Sync from quotations ------------------------------------- */

  const openSync = async (): Promise<void> => {
    setSyncRows([]);
    setSyncBusy(true);
    try {
      await loadQuotations();
      const items = useQuotationStore.getState().items;
      const index = buildSupplierKeyIndex(suppliers);
      const groupsByKey: Record<string, Record<string, number>> = {};
      items.forEach((q) => {
        const raw = (q.supplier || "").trim();
        const key = normalizeSupplierName(raw);
        if (!key || index[key]) return;
        const variants = (groupsByKey[key] = groupsByKey[key] || {});
        variants[raw] = (variants[raw] || 0) + 1;
      });
      const rows: SyncRow[] = Object.keys(groupsByKey).map((key) => {
        const counts = groupsByKey[key];
        const variants = Object.keys(counts).sort(
          (a, b) => counts[b] - counts[a] || a.localeCompare(b),
        );
        const possible = findPossibleMatch(variants[0], suppliers);
        return {
          key,
          variants,
          count: variants.reduce((sum, v) => sum + counts[v], 0),
          action: possible ? "alias" : "create",
          name: toTradeName(variants[0]),
          aliasOf: possible ? possible.id : "",
        };
      });
      rows.sort((a, b) => a.variants[0].localeCompare(b.variants[0]));
      setSyncRows(rows);
    } finally {
      setSyncBusy(false);
    }
  };

  const updateSyncRow = (key: string, patch: Partial<SyncRow>): void =>
    setSyncRows((rows) =>
      rows ? rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) : rows,
    );

  const applySync = async (): Promise<void> => {
    if (!syncRows) return;
    const entries: { name: string; sourceName: string }[] = [];
    syncRows.forEach((r) => {
      if (r.action === "create" && r.name.trim()) {
        r.variants.forEach((v) =>
          entries.push({ name: r.name.trim(), sourceName: v }),
        );
      } else if (r.action === "alias" && r.aliasOf !== "") {
        const target = suppliers.find((s) => s.id === r.aliasOf);
        if (target)
          r.variants.forEach((v) =>
            entries.push({ name: target.name, sourceName: v }),
          );
      }
    });
    if (entries.length === 0) {
      setSyncRows(null);
      return;
    }
    setSyncBusy(true);
    try {
      const { created, aliased } = await ensureSuppliers(entries, {
        autoProfile: false,
      });
      addToast({
        type: "success",
        title: `${created.length} supplier${created.length === 1 ? "" : "s"} added, ${aliased.length} updated with new names`,
      });
      setSyncRows(null);
    } catch (err) {
      console.error("[Suppliers] sync failed", err);
      addToast({ type: "error", title: "Could not sync suppliers." });
    } finally {
      setSyncBusy(false);
    }
  };

  /* ---- Enrich with AI ------------------------------------------- */

  const startEnrich = async (): Promise<void> => {
    const targets = suppliers.filter(
      (s) => !s.description.trim() || s.keywords.length === 0,
    );
    if (targets.length === 0) {
      addToast({
        type: "info",
        title: "Every supplier already has a description and keywords.",
      });
      return;
    }
    enrichCancelRef.current = false;
    setEnrichRows(
      targets.map((supplier) => ({
        supplier,
        status: "waiting",
        accept: false,
      })),
    );
    setEnrichRunning(true);
    for (const supplier of targets) {
      if (enrichCancelRef.current) break;
      const patchRow = (patch: Partial<EnrichRow>): void =>
        setEnrichRows((rows) =>
          rows
            ? rows.map((r) =>
                r.supplier.id === supplier.id ? { ...r, ...patch } : r,
              )
            : rows,
        );
      patchRow({ status: "running" });
      try {
        const suggestion = await suggestProfile(supplier);
        patchRow({
          status: "done",
          suggestion,
          accept: hasSuggestion(suggestion),
        });
      } catch (err) {
        console.warn(`[Suppliers] enrich failed for ${supplier.name}`, err);
        patchRow({ status: "error" });
      }
    }
    setEnrichRunning(false);
  };

  const closeEnrich = (): void => {
    enrichCancelRef.current = true;
    setEnrichRunning(false);
    setEnrichRows(null);
  };

  const saveEnrich = async (): Promise<void> => {
    if (!enrichRows) return;
    const accepted = enrichRows.filter((r) => r.accept && r.suggestion);
    setEnrichSaving(true);
    let saved = 0;
    for (const row of accepted) {
      const s = row.supplier;
      const suggestion = row.suggestion as ISupplierProfileSuggestion;
      try {
        await saveProfile(s.id, {
          description: s.description.trim() || suggestion.description,
          keywords: mergeUnique(s.keywords, suggestion.keywords),
          serviceTypes: mergeUnique(s.serviceTypes, suggestion.serviceTypes),
        });
        saved += 1;
      } catch (err) {
        console.error(`[Suppliers] could not save profile of ${s.name}`, err);
      }
    }
    setEnrichSaving(false);
    setEnrichRows(null);
    addToast({
      type: saved === accepted.length ? "success" : "warning",
      title: `${saved} of ${accepted.length} supplier profile${accepted.length === 1 ? "" : "s"} saved`,
    });
  };

  /* ---- Filters --------------------------------------------------- */

  const setFilter =
    (key: keyof Filters) =>
    (values: string[]): void =>
      setFilters((f) => ({ ...f, [key]: values }));

  const hasFilters =
    !!query.trim() ||
    Object.keys(filters).some((k) => filters[k as keyof Filters].length > 0);

  // Option lists come from all suppliers so choices don't vanish while filtering
  const options = React.useMemo(() => {
    const count = (values: string[][]): Record<string, number> => {
      const counts: Record<string, number> = {};
      values.forEach((list) =>
        list.forEach((v) => (counts[v] = (counts[v] || 0) + 1)),
      );
      return counts;
    };
    const typeCounts = count(suppliers.map((s) => s.serviceTypes));
    const usedTypes = serviceTypes.all.filter(
      (o) => o.isActive !== false || typeCounts[o.id],
    );
    const supplyCounts = count(
      suppliers.map((s) => supplyBySupplier[s.id] || []),
    );
    const keywordLabels: Record<string, string> = {};
    const keywordCounts = count(
      suppliers.map((s) =>
        mergeUnique([], s.keywords).map((k) => {
          const key = k.toLowerCase();
          if (!keywordLabels[key]) keywordLabels[key] = k;
          return key;
        }),
      ),
    );
    const countryCounts = count(
      suppliers.map((s) => (s.country.trim() ? [s.country.trim()] : [])),
    );
    const byLabel = (a: { label: string }, b: { label: string }): number =>
      a.label.localeCompare(b.label);
    return {
      serviceTypes: usedTypes.map((o) => ({ value: o.id, label: o.label })),
      supplyCategories: Object.keys(supplyCounts)
        .map((v) => ({ value: v, label: v }))
        .sort(byLabel),
      keywords: Object.keys(keywordCounts)
        .map((v) => ({ value: v, label: keywordLabels[v] }))
        .sort(byLabel),
      countries: Object.keys(countryCounts)
        .map((v) => ({ value: v, label: v }))
        .sort(byLabel),
      statuses: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    };
  }, [suppliers, serviceTypes, supplyBySupplier]);

  const facetValues = React.useMemo<
    Record<keyof Filters, (s: ISupplier) => string[]>
  >(
    () => ({
      serviceTypes: (s) => s.serviceTypes,
      supplyCategories: (s) => supplyBySupplier[s.id] || [],
      keywords: (s) => s.keywords.map((k) => k.toLowerCase()),
      countries: (s) => [s.country.trim()],
      statuses: (s) => [s.active ? "active" : "inactive"],
    }),
    [supplyBySupplier],
  );

  const searchTextById = React.useMemo(() => {
    const map: Record<string, string> = {};
    suppliers.forEach((s) => {
      map[s.id] = normalizeText(
        [
          s.name,
          s.aliases.join(" "),
          s.country,
          s.description,
          s.keywords.join(" "),
          s.serviceTypes.map(serviceTypeLabel).join(" "),
          (supplyBySupplier[s.id] || []).join(" "),
          s.partNumbers.join(" "),
          s.contacts.map((c) => `${c.name} ${c.email}`).join(" "),
        ].join(" "),
      );
    });
    return map;
  }, [suppliers, supplyBySupplier, serviceTypeLabel]);

  const normalizedQuery = normalizeText(query.trim());

  // `skip` lets a dropdown count against the other filters
  const passesFilters = React.useCallback(
    (s: ISupplier, skip?: keyof Filters): boolean =>
      (Object.keys(facetValues) as (keyof Filters)[]).every(
        (key) =>
          key === skip || matchesAnyOf(filters[key], facetValues[key](s)),
      ) &&
      (!normalizedQuery ||
        (searchTextById[s.id] || "").indexOf(normalizedQuery) !== -1),
    [filters, facetValues, normalizedQuery, searchTextById],
  );

  const filtered = React.useMemo(
    () => suppliers.filter((s) => passesFilters(s)),
    [suppliers, passesFilters],
  );

  const facetCounts = React.useMemo(
    () => countFacets(suppliers, facetValues, passesFilters),
    [suppliers, facetValues, passesFilters],
  );

  const selected =
    selectedId !== null
      ? suppliers.find((s) => s.id === selectedId)
      : undefined;

  const formTypeOptions = serviceTypes.active.concat(
    serviceTypes.all.filter(
      (o) => o.isActive === false && form.serviceTypes.indexOf(o.id) >= 0,
    ),
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search name, description, keyword, service, PN…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search suppliers"
          />
        </div>
        <MultiSelectDropdown
          label="Service type"
          options={withCounts(options.serviceTypes, facetCounts.serviceTypes)}
          selected={filters.serviceTypes}
          onChange={setFilter("serviceTypes")}
          searchable
        />
        <MultiSelectDropdown
          label="Supply category"
          options={withCounts(
            options.supplyCategories,
            facetCounts.supplyCategories,
          )}
          selected={filters.supplyCategories}
          onChange={setFilter("supplyCategories")}
        />
        <MultiSelectDropdown
          label="Keywords"
          options={withCounts(options.keywords, facetCounts.keywords)}
          selected={filters.keywords}
          onChange={setFilter("keywords")}
          searchable
        />
        <MultiSelectDropdown
          label="Country"
          options={withCounts(options.countries, facetCounts.countries)}
          selected={filters.countries}
          onChange={setFilter("countries")}
        />
        <MultiSelectDropdown
          label="Status"
          options={withCounts(options.statuses, facetCounts.statuses)}
          selected={filters.statuses}
          onChange={setFilter("statuses")}
        />
        {hasFilters && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setQuery("");
              setFilters(EMPTY_FILTERS);
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {canEdit && (
      <div className={styles.toolbar}>
        {editing === null && (
          <button className={styles.btnPrimary} onClick={openNew}>
            ＋ Add supplier
          </button>
        )}
        <button
          className={styles.btnGhost}
          onClick={() => void openSync()}
          disabled={syncBusy || !isLoaded}
        >
          <RefreshCw size={14} /> Sync from quotations
        </button>
        {aiEnabled && (
          <button
            className={styles.btnGhost}
            onClick={() => void startEnrich()}
            disabled={enrichRunning || enrichRows !== null || !isLoaded}
          >
            <Sparkles size={14} /> Enrich with AI
          </button>
        )}
      </div>
      )}

      {editing !== null && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              {editing === "new" ? "New supplier" : "Edit supplier"}
            </h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.grid}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  Logo{" "}
                  <span className={styles.hint}>
                    (PNG, JPG, WEBP, SVG or GIF - up to 1 MB)
                  </span>
                </label>
                <div className={styles.logoField}>
                  <span className={styles.logoPreview}>
                    <SupplierLogo name={form.name} url={logoPreview} />
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    className={styles.hiddenInput}
                    onChange={(e) => pickLogo(e.target.files?.[0])}
                  />
                  <button
                    className={styles.btnGhost}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    {logoPreview ? "Change image" : "Choose image"}
                  </button>
                  {logoPreview && (
                    <button
                      className={styles.linkBtn}
                      onClick={clearLogo}
                      disabled={saving}
                    >
                      Remove logo
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Supplier name *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  className={styles.input}
                  value={form.country}
                  onChange={(e) => set({ country: e.target.value })}
                />
              </div>
              <div className={styles.fieldFull}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>
                    Description{" "}
                    <span className={styles.hint}>
                      (what the company does and its specialty)
                    </span>
                  </label>
                  {aiEnabled && (
                    <button
                      type="button"
                      className={styles.aiBtn}
                      onClick={() => void generateProfile()}
                      disabled={generating || saving}
                      title="Suggest description, keywords and service types from SmartBid data"
                    >
                      <Sparkles size={13} />
                      {generating ? "Generating…" : "Generate with AI"}
                    </button>
                  )}
                </div>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
                {generatedBasis && (
                  <span className={styles.basisHint}>
                    {BASIS_LABELS[generatedBasis]}
                  </span>
                )}
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Service types</label>
                <div className={styles.typePicker}>
                  {formTypeOptions.map((o) => {
                    const on = form.serviceTypes.indexOf(o.id) >= 0;
                    return (
                      <button
                        type="button"
                        key={o.id}
                        className={`${styles.typeChip} ${on ? styles.typeChipOn : ""}`}
                        onClick={() => toggleFormServiceType(o.id)}
                        aria-pressed={on}
                      >
                        {o.label}
                        {o.isActive === false ? " (inactive)" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Keywords{" "}
                  <span className={styles.hint}>(comma-separated)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="hot stab, ROV clamp, CNC machining"
                  value={form.keywordsText}
                  onChange={(e) => set({ keywordsText: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Also known as{" "}
                  <span className={styles.hint}>(one name per line)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Legal names or other spellings seen on quotations"
                  value={form.aliasesText}
                  onChange={(e) => set({ aliasesText: e.target.value })}
                />
              </div>
              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  Part Numbers{" "}
                  <span className={styles.hint}>(one per line)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  value={form.pnsText}
                  onChange={(e) => set({ pnsText: e.target.value })}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Contacts</label>
                {form.contacts.map((c, i) => (
                  <div key={i} className={styles.contactRow}>
                    <input
                      className={styles.input}
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => setContact(i, { name: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      placeholder="E-mail"
                      value={c.email}
                      onChange={(e) => setContact(i, { email: e.target.value })}
                    />
                    <input
                      className={styles.input}
                      placeholder="Phone"
                      value={c.phone || ""}
                      onChange={(e) => setContact(i, { phone: e.target.value })}
                    />
                    <button
                      className={styles.iconBtn}
                      onClick={() => removeContactRow(i)}
                      disabled={form.contacts.length <= 1}
                      title="Remove contact"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button className={styles.linkBtn} onClick={addContactRow}>
                  ＋ Add contact
                </button>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Notes</label>
                <textarea
                  className={styles.textarea}
                  value={form.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => set({ active: e.target.checked })}
                  />
                  Active supplier
                </label>
              </div>
            </div>

            <div className={styles.footer}>
              <button
                className={styles.btnGhost}
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => void submit()}
                disabled={saving}
              >
                {saving
                  ? "Saving…"
                  : editing === "new"
                    ? "Add"
                    : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {syncRows !== null && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sync from quotations</h3>
            <span className={styles.subtle}>
              Supplier names used on quotations that are not registered yet
            </span>
          </div>
          <div className={styles.cardBody}>
            {syncBusy && syncRows.length === 0 ? (
              <div className={styles.stateBox}>
                <span className={styles.spinner} />
              </div>
            ) : syncRows.length === 0 ? (
              <p className={styles.stateText}>
                Every supplier used on quotations is already registered.
              </p>
            ) : (
              <div className={styles.reviewList}>
                {syncRows.map((r) => (
                  <div key={r.key} className={styles.reviewRow}>
                    <div className={styles.reviewInfo}>
                      <span className={styles.reviewTitle}>
                        {r.variants[0]}
                      </span>
                      {r.variants.length > 1 && (
                        <span className={styles.subtle}>
                          Also written as: {r.variants.slice(1).join(" | ")}
                        </span>
                      )}
                      <span className={styles.subtle}>
                        {r.count} quotation item{r.count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <select
                      className={styles.input}
                      value={r.action}
                      onChange={(e) =>
                        updateSyncRow(r.key, {
                          action: e.target.value as SyncRow["action"],
                        })
                      }
                      aria-label={`Action for ${r.variants[0]}`}
                    >
                      <option value="create">Create new supplier</option>
                      <option value="alias" disabled={suppliers.length === 0}>
                        Same as a registered supplier
                      </option>
                      <option value="skip">Skip</option>
                    </select>
                    {r.action === "create" && (
                      <input
                        className={styles.input}
                        value={r.name}
                        onChange={(e) =>
                          updateSyncRow(r.key, { name: e.target.value })
                        }
                        aria-label="New supplier name"
                      />
                    )}
                    {r.action === "alias" && (
                      <select
                        className={styles.input}
                        value={r.aliasOf === "" ? "" : String(r.aliasOf)}
                        onChange={(e) =>
                          updateSyncRow(r.key, {
                            aliasOf: e.target.value
                              ? Number(e.target.value)
                              : "",
                          })
                        }
                        aria-label="Registered supplier"
                      >
                        <option value="">Select supplier...</option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {r.action === "skip" && <span />}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.footer}>
              <button
                className={styles.btnGhost}
                onClick={() => setSyncRows(null)}
                disabled={syncBusy}
              >
                Cancel
              </button>
              {syncRows.length > 0 && (
                <button
                  className={styles.btnPrimary}
                  onClick={() => void applySync()}
                  disabled={syncBusy}
                >
                  {syncBusy ? "Applying…" : "Apply"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {enrichRows !== null && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Enrich with AI</h3>
            <span className={styles.subtle}>
              {
                enrichRows.filter(
                  (r) => r.status === "done" || r.status === "error",
                ).length
              }{" "}
              / {enrichRows.length} suppliers reviewed. Built from SmartBid data
              only; review before saving.
            </span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.reviewList}>
              {enrichRows.map((r) => {
                const sug = r.suggestion;
                const usable = !!sug && hasSuggestion(sug);
                return (
                  <div key={r.supplier.id} className={styles.enrichRow}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={r.accept}
                        disabled={!usable || enrichSaving}
                        onChange={(e) =>
                          setEnrichRows((rows) =>
                            rows
                              ? rows.map((x) =>
                                  x.supplier.id === r.supplier.id
                                    ? { ...x, accept: e.target.checked }
                                    : x,
                                )
                              : rows,
                          )
                        }
                      />
                      <span className={styles.reviewTitle}>
                        {r.supplier.name}
                      </span>
                    </label>
                    <div className={styles.enrichBody}>
                      {r.status === "waiting" && (
                        <span className={styles.subtle}>Waiting…</span>
                      )}
                      {r.status === "running" && (
                        <span className={styles.subtle}>Generating…</span>
                      )}
                      {r.status === "error" && (
                        <span className={styles.errorText}>
                          AI request failed for this supplier
                        </span>
                      )}
                      {r.status === "done" && sug && !usable && (
                        <span className={styles.subtle}>
                          {BASIS_LABELS.none}
                        </span>
                      )}
                      {r.status === "done" && sug && usable && (
                        <>
                          {sug.description && (
                            <p className={styles.enrichText}>
                              {sug.description}
                            </p>
                          )}
                          {(sug.serviceTypes.length > 0 ||
                            sug.keywords.length > 0) && (
                            <div className={styles.chips}>
                              {sug.serviceTypes.map((id) => (
                                <span
                                  key={id}
                                  className={`${styles.chip} ${styles.chipAccent}`}
                                >
                                  {serviceTypeLabel(id)}
                                </span>
                              ))}
                              {sug.keywords.map((k) => (
                                <span key={k} className={styles.chip}>
                                  {k}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className={styles.basisHint}>
                            {BASIS_LABELS[sug.basis]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.footer}>
              <button
                className={styles.btnGhost}
                onClick={closeEnrich}
                disabled={enrichSaving}
              >
                {enrichRunning ? "Stop" : "Cancel"}
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => void saveEnrich()}
                disabled={
                  enrichRunning ||
                  enrichSaving ||
                  !enrichRows.some((r) => r.accept)
                }
              >
                {enrichSaving
                  ? "Saving…"
                  : `Save selected (${enrichRows.filter((r) => r.accept).length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          Suppliers <span className={styles.subtle}>({filtered.length})</span>
        </h3>
      </div>

      {isLoading && !isLoaded ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.spinner} />
          <p className={styles.stateText}>Loading suppliers…</p>
        </div>
      ) : error && !isLoaded ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.stateIcon}>⚠️</span>
          <p className={styles.stateTitle}>Failed to load</p>
          <p className={styles.stateText}>{error}</p>
          <button
            className={styles.btnGhost}
            onClick={() => void refreshSuppliers()}
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${styles.card} ${styles.stateBox}`}>
          <span className={styles.stateIcon}>📇</span>
          <p className={styles.stateTitle}>
            {suppliers.length === 0
              ? "No suppliers yet"
              : "No results for these filters"}
          </p>
          <p className={styles.stateText}>
            {suppliers.length === 0
              ? "Use “Add supplier” or “Sync from quotations” to register the first ones."
              : "Try different search terms or clear the filters."}
          </p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filtered.map((s) => {
            const quoteCount = (quotesBySupplier[s.id] || []).length;
            const typeLabels = s.serviceTypes
              .map(serviceTypeLabel)
              .filter(Boolean);
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                className={`${styles.supplierCard} ${
                  editing === s.id ? styles.supplierCardEditing : ""
                }`}
                onClick={() => setSelectedId(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(s.id);
                  }
                }}
                aria-label={`Open details of ${s.name}`}
              >
                <div className={styles.supplierHead}>
                  <SupplierLogo name={s.name} url={s.logoUrl} />
                  <div className={styles.supplierTitleBlock}>
                    <p className={styles.supplierName} title={s.name}>
                      {s.name || "(no name)"}
                    </p>
                    <p className={styles.subtle}>
                      {s.country || "Country not set"}
                    </p>
                  </div>
                  {s.active ? (
                    <span className={styles.badgeActive}>Active</span>
                  ) : (
                    <span className={styles.badgeInactive}>Inactive</span>
                  )}
                </div>

                {s.description && (
                  <p className={styles.supplierNotes}>{s.description}</p>
                )}

                {(typeLabels.length > 0 || s.keywords.length > 0) && (
                  <div className={styles.chips}>
                    {typeLabels.map((label) => (
                      <span
                        key={label}
                        className={`${styles.chip} ${styles.chipAccent}`}
                      >
                        {label}
                      </span>
                    ))}
                    {s.keywords.slice(0, MAX_CARD_KEYWORDS).map((k) => (
                      <span key={k} className={styles.chip}>
                        {k}
                      </span>
                    ))}
                    {s.keywords.length > MAX_CARD_KEYWORDS && (
                      <span className={styles.subtle}>
                        +{s.keywords.length - MAX_CARD_KEYWORDS}
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.supplierMeta}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Contact</span>
                    {s.contacts.length ? (
                      <span className={styles.metaValue}>
                        {s.contacts[0].name || s.contacts[0].email}
                        {s.contacts[0].name && s.contacts[0].email && (
                          <span className={styles.subtle}>
                            {" "}
                            · {s.contacts[0].email}
                          </span>
                        )}
                        {s.contacts.length > 1 && (
                          <span className={styles.subtle}>
                            {" "}
                            +{s.contacts.length - 1}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className={styles.subtle}>-</span>
                    )}
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Quotations</span>
                    <span className={styles.metaValue}>
                      {quoteCount || <span className={styles.subtle}>-</span>}
                    </span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Part Numbers</span>
                    <span className={styles.metaValue}>
                      {s.partNumbers.length || (
                        <span className={styles.subtle}>-</span>
                      )}
                    </span>
                  </div>
                </div>

                {canEdit && (
                <div className={styles.supplierActions}>
                  <button
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(s);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      void remove(s);
                    }}
                    disabled={deletingId === s.id}
                  >
                    {deletingId === s.id ? "…" : "Delete"}
                  </button>
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <SupplierDrawer
          supplier={selected}
          quotations={quotesBySupplier[selected.id] || []}
          supplyCategories={supplyBySupplier[selected.id] || []}
          serviceTypesById={serviceTypes.byId}
          onClose={() => setSelectedId(null)}
          onEdit={
            canEdit
              ? () => {
                  setSelectedId(null);
                  openEdit(selected);
                }
              : undefined
          }
          onViewQuotations={() =>
            navigate(ROUTES.quotations, { state: { search: selected.name } })
          }
        />
      )}
    </div>
  );
};
