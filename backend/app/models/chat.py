from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "llama-3.3-70b-versatile"

class ChatResponse(BaseModel):
    response: str
