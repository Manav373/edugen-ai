from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
from app.models.chat import ChatRequest, ChatResponse
from app.services.groq_service import groq_service
from app.services.file_processor import file_processor

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response_content = await groq_service.get_chat_response(
            messages=[msg.dict() for msg in request.messages],
            model=request.model
        )
        return ChatResponse(response=response_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-assignment")
async def upload_assignment(file: UploadFile = File(...)):
    """
    Upload an assignment file and get AI-generated answers
    Supports PDF, images (JPG, PNG), and text files
    """
    try:
        # Extract text from the uploaded file
        extracted_text = await file_processor.process_file(file)
        
        if not extracted_text:
            raise HTTPException(status_code=400, detail="Could not extract text from file")
        
        # Create a prompt for the AI to analyze the assignment
        prompt = f"""You are an educational AI assistant. A student has uploaded an assignment file.

ASSIGNMENT CONTENT:
{extracted_text}

INSTRUCTIONS:
1. First, analyze if this is a Multiple Choice Question (MCQ) bank or regular assignment
2. If it's MCQs:
   - Provide ONLY the correct answers in a clean, numbered format
   - Format: "Q1: B", "Q2: A", etc.
   - NO explanations needed for MCQs
   - Group answers clearly

3. If it's a regular assignment:
   - Provide step-by-step solutions
   - Include clear explanations
   - Show formulas and calculations
   - Highlight final answers

FORMAT YOUR RESPONSE:
- Use clear headings with ## for sections
- Use **bold** for important terms
- Use numbered lists for steps
- Use bullet points for key concepts
- Keep it well-organized and easy to read

Provide clear, well-formatted answers."""
        
        # Get AI response
        messages = [{"role": "user", "content": prompt}]
        answer = await groq_service.get_chat_response(messages)
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": extracted_text,
            "answer": answer
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
