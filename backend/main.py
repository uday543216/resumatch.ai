from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from services.pdf_service import extract_text_from_pdf
from services.ai_service import generate_resume_roast
from services.stripe_service import create_checkout_session
from database import resume_collection
from models.resume import ResumeAnalysis
from pydantic import BaseModel

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="ResuMatch AI API")

# Configure CORS for Next.js frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "ResuMatch AI Backend is running"}

@app.post("/api/roast")
async def roast_resume(request: Request, file: UploadFile = File(...)):
    client_ip = request.client.host if request.client else "unknown"
    
    # Check free trial limit via IP (Max 1 free roast)
    if resume_collection is not None:
        usage_count = await resume_collection.count_documents({"client_ip": client_ip})
        if usage_count >= 1:
            raise HTTPException(
                status_code=403, 
                detail="Free trial limit reached. Please upgrade to Premium to get unlimited ATS analyses and advanced tools."
            )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        # 1. Read the file bytes
        file_bytes = await file.read()
        
        # 2. Extract text from PDF
        resume_text = extract_text_from_pdf(file_bytes)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. It might be an image-based PDF or empty.")
            
        # 3. Call OpenAI for analysis
        ai_analysis = await generate_resume_roast(resume_text)
        
        # 4. Save to MongoDB
        if resume_collection is not None:
            try:
                resume_record = ResumeAnalysis(
                    filename=file.filename,
                    raw_text=resume_text,
                    score=ai_analysis.get("score", 0),
                    roast=ai_analysis.get("roast", ""),
                    missing_keywords=ai_analysis.get("missing_keywords", []),
                    client_ip=client_ip
                )
                # Save to db
                new_resume = await resume_collection.insert_one(
                    resume_record.model_dump(by_alias=True, exclude={"id"})
                )
                ai_analysis["id"] = str(new_resume.inserted_id)
            except Exception as db_err:
                print(f"MongoDB Insert Error: {db_err}")
                pass # gracefully continue if db fails but keep analysis
        
        # Append filename
        ai_analysis["filename"] = file.filename
        
        return ai_analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CheckoutRequest(BaseModel):
    success_url: str
    cancel_url: str

@app.post("/api/checkout")
async def create_checkout(request: Request, body: CheckoutRequest):
    client_ip = request.client.host if request.client else "unknown"
    session_data = create_checkout_session(client_ip, body.success_url, body.cancel_url)
    if "error" in session_data:
         raise HTTPException(status_code=400, detail=session_data["error"])
    return session_data
