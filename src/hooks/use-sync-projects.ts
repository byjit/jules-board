"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/hooks/use-project-store";
import { trpc } from "@/trpc/react";

export function useSyncProjects() {
  const { setProjects } = useProjectStore();
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();

  useEffect(() => {
    if (projects) {
      setProjects(projects as any);
    }
  }, [projects, setProjects]);

  return { isLoading };
}
