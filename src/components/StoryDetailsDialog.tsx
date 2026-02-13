import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { trpc } from "@/trpc/react";

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
	const addStoryToProject = useProjectStore((state) => state.addStoryToProject);

	const updateStoryMutation = trpc.userStory.update.useMutation();
	const deleteStoryMutation = trpc.userStory.delete.useMutation();
	const createStoryMutation = trpc.userStory.create.useMutation();

	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([]);
	const [status, setStatus] = useState<ColumnType>("todo");
	const [priority, setPriority] = useState<string>("2");
	const [notes, setNotes] = useState("");
	const [passes, setPasses] = useState(false);
	const [dependsOn, setDependsOn] = useState("");
	const [sessionId, setSessionId] = useState("");
	const [sessionStatus, setSessionStatus] = useState("");

	useEffect(() => {
		if (story) {
			setTitle(story.title || "");
			setSlug(story.slug || "");
			setDescription(story.description || "");
			setAcceptanceCriteria(story.acceptanceCriteria || []);
			setStatus(story.status || "todo");
			setPriority((story.priority ?? 2).toString());
			setNotes(story.notes || "");
			setPasses(!!story.passes);
			setDependsOn((story.dependsOn || []).join(", "));
			setSessionId(story.sessionId || "");
			setSessionStatus(story.sessionStatus || "");
		} else {
			setTitle("");
			setSlug("");
			setDescription("");
			setAcceptanceCriteria([]);
			setStatus("todo");
			setPriority("2");
			setNotes("");
			setPasses(false);
			setDependsOn("");
			setSessionId("");
			setSessionStatus("");
		}
	}, [story, open]);

	const handleSave = async () => {
		if (!projectId) return;

		const projects = useProjectStore.getState().projects;
		const project = projects.find((p) => p.id === projectId);

		const parsedAcceptanceCriteria = acceptanceCriteria
			.map((ac) => ac.trim())
			.filter((ac) => ac !== "");

		const parsedDependsOn = dependsOn
			.split(",")
			.map((dep) => dep.trim())
			.filter((dep) => dep !== "");

		if (project && status !== "todo" && parsedDependsOn.length > 0) {
			const incompleteDependencies = parsedDependsOn.filter((depId) => {
				const dep = project.userStories.find(
					(s) => s.id === depId || s.slug === depId,
				);
				return !dep || dep.status !== "done";
			});

			if (incompleteDependencies.length > 0) {
				toast.error(
					`Cannot update status. Dependencies not completed: ${incompleteDependencies.join(", ")}`,
				);
				return;
			}
		}

		const storyData = {
			title,
			slug: slug || null,
			description,
			acceptanceCriteria: parsedAcceptanceCriteria,
			status,
			priority: parseInt(priority, 10),
			notes,
			passes,
			dependsOn: parsedDependsOn,
			sessionId: sessionId || null,
			sessionStatus: sessionStatus || null,
		};

		if (story?.id) {
			updateStory(projectId, story.id, storyData);
			await updateStoryMutation.mutateAsync({
				id: story.id,
				...storyData,
			});
			toast.success("Story updated");
		} else {
			const createdStory = await createStoryMutation.mutateAsync({
				projectId,
				...storyData,
			});
			addStoryToProject(projectId, createdStory as any);
			toast.success("Story created");
		}

		onOpenChange(false);
	};

	const handleDelete = async () => {
		if (!(story && projectId)) return;
		if (confirm("Are you sure you want to delete this story?")) {
			deleteStory(projectId, story.id);
			await deleteStoryMutation.mutateAsync({ id: story.id });
			toast.success("Story deleted");
			onOpenChange(false);
		}
	};

	const addAC = () => setAcceptanceCriteria([...acceptanceCriteria, ""]);
	const removeAC = (index: number) =>
		setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
	const updateAC = (index: number, value: string) => {
		const newAC = [...acceptanceCriteria];
		newAC[index] = value;
		setAcceptanceCriteria(newAC);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
				<DialogHeader className="p-6 pb-2">
					<div className="flex items-center justify-between">
						<DialogTitle>{story?.id ? "Edit Story" : "Create Story"}</DialogTitle>
					</div>
					<DialogDescription>
						{story?.id
							? "Update the details of your user story."
							: "Fill in the details for your new user story."}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="flex-1 overflow-y-auto">
					<div className="space-y-6 p-6">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									onChange={(e) => setTitle(e.target.value)}
									value={title}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									onChange={(e) => setSlug(e.target.value)}
									value={slug}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								className="min-h-[100px]"
								id="description"
								onChange={(e) => setDescription(e.target.value)}
								value={description}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label>Acceptance Criteria</Label>
								<Button
									onClick={addAC}
									size="sm"
									variant="outline"
									type="button"
								>
									<Plus className="h-3 w-3 mr-1" /> Add
								</Button>
							</div>
							<div className="space-y-2">
								{acceptanceCriteria.map((ac, index) => (
									<div key={index} className="flex gap-2">
										<Input
											placeholder={`Criterion ${index + 1}`}
											value={ac}
											onChange={(e) => updateAC(index, e.target.value)}
										/>
										<Button
											onClick={() => removeAC(index)}
											size="icon"
											variant="ghost"
											className="shrink-0 text-muted-foreground hover:text-destructive"
											type="button"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
								{acceptanceCriteria.length === 0 && (
									<p className="text-xs text-muted-foreground italic">
										No acceptance criteria added.
									</p>
								)}
							</div>
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
									onValueChange={(val) => setPriority(val)}
									value={priority}
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

						<div className="flex items-center space-x-2 py-2">
							<Checkbox
								checked={passes}
								id="passes"
								onCheckedChange={(checked) => setPasses(!!checked)}
							/>
							<Label htmlFor="passes">Passes/Verified</Label>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								className="min-h-[80px]"
								id="notes"
								onChange={(e) => setNotes(e.target.value)}
								value={notes}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dependsOn">
								Dependencies (Comma separated Slugs or IDs)
							</Label>
							<Input
								id="dependsOn"
								onChange={(e) => setDependsOn(e.target.value)}
								placeholder="STORY-1, STORY-2"
								value={dependsOn}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4 border-t pt-4">
							<div className="space-y-2">
								<Label htmlFor="sessionId">Session ID</Label>
								<Input
									id="sessionId"
									onChange={(e) => setSessionId(e.target.value)}
									value={sessionId}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="sessionStatus">Session Status</Label>
								<Input
									id="sessionStatus"
									onChange={(e) => setSessionStatus(e.target.value)}
									value={sessionStatus}
								/>
							</div>
						</div>
					</div>
				</ScrollArea>
				<DialogFooter className="p-6 border-t mt-auto">
					<div className="flex w-full justify-between">
						{story?.id ? (
							<Button
								className="text-destructive"
								onClick={handleDelete}
								size="icon"
								variant="ghost"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						) : (
							<div />
						)}
						<Button onClick={handleSave}>
							{story?.id ? "Save Changes" : "Create Story"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
