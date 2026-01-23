import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FreeOffer from './components/FreeOffer';
import Services from './components/Services';
import AnalyzerSection from './components/AnalyzerSection';
import ExperienceAI from './components/ExperienceAI';
import Stats from './components/Stats';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <FreeOffer />
            <Services />

            {/* AI Analyzer Section */}
            <AnalyzerSection />

            <ExperienceAI />
            <Stats />
            <Pricing />
            <Testimonials />
            <Contact />
            <Footer />
        </main>
    );
}
