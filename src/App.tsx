import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import RasiListPage from "./pages/RasiListPage";
import RasiPage from "./pages/RasiPage";
import PanchangamPage from "./pages/PanchangamPage";
import MuhurthamPage from "./pages/MuhurthamPage";
import PoruthamPage from "./pages/PoruthamPage";
import AstrologersPage from "./pages/AstrologersPage";
import BirthChartPage from "./pages/BirthChartPage";
import DashaPage from "./pages/DashaPage";
import DoshaPage from "./pages/DoshaPage";
import TransitPage from "./pages/TransitPage";
import RemediesPage from "./pages/RemediesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rasi" element={<RasiListPage />} />
          <Route path="/rasi/:rasiId" element={<RasiPage />} />
          <Route path="/birth-chart" element={<BirthChartPage />} />
          <Route path="/panchangam" element={<PanchangamPage />} />
          <Route path="/muhurtham" element={<MuhurthamPage />} />
          <Route path="/porutham" element={<PoruthamPage />} />
          <Route path="/dasha" element={<DashaPage />} />
          <Route path="/dosha" element={<DoshaPage />} />
          <Route path="/transit" element={<TransitPage />} />
          <Route path="/remedies" element={<RemediesPage />} />
          <Route path="/astrologers" element={<AstrologersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
