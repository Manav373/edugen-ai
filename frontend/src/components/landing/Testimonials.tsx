
import { motion } from 'framer-motion';
import { InfiniteMovingCards } from '../ui/InfiniteMovingCards';

export const Testimonials = () => {
    const testimonials = [
        { name: "Alex R.", role: "Computer Science Student", quote: "EduGen saved my finals. The practice questions were spot on." },
        { name: "Sarah K.", role: "Biology Major", quote: "The lab manual generator is a game changer for my reports." },
        { name: "Mike T.", role: "High School Teacher", quote: "I use this to create supplementary materials for my classes. Amazing tool." },
        { name: "Emily W.", role: "Engineering Student", quote: "Fast, accurate, and easy to use. Highly recommended." },
    ];

    return (
        <section className="py-28 bg-slate-950 border-t border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="container px-4 mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Loved by{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Students & Teachers
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Join thousands of users who are transforming their learning experience.
                    </p>
                </motion.div>
            </div>

            <div className="flex flex-col antialiased bg-slate-950 dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>
        </section>
    );
};
