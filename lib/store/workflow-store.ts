import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type WorkflowStep = {
  id: string;
  toolId: string;
  toolName: string;
  config?: Record<string, any>;
};

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  createdAt: number;
  updatedAt: number;
  lastRun?: number;
  runCount: number;
}

interface WorkflowStore {
  workflows: Workflow[];
  createWorkflow: (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "runCount">) => string;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflow: (id: string) => Workflow | undefined;
  recordRun: (id: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      workflows: [],
      createWorkflow: (workflow) => {
        const id = uuidv4();
        const newWorkflow: Workflow = {
          ...workflow,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          runCount: 0,
        };
        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
        }));
        return id;
      },
      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? { ...w, ...updates, updatedAt: Date.now() }
              : w
          ),
        }));
      },
      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
        }));
      },
      getWorkflow: (id) => {
        return get().workflows.find((w) => w.id === id);
      },
      recordRun: (id) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id
              ? { ...w, lastRun: Date.now(), runCount: w.runCount + 1 }
              : w
          ),
        }));
      },
    }),
    {
      name: "devtoolkit-workflows",
    }
  )
);

