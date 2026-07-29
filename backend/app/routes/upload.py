from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from app.services.llm_service import analyze_meeting
from app.services.whisper_service import transcribe_audio

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename

    content = await file.read()

    with open(file_path, "wb") as saved_file:
        saved_file.write(content)

    transcript = transcribe_audio(str(file_path))
    analysis = analyze_meeting(transcript)

    return {
    "filename": file.filename,
    "transcript": transcript,
    "summary": analysis["summary"],
    "action_items": analysis["action_items"],
    "key_decisions": analysis["key_decisions"]
}