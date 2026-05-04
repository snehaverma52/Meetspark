# import os
# import re
# from datetime import datetime

# from moviepy.editor import VideoFileClip
# import whisper
# from transformers import pipeline

# from reportlab.lib.pagesizes import A4
# from reportlab.platypus import SimpleDocTemplate, Paragraph
# from reportlab.lib.styles import ParagraphStyle
# # ================= AGENDA GENERATION MODEL =================
# title_generator = pipeline(
#     "text2text-generation",
#     model="czearing/article-title-generator"
# )


# # ================= AUDIO EXTRACTION =================
# def video_to_audio(video_path):
#     base, _ = os.path.splitext(video_path)
#     audio_path = base + ".wav"

#     print("🎬 Extracting audio from video...")
#     video = VideoFileClip(video_path)
#     video.audio.write_audiofile(audio_path, logger=None)

#     return audio_path


# # ================= TRANSCRIPTION =================
# def transcribe_audio(audio_path):
#     model = whisper.load_model("medium")

#     result = model.transcribe(
#         audio_path,
#         language="en",
#         fp16=False
#     )

#     text = result["text"]

#     # Remove filler words
#     for f in ["uh", "um", "you know", "like"]:
#         text = text.replace(f, "")

#     return text.strip()


# # ================= TEXT CHUNKING =================
# def chunk_text(text, max_words=700):
#     words = text.split()
#     chunks, current = [], []

#     for w in words:
#         current.append(w)
#         if len(current) >= max_words:
#             chunks.append(" ".join(current))
#             current = []

#     if current:
#         chunks.append(" ".join(current))

#     return chunks


# # ================= SUMMARIZATION =================
# def summarize_text(transcript):
#     summarizer = pipeline(
#         "summarization",
#         model="pszemraj/long-t5-tglobal-base-16384-book-summary",
#         tokenizer="pszemraj/long-t5-tglobal-base-16384-book-summary",
#         device_map="auto"
#     )

#     chunks = chunk_text(transcript)
#     summaries = []

#     for chunk in chunks:
#         prompt = (
#             "Summarize the following meeting transcript into:\n"
#             "- Overview\n"
#             "- Key decisions\n"
#             "- Action items\n"
#             "- Deadlines\n"
#             "- Project status\n\n"
#             + chunk
#         )

#         out = summarizer(
#             prompt,
#             max_length=350,
#             min_length=120,
#             do_sample=False
#         )[0]["summary_text"]

#         summaries.append(out)

#     return " ".join(summaries)
    

# # ================= AI GENERATED AGENDA =================
# def generate_agenda(summary_text):

#     prompt = "Generate a short meeting agenda title: " + summary_text[:500]

#     result = title_generator(
#         prompt,
#         max_length=15,
#         do_sample=False
#     )

#     agenda = result[0]["generated_text"]

#     return agenda


# # ================= SUMMARY FORMAT =================

# def format_summary(summary_text, sentences_per_block=3):
#     sentences = re.split(r'(?<=[.?!])\s+', summary_text.strip())

#     html = ""
#     block = []

#     for i, sentence in enumerate(sentences, 1):
#         block.append(sentence.strip())

#         # Break after 3 sentences OR at the end
#         if i % sentences_per_block == 0 or i == len(sentences):
#             paragraph = "<br/>".join(block)
#             html += f"• {paragraph}<br/><br/>"
#             block = []

#     return html


# # ================= PAGE BORDER & FOOTER =================
# def draw_page_frame(canvas, doc):
#     width, height = A4

#     canvas.setLineWidth(3)
#     canvas.rect(20, 20, width - 40, height - 40)

#     canvas.setFont("Helvetica", 9)
#     canvas.drawCentredString(
#         width / 2,
#         30,
#         "Confidential Property of the Company | Page 1 of 1"
#     )


# # ================= SUMMARY PDF =================
# def generate_summary_pdf(summary_text, base_name):
#     pdf_path = f"{base_name}_summary.pdf"

#     doc = SimpleDocTemplate(
#         pdf_path,
#         pagesize=A4,
#         leftMargin=50,
#         rightMargin=50,
#         topMargin=60,
#         bottomMargin=60
#     )

#     agenda = generate_agenda(summary_text)
#     summary_html = format_summary(summary_text)
#     now = datetime.now()

#     title_style = ParagraphStyle(
#         name="Title",
#         fontSize=14,
#         leading=18,
#         spaceAfter=12
#     )

#     meta_style = ParagraphStyle(
#         name="Meta",
#         fontSize=11,
#         leading=14,
#         spaceAfter=12
#     )

#     body_style = ParagraphStyle(
#         name="Body",
#         fontSize=11,
#         leading=16
#     )

#     elements = [
#         Paragraph(f"<b>Meeting Agenda:</b> {agenda}", title_style),
#         Paragraph(
#             f"<b>Date:</b> {now.strftime('%B %d, %Y')} &nbsp;&nbsp; | "
#             f"<b>Time:</b> {now.strftime('%I:%M %p')}",
#             meta_style
#         ),
#         Paragraph(summary_html, body_style)
#     ]

#     doc.build(
#         elements,
#         onFirstPage=draw_page_frame,
#         onLaterPages=draw_page_frame
#     )

#     return pdf_path


# # ================= TRANSCRIPT PDF =================
# def generate_transcript_pdf(transcript, base_name):
#     pdf_path = f"{base_name}_transcript.pdf"

#     style = ParagraphStyle(name="Normal", fontSize=11, leading=16)

#     doc = SimpleDocTemplate(pdf_path, pagesize=A4)
#     doc.build([
#         Paragraph("<b>FULL TRANSCRIPT</b><br/><br/>", style),
#         Paragraph(transcript.replace("\n", "<br/>"), style)
#     ])

#     return pdf_path


# # ================= MAIN PIPELINE =================
# def process_video(video_file):
#     audio_file = video_to_audio(video_file)
#     transcript = transcribe_audio(audio_file)
#     summary_text = summarize_text(transcript)

#     agenda = generate_agenda(summary_text)

#     base_name = os.path.splitext(os.path.basename(video_file))[0]

#     transcript_pdf = generate_transcript_pdf(transcript, base_name)
#     summary_pdf = generate_summary_pdf(summary_text, base_name)

#     return transcript_pdf, summary_pdf, agenda

# import os
# import re
# from datetime import datetime

# from moviepy.editor import VideoFileClip
# from faster_whisper import WhisperModel
# from transformers import pipeline

# from keybert import KeyBERT

# from reportlab.lib.pagesizes import A4
# from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
# from reportlab.lib.styles import ParagraphStyle


# # ================= MODELS =================


# print("🚀 Loading AI models...")

# # Faster Whisper (10x faster than normal whisper)
# whisper_model = WhisperModel("base", compute_type="int8")

# # Fast summarization model
# summarizer = pipeline(
#     "summarization",
#     model="facebook/bart-large-cnn",
#     device=-1
# )

# # Agenda title generator
# title_generator = pipeline(
#     "text2text-generation",
#     model="czearing/article-title-generator"
# )

# # Keyword extractor
# kw_model = KeyBERT()

# print("✅ Models Loaded")

# # ================= AUDIO EXTRACTION =================

# def video_to_audio(video_path):

#     base, _ = os.path.splitext(video_path)
#     audio_path = base + ".wav"

#     print("🎬 Extracting audio...")

#     video = VideoFileClip(video_path)
#     video.audio.write_audiofile(audio_path, logger=None)

#     return audio_path


# # ================= CLEAN TRANSCRIPT =================

# def clean_transcript(text):

#     text = re.sub(r"\b(uh|um|you know|like|okay|so)\b", "", text)
#     text = re.sub(r"\s+", " ", text)

#     return text.strip()


# # ================= TRANSCRIPTION =================

# def transcribe_audio(audio_path):

#     print("🧠 Transcribing audio...")

#     result = whisper_model.transcribe(
#         audio_path,
#         language="en",
#         fp16=False
#     )

#     text = result["text"]

#     return clean_transcript(text)

# # ================= TEXT CHUNKING =================

# def chunk_text(text, max_words=1200):

#     words = text.split()
#     chunks = []
#     current = []

#     for word in words:

#         current.append(word)

#         if len(current) >= max_words:
#             chunks.append(" ".join(current))
#             current = []

#     if current:
#         chunks.append(" ".join(current))

#     return chunks


# # ================= SUMMARIZATION =================

# def summarize_text(transcript):

#     print("📝 Generating summary...")

#     keywords = kw_model.extract_keywords(transcript, top_n=8)

#     keyword_list = [k[0] for k in keywords]

#     chunks = chunk_text(transcript)

#     summaries = []

#     for chunk in chunks:

#         prompt = f"""
# You are an AI meeting assistant.

# Create a professional meeting summary with the following sections.

# Overview:
# Explain the main discussion.

# Key Decisions:
# Important decisions taken in the meeting.

# Action Items:
# Tasks assigned during the meeting.

# Deadlines:
# Mention any timelines or due dates.

# Project Status:
# Describe the current progress of the project.

# Important Keywords:
# {keyword_list}

# Transcript:
# {chunk}
# """

#         output = summarizer(
#             prompt,
#             max_length=350,
#             min_length=120,
#             do_sample=False
#         )[0]["summary_text"]

#         summaries.append(output)

#     return " ".join(summaries)


# # ================= AGENDA GENERATION =================

# def generate_agenda(summary_text):

#     prompt = "Generate a short meeting agenda title: " + summary_text[:400]

#     result = title_generator(
#         prompt,
#         max_length=15,
#         do_sample=False
#     )

#     return result[0]["generated_text"]


# # ================= FORMAT SUMMARY =================

# def format_summary(summary_text):

#     sentences = re.split(r'(?<=[.?!])\s+', summary_text)

#     formatted = ""

#     for sentence in sentences:
#         formatted += f"• {sentence}<br/><br/>"

#     return formatted


# # ================= PAGE BORDER =================

# def draw_page_frame(canvas, doc):

#     width, height = A4

#     canvas.setLineWidth(3)
#     canvas.rect(20, 20, width - 40, height - 40)

#     canvas.setFont("Helvetica", 9)

#     canvas.drawCentredString(
#         width / 2,
#         30,
#         "Confidential Property of the Company"
#     )


# # ================= SUMMARY PDF =================

# def generate_summary_pdf(summary_text, base_name):

#     pdf_path = f"{base_name}_summary.pdf"

#     doc = SimpleDocTemplate(
#         pdf_path,
#         pagesize=A4,
#         leftMargin=50,
#         rightMargin=50,
#         topMargin=60,
#         bottomMargin=60
#     )

#     agenda = generate_agenda(summary_text)

#     summary_html = format_summary(summary_text)

#     now = datetime.now()

#     title_style = ParagraphStyle(
#         name="Title",
#         fontSize=14,
#         leading=18,
#         spaceAfter=15
#     )

#     meta_style = ParagraphStyle(
#         name="Meta",
#         fontSize=11,
#         leading=14,
#         spaceAfter=15
#     )

#     body_style = ParagraphStyle(
#         name="Body",
#         fontSize=11,
#         leading=16
#     )

#     elements = [

#         Paragraph(f"<b>Meeting Agenda:</b> {agenda}", title_style),

#         Paragraph(
#             f"<b>Date:</b> {now.strftime('%B %d, %Y')} | "
#             f"<b>Time:</b> {now.strftime('%I:%M %p')}",
#             meta_style
#         ),

#         Paragraph(summary_html, body_style)

#     ]

#     doc.build(
#         elements,
#         onFirstPage=draw_page_frame,
#         onLaterPages=draw_page_frame
#     )

#     return pdf_path


# # ================= TRANSCRIPT PDF =================

# def generate_transcript_pdf(transcript, base_name):

#     pdf_path = f"{base_name}_transcript.pdf"

#     style = ParagraphStyle(name="Normal", fontSize=11, leading=16)

#     doc = SimpleDocTemplate(pdf_path, pagesize=A4)

#     doc.build([

#         Paragraph("<b>FULL TRANSCRIPT</b><br/><br/>", style),

#         Paragraph(
#             transcript.replace("\n", "<br/>"),
#             style
#         )

#     ])

#     return pdf_path


# # ================= MAIN PIPELINE =================

# def process_video(video_file):

#     audio_file = video_to_audio(video_file)

#     transcript = transcribe_audio(audio_file)

#     summary_text = summarize_text(transcript)

#     agenda = generate_agenda(summary_text)

#     base_name = os.path.splitext(
#         os.path.basename(video_file)
#     )[0]

#     transcript_pdf = generate_transcript_pdf(
#         transcript,
#         base_name
#     )

#     summary_pdf = generate_summary_pdf(
#         summary_text,
#         base_name
#     )

#     return transcript_pdf, summary_pdf, agenda
import os
import re
from datetime import datetime

from moviepy.editor import VideoFileClip
from faster_whisper import WhisperModel
from transformers import pipeline
from keybert import KeyBERT

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle


# ================= LOAD MODELS =================

print("🚀 Loading AI models...")

whisper_model = WhisperModel("base", compute_type="int8")

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=-1
)

title_generator = pipeline(
    "text2text-generation",
    model="czearing/article-title-generator"
)

kw_model = KeyBERT()

print("✅ Models Loaded")


# ================= AUDIO EXTRACTION =================

def video_to_audio(video_path):

    base, _ = os.path.splitext(video_path)
    audio_path = base + ".wav"

    print("🎬 Extracting audio...")

    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path, logger=None)
    video.close()   # ✅ memory fix

    return audio_path


# ================= VIDEO DURATION =================

def get_video_duration(video_path):

    video = VideoFileClip(video_path)
    duration_seconds = video.duration
    video.close()

    return duration_seconds / 60   # minutes


# ================= CLEAN TRANSCRIPT =================

def clean_transcript(text):

    text = re.sub(r"\b(uh|um|you know|like|okay|so)\b", "", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ================= TRANSCRIPTION =================

def transcribe_audio(audio_path):

    print("🧠 Transcribing audio...")

    segments, _ = whisper_model.transcribe(audio_path)

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return clean_transcript(transcript)


# ================= TEXT CHUNKING =================

def chunk_text(text, max_words=1200):

    words = text.split()
    chunks = []

    for i in range(0, len(words), max_words):
        chunk = words[i:i + max_words]
        chunks.append(" ".join(chunk))

    return chunks


# ================= SUMMARIZATION =================

def summarize_text(transcript):

    print("📝 Generating summary...")

    keywords = kw_model.extract_keywords(transcript, top_n=6)
    keyword_list = [k[0] for k in keywords]

    chunks = chunk_text(transcript)
    summaries = []

    for chunk in chunks:

        prompt = f"""
Summarize the following meeting transcript.

Include:
- Problem discussed
- Proposed solution
- Technologies used
- Key benefits
- Performance details
- Future scope

Keywords: {", ".join(keyword_list)}

Transcript:
{chunk}
"""

        output = summarizer(
            prompt,
            max_length=320,
            min_length=100,
            do_sample=False
        )[0]["summary_text"]

        summaries.append(output)

    return " ".join(summaries)


# ================= AGENDA =================

def generate_agenda(summary_text):

    prompt = "Discussion on: " + summary_text[:400]

    result = title_generator(
        prompt,
        max_length=15,
        do_sample=False
    )

    return result[0]["generated_text"]


# ================= FORMAT SUMMARY =================

def format_summary(summary_text):

    sentences = re.split(r'(?<=[.?!])\s+', summary_text)

    formatted = ""

    for sentence in sentences:
        formatted += f"• {sentence}<br/><br/>"

    return formatted


# ================= PAGE BORDER =================

def draw_page_frame(canvas, doc):

    width, height = A4

    canvas.setLineWidth(3)
    canvas.rect(20, 20, width - 40, height - 40)

    canvas.setFont("Helvetica", 9)
    canvas.drawCentredString(
        width / 2,
        30,
        "Confidential Property of the Company"
    )


# ================= SUMMARY PDF =================

def generate_summary_pdf(summary_text, base_name):

    pdf_path = f"{base_name}_summary.pdf"

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=60,
        bottomMargin=60
    )

    agenda = generate_agenda(summary_text)
    summary_html = format_summary(summary_text)
    now = datetime.now()

    title_style = ParagraphStyle(name="Title", fontSize=14, leading=18)
    meta_style = ParagraphStyle(name="Meta", fontSize=11, leading=14)
    body_style = ParagraphStyle(name="Body", fontSize=11, leading=16)

    elements = [

        Paragraph(f"<b>Meeting Agenda:</b> {agenda}", title_style),

        Paragraph(
            f"<b>Date:</b> {now.strftime('%B %d, %Y')} | "
            f"<b>Time:</b> {now.strftime('%I:%M %p')}",
            meta_style
        ),

        Paragraph(summary_html, body_style)

    ]

    doc.build(
        elements,
        onFirstPage=draw_page_frame,
        onLaterPages=draw_page_frame
    )

    return pdf_path


# ================= TRANSCRIPT PDF =================

def generate_transcript_pdf(transcript, base_name):

    pdf_path = f"{base_name}_transcript.pdf"

    style = ParagraphStyle(name="Normal", fontSize=11, leading=16)

    doc = SimpleDocTemplate(pdf_path, pagesize=A4)

    doc.build([
        Paragraph("<b>FULL TRANSCRIPT</b><br/><br/>", style),
        Paragraph(transcript.replace("\n", "<br/>"), style)
    ])

    return pdf_path


# ================= TIME SAVED =================
def calculate_time_saved(duration_minutes, summary_text):
    words = len(summary_text.split())

    # reading speed: 200 words per minute
    read_time_minutes = words / 200

    # actual saved time
    time_saved = duration_minutes - read_time_minutes

    # ✅ minimum guarantee (important fix)
    if time_saved <= 0:
        time_saved = duration_minutes * 0.3

    return round(time_saved, 2)


# ================= MAIN PIPELINE =================

def process_video(video_file):

    # ⏱️ duration
    duration = get_video_duration(video_file)

    # 🎬 audio
    audio_file = video_to_audio(video_file)

    # 🧠 transcript
    transcript = transcribe_audio(audio_file)

    # 📝 summary
    summary_text = summarize_text(transcript)

    # 📌 agenda
    agenda = generate_agenda(summary_text)

    # ⏳ time saved
    time_saved = calculate_time_saved(duration, summary_text)

    base_name = os.path.splitext(os.path.basename(video_file))[0]

    transcript_pdf = generate_transcript_pdf(transcript, base_name)
    summary_pdf = generate_summary_pdf(summary_text, base_name)

    return (
        transcript_pdf,
        summary_pdf,
        agenda,
        transcript,
        summary_text,
        duration,
        time_saved
    )