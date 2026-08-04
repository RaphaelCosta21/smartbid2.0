/**
 * useErn — convenience hook wrapping the ERN store + live fetch by title.
 */
import * as React from "react";
import { IErn } from "../models";
import { useErnStore } from "../stores/useErnStore";
import { ErnService } from "../services/ErnService";

interface UseErnResult {
  erns: IErn[];
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  getByTitle: (title: string) => Promise<IErn | null>;
}

export function useErn(): UseErnResult {
  const erns = useErnStore((s) => s.erns);
  const loading = useErnStore((s) => s.isLoading);
  const error = useErnStore((s) => s.error);
  const loadAll = useErnStore((s) => s.loadAll);

  const getByTitle = React.useCallback(
    (title: string) => ErnService.getByTitle(title),
    [],
  );

  return { erns, loading, error, loadAll, getByTitle };
}
