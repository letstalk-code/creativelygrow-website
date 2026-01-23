export default function AdditionalServices() {
    return (
        <section className="additional-services">
            <div className="additional-container">
                <h2 className="section-title animate-on-scroll">WE ALSO OFFER</h2>
                <div className="additional-grid">
                    <div className="additional-card animate-on-scroll">
                        <div className="additional-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </div>
                        <h3>Social Media Content Creation</h3>
                        <p>Engaging content that grows your audience and drives traffic to your site.</p>
                    </div>
                    <div className="additional-card animate-on-scroll">
                        <div className="additional-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        </div>
                        <h3>Video Shorts</h3>
                        <p>Short-form video content optimized for social platforms.</p>
                    </div>
                    <div className="additional-card animate-on-scroll">
                        <div className="additional-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                        </div>
                        <h3>Brand Strategy</h3>
                        <p>Cohesive branding that tells your story and connects with your audience.</p>
                    </div>
                    <div className="additional-card animate-on-scroll">
                        <div className="additional-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h3>Marketing Automation</h3>
                        <p>Set it and forget it systems that nurture leads while you sleep.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
