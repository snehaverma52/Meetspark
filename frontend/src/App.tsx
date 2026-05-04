import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useEffect } from "react";

import { useAuth, RedirectToSignIn } from "@clerk/react";
import Login from "@/pages/Login";

import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import UploadPage from "@/pages/UploadPage";
import ResultPage from "@/pages/ResultPage";
import HistoryPage from "@/pages/HistoryPage";
import PricingPage from "@/pages/PricingPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

/* ✅ ADDED PAGES */
import AboutPage from "@/pages/AboutPage";
import FeaturesPage from "@/pages/FeaturesPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";

const queryClient = new QueryClient();

// ✅ THEME FUNCTION
const applyTheme = (theme: string) => {
  const html = document.documentElement;
  if (theme === "dark") html.classList.add("dark");
  else html.classList.remove("dark");
};

// Added: ProtectedRoute wrapper
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <RedirectToSignIn />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ✅ PUBLIC ROUTES (ADDED) */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* PROTECTED */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="result/:id" element={<ResultPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

const App = () => {

  // ✅ THEME INIT LOGIC
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      applyTheme(saved);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(systemDark ? "dark" : "light");
    }

    // ✅ SYSTEM CHANGE LISTENER
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = (e: any) => {
      const saved = localStorage.getItem("theme");
      if (!saved) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;