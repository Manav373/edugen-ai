import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-cyan-600/5 to-teal-600/5 animate-gradient-shift bg-[length:200%_200%]"></div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-morph"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-3xl animate-glow-pulse"></div>

            {/* Sign In Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Branding */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        EduGen AI
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Sign in to continue your learning journey
                    </p>
                </div>

                {/* Clerk Sign In Component */}
                <div className="animate-slide-up">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-glass",
                                headerTitle: "text-white font-display",
                                headerSubtitle: "text-gray-400",
                                socialButtonsBlockButton: "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white",
                                socialButtonsBlockButtonText: "text-white font-medium",
                                formButtonPrimary: "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-glow transition-all duration-300",
                                formFieldInput: "bg-slate-700/50 border-slate-600 text-white focus:border-emerald-500 focus:ring-emerald-500",
                                formFieldLabel: "text-gray-300",
                                footerActionLink: "text-emerald-400 hover:text-emerald-300",
                                identityPreviewText: "text-white",
                                identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
                                formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
                                dividerLine: "bg-slate-700",
                                dividerText: "text-gray-400",
                                otpCodeFieldInput: "bg-slate-700/50 border-slate-600 text-white",
                                formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
                                alertText: "text-gray-300",
                            },
                        }}
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        forceRedirectUrl="/chat"
                        fallbackRedirectUrl="/chat"
                    />
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in">
                    <p>
                        Powered by AI • Designed for Students
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
