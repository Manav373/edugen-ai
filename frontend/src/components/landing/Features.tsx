
import { motion } from 'framer-motion';
import { PenTool, BrainCircuit, Microscope, Bot, Download, Zap, Users, Sparkles } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '../ui/BentoGrid';

export const Features = () => {
    const features = [
        {
            title: "Smart Assignments",
            description: "Generate comprehensive assignments with researched content. AI checks for plagiarism and ensures academic accuracy automatically.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <PenTool className="w-8 h-8 text-emerald-400" />,
            className: "md:col-span-2",
        },
        {
            title: "Interactive Q&A",
            description: "Practice with dynamic questions that adapt to your knowledge level.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
            className: "md:col-span-1",
        },
        {
            title: "Lab Manuals",
            description: "Create detailed lab guides with step-by-step procedures, diagrams, and safety protocols tailored to your curriculum.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <Microscope className="w-8 h-8 text-teal-400" />,
            className: "md:col-span-1",
        },
        {
            title: "24/7 AI Tutor",
            description: "Get personalized explanations anytime. Your AI tutor understands context and adapts to your learning style.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <Bot className="w-8 h-8 text-indigo-400" />,
            className: "md:col-span-2",
        },
        {
            title: "Export Anywhere",
            description: "Download your content as PDF or Word documents. Perfectly formatted.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <Download className="w-8 h-8 text-orange-400" />,
            className: "md:col-span-1",
        },
        {
            title: "Lightning Fast",
            description: "Generate comprehensive content in seconds. Powered by advanced AI.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            className: "md:col-span-1",
        },
        {
            title: "Community Driven",
            description: "Join thousands of students and educators sharing resources.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
            icon: <Users className="w-8 h-8 text-pink-400" />,
            className: "md:col-span-1",
        }
    ];

    return (
        <section id="features" className="py-28 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients for Features */}
            <div className="absolute left-0 top-0 h-full w-full opacity-20 pointer-events-none">
                <div className="absolute left-[-20%] top-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
                <div className="absolute right-[-20%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
            </div>

            <div className="container px-4 mx-auto max-w-7xl relative z-10">
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Powerful Features</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-white"
                    >
                        Everything You{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Need
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        A complete suite of AI-powered tools designed to handle every aspect of your academic workload.
                    </motion.p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto">
                    {features.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};
