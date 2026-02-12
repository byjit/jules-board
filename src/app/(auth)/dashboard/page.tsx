import { getSession } from "@/../auth";
import { ProjectBoard } from "@/components/ProjectBoard";
import { TopBar } from "@/components/TopBar";

export default async function DashboardPage() {
  const session = await getSession();
  const userName = session?.user?.name || "User";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <main className="flex-1 flex flex-col min-h-0">
        <ProjectBoard />
      </main>
    </div>
  );
}
