import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Template {
  id: string;
  toolId: string;
  name: string;
  config: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

interface TemplatesStore {
  templates: Template[];
  saveTemplate: (toolId: string, name: string, config: Record<string, any>) => string;
  deleteTemplate: (id: string) => void;
  getTemplatesByTool: (toolId: string) => Template[];
  getTemplate: (id: string) => Template | undefined;
  updateTemplate: (id: string, updates: Partial<Omit<Template, "id" | "createdAt">>) => void;
}

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set, get) => ({
      templates: [],
      saveTemplate: (toolId, name, config) => {
        const id = uuidv4();
        const now = Date.now();
        const template: Template = {
          id,
          toolId,
          name,
          config,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          templates: [...state.templates, template],
        }));
        
        return id;
      },
      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },
      getTemplatesByTool: (toolId) => {
        const state = get().templates;
        return state.filter((t) => t.toolId === toolId);
      },
      getTemplate: (id) => {
        const state = get().templates;
        return state.find((t) => t.id === id);
      },
      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
        }));
      },
    }),
    {
      name: "devtoolkit-templates",
    }
  )
);

