import { create } from "zustand";
import { IBid, IQuickNote, Division, BidPriority } from "../models";
import { BidService } from "../services/BidService";

export type ViewMode = "kanban" | "list" | "table";

export interface BidFilters {
  search: string;
  divisions: Division[];
  serviceLines: string[];
  phases: string[];
  statuses: string[];
  priorities: BidPriority[];
  clients: string[];
  creators: string[];
  dateRange: { from: string | null; to: string | null };
}

export const DEFAULT_FILTERS: BidFilters = {
  search: "",
  divisions: [],
  serviceLines: [],
  phases: [],
  statuses: [],
  priorities: [],
  clients: [],
  creators: [],
  dateRange: { from: null, to: null },
};

export type BidFacetKey =
  | "divisions"
  | "serviceLines"
  | "phases"
  | "statuses"
  | "priorities"
  | "clients"
  | "creators";

/** BID value each multi-select facet matches against. */
export const BID_FACET_VALUES: Record<BidFacetKey, (b: IBid) => string> = {
  divisions: (b) => b.division,
  serviceLines: (b) => b.serviceLine,
  phases: (b) => b.currentPhase,
  statuses: (b) => b.currentStatus,
  priorities: (b) => b.priority,
  clients: (b) => b.opportunityInfo?.client || "",
  creators: (b) => b.creator?.email || "",
};

/** Search + every facet except `skip`, so a dropdown can count against the others. */
export function bidMatchesFilters(
  b: IBid,
  filters: BidFilters,
  skip?: BidFacetKey,
): boolean {
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const hit =
      (b.bidNumber || "").toLowerCase().includes(q) ||
      (b.crmNumber || "").toLowerCase().includes(q) ||
      (b.opportunityInfo?.client || "").toLowerCase().includes(q) ||
      (b.opportunityInfo?.projectName || "").toLowerCase().includes(q) ||
      (b.creator?.name || "").toLowerCase().includes(q);
    if (!hit) return false;
  }
  return (Object.keys(BID_FACET_VALUES) as BidFacetKey[]).every((key) => {
    const selected = filters[key] as string[];
    return (
      key === skip ||
      selected.length === 0 ||
      selected.indexOf(BID_FACET_VALUES[key](b)) >= 0
    );
  });
}

interface BidState {
  bids: IBid[];
  selectedBid: IBid | null;
  filters: BidFilters;
  viewMode: ViewMode;
  isLoading: boolean;

  setBids: (bids: IBid[]) => void;
  setSelectedBid: (bid: IBid | null) => void;
  setFilters: (filters: Partial<BidFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  updateBidNotes: (bidNumber: string, notes: IQuickNote[]) => void;
  getFilteredBids: () => IBid[];
  refreshBids: () => Promise<void>;
}

export const useBidStore = create<BidState>((set, get) => ({
  bids: [],
  selectedBid: null,
  filters: DEFAULT_FILTERS,
  viewMode: "kanban",
  isLoading: false,

  setBids: (bids) => set({ bids }),
  setSelectedBid: (bid) => set({ selectedBid: bid }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),

  updateBidNotes: (bidNumber, notes) =>
    set((state) => ({
      bids: state.bids.map((b) =>
        b.bidNumber === bidNumber ? { ...b, quickNotes: notes } : b,
      ),
    })),

  getFilteredBids: () => {
    const { bids, filters } = get();
    return bids.filter((b) => bidMatchesFilters(b, filters));
  },

  refreshBids: async () => {
    set({ isLoading: true });
    try {
      const bids = await BidService.getAll();
      set({ bids, isLoading: false });
    } catch (err) {
      console.error("Failed to refresh bids:", err);
      set({ isLoading: false });
    }
  },
}));
