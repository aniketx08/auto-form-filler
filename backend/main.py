# backend.main.py
from fastapi import FastAPI, File, Form, UploadFile, Depends, Request
from fastapi.responses import JSONResponse
import shutil
import uuid
import asyncio
import os
from form_filler_playwright import fill_form_main  # function we'll add next
from fastapi.middleware.cors import CORSMiddleware
from routes import submit
from dotenv import load_dotenv
from utils.auth import get_current_user
# backend/main.py
from routes import user_routes

load_dotenv()

CLERK_JWT_ISSUER = os.getenv("CLERK_JWKS_URL")
CLERK_JWT_AUDIENCE = os.getenv("CLERK_FRONTEND_API")

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_routes.router)

@app.post("/submit/")
async def submit_form(
    request: Request,
    form_url: str = Form(...),
    json_file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    print("User ID:", user["sub"])
    form = await request.form()
    print("📦 Received form:", form)

    job_id = str(uuid.uuid4())
    json_path = f"uploads/{job_id}_data.json"

    with open(json_path, "wb") as jf:
        shutil.copyfileobj(json_file.file, jf)

    # ✅ Launch the Playwright autofill now
    print("🚀 Launching form fill task...")
    await fill_form_main(form_url, json_path, resume_path=None)

    return JSONResponse({"status": "started", "job_id": job_id})
