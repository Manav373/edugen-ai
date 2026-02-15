import React from 'react';
import { motion } from 'framer-motion';
import { AuthButton } from '../ui/AuthButton';
import { ChevronRight } from 'lucide-react';

export const CTA = () => {
    return (
        <section className="py-32 relative overflow-hidden">

            <div className="absolute inset-0 bg-emerald-600/5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-3xl mx-auto text-white">
                        Ready to{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 animate-gradient-shift background-size-200">
                            Revolutionize
                        </span>{' '}
                        Your Studies?
                    </h2>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                >
                    Join thousands of students and teachers who are already experiencing the future of education.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                    <AuthButton
                        text="Get Started Now"
                        link="/sign-up"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105"
                    >
                        <span>Get Started Now</span>
                        <ChevronRight className="w-5 h-5" />
                    </AuthButton>
                </motion.div>
            </div>
        </section>
    );
};
