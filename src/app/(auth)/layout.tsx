import { validateSession } from "auth";

import { TopBar } from "@/components/TopBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await validateSession();
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      {children}
    </div>
  );
}
