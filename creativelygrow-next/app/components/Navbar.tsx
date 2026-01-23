"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-container">
                <Link href="/" className="logo">
                    <img src="/assets/logo.png" alt="Creatively Grow" />
                </Link>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
                    <Link href="#services">Services</Link>
                    <Link href="#plans">Plans</Link>
                    <Link href="#contact" className="nav-cta">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
