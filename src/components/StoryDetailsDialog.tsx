import { Trash2 } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	type ColumnType,
	type UserStory,
	useProjectStore,
} from "@/hooks/use-project-store";

interface StoryDetailsDialogProps {
	story: UserStory | null;
	projectId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function StoryDetailsDialog({
	story,
	projectId,
	open,
	onOpenChange,
}: StoryDetailsDialogProps) {
	const updateStory = useProjectStore((state) => state.updateStory);
	const deleteStory = useProjectStore((state) => state.deleteStory);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<ColumnType>("todo");
	const [priority, setPriority] = useState<number>(2);

	useEffect(() => {
		if (story) {
			setTitle(story.title);
			const acHeader = "Acceptance Criteria:";
			const hasAcInDesc = story.description?.includes(acHeader);
			const baseDesc = story.description || "";

			if (
				!hasAcInDesc &&
				story.acceptanceCriteria &&
				story.acceptanceCriteria.length > 0
			) {
				const acString = `${baseDesc ? "\n\n" : ""}${acHeader}\n${story.acceptanceCriteria
					.map((ac) => `- ${ac}`)
					.join("\n")}`;
				setDescription(baseDesc + acString);
			} else {
				setDescription(baseDesc);
			}

			setStatus(story.status);
			setPriority(story.priority || 2);
		}
	}, [story]);

	const handleSave = () => {
		if (!(story && projectId)) return;

		const projects = useProjectStore.getState().projects;
		const project = projects.find((p) => p.id === projectId);

		if (
			project &&
			status !== "todo" &&
			story.dependsOn &&
			story.dependsOn.length > 0
		) {
			const incompleteDependencies = story.dependsOn.filter((depId) => {
				const dep = project.userStories.find((s) => s.id === depId);
				return !dep || dep.status !== "done";
			});

			if (incompleteDependencies.length > 0) {
				toast.error(
					`Cannot update status. Dependencies not completed: ${incompleteDependencies.join(", ")}`
				);
				return;
			}
		}

		updateStory(projectId, story.id, {
			title,
			description,
			status,
			priority,
			passes: status === "done",
		});

		toast.success("Story updated");
		onOpenChange(false);
	};

	const handleDelete = () => {
		if (!(story && projectId)) return;
		if (confirm("Are you sure you want to delete this story?")) {
			deleteStory(projectId, story.id);
			toast.success("Story deleted");
			onOpenChange(false);
		}
	};

	if (!story) return null;

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle>Edit Story</DialogTitle>
					</div>
					<DialogDescription>
						Update the details of your user story.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							onChange={(e) => setTitle(e.target.value)}
							value={title}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							className="h-60"
							id="description"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								onValueChange={(val) => setStatus(val as ColumnType)}
								value={status}
							>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todo">New</SelectItem>
									<SelectItem value="doing">In Progress</SelectItem>
									<SelectItem value="done">Complete</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select
								onValueChange={(val) => setPriority(parseInt(val, 10))}
								value={priority.toString()}
							>
								<SelectTrigger id="priority">
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">P1 - Critical</SelectItem>
									<SelectItem value="2">P2 - High</SelectItem>
									<SelectItem value="3">P3 - Medium</SelectItem>
									<SelectItem value="4">P4 - Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					{story.sessionId && (
						<div className="space-y-2 border-t pt-4">
							<Label className="text-xs text-muted-foreground">
								Jules Session
							</Label>
							<div className="flex items-center justify-between bg-muted/50 p-2 rounded text-xs font-mono">
								<span className="truncate flex-1" title={story.sessionId}>
									{story.sessionId}
								</span>
								<span className="ml-2 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold uppercase">
									{story.sessionStatus || "ACTIVE"}
								</span>
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					<div className="flex w-full justify-between">
						<Button
							className="text-destructive"
							onClick={handleDelete}
							size="icon"
							variant="ghost"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
