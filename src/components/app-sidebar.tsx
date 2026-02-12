"use client";

import type { Session } from "auth";
import { Frame, Send } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CONTACT_FORM } from "@/lib/constant";
import { Logo } from "./block/Logo";

const data = {
  links: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "Contact",
      url: CONTACT_FORM,
      icon: Send,
      external: true,
    },
  ],
};

// AppSidebar component for rendering the main sidebar with user session
export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="#">
                <Logo className="w-4 h-4" showText textStyle={!open ? "hidden" : ""} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={data.links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
