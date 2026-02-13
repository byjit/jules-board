"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/hooks/use-project-store";
import { trpc } from "@/trpc/react";

export function useSyncProjects() {
  const { setProjects, setJulesApiKey } = useProjectStore();
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();
  const { data: currentUser } = trpc.user.getCurrentUser.useQuery();

  useEffect(() => {
    if (projects) {
      setProjects(projects as any);
    }
  }, [projects, setProjects]);

  useEffect(() => {
    if (currentUser?.julesApiKey !== undefined) {
      setJulesApiKey(currentUser.julesApiKey ?? "");
    }
  }, [currentUser, setJulesApiKey]);

  return { isLoading };
}
