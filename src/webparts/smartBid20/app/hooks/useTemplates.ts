/**
 * useTemplates — Hook de templates.
 */
import * as React from "react";
import { useTemplateStore } from "../stores/useTemplateStore";
import { IBidTemplate } from "../models/IBidTemplate";

export function useTemplates(): {
  templates: IBidTemplate[];
  isLoading: boolean;
  error: string | null;
  selectedTemplate: IBidTemplate | null;
  setSelectedTemplate: (template: IBidTemplate | null) => void;
  getByDivision: (division: string) => IBidTemplate[];
  getById: (id: string) => IBidTemplate | undefined;
  loadTemplates: () => Promise<void>;
  addTemplate: (template: IBidTemplate) => Promise<void>;
  updateTemplate: (template: IBidTemplate) => Promise<void>;
  removeTemplate: (templateId: string) => Promise<void>;
} {
  const templates = useTemplateStore((s) => s.templates);
  const isLoading = useTemplateStore((s) => s.isLoading);
  const error = useTemplateStore((s) => s.error);
  const selectedTemplate = useTemplateStore((s) => s.selectedTemplate);
  const setSelectedTemplate = useTemplateStore((s) => s.setSelectedTemplate);
  const getByDivision = useTemplateStore((s) => s.getByDivision);
  const loadTemplates = useTemplateStore((s) => s.loadTemplates);
  const addTemplate = useTemplateStore((s) => s.addTemplate);
  const updateTemplate = useTemplateStore((s) => s.updateTemplate);
  const removeTemplate = useTemplateStore((s) => s.removeTemplate);

  const getById = React.useCallback(
    (id: string) => templates.find((t) => t.id === id),
    [templates],
  );

  // Auto-load on first mount
  React.useEffect(() => {
    if (templates.length === 0 && !isLoading) {
      loadTemplates();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    templates,
    isLoading,
    error,
    selectedTemplate,
    setSelectedTemplate,
    getByDivision,
    getById,
    loadTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
  };
}
