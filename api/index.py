import sys
import os

# Add the parent directory to sys.path to allow importing from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

# This is the entry point for Vercel Serverless Functions
# It exposes the FastAPI app instance
