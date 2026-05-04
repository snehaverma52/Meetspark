import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Upload, History, CreditCard, Settings,
  Menu, X, Sparkles, ChevronRight,
} from "lucide-react";

import { UserButton, useUser } from "@clerk/react";
import Footer from "@/components/ui/Footer";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Upload Meeting", icon: Upload, path: "/upload" },
  { label: "History", icon: History, path: "/history" },
  { label: "Subscription", icon: CreditCard, path: "/pricing" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function DashboardLayout() {

  const { user } = useUser();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  // ✅ FETCH REAL TRIAL COUNT FROM BACKEND
  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/history?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Sidebar Data:", data);
        setTrialCount(data.trial_count || 0);
      })
      .catch(err => console.error("Sidebar trial fetch error:", err));
  }, [user]);

  return (
    <div className="min-h-screen flex bg-background">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border
        flex flex-col transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            MeetSum AI
          </span>

          <button
            className="lg:hidden ml-auto text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${active
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${active ? "text-primary" : ""}`} />
                {item.label}

                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ✅ REAL TRIAL BADGE */}
        <div className="px-4 pb-3">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Free Trials
            </p>

            <p className="text-lg font-bold text-foreground">
              {Math.max(0, 3 - trialCount)}/3
              <span className="text-xs text-muted-foreground font-normal">
                {" "}remaining
              </span>
            </p>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">

            <UserButton />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName}
              </p>
            </div>

          </div>
        </div>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-4 lg:px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">

          <button
            className="lg:hidden mr-3 text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.fullName}
            </span>

            <UserButton />
          </div>

        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}
