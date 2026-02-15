import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AssignmentForm from './components/AssignmentForm';
import StudentQuestionForm from './components/StudentQuestionForm';
import LabManualForm from './components/LabManualForm';
import Materials from './components/Materials';
import Upload from './components/Upload';
import Settings from './components/Settings';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AccountDropdown from './components/AccountDropdown';
import LandingPage from './pages/LandingPage';
import ToolsDashboard from './components/tools/ToolsDashboard';
import QuizGenerator from './components/tools/QuizGenerator';
import FlashcardCreator from './components/tools/FlashcardCreator';
import Summarizer from './components/tools/Summarizer';
import { ChatProvider } from './contexts/ChatContext';

// Check if Clerk is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_your_key_here';

// Main app content component
const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

          {/* Header */}
          <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 lg:pl-6 lg:pr-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 shadow-lg z-10 relative">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button - Now part of header */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div>
                <h2 className="text-base sm:text-lg font-display font-semibold text-white">
                  Assistant
                </h2>
                <p className="text-xs text-gray-400 hidden sm:block">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Show UserButton if Clerk is configured, otherwise show AccountDropdown */}
              {hasValidClerkKey ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-glow",
                      userButtonPopoverCard: "bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 shadow-glass",
                      userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-white/5",
                      userButtonPopoverActionButtonIcon: "text-blue-400",
                      userButtonPopoverActionButtonText: "text-sm font-medium",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                />
              ) : (
                <AccountDropdown userName="Student" userEmail="student@edugen.ai" />
              )}
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/assignments" element={<AssignmentForm />} />
              <Route path="/student-questions" element={<StudentQuestionForm />} />
              <Route path="/lab-manuals" element={<LabManualForm />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tools" element={<ToolsDashboard />} />
              <Route path="/tools/quiz" element={<QuizGenerator />} />
              <Route path="/tools/flashcards" element={<FlashcardCreator />} />
              <Route path="/tools/summarizer" element={<Summarizer />} />
            </Routes>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
};

function App() {
  return (
    <Router>
      {hasValidClerkKey ? (
        // Use Clerk authentication if configured
        <Routes>
          {/* Public Routes - Sign In/Up */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Landing Page at Root */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <>
                <SignedIn>
                  <AppContent />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
        </Routes>
      ) : (
        // No authentication - show app directly
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<Navigate to="/chat" replace />} />
          <Route path="/sign-up" element={<Navigate to="/chat" replace />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
