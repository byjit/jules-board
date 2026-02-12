import { validateSession } from "auth";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Layout for authenticated pages with sidebar and breadcrumb navigation
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Validate user session before rendering the layout
  const session = await validateSession();

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {/* Main content area */}
        <div className="h-full flex-1 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
