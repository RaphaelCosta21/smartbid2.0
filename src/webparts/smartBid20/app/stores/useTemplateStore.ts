/**
 * useTemplateStore — Templates de equipamento (Zustand).
 */
import { create } from "zustand";
import { IBidTemplate } from "../models/IBidTemplate";

interface TemplateState {
  templates: IBidTemplate[];
  selectedTemplate: IBidTemplate | null;
  isLoading: boolean;

  setTemplates: (templates: IBidTemplate[]) => void;
  setSelectedTemplate: (template: IBidTemplate | null) => void;
  setLoading: (loading: boolean) => void;
  getByDivision: (division: string) => IBidTemplate[];
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  isLoading: false,

  setTemplates: (templates) => set({ templates }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setLoading: (loading) => set({ isLoading: loading }),

  getByDivision: (division: string) => {
    return get().templates.filter((t) => t.division === division && t.isActive);
  },
}));
