import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RefreshCw, ArrowRight, Trophy } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface QuizGameProps {
    quiz: Question[];
    onReset?: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ quiz, onReset }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);

    if (!quiz.length) return null;

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



    if (showResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-12 text-center w-full max-w-2xl mx-auto"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
                <div className="text-4xl sm:text-6xl font-black gradient-text mb-4">
                    {Math.round((score / quiz.length) * 100)}%
                </div>
                <p className="text-lg sm:text-xl text-gray-400 mb-8">
                    You answered {score} out of {quiz.length} questions correctly.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            setCurrentQuestion(0);
                            setScore(0);
                            setShowResult(false);
                            setSelectedAnswer(null);
                            setIsAnswerChecked(false);
                        }}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry Quiz
                    </button>
                    {onReset && (
                        <button
                            onClick={onReset}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                        >
                            Start New Quiz
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 text-gray-400">
                <span className="text-sm font-medium bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                    Question {currentQuestion + 1} / {quiz.length}
                </span>
                <span className="text-sm font-medium bg-emerald-900/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50">
                    Score: {score}
                </span>
            </div>

            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
                <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                    {quiz[currentQuestion].question}
                </h3>

                <div className="space-y-3">
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
                                className={`w-full p-4 rounded-xl text-left transition-all border group ${showCorrect
                                    ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                    : showWrong
                                        ? 'bg-red-500/20 border-red-500 text-white'
                                        : isSelected
                                            ? 'bg-blue-500/20 border-blue-500 text-white'
                                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-blue-500/50 text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex-1">{option}</span>
                                    {showCorrect && <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />}
                                    {showWrong && <X className="w-5 h-5 text-red-400 flex-shrink-0 ml-2" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {isAnswerChecked && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-gray-700"
                    >
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 mb-6">
                            <p className="text-blue-200 text-sm leading-relaxed">
                                <span className="font-bold text-blue-400 block mb-1">Explanation:</span>
                                {quiz[currentQuestion].explanation}
                            </p>
                        </div>
                        <button
                            onClick={nextQuestion}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                        >
                            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'View Results'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default QuizGame;
