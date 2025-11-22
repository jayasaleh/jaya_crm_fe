import { ReactNode, ComponentType } from "react";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Products from "@/pages/Products";
import Deals from "@/pages/Deals";
import Customers from "@/pages/Customers";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

interface RouteConfig {
  path: string;
  element: ReactNode;
}

const createProtectedRoute = (Component: ComponentType) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
);

export const routes: RouteConfig[] = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: createProtectedRoute(Dashboard) },
  { path: "/leads", element: createProtectedRoute(Leads) },
  { path: "/products", element: createProtectedRoute(Products) },
  { path: "/deals", element: createProtectedRoute(Deals) },
  { path: "/customers", element: createProtectedRoute(Customers) },
  { path: "/reports", element: createProtectedRoute(Reports) },
  { path: "*", element: <NotFound /> },
];

