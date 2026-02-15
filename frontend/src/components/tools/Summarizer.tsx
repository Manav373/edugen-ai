import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Summarizer = () => {
    const [content, setContent] = useState('');
    const [mode, setMode] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/tools/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, mode })
            });

            const data = await response.json();
            if (data.summary) {
                setSummary(data.summary);
            }
        } catch (error) {
            console.error('Failed to summarize:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-400" />
                Smart Summarizer
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-[calc(100vh-200px)]"
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex-1 flex flex-col">
                        <label className="block text-gray-300 text-lg font-medium mb-4">
                            Source Text
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="Paste your document content here..."
                        />

                        <div className="mt-6 space-y-4">
                            <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                                {['standard', 'eli5', 'exam_prep'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === m
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {m === 'standard' ? 'Standard' : m === 'eli5' ? 'Explain Like I\'m 5' : 'Exam Prep'}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleSummarize}
                                disabled={isLoading || !content.trim()}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Summarizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Summarize
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-[calc(100vh-200px)]"
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-gray-300 text-lg font-medium">
                                AI Summary
                            </label>
                            {summary && (
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 w-full bg-gray-900/30 rounded-xl p-6 overflow-y-auto prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-purple-400">
                            {summary ? (
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 italic">
                                    Summary will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Summarizer;
