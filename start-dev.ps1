# Start EduGen AI Development Environment

Write-Host "Starting Backend Server..." -ForegroundColor Green
# Change to backend directory so that 'app' module is found in sys.path
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; & '..\venv\Scripts\python.exe' -m uvicorn main:app --reload --port 8000"

Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "EduGen AI is starting up! Access the app at http://localhost:5173" -ForegroundColor Cyan
