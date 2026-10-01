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

    if (filters.serviceLines.length > 0) {
      result = result.filter((b) =>
        filters.serviceLines.includes(b.serviceLine),
      );
    }

    if (filters.phases.length > 0) {
      result = result.filter((b) => filters.phases.includes(b.currentPhase));
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

    if (filters.creators.length > 0) {
      result = result.filter((b) =>
        filters.creators.includes(b.creator?.email),
      );
    }

    return result;
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
