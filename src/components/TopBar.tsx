import { LayoutDashboard, Menu, RefreshCcw, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectStore } from "@/hooks/use-project-store";
import { Logo } from "./block/Logo";

export const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    deleteProject,
    julesApiKey,
    updateStory,
  } = useProjectStore();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleDeleteProject = () => {
    if (!selectedProjectId) return;
    if (confirm("Are you sure you want to delete this project and all its stories?")) {
      deleteProject(selectedProjectId);
      setSelectedProjectId(projects.length > 0 ? projects[0]!.id : null);
      toast.success("Project deleted");
    }
  };

  const handleRefresh = async () => {
    if (!julesApiKey) {
      toast.error("Please set your Jules API Key in settings first.");
      return;
    }
    if (!selectedProject) return;

    const doingStories = selectedProject.userStories.filter(
      (s) => s.status === "doing" && s.sessionId
    );
    if (doingStories.length === 0) {
      toast.info("No active sessions to refresh.");
      return;
    }

    toast.promise(
      Promise.all(
        doingStories.map(async (story) => {
          try {
            const res = await fetch(`https://jules.googleapis.com/v1alpha/${story.sessionId}`, {
              headers: {
                "x-goog-api-key": julesApiKey,
              },
            });
            if (!res.ok) throw new Error("Failed to fetch session");
            const data = await res.json();

            // Update story status based on session state
            // For now, let's just update the internal sessionStatus field
            // If we knew the status that means "done", we could move it to 'done'
            updateStory(selectedProject.id, story.id, {
              sessionStatus: data.state || "UNKNOWN",
            });
          } catch (error) {
            console.error(`Error refreshing story ${story.id}:`, error);
          }
        })
      ),
      {
        loading: "Refreshing sessions...",
        success: "Sessions refreshed",
        error: "Failed to refresh some sessions",
      }
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo showText />

          {projects.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <Select onValueChange={setSelectedProjectId} value={selectedProjectId || ""}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDeleteProject}
                size="icon-sm"
                title="Delete Project"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {selectedProject && (
            <Button
              onClick={handleRefresh}
              size="icon"
              title="Refresh In-Progress Sessions"
              variant="ghost"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={() => setIsSettingsOpen(true)}
            size="icon"
            title="Settings"
            variant="ghost"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            variant="ghost"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {projects.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground px-1">
                  Projects
                </p>
                <Select
                  onValueChange={(val) => {
                    setSelectedProjectId(val);
                    setIsOpen(false);
                  }}
                  value={selectedProjectId || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full text-destructive"
                  onClick={() => {
                    handleDeleteProject();
                    setIsOpen(false);
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Current Project
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2 border-t">
              {selectedProject && (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleRefresh();
                    setIsOpen(false);
                  }}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh In-Progress
                </Button>
              )}
              <Button
                className="w-full"
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsOpen(false);
                }}
                size="sm"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  setIsCreateDialogOpen(true);
                }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateProjectDialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen} />
      <SettingsDialog onOpenChange={setIsSettingsOpen} open={isSettingsOpen} />
    </header>
  );
};
