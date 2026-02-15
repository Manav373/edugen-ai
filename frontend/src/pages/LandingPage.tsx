import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Pricing } from '../components/landing/Pricing';
import { Testimonials } from '../components/landing/Testimonials';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

const LandingPage = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-gray-100 selection:bg-emerald-500/30 font-sans relative">
            <ScrollProgress />
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
