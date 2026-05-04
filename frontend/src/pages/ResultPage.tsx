import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  CheckCircle2,
  FileText,
  Lightbulb,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const { id } = useParams();

  const [result, setResult] = useState<any>(location.state || null);
  const [copied, setCopied] = useState(false);

  // 🔥 Safe values
  const transcript = result?.transcript || "Transcript not available";
  const summary = result?.summary || "";
  const agenda = result?.agenda || "";

  // 🔔 Notification + sound
  useEffect(() => {
    if (!result) return;

    const showNotification = () => {
      new Notification("✅ PDF Ready!", {
        body: "Your meeting summary PDF has been generated.",
      });
    };

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") showNotification();
      });
    }

    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  }, [result]);

  // 🔥 Fetch fallback
  useEffect(() => {
    if (!result && id) {
      fetch(`http://127.0.0.1:5000/history`)
        .then((res) => res.json())
        .then((data) => {
          const found = data.history?.find((m: any) => m.id == id);
          if (found) setResult(found);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [id, result]);

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  if (!result) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        Loading meeting data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Meeting Summary
          </h1>
          <p className="text-muted-foreground mt-1">
            AI generated meeting minutes
          </p>
        </div>

        <a
          href={result?.summary_download_url}
          target="_blank"
          className="btn-primary inline-flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Agenda */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Meeting Agenda
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">{agenda}</p>
        </motion.div>

        {/* Transcript */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Transcript
              </h2>
            </div>

            <button
              onClick={copyTranscript}
              className="btn-ghost text-sm inline-flex items-center gap-1.5"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-sans bg-secondary/30 rounded-lg p-4 max-h-60 overflow-auto">
            {transcript}
          </pre>
        </motion.div>

        {/* Summary */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              AI Summary
            </h2>
          </div>

          <ul className="space-y-3">
            {summary.split(".").map((s: string, i: number) =>
              s.trim() ? (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {s}
                </li>
              ) : null
            )}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}