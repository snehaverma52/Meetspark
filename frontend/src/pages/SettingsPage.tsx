import { motion } from "framer-motion"
import { User, Bell, Shield, Palette } from "lucide-react"
import { useUser, useClerk } from "@clerk/react"
import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

export default function SettingsPage() {
  const { user } = useUser()
  const { openUserProfile } = useClerk() // ✅ FIX

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [theme, setTheme] = useState<Theme>("system")

  // 🔥 Load Clerk Data
  useEffect(() => {
    if (user) {
      setName(user.fullName || "")
      setEmail(user.primaryEmailAddress?.emailAddress || "")
    }
  }, [user])

  // 🔥 Load saved theme
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system"
    setTheme(savedTheme)
    applyTheme(savedTheme)

    // 🔥 Listen system change
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => {
      if (savedTheme === "system") applyTheme("system")
    }
    media.addEventListener("change", listener)

    return () => media.removeEventListener("change", listener)
  }, [])

  // 🔥 Apply theme logic
  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement

    if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else if (selectedTheme === "light") {
      root.classList.remove("dark")
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", isDark)
    }
  }

  // 🔥 Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  // 🔥 Save to Clerk
  const handleSave = async () => {
    if (!user) return

    const [firstName, ...rest] = name.split(" ")
    const lastName = rest.join(" ")

    try {
      await user.update({
        firstName,
        lastName,
      })
      alert("Updated successfully ✅")
    } catch (err) {
      console.error(err)
      alert("Update failed ❌")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Profile */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
              <input
                value={email}
                className="input-dark w-full"
                disabled
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary mt-4 text-sm"
          >
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: "Email when processing completes", defaultChecked: true },
              { label: "Weekly summary digest", defaultChecked: false },
              { label: "Product updates", defaultChecked: true },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-muted-foreground">{n.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={n.defaultChecked}
                  className="w-4 h-4 rounded border-border bg-secondary accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
          </div>

          <button
            onClick={() => openUserProfile()} // ✅ FIXED
            className="bg-secondary text-foreground hover:bg-secondary/80 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Change Password
          </button>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`px-4 py-2 rounded-lg text-sm ${
                theme === "light" ? "bg-primary text-white" : "bg-secondary"
              }`}
            >
              Light
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`px-4 py-2 rounded-lg text-sm ${
                theme === "dark" ? "bg-primary text-white" : "bg-secondary"
              }`}
            >
              Dark
            </button>

            <button
              onClick={() => handleThemeChange("system")}
              className={`px-4 py-2 rounded-lg text-sm ${
                theme === "system" ? "bg-primary text-white" : "bg-secondary"
              }`}
            >
              System
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            Choose your theme or follow system settings.
          </p>
        </div>

      </motion.div>
    </div>
  )
}