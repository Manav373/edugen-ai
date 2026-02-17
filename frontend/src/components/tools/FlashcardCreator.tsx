import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, RotateCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Flashcard {
    front: string;
    back: string;
}

const FlashcardCreator = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const generateFlashcards = async () => {
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/tools/generate-flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, num_cards: 10 })
            });

            const data = await response.json();
            if (data.flashcards) {
                setFlashcards(data.flashcards);
                setCurrentIndex(0);
                setIsFlipped(false);
            }
        } catch (error) {
            console.error('Failed to generate flashcards:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Layers className="w-8 h-8 text-blue-400" />
                Flashcard Creator
            </h1>

            {!flashcards.length ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
                >
                    <label className="block text-gray-300 text-lg font-medium mb-4">
                        Paste your text here:
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Paste definitions, theories, or key concepts..."
                    />
                    <button
                        onClick={generateFlashcards}
                        disabled={isLoading || !content.trim()}
                        className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Creating Decks...
                            </>
                        ) : (
                            'Generate Flashcards'
                        )}
                    </button>
                </motion.div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 text-gray-400">
                        <span>Card {currentIndex + 1} of {flashcards.length}</span>
                        <button
                            onClick={() => setFlashcards([])}
                            className="text-sm hover:text-white transition-colors"
                        >
                            Create New Deck
                        </button>
                    </div>

                    <div className="relative h-96 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                        <motion.div
                            initial={false}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative preserve-3d"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                                <span className="text-sm font-medium text-blue-300 mb-4 uppercase tracking-widest">Front</span>
                                <h3 className="text-2xl font-bold text-white">{flashcards[currentIndex].front}</h3>
                                <div className="absolute bottom-6 text-sm text-gray-400 flex items-center gap-2">
                                    <RotateCw className="w-4 h-4" /> Click to flip
                                </div>
                            </div>

                            {/* Back */}
                            <div
                                className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl"
                                style={{ transform: 'rotateY(180deg)' }}
                            >
                                <span className="text-sm font-medium text-emerald-400 mb-4 uppercase tracking-widest">Back</span>
                                <p className="text-xl text-gray-200 leading-relaxed">{flashcards[currentIndex].back}</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center items-center gap-8 mt-12">
                        <button
                            onClick={prevCard}
                            disabled={currentIndex === 0}
                            className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={nextCard}
                            disabled={currentIndex === flashcards.length - 1}
                            className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardCreator;
