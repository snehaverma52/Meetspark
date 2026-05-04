from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import pathlib
import traceback
from datetime import datetime

import razorpay

client = razorpay.Client(auth=("rzp_live_SdM6E1RYfMOQOT", "2Y2fvdbfip6yVfNsiTTVff0w"))

# 🔹 Import processing
from convert import process_video

# 🔹 Supabase
from db import supabase

# ------------------------------------
#        FLASK CONFIGURATION
# ------------------------------------
app = Flask(__name__, template_folder="templates")
CORS(app)

BASE_DIR = pathlib.Path(__file__).parent.resolve()
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR

os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".mkv", ".webm", ".avi", ".flv"}
app.config["MAX_CONTENT_LENGTH"] = 600 * 1024 * 1024  # 600MB

MAX_FREE_UPLOADS = 3

# ------------------------------------
#             HELPERS
# ------------------------------------
def allowed_file(filename: str) -> bool:
    return pathlib.Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

# ------------------------------------
#              ROUTES
# ------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

# 🔥 UPLOAD ROUTE
@app.post("/upload")
def upload_video():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if not file.filename:
            return jsonify({"error": "No filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        filename = secure_filename(file.filename)
        save_path = UPLOAD_DIR / filename
        file.save(str(save_path))
        print("📂 Video saved:", save_path)

        # 🔹 USER ID
        user_id = request.form.get("user_id", "guest")
        print("👤 USER ID:", user_id)

        # 🔹 CHECK TRIAL COUNT
        try:
            existing = supabase.table("Meetings").select("*").eq("user_id", user_id).execute()
            trial_count = len(existing.data) if existing.data else 0
        except Exception as e:
            print("❌ Supabase fetch error:", e)
            trial_count = 0

        if trial_count >= MAX_FREE_UPLOADS:
            return jsonify({"error": "Free trial limit reached"}), 403

        # 🔹 PROCESS VIDEO
        transcript_pdf, summary_pdf, agenda, transcript, summary_text, duration, time_saved = process_video(str(save_path))

        print("✅ Processing complete")
        print("⏱ Duration:", duration)
        print("⏳ Time Saved:", time_saved)

        # 🔹 SAFETY FIX
        duration = float(duration or 0)
        time_saved = float(time_saved or 0)

        # 🔹 SAVE TO SUPABASE
        try:
            response = supabase.table("Meetings").insert({
                "user_id": user_id,
                "title": filename,
                "duration": duration,
                "time_saved": time_saved,
                "summary": summary_text,
                "transcript": transcript,
                "agenda": agenda,
                "transcript_file": os.path.basename(transcript_pdf),
                "summary_file": os.path.basename(summary_pdf),
                "created_at": str(datetime.now())
            }).execute()

            print("📦 Inserted duration:", duration)
            print("📦 Inserted time_saved:", time_saved)
            print("📦 SUPABASE RESPONSE:", response)

        except Exception as db_error:
            print("❌ Supabase Insert Error:", db_error)

        # 🔥 RETURN RESPONSE (FIXED POSITION)
        return jsonify({
            "agenda": agenda,
            "transcript": transcript,
            "summary": summary_text,
            "duration": round(duration, 2),
            "time_saved": round(time_saved, 2),
            "transcript_download_url": f"http://127.0.0.1:5000/download?file={os.path.basename(transcript_pdf)}",
            "summary_download_url": f"http://127.0.0.1:5000/download?file={os.path.basename(summary_pdf)}",
            "trial_count": trial_count + 1
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🔥 DOWNLOAD
@app.get("/download")
def download_file_api():
    file_name = request.args.get("file")

    if not file_name:
        return jsonify({"error": "Missing filename"}), 400

    safe_file = secure_filename(file_name)
    file_path = OUTPUT_DIR / safe_file

    if not file_path.exists():
        return jsonify({"error": "File not found"}), 404

    return send_file(str(file_path), as_attachment=True)


# 🔥 HISTORY
@app.get("/history")
def get_history():
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"history": [], "trial_count": 0})

        response = supabase.table("Meetings") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()

        meetings = response.data if response.data else []

        return jsonify({
            "history": meetings,
            "trial_count": len(meetings)
        })

    except Exception as e:
        print("❌ History Error:", e)
        return jsonify({
            "error": str(e),
            "history": [],
            "trial_count": 0
        }), 500


@app.route("/create-order", methods=["POST"])
def create_order():
    try:
        data = request.json
        amount = data.get("amount")

        order = client.order.create({
            "amount": int(amount * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify(order)

    except Exception as e:
        return jsonify({"error": str(e)})


# ------------------------------------
#            START SERVER
# ------------------------------------
if __name__ == "__main__":
    print("🚀 Server running: http://127.0.0.1:5000")
    print(f"📂 Upload Folder: {UPLOAD_DIR}")
    print(f"📂 Output Folder: {OUTPUT_DIR}")
    app.run(host="0.0.0.0", port=5000, debug=True)