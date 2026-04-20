import { create } from "zustand";
import { IBid, IQuickNote, Division, BidPriority } from "../models";

export type ViewMode = "kanban" | "list" | "table";

interface BidFilters {
  search: string;
  divisions: Division[];
  statuses: string[];
  priorities: BidPriority[];
  clients: string[];
  owners: string[];
  dateRange: { from: string | null; to: string | null };
}

const DEFAULT_FILTERS: BidFilters = {
  search: "",
  divisions: [],
  statuses: [],
  priorities: [],
  clients: [],
  owners: [],
  dateRange: { from: null, to: null },
};

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
}

export const useBidStore = create<BidState>((set, get) => ({
  bids: [],
  selectedBid: null,
  filters: DEFAULT_FILTERS,
  viewMode: "table",
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
    let result = [...bids];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          (b.bidNumber || "").toLowerCase().includes(q) ||
          (b.crmNumber || "").toLowerCase().includes(q) ||
          (b.opportunityInfo?.client || "").toLowerCase().includes(q) ||
          (b.opportunityInfo?.projectName || "").toLowerCase().includes(q) ||
          (b.creator?.name || "").toLowerCase().includes(q),
      );
    }

    if (filters.divisions.length > 0) {
      result = result.filter((b) => filters.divisions.includes(b.division));
    }

    if (filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses.includes(b.currentStatus));
    }

    if (filters.priorities.length > 0) {
      result = result.filter((b) => filters.priorities.includes(b.priority));
    }

    if (filters.clients.length > 0) {
      result = result.filter((b) =>
        filters.clients.includes(b.opportunityInfo?.client),
      );
    }

    if (filters.owners.length > 0) {
      result = result.filter((b) => filters.owners.includes(b.creator?.email));
    }

    return result;
  },
}));
