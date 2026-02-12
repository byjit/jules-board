"use client";

import { motion } from "framer-motion";
import { type DragEvent, useState } from "react";
import { FaFire } from "react-icons/fa";
import { FiLock, FiPlus, FiTrash } from "react-icons/fi";
import type { ColumnType, UserStory } from "@/hooks/use-project-store";
import { cn } from "@/lib/utils";

interface KanbanProps {
  stories: UserStory[];
  onMoveStory: (storyId: string, newStatus: ColumnType) => void;
  onDeleteStory: (storyId: string) => void;
  onAddStory: (title: string) => void;
  onStoryClick: (story: UserStory) => void;
  canAddStory: boolean;
}

export const Kanban = ({
  stories,
  onMoveStory,
  onDeleteStory,
  onAddStory,
  onStoryClick,
  canAddStory,
}: KanbanProps) => {
  return (
    <div
      className={cn("flex-1 w-full bg-background text-foreground overflow-hidden flex flex-col")}
    >
      <Board
        canAddStory={canAddStory}
        onAddStory={onAddStory}
        onDeleteStory={onDeleteStory}
        onMoveStory={onMoveStory}
        onStoryClick={onStoryClick}
        stories={stories}
      />
    </div>
  );
};

const Board = ({
  stories,
  onMoveStory,
  onDeleteStory,
  onAddStory,
  onStoryClick,
  canAddStory,
}: KanbanProps) => {
  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto p-8">
      {[
        {
          column: "todo",
          title: "New",
          headingColor: "text-yellow-500",
          canAddStory: canAddStory,
        },
        {
          column: "doing",
          title: "In progress",
          headingColor: "text-blue-500",
          canAddStory: false,
        },
        {
          column: "done",
          title: "Complete",
          headingColor: "text-emerald-500",
          canAddStory: false,
        },
      ].map((col) => (
        <Column
          canAddStory={col.canAddStory}
          column={col.column as ColumnType}
          headingColor={col.headingColor}
          key={col.column}
          onAddStory={onAddStory}
          onMoveStory={onMoveStory}
          onStoryClick={onStoryClick}
          stories={stories}
          title={col.title}
        />
      ))}
      <BurnBarrel onDeleteStory={onDeleteStory} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  stories: UserStory[];
  column: ColumnType;
  onMoveStory: (storyId: string, newStatus: ColumnType) => void;
  onStoryClick: (story: UserStory) => void;
  onAddStory: (title: string) => void;
  canAddStory: boolean;
};

const Column = ({
  title,
  headingColor,
  stories,
  column,
  onMoveStory,
  onStoryClick,
  onAddStory,
  canAddStory,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, storyId: string) => {
    e.dataTransfer.setData("storyId", storyId);
  };

  const handleDragEnd = (e: DragEvent) => {
    const storyId = e.dataTransfer.getData("storyId");
    setActive(false);
    clearHighlights();
    onMoveStory(storyId, column);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    for (const i of indicators) {
      i.style.opacity = "0";
    }
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    if (el.element) el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredStories = stories.filter((s) => s.status === column);

  return (
    <div className="w-72 shrink-0">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className={cn("font-semibold text-sm uppercase tracking-wider", headingColor)}>
          {title}
        </h3>
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {filteredStories.length}
        </span>
      </div>
      <div
        className={cn(
          "h-full w-full rounded-lg transition-colors min-h-[150px]",
          active ? "bg-muted/50" : "bg-muted/20"
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
      >
        {filteredStories.map((s) => {
          return (
            <Card
              handleDragStart={handleDragStart}
              key={s.id}
              onClick={() => onStoryClick(s)}
              story={s}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
        {canAddStory && <AddCard onAddStory={onAddStory} />}
      </div>
    </div>
  );
};

type CardProps = {
  story: UserStory;
  handleDragStart: (e: DragEvent, storyId: string) => void;
  onClick: () => void;
};

const Card = ({ story, handleDragStart, onClick }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={story.id} column={story.status} />
      <motion.div
        className="cursor-grab rounded-lg border border-border bg-card p-4 shadow-sm active:cursor-grabbing hover:border-primary/50 transition-colors"
        draggable="true"
        layout
        layoutId={story.id}
        onClick={onClick}
        onDragStart={(e) => handleDragStart(e as any, story.id)}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight bg-muted px-1.5 py-0.5 rounded">
              {story.id}
            </span>
            {story.priority && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                  story.priority === 1
                    ? "bg-red-100 text-red-700"
                    : story.priority === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                )}
              >
                P{story.priority}
              </span>
            )}
          </div>
          <p className="text-sm font-medium leading-snug">{story.title}</p>
          {story.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{story.description}</p>
          )}
          {story.dependsOn && story.dependsOn.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-border/50">
              <FiLock className="h-3 w-3 text-muted-foreground/70" />
              <div className="flex flex-wrap gap-1">
                {story.dependsOn.map((depId) => (
                  <span
                    className="text-[9px] font-semibold text-muted-foreground/70 bg-muted px-1 rounded"
                    key={depId}
                  >
                    {depId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      className="my-1 h-0.5 w-full bg-primary opacity-0"
      data-before={beforeId || "-1"}
      data-column={column}
    />
  );
};

const BurnBarrel = ({ onDeleteStory }: { onDeleteStory: (storyId: string) => void }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const storyId = e.dataTransfer.getData("storyId");
    onDeleteStory(storyId);
    setActive(false);
  };

  return (
    <div
      className={cn(
        "mt-10 grid h-56 w-56 shrink-0 place-content-center rounded-xl border-2 border-dashed text-3xl transition-all",
        active
          ? "border-destructive bg-destructive/20 text-destructive scale-105"
          : "border-muted-foreground/30 bg-muted/20 text-muted-foreground/50"
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDragEnd}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  onAddStory: (title: string) => void;
};

const AddCard = ({ onAddStory }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim().length) return;
    onAddStory(text.trim());
    setText("");
    setAdding(false);
  };

  return (
    <div className="p-2">
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            autoFocus
            className="w-full rounded-lg border border-primary bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            placeholder="What needs to be done?"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setAdding(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              type="submit"
            >
              Add Story
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 py-3 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all bg-background/50"
          layout
          onClick={() => setAdding(true)}
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Story</span>
        </motion.button>
      )}
    </div>
  );
};
