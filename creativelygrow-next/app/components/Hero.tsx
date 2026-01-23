export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg-image"></div>
            <div className="hero-overlay"></div>
            <div className="hero-content fade-in">
                <p className="hero-tagline">
                    A company created to help grow your business creatively
                </p>
                <h1 className="hero-headline">
                    STOP TREATING YOUR WEBSITE LIKE A{" "}
                    <span className="highlight">DIGITAL BUSINESS CARD</span>
                </h1>
                <p className="hero-subtext">
                    Turn it into a sales machine that works 24/7 to capture leads, book
                    appointments, and follow up automatically.
                </p>
                <div className="hero-buttons">
                    <a href="#plans" className="btn btn-primary">
                        VIEW PLANS
                    </a>
                </div>
            </div>
            <div className="scroll-indicator">
                <span>Scroll</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
}
