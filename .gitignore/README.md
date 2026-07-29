# 🎙️ AI Meeting Assistant

AI Meeting Assistant is a local AI-powered meeting analysis application.

It automatically:

- 🎤 Converts meeting audio into text using Whisper
- 📄 Generates a meeting summary
- ✅ Extracts action items
- 📌 Detects key decisions
- 📥 Exports the report as a TXT file

Everything runs locally using Ollama and Microsoft Phi-4 Mini.

---

# 🚀 Features

- Audio Upload (MP3, WAV, OGG, M4A)
- Whisper Speech-to-Text
- AI Meeting Summary
- Action Item Extraction
- Key Decision Detection
- TXT Report Export
- Modern React UI
- FastAPI Backend
- Local AI Processing

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Axios
- CSS

## Backend

- FastAPI
- Python
- Whisper
- Ollama
- Microsoft Phi-4 Mini

---

# 📁 Project Structure

```
AI-Meeting-Assistant
│
├── backend
│   ├── app
│   │   ├── routes
│   │   └── services
│   └── uploads
│
├── frontend
│   ├── src
│   └── public
│
└── README.md
```

---

# ⚙️ Installation

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Ollama

Install Ollama

```bash
ollama pull phi4-mini
```

Run

```bash
ollama serve
```

---

# ▶️ Usage

1. Start Ollama
2. Start FastAPI backend
3. Start React frontend
4. Upload a meeting recording
5. Click **Analyze Meeting**
6. Review:
   - Transcript
   - Summary
   - Action Items
   - Key Decisions
7. Download the TXT report

---

# 📸 Screenshots

Add screenshots here.

Example:

- Home Page
- Analysis Result
- TXT Report

---

# 🔒 Privacy

All processing is performed locally.

No meeting audio is uploaded to any cloud service.

---

# 🔮 Future Improvements

- PDF Export
- Speaker Identification
- Meeting Translation
- Search Inside Meetings
- Multiple AI Models
- Email Report Sharing

---

# 👨‍💻 Author

**Mevlüthan Küçük**

Management Information Systems Student

AI • Data Engineering • Machine Learning