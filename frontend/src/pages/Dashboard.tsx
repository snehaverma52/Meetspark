import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  FileVideo,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = useUser();

  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [trialCount, setTrialCount] = useState(0);

  const [totalMeetings, setTotalMeetings] = useState(0);
  const [totalTimeSaved, setTotalTimeSaved] = useState(0);

  // ✅ FORMAT TIME
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);

    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // ✅ FETCH DATA
  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/history?user_id=${user.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        const meetings = data.history || [];

        setRecentMeetings(meetings.slice(0, 3));
        setTrialCount(data.trial_count || 0);
        setTotalMeetings(meetings.length);

        const totalSaved = meetings.reduce((acc: number, m: any) => {
          return acc + (m.time_saved || 0);
        }, 0);

        setTotalTimeSaved(totalSaved);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // ✅ STATS
  const stats = [
    {
      label: "Total Meetings",
      value: totalMeetings.toString(),
      icon: FileVideo,
      change: "Your uploads",
      link: "/history"
    },
    {
      label: "Time Saved",
      value: formatTime(totalTimeSaved),
      icon: TrendingUp,
      change: "AI optimized",
      link: "/history"
    },
    {
      label: "Summaries",
      value: totalMeetings.toString(),
      icon: BarChart3,
      change: "Generated",
      link: "/history"
    },
    {
      label: "Team Members",
      value: "1",
      icon: Users,
      change: "Solo plan",
      link: "/pricing"
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your meeting summaries
        </p>
      </div>

      {/* STATS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Link to={s.link} className="glass-card-hover p-5 block">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              <p className="text-2xl font-bold text-foreground">
                {s.value}
              </p>

              <p className="text-sm text-muted-foreground mt-1">
                {s.label}
              </p>

              <p className="text-xs text-primary/80 mt-2">
                {s.change}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* UPLOAD CARD */}
        <motion.div variants={item} className="lg:col-span-1">
          <Link to="/upload" className="block glass-card-hover p-6 h-full group">
            <div className="flex flex-col items-center text-center h-full justify-center py-4">

              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                Upload Meeting
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {trialCount >= 3
                  ? "Upgrade to continue uploading"
                  : `${3 - trialCount} free uploads remaining`}
              </p>

              <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                {trialCount >= 3 ? "View Plans" : "Upload Now"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* RECENT MEETINGS */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="glass-card p-6">

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Recent Meetings
              </h3>

              <Link
                to="/history"
                className="text-sm text-primary hover:text-primary/80"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No meetings yet
                </p>
              ) : (
                recentMeetings.map((m) => (
                  <Link
                    key={m.id}
                    to={`/result/${m.id}`}
                    state={{
                      transcript: m.transcript,
                      summary: m.summary,
                      agenda: m.agenda,
                      summary_download_url: `/download?file=${m.summary_file}`,
                      transcript_download_url: `/download?file=${m.transcript_file}`
                    }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/40 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <FileVideo className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                        {m.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleString()} ·{" "}
                        {formatTime(m.duration || 0)}
                      </p>
                    </div>

                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </span>
                  </Link>
                ))
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}