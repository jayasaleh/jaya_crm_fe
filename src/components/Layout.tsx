import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface LayoutProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/products": "Products",
  "/deals": "Deal Pipeline",
  "/customers": "Active Customers",
  "/reports": "Reports",
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  useDocumentTitle();
  
  const currentTitle = pageTitles[location.pathname] || "PT. Smart CRM";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-4 md:px-6">
            <SidebarTrigger />
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold">{currentTitle}</h2>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
