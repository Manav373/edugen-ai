import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Check, X, RefreshCw, Loader2, ArrowRight } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

const QuizGenerator = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    const generateQuiz = async () => {
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/tools/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, num_questions: 5 })
            });

            const data = await response.json();
            if (data.questions) {
                setQuiz(data.questions);
                setCurrentQuestion(0);
                setScore(0);
                setShowResult(false);
                setSelectedAnswer(null);
                setIsAnswerChecked(false);
            }
        } catch (error) {
            console.error('Failed to generate quiz:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (option: string) => {
        if (isAnswerChecked) return;
        setSelectedAnswer(option);
        setIsAnswerChecked(true);

        if (option === quiz[currentQuestion].correct_answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setQuiz([]);
        setContent('');
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Brain className="w-8 h-8 text-emerald-400" />
                Quiz Generator
            </h1>

            {!quiz.length ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
                >
                    <label className="block text-gray-300 text-lg font-medium mb-4">
                        Paste your notes or text here:
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="Paste lecture notes, book chapters, or any study material..."
                    />
                    <button
                        onClick={generateQuiz}
                        disabled={isLoading || !content.trim()}
                        className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            'Generate Quiz'
                        )}
                    </button>
                </motion.div>
            ) : showResult ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center"
                >
                    <h2 className="text-4xl font-bold text-white mb-6">Quiz Completed!</h2>
                    <div className="text-6xl font-black gradient-text mb-4">
                        {Math.round((score / quiz.length) * 100)}%
                    </div>
                    <p className="text-xl text-gray-400 mb-8">
                        You got {score} out of {quiz.length} questions correct.
                    </p>
                    <button
                        onClick={resetQuiz}
                        className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Create New Quiz
                    </button>
                </motion.div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 text-gray-400">
                        <span>Question {currentQuestion + 1} of {quiz.length}</span>
                        <span>Score: {score}</span>
                    </div>

                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
                    >
                        <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                            {quiz[currentQuestion].question}
                        </h3>

                        <div className="space-y-4">
                            {quiz[currentQuestion].options.map((option, idx) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = option === quiz[currentQuestion].correct_answer;
                                const showCorrect = isAnswerChecked && isCorrect;
                                const showWrong = isAnswerChecked && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        disabled={isAnswerChecked}
                                        className={`w-full p-4 rounded-xl text-left transition-all border ${showCorrect
                                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                            : showWrong
                                                ? 'bg-red-500/20 border-red-500 text-white'
                                                : isSelected
                                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                                    : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700/50 text-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <Check className="w-5 h-5 text-emerald-400" />}
                                            {showWrong && <X className="w-5 h-5 text-red-400" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswerChecked && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 pt-6 border-t border-gray-700"
                            >
                                <p className="text-gray-300 mb-4">
                                    <span className="font-bold text-emerald-400">Explanation: </span>
                                    {quiz[currentQuestion].explanation}
                                </p>
                                <button
                                    onClick={nextQuestion}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;
