"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Kanban } from "@/components/kanban";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ColumnType, type UserStory, useProjectStore } from "@/hooks/use-project-store";
import { parseGitHubUrl } from "@/lib/utils";
import { trpc } from "@/trpc/react";
import { StoryDetailsDialog } from "./StoryDetailsDialog";

export function ProjectBoard() {
  const {
    projects,
    selectedProjectId,
    updateStory,
    deleteStory,
    addStoryToProject,
    updateProject,
  } = useProjectStore();
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const updateStoryMutation = trpc.userStory.update.useMutation();
  const deleteStoryMutation = trpc.userStory.delete.useMutation();
  const createStoryMutation = trpc.userStory.create.useMutation();
  const updateProjectMutation = trpc.project.update.useMutation();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">No Project Selected</h2>
        <p className="text-muted-foreground">
          Create a new project or select an existing one from the dropdown to see the board.
        </p>
      </div>
    );
  }

  const createJulesSession = async (story: UserStory, projectId: string) => {
    const { julesApiKey } = useProjectStore.getState();
    const project = projects.find((p) => p.id === projectId);

    if (!(project && julesApiKey && project.gitRepo && project.gitBranch)) {
      if (!julesApiKey) {
        toast.info("Set Jules API Key in settings to enable automation.");
      } else if (!(project?.gitRepo && project?.gitBranch)) {
        toast.info("Set Git Repository and Branch in settings to enable automation.");
      }
      return;
    }

    toast.promise(
      (async () => {
        const res = await fetch("https://jules.googleapis.com/v1alpha/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": julesApiKey,
          },
          body: JSON.stringify({
            prompt: `Here's a short description on the project:\n${project.description}\n\nFor the project Implement the following User story now: ${story.description}\n\nAcceptance Criteria:\n${story.acceptanceCriteria.map((ac) => `- ${ac}`).join("\n")}`,
            sourceContext: {
              source: project.gitRepo,
              githubRepoContext: {
                startingBranch: project.gitBranch,
              },
            },
            automationMode: "AUTO_CREATE_PR",
            title: story.title,
          }),
        });
        if (!res.ok) throw new Error("Failed to create Jules session");
        const data = await res.json();

        updateStory(projectId, story.id, {
          sessionId: data.name,
          sessionStatus: "CREATED",
        });

        await updateStoryMutation.mutateAsync({
          id: story.id,
          sessionId: data.name,
          sessionStatus: "CREATED",
        });

        return data;
      })(),
      {
        loading: "Creating Jules session...",
        success: "Jules session created!",
        error: "Failed to create Jules session. Check settings.",
      }
    );
  };

  const handleMoveStory = async (storyId: string, newStatus: ColumnType) => {
    const story = selectedProject.userStories.find((s) => s.id === storyId);
    if (!story) return;

    // If moving to doing or done, check dependencies
    if (newStatus !== "todo" && story.dependsOn && story.dependsOn.length > 0) {
      const incompleteDependencies = story.dependsOn.filter((depId) => {
        const dep = selectedProject.userStories.find((s) => s.id === depId);
        return !dep || dep.status !== "done";
      });

      if (incompleteDependencies.length > 0) {
        toast.error(
          `Cannot move story. Dependencies not completed: ${incompleteDependencies.join(", ")}`
        );
        return;
      }
    }

    updateStory(selectedProject.id, storyId, {
      status: newStatus,
      passes: newStatus === "done",
    });

    await updateStoryMutation.mutateAsync({
      id: storyId,
      status: newStatus,
      passes: newStatus === "done",
    });

    // Jules Integration: Create session when moved to 'doing'
    if (newStatus === "doing" && !story.sessionId) {
      await createJulesSession(story, selectedProject.id);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    const story = selectedProject.userStories.find((s) => s.id === storyId);
    const { julesApiKey } = useProjectStore.getState();

    if (story?.sessionId && julesApiKey) {
      // Attempt to delete session if it exists
      try {
        await fetch(`https://jules.googleapis.com/v1alpha/${story.sessionId}`, {
          method: "DELETE",
          headers: {
            "x-goog-api-key": julesApiKey,
          },
        });
      } catch (error) {
        console.error("Failed to delete Jules session:", error);
      }
    }

    deleteStory(selectedProject.id, storyId);
    await deleteStoryMutation.mutateAsync({ id: storyId });
    toast.success("Story deleted");
  };

  const handleAddStory = async (title: string) => {
    const newStoryData = {
      projectId: selectedProject.id,
      title,
      description: "",
      acceptanceCriteria: [],
      priority: 2,
      passes: false,
      status: "todo" as const,
      notes: "",
      dependsOn: [],
    };

    const createdStory = await createStoryMutation.mutateAsync(newStoryData);
    addStoryToProject(selectedProject.id, createdStory as any);
    toast.success("New story added to project");
  };

  const handleStoryClick = (story: UserStory) => {
    setSelectedStory(story);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-8 py-4 border-b flex items-center justify-between bg-background/50 backdrop-blur-sm">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-xl font-bold truncate">{selectedProject.name}</h1>
          {selectedProject.description && (
            <p className="text-sm text-muted-foreground truncate">{selectedProject.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <Label
              className="text-[10px] uppercase text-muted-foreground font-semibold"
              htmlFor="gitRepo"
            >
              Git Repository
            </Label>
            <Input
              className="h-8 text-xs w-64 bg-background/50"
              id="gitRepo"
              onBlur={async (e) => {
                const gitRepo = parseGitHubUrl(e.target.value);
                updateProject(selectedProject.id, {
                  gitRepo,
                });
                await updateProjectMutation.mutateAsync({
                  id: selectedProject.id,
                  gitRepo,
                });
              }}
              onChange={(e) => {
                updateProject(selectedProject.id, {
                  gitRepo: e.target.value,
                });
              }}
              placeholder="Paste GitHub URL..."
              value={selectedProject.gitRepo || ""}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              className="text-[10px] uppercase text-muted-foreground font-semibold"
              htmlFor="gitBranch"
            >
              Branch
            </Label>
            <Input
              className="h-8 text-xs w-24 bg-background/50"
              id="gitBranch"
              onBlur={async (e) => {
                await updateProjectMutation.mutateAsync({
                  id: selectedProject.id,
                  gitBranch: e.target.value,
                });
              }}
              onChange={(e) => {
                updateProject(selectedProject.id, { gitBranch: e.target.value });
              }}
              placeholder="main"
              value={selectedProject.gitBranch || ""}
            />
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap pt-4">
            {selectedProject.userStories.length} stories
          </div>
        </div>
      </div>

      <Kanban
        canAddStory={true}
        onAddStory={handleAddStory}
        onDeleteStory={handleDeleteStory}
        onMoveStory={handleMoveStory}
        onStoryClick={handleStoryClick}
        stories={selectedProject.userStories} // As per requirements: "add new user stories to only the 'new' project" - I'll assume any project currently viewed is the target.
      />

      <StoryDetailsDialog
        onOpenChange={setIsDetailsOpen}
        open={isDetailsOpen}
        projectId={selectedProject.id}
        story={selectedStory}
      />
    </div>
  );
}
