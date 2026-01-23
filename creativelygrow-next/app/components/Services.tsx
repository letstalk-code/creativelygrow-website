export default function Services() {
    return (
        <section className="services" id="services">
            <div className="services-container">
                <div className="services-header">
                    <p className="section-label animate-on-scroll">WHAT WE OFFER</p>
                    <h2 className="section-title animate-on-scroll">
                        A SMART WEBSITE HAS <span className="highlight">FOUR KEY COMPONENTS</span>
                    </h2>
                </div>

                <div className="services-grid">
                    {/* Service 1 */}
                    <div className="service-card animate-on-scroll" data-number="01">
                        <div className="service-image">
                            <img
                                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop"
                                alt="Professional website design"
                            />
                        </div>
                        <div className="service-content">
                            <div className="service-number">01</div>
                            <h3 className="service-title">BEAUTIFUL DESIGN</h3>
                            <p className="service-description">
                                Stand out from your competitors with stunning, modern design that
                                captures attention and builds trust instantly.
                            </p>
                            <a href="#contact" className="service-link">
                                Learn more <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Service 2 */}
                    <div className="service-card animate-on-scroll" data-number="02">
                        <div className="service-image">
                            <img
                                src="https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&h=400&fit=crop"
                                alt="SEO analytics"
                            />
                        </div>
                        <div className="service-content">
                            <div className="service-number">02</div>
                            <h3 className="service-title">SEO OPTIMIZATION</h3>
                            <p className="service-description">
                                Actually rank on Google above your competition. We build websites
                                that search engines love.
                            </p>
                            <a href="#contact" className="service-link">
                                Learn more <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Service 3 */}
                    <div className="service-card animate-on-scroll" data-number="03">
                        <div className="service-image">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
                                alt="Lead capture"
                            />
                        </div>
                        <div className="service-content">
                            <div className="service-number">03</div>
                            <h3 className="service-title">LEAD CAPTURE SYSTEMS</h3>
                            <p className="service-description">
                                Forms, chat widgets, booking calendars - multiple ways for
                                visitors to become leads.
                            </p>
                            <a href="#contact" className="service-link">
                                Learn more <span>&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Service 4 */}
                    <div className="service-card animate-on-scroll" data-number="04">
                        <div className="service-image">
                            <img
                                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop"
                                alt="AI chatbot"
                            />
                        </div>
                        <div className="service-content">
                            <div className="service-number">04</div>
                            <h3 className="service-title">AI & AUTOMATION</h3>
                            <p className="service-description">
                                Works 24/7 to capture leads, book appointments, and follow up
                                automatically. Never miss an opportunity.
                            </p>
                            <a href="#contact" className="service-link">
                                Learn more <span>&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
