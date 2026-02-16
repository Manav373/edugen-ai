from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional
from app.services.groq_service import groq_service
from app.core.prompts import QUIZ_GENERATION_PROMPT, FLASHCARD_GENERATION_PROMPT, SUMMARIZATION_PROMPT
import json
import re

router = APIRouter()

# --- Request Models ---
class GenerateQuizRequest(BaseModel):
    content: Optional[str] = None
    files_data: List[str] = [] # list of base64 strings
    file_types: List[str] = [] # list of mime types
    num_questions: int = 5
    difficulty: str = "medium"
    question_type: str = "mixed"
    quiz_focus: str = "comprehensive"

class GenerateFlashcardsRequest(BaseModel):
    content: Optional[str] = None
    files_data: List[str] = []
    file_types: List[str] = []
    num_cards: int = 10
    card_style: str = "standard"
    focus_area: str = "all"

class SummarizeRequest(BaseModel):
    content: Optional[str] = None
    files_data: List[str] = []
    file_types: List[str] = []
    mode: str = "standard"
    summary_format: str = "bullet_points"
    focus_area: str = "general"

# --- Helper to parse JSON from AI response ---
def parse_json_response(response_text: str):
    # Try to find JSON block if wrapped in markdown
    match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
    if match:
        json_str = match.group(1)
    else:
        # Sometimes AI just returns the JSON
        json_str = response_text
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        # Fallback: try to clean up the string if needed or just raise
        raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON")

# --- Endpoints ---

@router.post("/generate-quiz")
async def generate_quiz(request: GenerateQuizRequest):
    try:
        messages = []
        
        # Handle Files (Vision) or Text
        if request.files_data:
            vision_content = []
            
            # Add text instruction first
            prompt_text = QUIZ_GENERATION_PROMPT.format(
                content="[SEE ATTACHED IMAGES/DOCUMENTS]", 
                num_questions=request.num_questions,
                difficulty=request.difficulty,
                question_type=request.question_type,
                quiz_focus=request.quiz_focus
            )
            # STRICT JSON ENFORCEMENT FOR VISION MODEL
            prompt_text += "\n\nCRITICAL: You must return ONLY valid JSON. No Markdown. No Explanations. Just the JSON array."
            
            vision_content.append({"type": "text", "text": prompt_text})
            
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                # Decode base64 to bytes
                file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                file_type = request.file_types[idx]
                
                # Convert to vision-ready base64 images
                vision_images = file_processor.process_file_to_base64_images(file_bytes, file_type)
                
                for img_b64 in vision_images:
                    vision_content.append({
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_b64}"
                        }
                    })
            
            messages = [{"role": "user", "content": vision_content}]
            model = "meta-llama/llama-4-scout-17b-16e-instruct"  # Llama 4 Vision model 

        else:
            # Text Only
            prompt = QUIZ_GENERATION_PROMPT.format(
                content=request.content,
                num_questions=request.num_questions,
                difficulty=request.difficulty,
                question_type=request.question_type,
                quiz_focus=request.quiz_focus
            )
            messages = [{"role": "user", "content": prompt}]
            model = "llama-3.3-70b-versatile"

        response_text = await groq_service.get_chat_response(messages, model=model)
        print(f"DEBUG: Quiz/Vision Response: {response_text[:200]}...") # Log response
        quiz_data = parse_json_response(response_text)
        
        return {"questions": quiz_data}
    except Exception as e:
        print(f"ERROR: Generate Quiz Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-flashcards")
async def generate_flashcards(request: GenerateFlashcardsRequest):
    try:
        if request.files_data:
            vision_content = []
            prompt_text = FLASHCARD_GENERATION_PROMPT.format(
                content="[SEE ATTACHED IMAGES/DOCUMENTS]",
                num_cards=request.num_cards,
                card_style=request.card_style,
                focus_area=request.focus_area
            )
            prompt_text += "\n\nCRITICAL: You must return ONLY valid JSON. No Markdown. No Explanations. Just the JSON array."
            vision_content.append({"type": "text", "text": prompt_text})
            
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                file_type = request.file_types[idx]
                vision_images = file_processor.process_file_to_base64_images(file_bytes, file_type)
                for img_b64 in vision_images:
                    vision_content.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}
                    })
            
            messages = [{"role": "user", "content": vision_content}]
            model = "meta-llama/llama-4-scout-17b-16e-instruct"  # Llama 4 Vision model
        else:
            prompt = FLASHCARD_GENERATION_PROMPT.format(
                content=request.content,
                num_cards=request.num_cards,
                card_style=request.card_style,
                focus_area=request.focus_area
            )
            messages = [{"role": "user", "content": prompt}]
            model = "llama-3.3-70b-versatile"
        
        response_text = await groq_service.get_chat_response(messages, model=model)
        print(f"DEBUG: Flashcards Response: {response_text[:200]}...")
        flashcards_data = parse_json_response(response_text)
        
        return {"flashcards": flashcards_data}
    except Exception as e:
        print(f"ERROR: Generate Flashcards Failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize")
async def summarize_content(request: SummarizeRequest):
    try:
        if request.files_data:
            vision_content = []
            prompt_text = SUMMARIZATION_PROMPT.format(
                content="[SEE ATTACHED IMAGES/DOCUMENTS]",
                summary_mode=request.mode,
                summary_format=request.summary_format,
                focus_area=request.focus_area
            )
            prompt_text += "\n\nCRITICAL: You must return ONLY the summary in the requested format."
            vision_content.append({"type": "text", "text": prompt_text})
            
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                file_type = request.file_types[idx]
                vision_images = file_processor.process_file_to_base64_images(file_bytes, file_type)
                for img_b64 in vision_images:
                    vision_content.append({
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}
                    })
            
            messages = [{"role": "user", "content": vision_content}]
            model = "meta-llama/llama-4-scout-17b-16e-instruct"  # Llama 4 Vision model
        else:
            prompt = SUMMARIZATION_PROMPT.format(
                content=request.content,
                summary_mode=request.mode,
                summary_format=request.summary_format,
                focus_area=request.focus_area
            )
            messages = [{"role": "user", "content": prompt}]
            model = "llama-3.3-70b-versatile"

        response_text = await groq_service.get_chat_response(messages, model=model)
        
        return {"summary": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.core.prompts import ASSIGNMENT_SOLVER_PROMPT

class SolveAssignmentRequest(BaseModel):
    questions: str
    files_data: List[str] = []
    file_types: List[str] = []
    subject: str = "General"
    marks: str = "5"
    style: str = "academic" # academic, simple, bullet_points

@router.post("/solve-assignment")
async def solve_assignment(request: SolveAssignmentRequest):
    try:
        # Generate specific instructions based on marks
        marks_instructions = ""
        if request.marks == '1':
            marks_instructions = """
**1 MARK QUESTIONS:**
- MAXIMUM 1 sentence per answer
- Direct, concise answers only
- Example: "Machine learning is a subset of AI that enables systems to learn from data."
"""
        elif request.marks == '2':
            marks_instructions = """
**2 MARK QUESTIONS:**
- MINIMUM 3-4 sentences OR 4-5 bullet points per question
- Include: Definition + 2-3 key points
- Example length: 50-80 words per answer
"""
        elif request.marks == '3':
            marks_instructions = """
**3 MARK QUESTIONS:**
- MINIMUM 5-7 sentences OR 6-8 bullet points per question
- Include: Definition + Explanation + Example
- Example length: 100-150 words per answer
"""
        elif request.marks == '4':
            marks_instructions = """
**4 MARK QUESTIONS:**
- MINIMUM 8-12 sentences OR 10-15 bullet points per question
- Include: Detailed explanation + Multiple examples + Comparison
- Example length: 200-300 words per answer
"""
        elif request.marks == '5':
            marks_instructions = """
**5 MARK QUESTIONS (COMPREHENSIVE):**
- **CRITICAL: SKIP ALL MCQs and 1-Mark Questions.** Only provide answers for long-answer/essay type questions.
- MINIMUM 15-20 sentences OR 20-25 bullet points per question
- This is a FULL ESSAY-STYLE answer for EACH question
- Include: Complete explanation + Multiple examples + Diagrams + Applications + Conclusion
- Example length: 400-600 words PER ANSWER
"""

        # Adjust for style
        if request.style == 'simple':
            marks_instructions += "\n\n**STYLE NOTE**: Explain concepts simply, using easy-to-understand language and analogies. Avoid overly complex jargon."
        elif request.style == 'bullet_points':
             marks_instructions += "\n\n**STYLE NOTE**: prioritize bullet points and structured lists over long paragraphs for easy reading."

        # Process Files if any
        extracted_text = ""
        if request.files_data:
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                try:
                    file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                    file_type = request.file_types[idx]
                    text = await file_processor.extract_text_from_bytes(file_bytes, file_type)
                    extracted_text += f"\n\n--- FILE CONTENT ({file_type}) ---\n{text}\n"
                except Exception as e:
                    print(f"Error processing file for assignment: {e}")

        final_questions = request.questions + extracted_text

        prompt = ASSIGNMENT_SOLVER_PROMPT.format(
            subject=request.subject,
            questions=final_questions,
            marks=request.marks,
            style=request.style,
            marks_instructions=marks_instructions
        )
        
        # Use a model with larger context window if files are present? 
        # Llama 3 70b has 8k context, should be fine for text.
        messages = [
            {"role": "user", "content": prompt}
        ]
        
        response_text = await groq_service.get_chat_response(messages)
        
        return {"answer": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.core.prompts import LAB_SOLVER_PROMPT

class SolveLabRequest(BaseModel):
    questions: str
    files_data: List[str] = []
    file_types: List[str] = []
    subject: str = "General"
    language: str = "Python"
    style: str = "detailed" # detailed, concise, code_only

@router.post("/solve-lab-questions")
async def solve_lab_questions(request: SolveLabRequest):
    try:
        style_instructions = ""
        if request.style == 'detailed':
            style_instructions = """
- Provide thorough explanations for every step.
- Include "Why this approach?" section.
- Add detailed comments in the code explaining each block.
"""
        elif request.style == 'concise':
            style_instructions = """
- Keep explanations brief and to the point.
- Focus mainly on the logic and the code.
- Minimal comments, only where necessary.
"""
        if request.style == 'code_only':
            style_instructions = """
- PROVIDE ONLY THE CODE AND SAMPLE OUTPUT.
- NO theoretical explanations.
- Minimal comments.
"""

        # Process Files if any
        extracted_text = ""
        if request.files_data:
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                try:
                    file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                    file_type = request.file_types[idx]
                    text = await file_processor.extract_text_from_bytes(file_bytes, file_type)
                    extracted_text += f"\n\n--- FILE CONTENT ({file_type}) ---\n{text}\n"
                except Exception as e:
                    print(f"Error processing file for lab: {e}")

        final_questions = request.questions + extracted_text

        prompt = LAB_SOLVER_PROMPT.format(
            subject=request.subject,
            questions=final_questions,
            language=request.language,
            language_lower=request.language.lower(),
            style=request.style,
            style_instructions=style_instructions
        )

        messages = [
            {"role": "user", "content": prompt}
        ]

        response_text = await groq_service.get_chat_response(messages)

        return {"answer": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.core.prompts import STUDY_HELPER_PROMPT

class SolveStudyRequest(BaseModel):
    questions: str
    files_data: List[str] = []
    file_types: List[str] = []
    subject: str = "General"
    difficulty: str = "medium"
    study_mode: str = "balanced"
    tutor_persona: str = "friendly" # friendly, socratic, direct, analogy

@router.post("/study-helper")
async def study_helper(request: SolveStudyRequest):
    try:
        # 1. Persona Instructions
        persona_map = {
            "friendly": "You are a warm, encouraging, and patient tutor. Use emojis, give praise, and explain things simply.",
            "socratic": "You are a Socratic tutor. DO NOT give the answer directly appropriately. Instead, ask guiding questions to help the student derive the answer themselves. Lead them to the solution.",
            "direct": "You are a strict, no-nonsense professor. Give the facts, be precise, be concise. No fluff, no emojis. Focus on accuracy.",
            "analogy": "You are an 'Analogy Master'. Explain every complex concept using a simple, real-world analogy (e.g., explain CPU like a kitchen, etc.)."
        }
        persona_instructions = persona_map.get(request.tutor_persona, persona_map["friendly"])

        # 2. Difficulty Instructions
        difficulty_map = {
            "easy": "Explain like I'm 5. Use very simple language. Avoid jargon.",
            "medium": "Standard high-school/college level explanation. Balance depth and simplicity.",
            "hard": "PhD level explanation. Go deep into theory, exceptions, and nuance."
        }
        difficulty_instructions = difficulty_map.get(request.difficulty, difficulty_map["medium"])

        # 3. Study Mode Instructions
        mode_map = {
            "quick": "Keep answers very short and bulleted. The student is cramming.",
            "balanced": "Provide a standard explanation with 1-2 examples.",
            "deep": "Provide a comprehensive deep-dive. Include history, context, and related concepts."
        }
        study_mode_instructions = mode_map.get(request.study_mode, mode_map["balanced"])

        # Process Files if any
        extracted_text = ""
        if request.files_data:
            import base64
            from app.services.file_processor import file_processor
            
            for idx, file_b64 in enumerate(request.files_data):
                try:
                    file_bytes = base64.b64decode(file_b64.split(',')[1] if ',' in file_b64 else file_b64)
                    file_type = request.file_types[idx]
                    text = await file_processor.extract_text_from_bytes(file_bytes, file_type)
                    extracted_text += f"\n\n--- FILE CONTENT ({file_type}) ---\n{text}\n"
                except Exception as e:
                    print(f"Error processing file for study helper: {e}")

        final_questions = request.questions + extracted_text

        prompt = STUDY_HELPER_PROMPT.format(
            subject=request.subject,
            questions=final_questions,
            difficulty=request.difficulty.upper(),
            study_mode=request.study_mode.upper(),
            tutor_persona=request.tutor_persona.upper(),
            persona_instructions=persona_instructions,
            difficulty_instructions=difficulty_instructions,
            study_mode_instructions=study_mode_instructions
        )

        messages = [
            {"role": "user", "content": prompt}
        ]

        response_text = await groq_service.get_chat_response(messages)

        return {"answer": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
