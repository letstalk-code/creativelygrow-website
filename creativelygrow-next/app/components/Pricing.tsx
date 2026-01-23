export default function Pricing() {
    return (
        <section className="plans" id="plans">
            <div className="plans-container">
                <div className="plans-header">
                    <p className="section-label animate-on-scroll">
                        SMART WEBSITE SOLUTIONS
                    </p>
                    <h2 className="section-title animate-on-scroll">
                        CHOOSE YOUR <span className="highlight">PLAN</span>
                    </h2>
                </div>

                <div className="plans-grid">
                    {/* Starter Plan */}
                    <div className="plan-card animate-on-scroll">
                        <div className="plan-badge">Starter</div>
                        <h3 className="plan-name">STARTER PLAN</h3>
                        <p className="plan-tagline">Perfect for getting started online</p>
                        <ul className="plan-features">
                            <li>
                                <strong>Web Design & Hosting</strong>
                            </li>
                            <li>Mobile-optimized</li>
                            <li>AI Chatbot (Basic)</li>
                            <li>Basic Contact Forms</li>
                            <li>Google My Business</li>
                            <li>SSL Security</li>
                            <li>Basic SEO</li>
                            <li>2 Revision Rounds</li>
                        </ul>
                        <a href="#contact" className="btn btn-secondary btn-full">
                            GET STARTED
                        </a>
                    </div>

                    {/* Professional Plan */}
                    <div className="plan-card featured animate-on-scroll">
                        <div className="plan-badge popular">Most Popular</div>
                        <h3 className="plan-name">PROFESSIONAL PLAN</h3>
                        <p className="plan-tagline">Complete online presence</p>
                        <ul className="plan-features">
                            <li>
                                <strong>Everything in Starter, PLUS:</strong>
                            </li>
                            <li>Smart Lead Capture</li>
                            <li>Online Booking System</li>
                            <li>Auto Email/SMS Follow-up</li>
                            <li>AI Voice Assistant</li>
                            <li>Review Automation</li>
                            <li>Advanced SEO</li>
                            <li>Social Media Integration</li>
                            <li>Analytics Reporting</li>
                        </ul>
                        <p className="plan-note">Best value for growing businesses</p>
                        <a href="#contact" className="btn btn-primary btn-full">
                            GET STARTED
                        </a>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="plan-card animate-on-scroll">
                        <div className="plan-badge enterprise">Enterprise</div>
                        <h3 className="plan-name">ENTERPRISE PLAN</h3>
                        <p className="plan-tagline">Complete AI business automation</p>
                        <ul className="plan-features">
                            <li>
                                <strong>Everything in Professional, PLUS:</strong>
                            </li>
                            <li>Unlimited AI Agents</li>
                            <li>Custom Workflows</li>
                            <li>Payment Integration</li>
                            <li>Advanced Analytics</li>
                            <li>Unlimited Pages</li>
                            <li>Custom API Integrations</li>
                            <li>White-glove Onboarding</li>
                            <li>24/7 Priority Support</li>
                        </ul>
                        <p className="plan-note">Turn your website into a sales machine</p>
                        <a href="#contact" className="btn btn-secondary btn-full">
                            GET STARTED
                        </a>
                    </div>
                </div>

                <div className="plans-footer animate-on-scroll">
                    <h4>All plans include:</h4>
                    <div className="plans-benefits">
                        <div className="benefit-item">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="benefit-item">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>Free migration from existing website</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
