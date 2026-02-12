import { useEffect, useState } from "react";
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
import { useProjectStore } from "@/hooks/use-project-store";
import { parseGitHubUrl } from "@/lib/utils";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
	const {
		julesApiKey,
		setJulesApiKey,
		selectedProjectId,
		projects,
		updateProject,
	} = useProjectStore();

	const selectedProject = projects.find((p) => p.id === selectedProjectId);

	const [apiKey, setApiKey] = useState(julesApiKey);
	const [gitRepo, setGitRepo] = useState(selectedProject?.gitRepo || "");
	const [gitBranch, setGitBranch] = useState(selectedProject?.gitBranch || "");

	useEffect(() => {
		if (open) {
			setApiKey(julesApiKey);
			setGitRepo(selectedProject?.gitRepo || "");
			setGitBranch(selectedProject?.gitBranch || "");
		}
	}, [open, julesApiKey, selectedProject]);

	const handleSave = () => {
		setJulesApiKey(apiKey);
		if (selectedProjectId) {
			updateProject(selectedProjectId, {
				gitRepo: parseGitHubUrl(gitRepo),
				gitBranch,
			});
		}
		toast.success("Settings saved");
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Jules Settings</DialogTitle>
					<DialogDescription>
						Configure your Jules API key and project-specific Git settings.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="apiKey">Jules API Key (Global)</Label>
						<Input
							id="apiKey"
							onChange={(e) => setApiKey(e.target.value)}
							placeholder="x-goog-api-key..."
							type="password"
							value={apiKey}
						/>
					</div>
					{selectedProject ? (
						<>
							<div className="grid gap-2 border-t pt-4">
								<h3 className="text-sm font-medium">
									Project Settings: {selectedProject.name}
								</h3>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="gitRepo">Git Repository Source</Label>
								<Input
									id="gitRepo"
									onChange={(e) => setGitRepo(e.target.value)}
									onBlur={(e) => setGitRepo(parseGitHubUrl(e.target.value))}
									placeholder="sources/github/owner/repo"
									value={gitRepo}
								/>
								<p className="text-[10px] text-muted-foreground">
									Format: sources/github/owner/repo
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="gitBranch">Git Branch</Label>
								<Input
									id="gitBranch"
									onChange={(e) => setGitBranch(e.target.value)}
									placeholder="main"
									value={gitBranch}
								/>
							</div>
						</>
					) : (
						<div className="text-sm text-muted-foreground border-t pt-4">
							Select a project to configure project-specific settings.
						</div>
					)}
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
