from groq import Groq
from app.core.config import settings

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        # List of models to try in order of preference
        self.fallback_models = [
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant",
            "gemma2-9b-it"
        ]

    async def get_chat_response(self, messages: list, model: str = None):
        # If a specific model is requested, try it first. Otherwise start with default.
        models_to_try = [model] + [m for m in self.fallback_models if m != model] if model else self.fallback_models
        
        last_exception = None

        for current_model in models_to_try:
            try:
                print(f"DEBUG: Attempting with model: {current_model}")
                chat_completion = self.client.chat.completions.create(
                    messages=messages,
                    model=current_model,
                    max_tokens=8000,
                    temperature=0.7,
                )
                return chat_completion.choices[0].message.content
            
            except Exception as e:
                error_msg = str(e).lower()
                last_exception = e
                print(f"Groq API Error on {current_model}: {e}")
                
                # Check for rate limit, overload, OR decommissioned models
                if any(x in error_msg for x in ["429", "rate limit", "overloaded", "model_decommissioned", "not found"]):
                    print(f"⚠️ Issue with {current_model} ({error_msg}). Switching to next model...")
                    continue # Try next model in loop
                
                # Handle specific Vision model failures by falling back to text-only processing
                if "vision" in current_model and ("vision" not in error_msg):
                     # If it's NOT a vision error but some other crash, try next model
                     continue
                
                # Simple fallback for now: just try next. If it's a 400 error (bad request), stop.
                if "400" in error_msg and "model_decommissioned" not in error_msg:
                    raise e # Don't retry real bad requests (like invalid parameters)
        
        # If all models fail, raise the last exception
        print("❌ All models failed.")
        raise last_exception

groq_service = GroqService()
