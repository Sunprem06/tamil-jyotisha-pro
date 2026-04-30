import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
import AutoMatchesPage from "./pages/AutoMatchesPage";
import MessagesPage from "./pages/MessagesPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import UniversalSearchPage from "./pages/UniversalSearchPage";
import DeityProfilePage from "./pages/DeityProfilePage";
import TempleDetailPage from "./pages/TempleDetailPage";
import DashboardPage from "./pages/DashboardPage";
import PassportPage from "./pages/PassportPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import TamilCalendarPage from "./pages/TamilCalendarPage";
import NayanmarsPage from "./pages/NayanmarsPage";
import AlwarsPage from "./pages/AlwarsPage";
import SpiritualUpdatesPage from "./pages/SpiritualUpdatesPage";
import TempleMapPage from "./pages/TempleMapPage";
const queryClient = new QueryClient();

const E = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<E><Index /></E>} />
            <Route path="/dashboard" element={<E><DashboardPage /></E>} />
            <Route path="/passport" element={<E><PassportPage /></E>} />
            <Route path="/auth" element={<E><AuthPage /></E>} />
            <Route path="/forgot-password" element={<E><ForgotPasswordPage /></E>} />
            <Route path="/reset-password" element={<E><ResetPasswordPage /></E>} />
            <Route path="/rasi" element={<E><RasiListPage /></E>} />
            <Route path="/rasi/:rasiId" element={<E><RasiPage /></E>} />
            <Route path="/birth-chart" element={<E><BirthChartPage /></E>} />
            <Route path="/panchangam" element={<E><PanchangamPage /></E>} />
            <Route path="/muhurtham" element={<E><MuhurthamPage /></E>} />
            <Route path="/porutham" element={<E><PoruthamPage /></E>} />
            <Route path="/dasha" element={<E><DashaPage /></E>} />
            <Route path="/dosha" element={<E><DoshaPage /></E>} />
            <Route path="/transit" element={<E><TransitPage /></E>} />
            <Route path="/remedies" element={<E><RemediesPage /></E>} />
            <Route path="/astrologers" element={<E><AstrologersPage /></E>} />
            <Route path="/about" element={<E><AboutPage /></E>} />
            <Route path="/contact" element={<E><ContactPage /></E>} />
            <Route path="/profile" element={<ProtectedRoute><E><ProfilePage /></E></ProtectedRoute>} />
            <Route path="/saved-charts" element={<ProtectedRoute><E><SavedChartsPage /></E></ProtectedRoute>} />
            <Route path="/matrimony/profile" element={<ProtectedRoute><E><MatrimonyProfilePage /></E></ProtectedRoute>} />
            <Route path="/matrimony/preferences" element={<ProtectedRoute><E><PartnerPreferencesPage /></E></ProtectedRoute>} />
            <Route path="/matrimony/search" element={<E><MatrimonySearchPage /></E>} />
            <Route path="/matrimony/auto-matches" element={<ProtectedRoute><E><AutoMatchesPage /></E></ProtectedRoute>} />
            <Route path="/matrimony/profile/:userId" element={<E><MatrimonyViewProfilePage /></E>} />
            <Route path="/messages" element={<ProtectedRoute><E><MessagesPage /></E></ProtectedRoute>} />
            <Route path="/admin" element={<E><AdminDashboardPage /></E>} />
            <Route path="/admin/users" element={<E><AdminUsersPage /></E>} />
            <Route path="/admin/profiles" element={<E><AdminProfilesPage /></E>} />
            <Route path="/admin/fraud" element={<E><AdminFraudPage /></E>} />
            <Route path="/admin/payments" element={<E><AdminPaymentsPage /></E>} />
            <Route path="/admin/analytics" element={<E><AdminAnalyticsPage /></E>} />
            <Route path="/admin/roles" element={<E><AdminRolesPage /></E>} />
            <Route path="/admin/config" element={<E><AdminConfigPage /></E>} />
            <Route path="/admin/reports" element={<E><AdminReportsPage /></E>} />
            <Route path="/admin/spiritual" element={<E><AdminSpiritualPage /></E>} />
            <Route path="/deity-search" element={<E><UniversalSearchPage /></E>} />
            <Route path="/deity/:deityName" element={<E><DeityProfilePage /></E>} />
            <Route path="/temple/:id" element={<E><TempleDetailPage /></E>} />
            <Route path="/terms" element={<E><TermsPage /></E>} />
            <Route path="/privacy" element={<E><PrivacyPage /></E>} />
            <Route path="/refund-policy" element={<E><RefundPolicyPage /></E>} />
            <Route path="/calendar" element={<E><TamilCalendarPage /></E>} />
            <Route path="/nayanmars" element={<E><NayanmarsPage /></E>} />
            <Route path="/alwars" element={<E><AlwarsPage /></E>} />
            <Route path="/spiritual-updates" element={<E><SpiritualUpdatesPage /></E>} />
            <Route path="/temple-map" element={<E><TempleMapPage /></E>} />
            <Route path="*" element={<E><NotFound /></E>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
