import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload as UploadIcon,
  FileVideo,
  X,
  CheckCircle2
} from "lucide-react";
import { useUser } from "@clerk/react";

export default function UploadPage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [status, setStatus] = useState("idle");
  const [resultData, setResultData] = useState<any>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [trialCount, setTrialCount] = useState(0);

  const locked = trialCount >= 3 && !uploading && !resultData;

  // ✅ FETCH HISTORY
  useEffect(() => {
    if (!user) return;

    fetch(`http://127.0.0.1:5000/history?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setTrialCount(Number(data.trial_count) || 0);
      })
      .catch(err => console.error(err));
  }, [user]);

  const incrementTrial = () => setTrialCount(prev => prev + 1);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Please login first
      </div>
    );
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  // 🔥 UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!file) return;

    if (trialCount >= 3) {
      navigate("/pricing");
      return;
    }

    setUploading(true);
    setStatus("uploading");
    setProgress(10);

    // 🔥 Smooth fake progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.id);

      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      clearInterval(interval);

      setProgress(100);
      setStatus("completed");
      setResultData(result);

      incrementTrial();

    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  // 🔥 STATUS TEXT
  const getStatusText = () => {
    if (progress < 30) return "Uploading...";
    if (progress < 60) return "Processing audio...";
    if (progress < 90) return "Generating summary...";
    if (progress < 100) return "Finalizing...";
    return "Completed";
  };

  // 🔒 LOCK UI
  if (locked) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Upload Meeting</h1>

        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-semibold">Free trials used</h2>

          <button
            onClick={() => navigate("/pricing")}
            className="btn-primary mt-4"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Upload Meeting</h1>

        <p className="text-muted-foreground mt-1">
          {3 - trialCount} free uploads remaining
        </p>

        {/* HISTORY */}
        {history.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold">Recent Meetings</h2>
            <ul className="text-sm text-muted-foreground">
              {history.map((m) => (
                <li key={m.id}>
                  {m.title} - {new Date(m.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MAIN */}
      {!uploading ? (
        <motion.div>

          {/* DROP ZONE */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >

            <input
              id="file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && setFile(e.target.files[0])
              }
            />

            {/* ICON */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UploadIcon className="w-8 h-8 text-primary" />
            </div>

            {/* TEXT */}
            <h3 className="text-lg font-semibold">
              Drop your meeting video here
            </h3>

            <p className="text-sm text-muted-foreground">
              or click to browse · MP4, MOV, WEBM up to 2GB
            </p>
          </div>

          {/* FILE PREVIEW */}
          {file && (
            <div className="glass-card p-4 mt-4 flex items-center justify-between">

              <div className="flex items-center gap-3">
                <FileVideo />
                <span>{file.name}</span>
              </div>

              <button onClick={() => setFile(null)}>
                <X />
              </button>
            </div>
          )}

          {/* BUTTON */}
          {file && (
            <button
              onClick={handleUpload}
              className="btn-primary w-full mt-4"
            >
              Upload & Process
            </button>
          )}

        </motion.div>
      ) : (
        <motion.div className="glass-card p-8 text-center">

          {progress >= 100 ? (
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          ) : (
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          )}

          <h3 className="font-semibold">{getStatusText()}</h3>

          <div className="w-full bg-gray-200 h-2 mt-4 rounded">
            <div
              className="bg-primary h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2">{Math.floor(progress)}%</p>

          {/* RESULT BUTTON */}
          {status === "completed" && resultData && (
            <>
              <button
                onClick={() => navigate("/result/new", { state: resultData })}
                className="btn-primary w-full mt-4"
              >
                View Result
              </button>

              <button
                onClick={() => {
                  setUploading(false);
                  setFile(null);
                  setProgress(0);
                  setStatus("idle");
                  setResultData(null);
                }}
                className="btn-ghost w-full mt-2"
              >
                Upload Another
              </button>
            </>
          )}

        </motion.div>
      )}
    </div>
  );
}