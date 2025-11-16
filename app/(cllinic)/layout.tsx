import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()

  if(!session) redirect('/')

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-3">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}