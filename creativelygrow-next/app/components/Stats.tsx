"use client";

import { useEffect, useRef, useState } from "react";

export default function Stats() {
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const [counts, setCounts] = useState({
        clients: 0,
        projects: 0,
        satisfaction: 0,
        support: 0
    });

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                setAnimated(true);
                animateCounters();
            }
        }, { threshold: 0.5 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [animated]);

    const animateCounters = () => {
        const targets = { clients: 150, projects: 500, satisfaction: 98, support: 24 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setCounts({
                clients: Math.min(Math.floor(progress * targets.clients), targets.clients),
                projects: Math.min(Math.floor(progress * targets.projects), targets.projects),
                satisfaction: Math.min(Math.floor(progress * targets.satisfaction), targets.satisfaction),
                support: Math.min(Math.floor(progress * targets.support), targets.support),
            });

            if (step >= steps) clearInterval(timer);
        }, interval);
    };

    return (
        <section className="stats" ref={sectionRef}>
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-number">{counts.clients}</span>
                    <span className="stat-suffix">+</span>
                    <p className="stat-label">Happy Clients</p>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{counts.projects}</span>
                    <span className="stat-suffix">+</span>
                    <p className="stat-label">Projects Completed</p>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{counts.satisfaction}</span>
                    <span className="stat-suffix">%</span>
                    <p className="stat-label">Client Satisfaction</p>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{counts.support}</span>
                    <span className="stat-suffix">/7</span>
                    <p className="stat-label">Support Available</p>
                </div>
            </div>
        </section>
    );
}
