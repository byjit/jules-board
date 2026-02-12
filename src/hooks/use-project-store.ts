import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColumnType = "todo" | "doing" | "done";

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
  passes: boolean;
  status: ColumnType;
  notes: string;
  dependsOn: string[];
  sessionId?: string;
  sessionStatus?: string;
}

export interface Project {
  id: string;
  name: string;
  branchName?: string;
  description?: string;
  userStories: UserStory[];
  createdAt: number;
  gitRepo?: string;
  gitBranch?: string;
}

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  julesApiKey: string;
  setSelectedProjectId: (id: string | null) => void;
  setJulesApiKey: (key: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addStoryToProject: (projectId: string, story: UserStory) => void;
  updateStory: (projectId: string, storyId: string, story: Partial<UserStory>) => void;
  deleteStory: (projectId: string, storyId: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      selectedProjectId: null,
      julesApiKey: "",
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setJulesApiKey: (key) => set({ julesApiKey: key }),
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
          selectedProjectId: state.selectedProjectId || project.id,
        })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      addStoryToProject: (projectId, story) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, userStories: [...p.userStories, story] } : p
          ),
        })),
      updateStory: (projectId, storyId, updatedStory) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.map((s) =>
                    s.id === storyId ? { ...s, ...updatedStory } : s
                  ),
                }
              : p
          ),
        })),
      deleteStory: (projectId, storyId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.filter((s) => s.id !== storyId),
                }
              : p
          ),
        })),
    }),
    {
      name: "project-storage",
    }
  )
);
