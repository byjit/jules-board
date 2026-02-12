import { ProjectBoard } from "@/components/ProjectBoard";

export default async function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      <ProjectBoard />
    </main>
  );
}
