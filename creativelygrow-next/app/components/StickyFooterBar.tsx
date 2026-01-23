"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function StickyFooterBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 500px
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <div className="sticky-footer-bar">
            <button
                className="scroll-to-top-btn"
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <ChevronUp size={20} />
            </button>
            <div className="sticky-footer-content">
                <p>
                    <strong>FREE Smart Website Design</strong> — No Hidden Fees, No Obligations
                </p>
                <a href="#contact" className="btn btn-primary">
                    Claim Your Free Design
                </a>
            </div>
        </div>
    );
}
