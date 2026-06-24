import traceback
import uvicorn
import os
import shutil
import math
os.environ["PATH"] += os.pathsep + r"D:\ffmpeg-8.1.1-essentials_build\bin"
print("FFMPEG PATH =", shutil.which("ffmpeg"))
import io
import json
import re
import tempfile
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai
from google.genai import types
import whisper
from pydub import AudioSegment

load_dotenv()

AI_SERVICE_PORT = int(os.getenv("PORT", os.getenv("AI_SERVICE_PORT", 8000)))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash").strip()

app = FastAPI(title="AI Interviewer Microservice", version="1.0")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WHISPER_MODEL = None

def get_whisper_model():
    global WHISPER_MODEL
    if WHISPER_MODEL is None:
        print("Loading Whisper Model ...")
        WHISPER_MODEL = whisper.load_model("base.en")
        print("Whisper Model Loaded Successfully")
    return WHISPER_MODEL


class QuestionResquest(BaseModel):
    role: str = "MERN Stack Developer"
    level: str = "Junior"
    count: int = 5
    interview_type: str = "coding-mix"


class QuestionResponse(BaseModel):
    questions: list[str]
    model_used: str


class QuestionsPayload(BaseModel):
    questions: list[str]


class EvaluationRequest(BaseModel):
    question: str
    question_type: str
    role: str
    level: str
    user_answer: Optional[str] = None
    user_code: Optional[str] = None


class EvaluationResponse(BaseModel):
    technicalScore: int
    confidenceScore: int
    aiFeedback: str
    idealAnswer: str


class EvaluationPayload(BaseModel):
    technicalScore: int
    confidenceScore: int
    aiFeedback: str
    idealAnswer: str


def get_gemini_client() -> genai.Client:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is missing in ai-service/.env",
        )
    return genai.Client(api_key=GEMINI_API_KEY)


def strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()
    return cleaned


def extract_json_text(text: str) -> str:
    cleaned = strip_code_fences(text)

    obj_match = re.search(r"\{[\s\S]*\}", cleaned)
    if obj_match:
        return obj_match.group(0)

    return cleaned


def clamp_score(value) -> int:
    try:
        score = int(float(value))
    except Exception:
        score = 0
    return max(0, min(100, score))


@app.get("/")
async def root():
    return {
        "message": "Hello from AI Interviewer Microservice!",
        "model": GEMINI_MODEL_NAME,
    }
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: QuestionResquest):
    print("\n===== GENERATE QUESTIONS REQUEST =====")
    print(request.model_dump())
    print("=====================================\n")
    try:
        role_instruction = ""
        if request.interview_type == "coding-mix":
            coding_count = max(1, math.ceil(request.count * 0.5))
            oral_count = int(request.count) - int(coding_count)

            instruction = (
                f"The first {coding_count} questions MUST be coding challenges requiring function implementation. "
                f"The remaining {oral_count} questions MUST be conceptual oral questions."
            )
        else:
            instruction = (
                "All questions MUST be conceptual oral questions. "
                "Do NOT generate any coding or implementation challenges."
            )

            

        if "SDE" in request.role or "Software Development Engineer" in request.role:
            role_instruction = (
                "For SDE interviews: "
                "Generate questions from Data Structures & Algorithms, OOP, DBMS, Operating Systems, "
                "Computer Networks, SQL, System Design and Software Engineering fundamentals. "
                "For Junior level focus on Arrays, Strings, Hashing, Linked Lists, OOP and DBMS basics. "
                "For Mid level include Trees, Graphs, OS, CN and SQL. "
                "For Senior level include Dynamic Programming, System Design, Scalability, "
                "Concurrency and Distributed Systems."
            )

        system_prompt = (
            "You are a professional technical interviewer. "
            "Return ONLY valid JSON with this exact shape: "
            '{"questions":["question 1","question 2"]}. '
            "No markdown, no numbering, no extra explanation, no code fences. "
            f"Crucial instruction: {instruction} "
            f"Generate exactly {request.count} unique interview questions for a {request.level} level {request.role}. "
            f"{role_instruction}"
        )

        user_prompt = (
            f"Generate exactly {request.count} unique interview questions "
            f"for a {request.level} level {request.role}."
        )

        client = get_gemini_client()
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.6,
            max_output_tokens=1024,
            response_mime_type="application/json",
            response_schema=QuestionsPayload,
        )
        response = client.models.generate_content(
            model=GEMINI_MODEL_NAME,
            contents=user_prompt,
            config=config,
        )


        raw_text = (response.text or "").strip()
        try:
            parsed = QuestionsPayload.model_validate_json(raw_text)
        except Exception:
            cleaned = extract_json_text(raw_text)
            parsed = QuestionsPayload.model_validate_json(cleaned)

        questions = [q.strip() for q in parsed.questions if q and q.strip()]

        if not questions:
            raise HTTPException(status_code=500, detail="Gemini returned no questions.")

        return QuestionResponse(
            questions=questions[: request.count],
            model_used=GEMINI_MODEL_NAME,
        )

    except HTTPException:
        raise
    except Exception as e:
            print("\n===== GENERATE QUESTIONS ERROR =====")
            traceback.print_exc()
            print("===================================\n")
            raise HTTPException(status_code=500, detail=str(e))


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        print("TRANSCRIBE ENDPOINT HIT")
        print("FILE:", file.filename, file.content_type)

        audio_bytes = await file.read()
        print("AUDIO SIZE:", len(audio_bytes))

        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(audio_bytes)
            temp_audio_path = tmp.name

        

        result = get_whisper_model().transcribe(temp_audio_path)
        print("\n===== WHISPER TRANSCRIPTION =====")
        print(result)
        print("=================================\n")
        print("TRANSCRIPTION TEXT:", result.get("text", "NO TEXT"))

        os.remove(temp_audio_path)
        return {"transcription": result["text"].strip()}

    except Exception as e:
        import traceback

        print("\n===== TRANSCRIBE ERROR =====")
        traceback.print_exc()
        print("===========================\n")

        if "temp_audio_path" in locals() and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

        raise HTTPException(status_code=500, detail=str(e))


@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest):
    try:
        if request.question_type == "oral":
            assessment_instruction = (
                "This is a conceptual oral question. Focus purely on the candidate's verbal explanation. "
                "Ignore any code blocks. "
                "CRITICAL: If the transcript is empty, nonsense (e.g. 'blah blah', 'testing') "
                "or irrelevant to the question, SCORE 0."
            )
        else:
            assessment_instruction = (
                "This is a coding challenge question. Evaluate the code logic and efficiency. "
                "Use the transcription only for insight into their thought process. "
                "CRITICAL: If the code is undefined, empty, just random comments, or random characters, SCORE 0."
            )

        system_prompt = (
            "You are a strict technical interviewer. "
            "Do NOT hallucinate positive reviews for bad input. "
            "RULE 1: If the answer is gibberish, irrelevant, or missing, "
            "return technicalScore=0 and confidenceScore=0. "
            "RULE 2: For idealAnswer, provide a clean markdown string. "
            "Do NOT return a nested JSON object. "
            "RULE 3: technicalScore and confidenceScore MUST be integers between 0 and 100. "
            "Use the following scale: "
            "100 = perfect answer, "
            "90 = excellent answer, "
            "80 = very good answer, "
            "70 = good answer, "
            "50 = average answer, "
            "30 = weak answer, "
            "0 = completely incorrect answer. "
            "DO NOT use a 1-10 scale. "
            "DO NOT use a 1-5 scale. "
            "ALWAYS return scores between 0 and 100. "
            "Return ONLY valid JSON with this exact shape: "
            '{"technicalScore":0,"confidenceScore":0,"aiFeedback":"...","idealAnswer":"..."}. '
            f"Context: {assessment_instruction}"
        )

        user_prompt = (
            f"Role: {request.role}\n"
            f"Question: {request.question}\n"
            f"Level: {request.level}\n"
            f"Verbal Answer: {request.user_answer or 'No verbal answer provided'}\n"
            f"Code Answer: {request.user_code or 'No code provided'}\n"
        )

        client = get_gemini_client()
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.1,
            max_output_tokens=2048,
            response_mime_type="application/json",
            response_schema=EvaluationPayload,
        )
        response = client.models.generate_content(
            model=GEMINI_MODEL_NAME,
            contents=user_prompt,
            config=config,
        )

        print("\n===== RAW GEMINI RESPONSE =====")
        print(response.text)
        print("==============================\n")

        raw_text = (response.text or "").strip()
        try:
            parsed = EvaluationPayload.model_validate_json(raw_text)
        except Exception:
            cleaned = extract_json_text(raw_text)
            parsed = EvaluationPayload.model_validate_json(cleaned)

        evaluation_data = {
            "technicalScore": clamp_score(parsed.technicalScore),
            "confidenceScore": clamp_score(parsed.confidenceScore),
            "aiFeedback": str(parsed.aiFeedback).strip() or "No feedback returned.",
            "idealAnswer": str(parsed.idealAnswer).strip()
            or "No ideal answer returned.",
        }

        return EvaluationResponse(**evaluation_data)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Failed to generate response: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=AI_SERVICE_PORT)
