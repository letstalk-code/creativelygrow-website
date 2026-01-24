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
                            <li>Professional website design using proven templates</li>
                            <li>Mobile-optimized and fast-loading</li>
                            <li>Business-class hosting included</li>
                            <li>AI-powered chatbot for 24/7 customer engagement</li>
                            <li>Basic contact forms</li>
                            <li>Google My Business integration</li>
                            <li>SSL security certificate</li>
                            <li>Basic on-page SEO setup</li>
                            <li>2 rounds of revisions included</li>
                            <li>Monthly basic maintenance & updates</li>
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
                                <strong>Everything in Starter Plan, PLUS:</strong>
                            </li>
                            <li>Smart lead capture forms with automation</li>
                            <li>Online appointment booking system</li>
                            <li>Automated email & SMS follow-up sequences</li>
                            <li>AI voice assistant</li>
                            <li>Google review automation</li>
                            <li>Advanced SEO optimization</li>
                            <li>Social media integration</li>
                            <li>Monthly analytics reporting</li>
                            <li>Priority support</li>
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
                        <p className="plan-tagline">Complete AI-powered business automation</p>
                        <ul className="plan-features">
                            <li>
                                <strong>Everything in Professional Plan, PLUS:</strong>
                            </li>
                            <li>Unlimited AI voice assistants</li>
                            <li>Advanced conversation AI across all channels</li>
                            <li>Custom automation workflows</li>
                            <li>Payment processing integration</li>
                            <li>Advanced analytics dashboard</li>
                            <li>Unlimited additional pages</li>
                            <li>Custom integrations</li>
                            <li>White-glove onboarding</li>
                            <li>24/7 priority support</li>
                        </ul>
                        <p className="plan-note">Turn your website into a complete sales machine</p>
                        <a href="#contact" className="btn btn-secondary btn-full">
                            GET STARTED
                        </a>
                    </div>
                </div>

                <div className="plans-footer animate-on-scroll">
                    <h4>ALL PLANS INCLUDE:</h4>
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
                            <span>Mobile app access to manage everything</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
