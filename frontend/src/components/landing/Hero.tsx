import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Users, FileText, Star, ArrowDown } from 'lucide-react';
import { Spotlight } from '../ui/Spotlight';
import { Meteors } from '../ui/Meteors';
import { AuthButton } from '../ui/AuthButton';

export const Hero = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

    const words = "Master Any Subject".split(" ");

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center pt-32 md:pt-0">
            {/* Background Effects */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <div className="absolute inset-0 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]" />
            </div>

            <div className="absolute h-full w-full top-0 left-0 z-[0]">
                <Meteors number={30} />
            </div>

            {/* Content */}
            <div ref={heroRef} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 overflow-hidden max-w-7xl mx-auto">
                <motion.div
                    style={{ y, opacity, scale }}
                    className="will-change-transform flex flex-col items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-200">The Ultimate AI Study Companion</span>
                    </motion.div>

                    <div className="max-w-5xl mx-auto mb-8">
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight"
                        >
                            {words.map((word, i) => (
                                <span key={i} className="inline-block mr-4">
                                    {word.split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            className="inline-block"
                                            variants={{
                                                hidden: { opacity: 0, y: 50 },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        delay: i * 0.2 + index * 0.05,
                                                        duration: 0.8,
                                                        ease: [0.2, 0.65, 0.3, 0.9]
                                                    }
                                                }
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 animate-gradient-shift background-size-200">
                                In Seconds
                            </span>
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
                    >
                        Generate comprehensive assignments, quizzes, and lab manuals tailored to your curriculum.
                        Elevate your learning experience with AI-powered precision.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
                    >
                        <AuthButton
                            text="Get Started Free"
                            link="/sign-up"
                            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="auth-text-swap">Get Started Free</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </AuthButton>

                        <motion.a
                            href="#features"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full font-semibold text-white border border-emerald-500/30 hover:bg-emerald-500/10 transition-all backdrop-blur-sm flex items-center gap-2"
                        >
                            Explore Features <ArrowDown className="w-4 h-4 animate-bounce" />
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-24"
                >
                    {[
                        { label: "Students", value: "10K+", icon: Users },
                        { label: "Documents", value: "50K+", icon: FileText },
                        { label: "Avg Rating", value: "4.9", icon: Star },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + i * 0.15 }}
                            className="text-center group"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center justify-center gap-2 mb-1 group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-5 h-5 text-emerald-400 shadow-glow" />
                                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                            </div>
                            <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
