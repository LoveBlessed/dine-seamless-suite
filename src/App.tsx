import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Staff from "./pages/Staff";
import Admin from "./pages/Admin";
import MenuManagement from "./pages/MenuManagement";
import CustomerManagement from "./pages/CustomerManagement";
import SystemSettings from "./pages/SystemSettings";
import Auth from "./pages/Auth";
import CustomerAuth from "./pages/CustomerAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/order-history" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/customer-auth" element={<CustomerAuth />} />
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute requiredRole="staff">
                  <Staff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/menu-management" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <MenuManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer-management" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <CustomerManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/system-settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <SystemSettings />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
