/**
 * useRequests — TanStack Query wrapper para Requests.
 */
import * as React from "react";
import { useRequestStore } from "../stores/useRequestStore";
import { IBidRequest } from "../models/IBidRequest";

export function useRequests(): {
  requests: IBidRequest[];
  unassigned: IBidRequest[];
  isLoading: boolean;
  selectedRequest: IBidRequest | null;
  setSelectedRequest: (request: IBidRequest | null) => void;
} {
  const requests = useRequestStore((s) => s.requests);
  const getUnassigned = useRequestStore((s) => s.getUnassigned);
  const isLoading = useRequestStore((s) => s.isLoading);
  const selectedRequest = useRequestStore((s) => s.selectedRequest);
  const setSelectedRequest = useRequestStore((s) => s.setSelectedRequest);

  const unassigned = React.useMemo(
    () => getUnassigned(),
    [requests, getUnassigned],
  );

  return {
    requests,
    unassigned,
    isLoading,
    selectedRequest,
    setSelectedRequest,
  };
}
