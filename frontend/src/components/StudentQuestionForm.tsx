import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Download, Loader2, Copy, FileDown, BookmarkPlus, BookmarkCheck, Volume2, VolumeX, History, Sparkles, Maximize2, X, Check, GraduationCap, ArrowUp } from 'lucide-react';
import MarkdownRenderer from './ui/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedAnswer {
    id: string;
    questions: string;
    subject: string;
    difficulty: string;
    studyMode: string;
    tutorPersona: string;
    answer: string;
    timestamp: number;
    isBookmarked: boolean;
}

interface FileData {
    name: string;
    type: string;
    data: string; // base64
}

const StudentQuestionForm: React.FC = () => {
    const [questions, setQuestions] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [studyMode, setStudyMode] = useState('balanced');
    const [tutorPersona, setTutorPersona] = useState('friendly');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');
    const [files, setFiles] = useState<FileData[]>([]);
    const [processingFiles, setProcessingFiles] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    // const [answerTheme, setAnswerTheme] = useState<'dark' | 'light'>('dark'); // Removed for forced dark mode
    const [showHistory, setShowHistory] = useState(false);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);
    const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const speechSynthesis = window.speechSynthesis;

    useEffect(() => {
        const saved = localStorage.getItem('studentAnswers');
        if (saved) {
            setSavedAnswers(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('studentAnswers');
        if (saved) {
            setSavedAnswers(JSON.parse(saved));
        }
    }, []);

    // Auto-scroll to results when generated (Mobile UX)
    useEffect(() => {
        if (result && componentRef.current) {
            setTimeout(() => {
                componentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300); // Slight delay for animation
        }
    }, [result]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setProcessingFiles(true);
        const newFiles: FileData[] = [];

        try {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const reader = new FileReader();

                await new Promise<void>((resolve) => {
                    reader.onload = (event) => {
                        if (event.target?.result) {
                            newFiles.push({
                                name: file.name,
                                type: file.type,
                                data: event.target.result as string
                            });
                        }
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
            setFiles(prev => [...prev, ...newFiles]);
        } catch (error) {
            console.error("Error reading files:", error);
            alert("Failed to process files");
        } finally {
            setProcessingFiles(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(result);
        alert('✅ Answers copied to clipboard!');
    };

    const handleDownloadPDF = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Study_Notes_${subject || 'General'}`,
    });

    const handleDownloadWord = () => {
        if (!componentRef.current) return;

        const content = componentRef.current.innerHTML;
        const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Detailed Study Notes</title>
            <style>
                body { 
                    font-family: 'Calibri', 'Arial', sans-serif; 
                    font-size: 11pt; 
                    color: #000000; 
                    background-color: #ffffff; 
                    line-height: 1.5;
                }
                h1, h2, h3, h4, h5, h6 { 
                    color: #000000; 
                    margin-top: 15pt; 
                    margin-bottom: 5pt; 
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin-bottom: 10pt; 
                    border: 1px solid #000000;
                }
                th, td { 
                    border: 1px solid #000000; 
                    padding: 5pt; 
                    text-align: left; 
                    vertical-align: top;
                }
                th { 
                    background-color: #f2f2f2; 
                    font-weight: bold; 
                }
                code { 
                    font-family: 'Consolas', 'Courier New', monospace; 
                    background-color: #f5f5f5; 
                    padding: 2px 4px; 
                    border-radius: 3px;
                }
                pre { 
                    background-color: #f5f5f5; 
                    padding: 10pt; 
                    border: 1px solid #ddd; 
                    white-space: pre-wrap; 
                    font-family: 'Consolas', 'Courier New', monospace;
                }
                ul, ol { margin-bottom: 10pt; }
                li { margin-bottom: 3pt; }
                /* Clean up Tailwind utility classes that might interfere */
                .hidden { display: none; }
            </style>
        </head>
        <body>
            <div class="WordSection1">
                ${content}
            </div>
        </body>
        </html>`;

        const blob = new Blob(['\ufeff', preHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Study_Notes_${subject || 'General'}_${Date.now()}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked && result) saveAnswer(true);
    };

    const handleTextToSpeech = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(result.replace(/[#*`]/g, ''));
            utterance.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const saveAnswer = (bookmark: boolean = false) => {
        const newAnswer: SavedAnswer = {
            id: Date.now().toString(),
            questions,
            subject,
            difficulty,
            studyMode,
            tutorPersona,
            answer: result,
            timestamp: Date.now(),
            isBookmarked: bookmark
        };
        const updated = [newAnswer, ...savedAnswers].slice(0, 50);
        setSavedAnswers(updated);
        localStorage.setItem('studentAnswers', JSON.stringify(updated));
    };

    const loadSavedAnswer = (saved: SavedAnswer) => {
        setQuestions(saved.questions);
        setSubject(saved.subject);
        setDifficulty(saved.difficulty);
        setStudyMode(saved.studyMode);
        setTutorPersona(saved.tutorPersona || 'friendly');
        setResult(saved.answer);
        setIsBookmarked(saved.isBookmarked);
        setShowHistory(false);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!questions.trim() && files.length === 0) return;

        setIsGenerating(true);
        setResult('');
        setIsBookmarked(false);

        try {
            const response = await fetch('http://localhost:8000/api/v1/tools/study-helper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions,
                    files_data: files.map(f => f.data),
                    file_types: files.map(f => f.type),
                    subject,
                    difficulty,
                    study_mode: studyMode,
                    tutor_persona: tutorPersona
                })
            });
            const data = await response.json();
            if (data.answer) {
                setResult(data.answer);
                setTimeout(() => saveAnswer(false), 1000);
            }
        } catch (error) {
            console.error("Error generating answers:", error);
            setResult("❌ Failed to generate answers. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const mainContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={mainContainerRef} className="flex flex-col lg:flex-row h-full gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 overflow-y-auto lg:overflow-hidden relative custom-scrollbar">
            {/* Expanded Editor Modal */}
            <AnimatePresence>
                {isEditorExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">

                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-gray-900 border border-gray-700 w-full max-w-5xl h-[80vh] rounded-2xl flex flex-col shadow-2xl"
                        >
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
                                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    Edit Study Material
                                </h3>
                                <button
                                    onClick={() => setIsEditorExpanded(false)}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <textarea
                                value={questions}
                                onChange={(e) => setQuestions(e.target.value)}
                                className="flex-1 w-full bg-gray-950 p-4 sm:p-6 text-base sm:text-lg text-purple-300 font-sans outline-none resize-none"
                                placeholder="Paste your questions or notes here..."
                            />
                            <div className="p-4 border-t border-gray-800 flex justify-end">
                                <button
                                    onClick={() => setIsEditorExpanded(false)}
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold"
                                >
                                    Done Editing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Side - Options */}
            {/* Left Side - Questions Form */}
            <div className={`transition-all duration-500 ${result ? 'w-full lg:w-1/2' : 'w-full max-w-4xl mx-auto'} h-auto lg:h-full lg:overflow-y-auto custom-scrollbar pr-2`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 text-white">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <span className="hidden sm:inline">Study Helper</span>
                        <span className="sm:hidden">Study</span>
                    </h2>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="px-3 sm:px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all flex items-center gap-2 border border-gray-700 min-h-[44px]"
                    >
                        <History className="w-5 h-5" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                </div>

                {/* History Panel */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden"
                        >
                            <div className="p-4 max-h-64 overflow-y-auto">
                                {savedAnswers.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">No saved history yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {savedAnswers.map((saved) => (
                                            <div
                                                key={saved.id}
                                                onClick={() => loadSavedAnswer(saved)}
                                                className="p-3 bg-gray-800/30 hover:bg-gray-800 rounded-lg cursor-pointer border border-gray-700/50 hover:border-purple-500/50 transition-all flex justify-between items-center group"
                                            >
                                                <div className="truncate flex-1 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-purple-400 text-sm">{saved.subject || 'General'}</span>
                                                        <span className="text-xs text-gray-500">• {new Date(saved.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 truncate">{saved.questions}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700 p-4 sm:p-6 shadow-xl">
                    <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
                        {/* File Upload */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                accept=".pdf,.png,.jpg,.jpeg,.webp"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={processingFiles}
                                className={`w-full py-4 border-2 border-dashed rounded-xl transition-all group min-h-[80px] ${processingFiles ? 'border-purple-500 bg-purple-500/5' : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/5'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    {processingFiles ? (
                                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                                    ) : (
                                        <Download className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    )}
                                    <span className="text-gray-400 group-hover:text-purple-400 font-medium">
                                        {processingFiles ? 'Processing Files...' : 'Upload Study Material (PDF / Images)'}
                                    </span>
                                </div>
                            </button>
                            {files.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg border border-gray-700 text-xs text-gray-300">
                                            <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                                            <button type="button" onClick={() => removeFile(i)} className="hover:text-red-400 ml-1">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Question Input */}
                        <div className="relative">
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">
                                Your Questions / Notes
                            </label>
                            <div className="relative">
                                <textarea
                                    value={questions}
                                    onChange={(e) => setQuestions(e.target.value)}
                                    className="w-full h-32 sm:h-40 md:h-48 bg-gray-900/50 border border-gray-600 rounded-xl p-3 sm:p-4 text-purple-200 font-sans resize-none focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                                    placeholder="e.g. Explain Quantum Physics like I'm 5..."
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsEditorExpanded(true)}
                                    className="absolute top-2 right-2 p-2 bg-gray-800/80 hover:bg-purple-600 rounded-lg text-gray-300 hover:text-white transition-all backdrop-blur-sm"
                                    title="Expand Editor"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Configuration Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Subject */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 outline-none transition-all"
                                    placeholder="e.g. Biology, History"
                                />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Difficulty</label>
                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                    {[
                                        { id: 'easy', label: 'Easy', emoji: '😊' },
                                        { id: 'medium', label: 'Medium', emoji: '🤔' },
                                        { id: 'hard', label: 'Hard', emoji: '🧠' },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setDifficulty(s.id)}
                                            className={`py-2 px-1 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-all border flex flex-col items-center gap-1 min-h-[44px] ${difficulty === s.id
                                                ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <span>{s.emoji}</span>
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Study Mode */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-2 block">Study Mode</label>
                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                    {[
                                        { id: 'quick', label: 'Quick', emoji: '⚡' },
                                        { id: 'balanced', label: 'Balanced', emoji: '⚖️' },
                                        { id: 'deep', label: 'Deep', emoji: '📚' },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setStudyMode(s.id)}
                                            className={`py-2 px-1 sm:px-2 rounded-lg text-xs sm:text-sm font-medium transition-all border flex flex-col items-center gap-1 min-h-[44px] ${studyMode === s.id
                                                ? 'bg-pink-600/20 border-pink-500 text-pink-400'
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <span>{s.emoji}</span>
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tutor Persona */}
                        <div>
                            <label className="text-sm font-semibold text-gray-300 mb-3 block">
                                Tutor Persona
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                                {[
                                    { value: 'friendly', label: 'Friendly', emoji: '🤗', desc: 'Warm & Patient' },
                                    { value: 'socratic', label: 'Socratic', emoji: '🧐', desc: 'Asks Questions' },
                                    { value: 'direct', label: 'Direct', emoji: '🎯', desc: 'To The Point' },
                                    { value: 'analogy', label: 'Analogy', emoji: '🍕', desc: 'Real Examples' },
                                ].map((persona) => (
                                    <button
                                        key={persona.value}
                                        type="button"
                                        onClick={() => setTutorPersona(persona.value)}
                                        className={`p-2 sm:p-3 rounded-xl border transition-all min-h-[44px] ${tutorPersona === persona.value
                                            ? 'border-blue-500 bg-blue-600/20 text-blue-400 shadow-md'
                                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 text-gray-400'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-lg sm:text-xl">{persona.emoji}</span>
                                            <span className="font-bold text-[10px] sm:text-xs">{persona.label}</span>
                                            <span className="text-[10px] opacity-70">{persona.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 min-h-[44px]"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Teaching...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="w-5 h-5" />
                                    Start Learning
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Answers */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full lg:w-1/2 h-full lg:h-full flex flex-col mt-4 lg:mt-0"
                    >
                        <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-t-2xl p-4 flex items-center justify-between shadow-lg z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <button
                                    onClick={() => mainContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="lg:hidden p-1.5 hover:bg-gray-700/50 rounded-lg text-blue-400 transition-colors"
                                >
                                    <ArrowUp className="w-5 h-5" />
                                </button>
                                <Check className="w-5 h-5 text-purple-500" />
                                Study Notes
                            </h3>
                            <div className="flex gap-2">

                                <button onClick={handleBookmark} className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors">
                                    {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
                                </button>
                                <button onClick={handleTextToSpeech} className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-blue-400 transition-colors">
                                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <button onClick={handleTextToSpeech} className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-blue-400 transition-colors">
                                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                {/* Theme toggle removed: Forced Dark Mode */}
                            </div>
                        </div>

                        <div
                            ref={componentRef}
                            className="flex-1 overflow-y-auto p-8 rounded-b-2xl shadow-2xl custom-scrollbar print:overflow-visible print:h-auto print:bg-white print:text-black bg-gray-900 text-gray-300"
                        >
                            <div className="prose max-w-none print:prose-neutral prose-invert">
                                <style type="text/css" media="print">
                                    {`
                                        @page { size: auto; margin: 20mm; }
                                        @media print {
                                            body { -webkit-print-color-adjust: exact; }
                                            * {
                                                color: #000000 !important;
                                                background-color: #ffffff !important;
                                                text-shadow: none !important;
                                                box-shadow: none !important;
                                            }
                                            .prose { color: #000000 !important; }
                                            .prose * { color: #000000 !important; }
                                            code, pre { 
                                                border: 1px solid #ccc; 
                                                background-color: #f5f5f5 !important; 
                                            }
                                        }
                                    `}
                                </style>
                                <div className="hidden print:block mb-6 pb-6 border-b border-gray-200">
                                    <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                        {subject && <span>Subject: {subject}</span>}
                                        {difficulty && <span>• Difficulty: {difficulty}</span>}
                                    </div>
                                </div>
                                <MarkdownRenderer
                                    content={result}
                                    theme="dark"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button onClick={handleCopyToClipboard} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 min-h-[44px]">
                                <Copy className="w-4 h-4" /> Copy
                            </button>
                            <button onClick={handleDownloadPDF} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 min-h-[44px]">
                                <FileDown className="w-4 h-4" /> PDF
                            </button>
                            <button onClick={handleDownloadWord} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2 min-h-[44px]">
                                <FileText className="w-4 h-4" /> Word
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentQuestionForm;
