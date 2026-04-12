import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SavedChartsPage from "./pages/SavedChartsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProfilesPage from "./pages/admin/AdminProfilesPage";
import AdminFraudPage from "./pages/admin/AdminFraudPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import AdminConfigPage from "./pages/admin/AdminConfigPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminSpiritualPage from "./pages/admin/AdminSpiritualPage";
import MatrimonyProfilePage from "./pages/MatrimonyProfilePage";
import MatrimonySearchPage from "./pages/MatrimonySearchPage";
import MatrimonyViewProfilePage from "./pages/MatrimonyViewProfilePage";
import PartnerPreferencesPage from "./pages/PartnerPreferencesPage";
import MessagesPage from "./pages/MessagesPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import UniversalSearchPage from "./pages/UniversalSearchPage";
import DeityProfilePage from "./pages/DeityProfilePage";
import TempleDetailPage from "./pages/TempleDetailPage";

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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/saved-charts" element={<ProtectedRoute><SavedChartsPage /></ProtectedRoute>} />
            <Route path="/matrimony/profile" element={<ProtectedRoute><MatrimonyProfilePage /></ProtectedRoute>} />
            <Route path="/matrimony/preferences" element={<ProtectedRoute><PartnerPreferencesPage /></ProtectedRoute>} />
            <Route path="/matrimony/search" element={<MatrimonySearchPage />} />
            <Route path="/matrimony/profile/:userId" element={<MatrimonyViewProfilePage />} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/profiles" element={<AdminProfilesPage />} />
            <Route path="/admin/fraud" element={<AdminFraudPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/roles" element={<AdminRolesPage />} />
            <Route path="/admin/config" element={<AdminConfigPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/spiritual" element={<AdminSpiritualPage />} />
            <Route path="/deity-search" element={<UniversalSearchPage />} />
            <Route path="/deity/:deityName" element={<DeityProfilePage />} />
            <Route path="/temple/:id" element={<TempleDetailPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
