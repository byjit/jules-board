CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`branch_name` text,
	`git_repo` text,
	`git_branch` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_story` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`acceptance_criteria` text DEFAULT '[]' NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`passes` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`depends_on` text DEFAULT '[]' NOT NULL,
	`session_id` text,
	`session_status` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
