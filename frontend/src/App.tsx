import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Logs from "./pages/Logs";
import Warehouses from "./pages/Warehouses";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Receipts from "./pages/Receipts";
import DeliveryOrders from "./pages/DeliveryOrders";
import MoveHistory from "./pages/MoveHistory";
import OtpVerification from "./pages/OtpVerification";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage OR sessionStorage
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");
    setIsAuthenticated(!!(localUser || sessionUser));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? (
    <AppLayout>
      <Outlet /> {/* This is where the child routes will render */}
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp-verification" element={<OtpVerification />} />

            {/* All protected routes now share a single AppLayout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/index" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/products" element={<Products />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/delivery-orders" element={<DeliveryOrders />} />
              <Route path="/move-history" element={<MoveHistory />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/warehouses/:id" element={<Warehouses />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;