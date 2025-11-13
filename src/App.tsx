import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import SupportTicket from "./pages/SupportTicket";
import NotFound from "./pages/NotFound";
import CropManagement from "./pages/CropManagement";
import WeatherClimate from "./pages/WeatherClimate";
import PestControl from "./pages/PestControl";
import FarmEquipment from "./pages/FarmEquipment";
import MarketIntelligence from "./pages/MarketIntelligence";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/crop-management" element={<CropManagement />} />
            <Route path="/learn/weather-climate" element={<WeatherClimate />} />
            <Route path="/learn/pest-control" element={<PestControl />} />
            <Route path="/learn/farm-equipment" element={<FarmEquipment />} />
            <Route path="/learn/market-intelligence" element={<MarketIntelligence />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support-ticket" element={<SupportTicket />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
