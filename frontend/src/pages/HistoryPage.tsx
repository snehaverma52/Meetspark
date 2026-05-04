import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileVideo, CheckCircle2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const { user } = useUser();

  // 🔥 Fetch history
  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/history?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("HISTORY DATA:", data); // debug
        setMeetings(data.history || []);
      })
      .catch((err) => console.error("History fetch error:", err));
  }, [user]);

  // 🔥 Search filter
  const filtered = meetings.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Meeting History
          </h1>
          <p className="text-muted-foreground mt-1">
            {meetings.length} meetings processed
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings..."
            className="input-dark w-full pl-10 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No meetings found</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filtered.map((m) => (
            <motion.div key={m.id} variants={item}>
              
              {/* 🔥 IMPORTANT FIX HERE */}
              <Link
                to={`/result/${m.id}`}
                state={m}   // 🔥 DATA PASS
                className="glass-card-hover p-4 flex items-center gap-4 block"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileVideo className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()} ·{" "}
                    {m.duration} min
                  </p>
                </div>

                {/* Status */}
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}