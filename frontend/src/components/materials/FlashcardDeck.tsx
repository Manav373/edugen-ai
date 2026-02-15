import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Flashcard {
    front: string;
    back: string;
}

interface FlashcardDeckProps {
    flashcards: Flashcard[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!flashcards.length) return null;

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center w-full mb-4 text-gray-400">
                <span className="text-sm font-medium">Card {currentIndex + 1} of {flashcards.length}</span>
            </div>

            <div
                className="relative w-full h-80 sm:h-96 perspective-1000 group cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full relative preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                        <span className="text-xs font-semibold text-blue-300 mb-4 uppercase tracking-widest bg-blue-900/30 px-3 py-1 rounded-full">Question / Term</span>
                        <h3 className="text-2xl font-bold text-white leading-relaxed">{flashcards[currentIndex].front}</h3>
                        <div className="absolute bottom-6 text-sm text-gray-400 flex items-center gap-2">
                            <RotateCw className="w-4 h-4" /> Click to flip
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-xs font-semibold text-emerald-400 mb-4 uppercase tracking-widest bg-emerald-900/30 px-3 py-1 rounded-full">Answer / Definition</span>
                        <p className="text-xl text-gray-200 leading-relaxed font-medium">{flashcards[currentIndex].back}</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-6 mt-8">
                <button
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                    />
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FlashcardDeck;
