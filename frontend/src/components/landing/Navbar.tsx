import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Menu, X, LayoutDashboard } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { cn } from '../../utils/cn.ts';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_your_key_here';

const AuthButtons = ({ mobile, setIsMobileMenuOpen }: { mobile?: boolean; setIsMobileMenuOpen?: (val: boolean) => void }) => {
    const { isSignedIn } = useUser();

    if (mobile) {
        return (
            <div className="flex flex-col gap-4 mt-2">
                {isSignedIn ? (
                    <Link
                        to="/chat"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-center flex items-center justify-center gap-2"
                        onClick={() => setIsMobileMenuOpen?.(false)}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/sign-in"
                            className="text-center py-2 text-gray-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen?.(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/sign-up"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-center"
                            onClick={() => setIsMobileMenuOpen?.(false)}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
                <Link
                    to="/chat"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        to="/sign-in"
                        className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/sign-up"
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
                    >
                        Get Started
                    </Link>
                </>
            )}
        </div>
    );
};

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className={cn(
                "fixed top-6 inset-x-0 mx-auto z-50 w-[95%] max-w-5xl rounded-full border transition-all duration-500 backdrop-blur-md",
                scrolled
                    ? "bg-slate-900/80 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] py-3 px-6"
                    : "bg-transparent border-transparent py-3 px-6"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-1.5 bg-gradient-to-tr from-emerald-600 to-cyan-500 rounded-lg"
                    >
                        <Bot className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="font-bold text-lg tracking-tight text-white">EduGen AI</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'How it Works', 'Pricing'].map((item) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors relative group"
                            whileHover={{ y: -2 }}
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
                        </motion.a>
                    ))}
                </div>

                {hasValidClerkKey ? (
                    <AuthButtons />
                ) : (
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/sign-in"
                            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/sign-up"
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                )}


                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full left-0 right-0 mt-4 p-6 bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col gap-4 md:hidden"
                >
                    {['Features', 'How it Works', 'Pricing'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-base font-medium text-gray-300 hover:text-emerald-400 py-2 border-b border-white/5"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}

                    {hasValidClerkKey ? (
                        <AuthButtons mobile setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    ) : (
                        <div className="flex flex-col gap-4 mt-2">
                            <Link
                                to="/sign-in"
                                className="text-center py-2 text-gray-300 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
};
