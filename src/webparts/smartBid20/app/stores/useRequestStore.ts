/**
 * useRequestStore — Requests state (Zustand).
 */
import { create } from "zustand";
import { IBidRequest } from "../models/IBidRequest";

interface RequestState {
  requests: IBidRequest[];
  selectedRequest: IBidRequest | null;
  isLoading: boolean;

  setRequests: (requests: IBidRequest[]) => void;
  setSelectedRequest: (request: IBidRequest | null) => void;
  setLoading: (loading: boolean) => void;
  getUnassigned: () => IBidRequest[];
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,

  setRequests: (requests) => set({ requests }),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  setLoading: (loading) => set({ isLoading: loading }),

  getUnassigned: () => {
    return get().requests.filter((r) => r.status === "submitted");
  },
}));
