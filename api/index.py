import sys
import os

# Add the parent directory to sys.path to allow importing from backend
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, 'backend'))

from backend.main import app

# This is the entry point for Vercel Serverless Functions
# It exposes the FastAPI app instance
