
import { motion } from 'framer-motion';
import { Award, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing = () => {
    const features = [
        "Unlimited assignments generation",
        "Unlimited Q&A sessions",
        "Unlimited lab manuals",
        "24/7 AI tutor access",
        "Export to PDF & Word",
        "No credit card required",
        "No hidden fees",
        "Community support"
    ];

    return (
        <section id="pricing" className="py-28 bg-slate-950 relative">
            <div className="container px-4 mx-auto max-w-6xl relative z-10">
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6"
                    >
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Free Forever</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-white"
                    >
                        Simple,{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Transparent
                        </span>{' '}
                        Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Everything you need to succeed, completely free
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="max-w-lg mx-auto"
                >
                    <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.25)] hover:shadow-[0_0_100px_rgba(16,185,129,0.4)] transition-all duration-700 group">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-teal-500/20 rounded-3xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-500" />

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold mb-6"
                        >
                            <Sparkles className="w-4 h-4" />
                            Most Popular
                        </motion.div>

                        {/* Price */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Free for All</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400">
                                    $0
                                </span>
                                <span className="text-gray-400 text-xl">/forever</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.06, duration: 0.4, ease: "easeOut" }}
                                    className="flex items-center gap-3 text-gray-300"
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {feature}
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link
                            to="/sign-up"
                            className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-center hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-[1.03]"
                        >
                            Get Started Free
                        </Link>

                        <p className="text-center text-gray-400 text-sm mt-4">
                            No credit card required • Start in seconds
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
