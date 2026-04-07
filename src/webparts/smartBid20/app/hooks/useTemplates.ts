/**
 * useTemplates — Hook de templates.
 */
import * as React from "react";
import { useTemplateStore } from "../stores/useTemplateStore";
import { IBidTemplate } from "../models/IBidTemplate";

export function useTemplates(): {
  templates: IBidTemplate[];
  isLoading: boolean;
  selectedTemplate: IBidTemplate | null;
  setSelectedTemplate: (template: IBidTemplate | null) => void;
  getByDivision: (division: string) => IBidTemplate[];
  getById: (id: string) => IBidTemplate | undefined;
} {
  const templates = useTemplateStore((s) => s.templates);
  const isLoading = useTemplateStore((s) => s.isLoading);
  const selectedTemplate = useTemplateStore((s) => s.selectedTemplate);
  const setSelectedTemplate = useTemplateStore((s) => s.setSelectedTemplate);
  const getByDivision = useTemplateStore((s) => s.getByDivision);

  const getById = React.useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates],
  );

  return {
    templates,
    isLoading,
    selectedTemplate,
    setSelectedTemplate,
    getByDivision,
    getById,
  };
}
