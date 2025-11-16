"use client";

import { LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { handleSignOut } from "@/lib/auth";

export function NavUser() {
    
  const onSignOut = async () => {
    await handleSignOut();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Logout" asChild size="sm">
          <button onClick={onSignOut} disabled>
            <LogOut />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
