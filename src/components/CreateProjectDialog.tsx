"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseGitHubUrl } from "@/lib/utils";
import { trpc } from "@/trpc/react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createProjectMutation = trpc.project.create.useMutation();
  const createUserStoryMutation = trpc.userStory.create.useMutation();
  const utils = trpc.useUtils();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    if (!file) {
      toast.error("Please upload a PRD JSON file");
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Simple validation based on the schema
      if (!(jsonData.userStories && Array.isArray(jsonData.userStories))) {
        throw new Error("Invalid JSON format: userStories array is missing");
      }

      const createdProject = await createProjectMutation.mutateAsync({
        name: projectName,
        branchName: gitBranch || jsonData.branchName,
        description: jsonData.description || "",
        gitRepo: parseGitHubUrl(gitRepo),
        gitBranch: gitBranch,
      });

      if (!createdProject?.id) {
        throw new Error("Failed to create project");
      }

      // Create stories
      const stories = (jsonData.userStories as any[]).map((story) => ({
        ...story,
        projectId: createdProject.id,
        status: story.status || (story.passes ? "done" : "todo"),
        passes: story.passes ?? story.status === "done",
      }));

      await Promise.all(stories.map((story) => createUserStoryMutation.mutateAsync(story)));

      // Invalidate queries to refresh data
      await utils.project.getAll.invalidate();

      toast.success("Project created successfully");
      onOpenChange(false);
      setProjectName("");
      setGitRepo("");
      setGitBranch("main");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to parse JSON file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter a project name and upload your PRD JSON file to get started.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Project"
              value={projectName}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gitRepo">Git Repo Source</Label>
              <Input
                id="gitRepo"
                onBlur={(e) => setGitRepo(parseGitHubUrl(e.target.value))}
                onChange={(e) => setGitRepo(e.target.value)}
                placeholder="github repo url"
                value={gitRepo}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gitBranch">Git Branch</Label>
              <Input
                id="gitBranch"
                onChange={(e) => setGitBranch(e.target.value)}
                placeholder="main"
                value={gitBranch}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prd">PRD JSON File</Label>
            <Input accept=".json" id="prd" onChange={handleFileChange} type="file" />
          </div>
          <DialogFooter>
            <Button disabled={isUploading} type="submit">
              {isUploading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
