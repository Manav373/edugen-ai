# EduGen AI 🎓🤖

**EduGen AI** is an advanced, cloud-based academic assistant designed to streamline the study workflow for college students. It leverages the power of **Large Language Models (LLMs)** via the Groq API (LLaMA 3, Mixtral) to generate high-quality academic content, debug code, and provide detailed explanations.

Built with a modern, responsive **Dark Mode UI**, EduGen AI ensures a premium user experience across all devices, from desktops to mobile phones.

---

## 🚀 Key Features

### 1. 📝 Assignment Solver
- **Smart Generation**: Upload assignment questions (PDF/Images) or type them manually.
- **Customizable Output**: Choose from different writing styles (*Academic, Simple, Bullet Points*) and detail levels (Marks 1-5).
- **File Support**: Extracts text from PDFs and images to contextually answer questions.
- **Export Options**: Download solutions as **PDF**, **Word (.doc)**, or **Copy to Clipboard**.

### 2. 🧪 Lab Manual Assistant
- **Code & Theory**: specialised mode for generating lab reports, code solutions, and theoretical explanations.
- **Language Support**: Supports Python, Java, C++, JavaScript, and custom languages.
- **Format Control**: Toggle between *Detailed, Concise,* or *Code Only* outputs.
- **Mobile Optimized**: Auto-scrolls to solutions on mobile for a seamless coding experience.

### 3. 🎓 Student Question Helper
- **Concept Clarification**: Ask any academic doubt and get a structured, easy-to-understand answer.
- **Text-to-Speech**: Listen to answers on the go.
- **History & Bookmarks**: Save important answers for quick revision later.

### 4. 📱 Premium UI & Accessibility
- **Forced Dark Mode**: A sleek, eye-friendly dark interface permanently enabled.
- **Mobile First**: Touch-friendly navigation, "Back to Top" buttons, and responsive layouts.
- **Print Friendly**: All exports (PDF/Word) are automatically formatted in standard **Black on White** for printing.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Framework**: FastAPI (Python)
- **AI Inference**: Groq API (LLaMA 3 / Mixtral)
- **Validation**: Pydantic
- **Server**: Uvicorn

### Tools & Libraries
- **PDF Generation**: `react-to-print` (custom print styles)
- **Word Export**: HTML-to-Doc conversion
- **Markdown Rendering**: Custom Markdown renderer with syntax highlighting

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.8+
- Groq API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/edugen-ai.git
cd edugen-ai
```

### 2. Backend Setup
Navigate to the `backend` folder and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY=your_api_key_here
```

Run the backend server:
```bash
python -m uvicorn main:app --reload
```
*Server runs at `http://localhost:8000`*

### 3. Frontend Setup
Navigate to the `frontend` folder.

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
*App runs at `http://localhost:5173`*

---

## 📖 How to Use

1.  **Select a Tool**: Use the sidebar to choose between *Assignment Solver*, *Lab Manual*, or *Student Questions*.
2.  **Input Data**:
    *   **Text**: Type your questions directly.
    *   **Files**: Click "Upload" to attach PDFs or Images of your question paper.
3.  **Customize**: Select your subject, desired marks/length, and output style.
4.  **Generate**: Click "Solve". The AI will stream the answer.
5.  **Export**:
    *   Click **PDF** to download a print-ready file.
    *   Click **Word** to get an editable `.doc` file.
    *   Click **Copy** to paste it elsewhere.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

MIT License © 2024 EduGen AI
