import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "PT. Smart CRM",
  "/login": "Login",
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/products": "Products",
  "/deals": "Deal Pipeline",
  "/customers": "Active Customers",
  "/reports": "Reports",
};

export function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || "PT. Smart CRM";
    document.title = title;
  }, [location.pathname]);
}

