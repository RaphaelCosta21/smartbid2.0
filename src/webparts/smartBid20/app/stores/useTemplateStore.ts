/**
 * useTemplateStore — Templates de Scope of Supply (Zustand).
 */
import { create } from "zustand";
import { IBidTemplate } from "../models/IBidTemplate";
import { TemplateService } from "../services/TemplateService";

interface TemplateState {
  templates: IBidTemplate[];
  selectedTemplate: IBidTemplate | null;
  isLoading: boolean;
  error: string | null;

  setTemplates: (templates: IBidTemplate[]) => void;
  setSelectedTemplate: (template: IBidTemplate | null) => void;
  setLoading: (loading: boolean) => void;
  getByDivision: (division: string) => IBidTemplate[];

  loadTemplates: () => Promise<void>;
  addTemplate: (template: IBidTemplate) => Promise<void>;
  updateTemplate: (template: IBidTemplate) => Promise<void>;
  removeTemplate: (templateId: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,

  setTemplates: (templates) => set({ templates }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setLoading: (loading) => set({ isLoading: loading }),

  getByDivision: (division: string) => {
    return get().templates.filter((t) => t.division === division && t.isActive);
  },

  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const templates = await TemplateService.getAll();
      set({ templates, isLoading: false });
    } catch (err) {
      console.error("Failed to load templates:", err);
      set({ isLoading: false, error: "Failed to load templates" });
    }
  },

  addTemplate: async (template: IBidTemplate) => {
    const prev = get().templates;
    // Optimistic
    set({ templates: [...prev, template] });
    try {
      await TemplateService.create(template);
    } catch (err) {
      console.error("Failed to create template:", err);
      set({ templates: prev, error: "Failed to create template" });
    }
  },

  updateTemplate: async (template: IBidTemplate) => {
    const prev = get().templates;
    // Optimistic
    set({
      templates: prev.map((t) => (t.id === template.id ? template : t)),
    });
    try {
      await TemplateService.update(template);
    } catch (err) {
      console.error("Failed to update template:", err);
      set({ templates: prev, error: "Failed to update template" });
    }
  },

  removeTemplate: async (templateId: string) => {
    const prev = get().templates;
    // Optimistic
    set({ templates: prev.filter((t) => t.id !== templateId) });
    try {
      await TemplateService.deleteTemplate(templateId);
    } catch (err) {
      console.error("Failed to delete template:", err);
      set({ templates: prev, error: "Failed to delete template" });
    }
  },
}));
