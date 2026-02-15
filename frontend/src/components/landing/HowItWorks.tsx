
import { Rocket, FileText, Sparkles, Download } from 'lucide-react';
import { TracingBeam } from '../ui/TracingBeam';
import { cn } from '../../utils/cn.ts';

export const HowItWorks = () => {
    const steps = [
        {
            title: "Choose Your Tool",
            description: "Select from assignments, Q&A, or lab manuals based on your needs.",
            badge: "Step 01",
            image: <Rocket className="w-12 h-12 text-emerald-400 mb-4" />
        },
        {
            title: "Input Requirements",
            description: "Provide your topic, subject, and any specific requirements or guidelines. The more detail, the better.",
            badge: "Step 02",
            image: <FileText className="w-12 h-12 text-cyan-400 mb-4" />
        },
        {
            title: "AI Generates Content",
            description: "Our advanced AI models process your request and create comprehensive, accurate content in seconds.",
            badge: "Step 03",
            image: <Sparkles className="w-12 h-12 text-teal-400 mb-4" />
        },
        {
            title: "Export & Use",
            description: "Download as PDF or Word, edit if needed, and submit your work with confidence.",
            badge: "Step 04",
            image: <Download className="w-12 h-12 text-blue-400 mb-4" />
        }
    ];

    return (
        <section id="how-it-works" className="py-28 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-50" />
            <div className="container px-4 mx-auto relative z-10">
                <div className="mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                        How It{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                            Works
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Get started in minutes with our simple, intuitive workflow.
                    </p>
                </div>

                <TracingBeam className="px-6">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                        {steps.map((item, index) => (
                            <div key={`content-${index}`} className="mb-10 relative">
                                <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4 border border-white/10">
                                    {item.badge}
                                </h2>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
                                    {item.image}
                                    <p className={cn("text-xl mb-4 font-bold text-white")}>
                                        {item.title}
                                    </p>
                                    <div className="text-sm prose prose-sm dark:prose-invert text-neutral-400">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </div>
        </section>
    );
};
