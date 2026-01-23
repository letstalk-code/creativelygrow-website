"use client";

import { useState, useEffect } from "react";

const testimonials = [
    {
        text: "Creatively Grow transformed our online presence. Our leads have increased by 300% since launching our new smart website!",
        name: "John Smith",
        role: "CEO, Tech Solutions",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
        text: "The AI automation saves us hours every week. It's like having a full-time employee working 24/7!",
        name: "Sarah Johnson",
        role: "Owner, Local Business",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
        text: "Best investment we've made for our business. The team at Creatively Grow truly understands what it takes to grow online.",
        name: "Mike Davis",
        role: "Founder, StartUp Inc",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="testimonials">
            <div className="testimonials-container">
                <h2 className="section-title animate-on-scroll">
                    WHAT OUR <span className="highlight">CLIENTS SAY</span>
                </h2>
                <div className="testimonial-slider">
                    {testimonials.map((t, i) => (
                        <div key={i} className={`testimonial-card ${i === activeIndex ? 'active' : ''}`}>
                            <div className="testimonial-content">
                                <p>"{t.text}"</p>
                            </div>
                            <div className="testimonial-author">
                                <img src={t.img} alt={t.name} />
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="testimonial-dots">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${i === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(i)}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
}
