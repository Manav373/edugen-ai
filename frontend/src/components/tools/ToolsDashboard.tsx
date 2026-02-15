import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Layers, ArrowRight } from 'lucide-react';

const tools = [
    {
        id: 'quiz-generator',
        title: 'Quiz Generator',
        description: 'Turn your notes into interactive quizzes instantly. Test your knowledge and master any subject.',
        icon: Brain,
        color: 'from-emerald-500 to-teal-500',
        link: '/tools/quiz'
    },
    {
        id: 'flashcards',
        title: 'Flashcard Creator',
        description: 'Create study flashcards from any text. Perfect for memorizing terms, dates, and definitions.',
        icon: Layers,
        color: 'from-blue-500 to-indigo-500',
        link: '/tools/flashcards'
    },
    {
        id: 'summarizer',
        title: 'Smart Summarizer',
        description: 'Get concise summaries of long documents. Choose from "Explain Like I\'m 5" or "Exam Prep" modes.',
        icon: BookOpen,
        color: 'from-purple-500 to-pink-500',
        link: '/tools/summarizer'
    }
];

const ToolsDashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-bold text-white mb-4">Student Toolkit</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    AI-powered tools designed to solve real student problems.
                    Save time and study smarter, not harder.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={tool.link} className="block group">
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full hover:bg-gray-800 transition-colors relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <tool.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
                                    {tool.title}
                                </h3>

                                <p className="text-gray-400 mb-6 line-clamp-3">
                                    {tool.description}
                                </p>

                                <div className="flex items-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                    Try Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ToolsDashboard;
