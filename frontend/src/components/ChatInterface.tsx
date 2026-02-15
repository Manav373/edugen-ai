import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Paperclip, PanelLeftOpen, X } from 'lucide-react';
import { chatService } from '../services/api';
import MessageBubble from './MessageBubble';
import ChatHistory from './ChatHistory';
import { useChatContext } from '../contexts/ChatContext';

const ChatInterface: React.FC = () => {
    const { messages, addMessage } = useChatContext();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<{ name: string; type: string; data: string }[]>([]);
    const [processingFiles, setProcessingFiles] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(window.innerWidth >= 1024);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsHistoryOpen(false);
            } else {
                setIsHistoryOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setProcessingFiles(true);
        const newFiles: { name: string; type: string; data: string }[] = [];

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
        } finally {
            setProcessingFiles(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (!input.trim() && files.length === 0) return;

        // Create message content (text + mention of files if any)
        let messageContent = input;
        if (files.length > 0) {
            messageContent += `\n\n[Attached ${files.length} file(s): ${files.map(f => f.name).join(', ')}]`;
        }

        const userMessage = { role: 'user' as const, content: messageContent };
        addMessage(userMessage);

        // Prepare payload data
        const filesData = files.map(f => f.data);
        const fileTypes = files.map(f => f.type);

        // Clear input immediately
        setInput('');
        setFiles([]);
        setIsLoading(true);

        try {
            const response = await chatService.sendMessage(
                [...messages, userMessage],
                filesData.length > 0 ? filesData : undefined,
                fileTypes.length > 0 ? fileTypes : undefined
            );
            const botMessage = { role: 'assistant' as const, content: response.response };
            addMessage(botMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            addMessage({ role: 'assistant', content: "Sorry, I encountered an error. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const hasOnlyWelcomeMessage = messages.length === 1 && messages[0].role === 'assistant';

    return (
        <div className="flex h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
            {/* Chat History Sidebar - Collapsible */}
            <div className={`
                absolute lg:relative z-30 h-full transition-all duration-300 ease-in-out
                ${isHistoryOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 overflow-hidden'}
            `}>
                <ChatHistory />
            </div>

            {/* Mobile Overlay for History */}
            {isHistoryOpen && (
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsHistoryOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-gradient bg-[length:200%_200%]"></div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 relative z-10 scrollbar-thin">

                    {/* History Toggle Button (Mobile & Desktop when closed) */}
                    <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className={`
                            absolute top-4 left-4 z-40 p-2 rounded-lg bg-gray-800/80 backdrop-blur text-gray-400 hover:text-white border border-gray-700 transition-all
                            ${isHistoryOpen ? 'lg:hidden' : 'flex'}
                        `}
                    >
                        {isHistoryOpen ? <X className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                    </button>
                    {hasOnlyWelcomeMessage ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-6 animate-fade-in px-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4 sm:p-6 rounded-3xl shadow-2xl">
                                    <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                                </div>
                            </div>

                            <div className="text-center space-y-2 sm:space-y-3 max-w-2xl">
                                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    Welcome to EduGen AI
                                </h2>
                                <p className="text-gray-400 text-base sm:text-lg">
                                    Your intelligent academic assistant powered by AI
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl w-full mt-4 sm:mt-8">
                                {[
                                    { icon: '📝', title: 'Generate Assignments', desc: 'Create custom assignments and exercises', color: 'from-blue-500/10 to-cyan-500/10' },
                                    { icon: '🔬', title: 'Lab Manuals', desc: 'Design comprehensive lab experiments', color: 'from-purple-500/10 to-pink-500/10' },
                                    { icon: '💡', title: 'Study Materials', desc: 'Get explanations and study guides', color: 'from-amber-500/10 to-orange-500/10' },
                                    { icon: '❓', title: 'Ask Questions', desc: 'Get instant answers to your queries', color: 'from-green-500/10 to-emerald-500/10' }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`group p-5 bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer animate-fade-in`}
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                        onClick={() => setInput(item.title)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Messages
                        <>
                            {messages.map((msg, index) => (
                                <MessageBubble key={index} role={msg.role} content={msg.content} />
                            ))}

                            {isLoading && (
                                <div className="flex justify-start animate-slide-up">
                                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-lg border border-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            <span className="text-sm text-gray-400">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 md:p-6 bg-gray-900/50 backdrop-blur-xl border-t border-gray-700/50 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            {/* Gradient Border Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>

                            <div className="relative flex gap-2 sm:gap-3 bg-gray-800 rounded-2xl p-1.5 sm:p-2 border border-gray-700">
                                {/* File Upload Button */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={processingFiles}
                                    className={`p-2 sm:p-3 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${processingFiles
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'hover:bg-gray-700 text-gray-400 hover:text-blue-400'
                                        }`}
                                    title="Attach files (PDF/Images)"
                                >
                                    {processingFiles ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Paperclip className="w-5 h-5" />
                                    )}
                                </button>

                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    placeholder="Ask me anything about your studies..."
                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm sm:text-[15px]"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Attached Files Preview */}
                            {files.length > 0 && (
                                <div className="absolute bottom-full left-0 mb-2 w-full px-2 flex flex-wrap gap-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/90 backdrop-blur rounded-lg border border-gray-700 text-xs text-gray-300 shadow-lg animate-in slide-in-from-bottom-2 fade-in">
                                            <span className="truncate max-w-[120px] font-medium">{file.name}</span>
                                            <button
                                                onClick={() => removeFile(i)}
                                                className="hover:text-red-400 ml-1 p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="absolute right-2 top-1.5 sm:top-2">
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || (!input.trim() && files.length === 0)}
                                    className="
                                    p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600
                                    text-white rounded-xl font-medium
                                    hover:shadow-glow hover:scale-105
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                    transition-all duration-300
                                    flex items-center gap-2
                                    min-h-[36px]
                                "
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="hidden sm:inline">Send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Helper Text */}
                        <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center hidden sm:block">
                            Press <kbd className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-400">Enter</kbd> to send
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
