import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import { ClerkProvider } from "@clerk/react";

// 🔥 APPLY THEME ON LOAD (IMPORTANT)
const savedTheme = localStorage.getItem("theme") || "system";
const root = document.documentElement;

if (savedTheme === "dark") {
  root.classList.add("dark");
} else if (savedTheme === "light") {
  root.classList.remove("dark");
} else {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", isDark);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);