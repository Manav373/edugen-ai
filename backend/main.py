from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import api_router
from app.api.routers.tools import router as tools_router

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(tools_router, prefix="/api/v1/tools", tags=["tools"])

@app.get("/")
async def root():
    return {"message": "EduGen AI Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
