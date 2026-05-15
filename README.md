# 🚀 MeetSpark – AI Meeting Minutes Generator

MeetSpark is an AI-powered Meeting Minutes Generator designed to automate the process of converting meeting recordings into structured transcripts and concise summaries.  
The system securely validates uploaded files before processing them using AI-based transcription and summarization models.

---

# ✨ Key Features

## 🔐 Secure File Validation
- Malware scanning using ClamAV
- Detects suspicious or malicious uploaded files
- Supports secure validation before AI processing
- File type verification for audio/video uploads

## 🎙️ AI-Based Transcription
- Converts meeting audio/video into text
- Whisper AI integration for speech-to-text processing
- Supports meeting recording transcription

## 🧠 AI Meeting Summarization
- Automatically generates concise meeting summaries
- Extracts important discussion points
- Reduces manual note-taking effort

## 📂 Media Processing
- Audio extraction using FFmpeg
- Handles video/audio preprocessing before transcription

## 📊 Professional Dashboard
- Modern and responsive UI
- Upload progress indicators
- Result display for transcript and summary
- User-friendly workflow

## 🔔 Notification System
- Sends notifications when transcript and summary are generated
- Improves user interaction and workflow tracking

## 📄 Report Generation
- Structured transcript and summary output
- Ready for future PDF export integration

---

# 🏗️ System Workflow

```text
User Upload
     ↓
File Validation (ClamAV)
     ↓
Safe File Verification
     ↓
FFmpeg Media Processing
     ↓
Whisper AI Transcription
     ↓
AI Summarization
     ↓
Dashboard Result Display
     ↓
Notification Generation
```

---

# 🛠️ Tech Stack

## 🎨 Frontend
- React.js
- TypeScript
- Tailwind CSS
- Vite

## ⚙️ Backend
- Python
- Flask

## 🤖 AI & NLP
- Whisper AI
- Transformers
- NLP Processing

## 🔐 Security
- ClamAV Antivirus Scanner
- File Validation System

## 🎞️ Media Processing
- FFmpeg

## 🌐 Version Control
- Git
- GitHub

---

# 📁 Project Structure

```text
MeetSpark/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── scanner.py
│   └── uploads/
│
├── README.md
└── package.json
```

---

# ⚡ Installation & Setup

## 📌 Clone Repository

```bash
git clone https://github.com/snehaverma52/Meetspark.git
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5000
```

---

# 🔐 ClamAV Setup (Windows)

## 1️⃣ Install ClamAV
Download and install ClamAV for Windows.

## 2️⃣ Configure Files
Edit:

```text
freshclam.conf
clamd.conf
```

Remove:

```text
Example
```

from both files.

## 3️⃣ Update Database

```bash
freshclam.exe
```

## 4️⃣ Test Scanner

```bash
clamscan.exe test.mp4
```

---

# 🎞️ FFmpeg Setup

## Install FFmpeg
Download FFmpeg and add it to system environment variables.

## Verify Installation

```bash
ffmpeg -version
```

---

# 👥 Team Members & Contributions

## 👩‍💻 Sneha
### Security & Secure File Validation
- ClamAV integration
- File validation workflow
- Secure upload architecture
- Malware scanning implementation

---

## 🧠 Naman
### AI Model & Processing
- AI model integration
- Meeting summarization workflow
- NLP processing pipeline

---

## 🔔 Ritu
### Notification System
- Notification workflow
- User alert integration
- Result notification handling

---

## 💻 Vansh
### Frontend & Backend Development
- Dashboard UI development
- Backend integration
- API connectivity
- Frontend workflow management

---

# 🎯 Future Scope

- Multi-language support
- Live meeting transcription
- Zoom/Google Meet integration
- Speaker identification
- Cloud deployment
- PDF export enhancement
- Real-time meeting analysis

---

# 📸 Screenshots





# 📜 License

This project is developed for educational and academic purposes.

---

# 🌟 Project Highlights

✅ Secure File Upload Validation  
✅ AI-Based Meeting Summarization  
✅ Malware Detection Integration  
✅ Professional Dashboard UI  
✅ AI Speech-to-Text Conversion  
✅ Real-Time Notification Workflow  
✅ Automated Meeting Documentation  

---

# 🔗 Repository

GitHub Repository:  
https://github.com/snehaverma52/Meetspark
