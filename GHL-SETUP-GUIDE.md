# Creatively Grow - GHL Setup Guide

## Step 1: Upload Assets to GHL Media Library

Upload these files from the `assets` folder:
- `logo.png` (main logo)
- `favicon.png` (browser icon)
- `new_back.gif`
- `new_back_1.gif`
- `new_back_2.gif`
- `new_back_3.gif`

After uploading, copy the GHL URLs for each file. You'll replace the URLs in the code below.

---

## Step 2: Add Global CSS

Go to **Settings > Custom Code > Head Tracking Code** (or site-wide CSS)

Paste this CSS:

```css
<style>
/* =========================================
   CREATIVELY GROW - GLOBAL STYLES
   ========================================= */
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
    --sage: #4e5a4e;
    --sage-dark: #3d473d;
    --cream: #f9f8eb;
    --orange: #ef7938;
    --orange-hover: #d96a2d;
    --black: #1a1a1a;
    --white: #ffffff;
    --gray: #666666;
    --font-heading: 'Oswald', sans-serif;
    --font-body: 'Inter', sans-serif;
    --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
    --shadow-xl: 0 16px 48px rgba(0,0,0,0.25);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.7;
    color: var(--black);
}

h1, h2, h3 {
    font-family: var(--font-heading);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.1;
}

.highlight {
    color: var(--orange);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    transition: var(--transition);
}

.btn-primary {
    background-color: var(--orange);
    color: var(--white);
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    background-color: var(--orange-hover);
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: var(--sage);
    color: var(--white);
}

.btn-secondary:hover {
    background-color: var(--sage-dark);
}

.btn-full {
    width: 100%;
}

.section-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--orange);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 1rem;
}

.section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--sage);
}
</style>
```

---

## Step 3: Add Each Section

### SECTION 1: Hero

```html
<style>
.cg-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem 4rem;
    position: relative;
    overflow: hidden;
    background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80');
    background-size: cover;
    background-position: center;
}

.cg-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(78, 90, 78, 0.95) 0%, rgba(61, 71, 61, 0.9) 100%);
}

.cg-hero-content {
    max-width: 900px;
    text-align: center;
    position: relative;
    z-index: 2;
}

.cg-hero-tagline {
    font-size: 1rem;
    font-weight: 500;
    color: var(--orange);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 1.5rem;
}

.cg-hero-headline {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    color: var(--cream);
    margin-bottom: 1.5rem;
    text-shadow: 2px 4px 8px rgba(0,0,0,0.3);
}

.cg-hero-subtext {
    font-size: 1.25rem;
    color: var(--cream);
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 2.5rem;
}

.cg-hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-outline {
    background-color: transparent;
    color: var(--cream);
    border: 2px solid var(--cream);
}

.btn-outline:hover {
    background-color: var(--cream);
    color: var(--sage);
}

@media (max-width: 768px) {
    .cg-hero { padding: 4rem 1.5rem 3rem; }
    .cg-hero-headline { font-size: 2rem; }
    .cg-hero-buttons { flex-direction: column; }
}
</style>

<section class="cg-hero">
    <div class="cg-hero-content">
        <p class="cg-hero-tagline">A company created to help grow your business creatively</p>
        <h1 class="cg-hero-headline">
            STOP TREATING YOUR WEBSITE LIKE A <span class="highlight">DIGITAL BUSINESS CARD</span>
        </h1>
        <p class="cg-hero-subtext">
            Turn it into a sales machine that works 24/7 to capture leads, book appointments, and follow up automatically.
        </p>
        <div class="cg-hero-buttons">
            <a href="#plans" class="btn btn-primary">VIEW PLANS</a>
            <a href="#services" class="btn btn-outline">LEARN MORE</a>
        </div>
    </div>
</section>
```

---

### SECTION 2: Free Offer Banner

```html
<style>
.cg-free-offer {
    background: linear-gradient(135deg, var(--orange) 0%, #d96a2d 100%);
    padding: 4rem 2rem;
    text-align: center;
}

.cg-free-offer-container {
    max-width: 800px;
    margin: 0 auto;
}

.cg-free-offer h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--white);
    margin-bottom: 1rem;
}

.cg-free-offer h2 .highlight {
    color: var(--cream);
    text-decoration: underline;
    text-decoration-thickness: 3px;
}

.cg-free-offer p {
    color: var(--white);
    font-size: 1.125rem;
    opacity: 0.95;
    margin-bottom: 2rem;
    line-height: 1.8;
}

.cg-free-offer .btn-primary {
    background-color: var(--white);
    color: var(--orange);
    font-size: 1.1rem;
    padding: 1.25rem 2.5rem;
}

.cg-free-offer .btn-primary:hover {
    background-color: var(--cream);
}

@media (max-width: 768px) {
    .cg-free-offer { padding: 3rem 1.5rem; }
    .cg-free-offer h2 { font-size: 1.75rem; }
}
</style>

<section class="cg-free-offer">
    <div class="cg-free-offer-container">
        <h2>Get Your Smart Website Designed <span class="highlight">100% FREE</span></h2>
        <p>That's right — receive a custom Smart Website design for your business at absolutely no charge. No hidden fees. No obligations. Just a beautifully designed website ready to grow your business.</p>
        <a href="#contact" class="btn btn-primary">Claim Your Free Design</a>
    </div>
</section>
```

---

### SECTION 3: Four Key Components (Services)

```html
<style>
.cg-services {
    background-color: var(--cream);
    padding: 6rem 2rem;
}

.cg-services-container {
    max-width: 1200px;
    margin: 0 auto;
}

.cg-services-header {
    text-align: center;
    margin-bottom: 4rem;
}

.cg-services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
}

.cg-service-card {
    background-color: var(--white);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: var(--transition);
}

.cg-service-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
}

.cg-service-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.cg-service-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.cg-service-card:hover .cg-service-image img {
    transform: scale(1.1);
}

.cg-service-content {
    padding: 2rem;
    position: relative;
}

.cg-service-number {
    font-family: var(--font-heading);
    font-size: 3rem;
    font-weight: 700;
    color: var(--orange);
    opacity: 0.2;
    position: absolute;
    top: 1rem;
    right: 1.5rem;
}

.cg-service-title {
    font-size: 1.25rem;
    color: var(--sage);
    margin-bottom: 0.75rem;
}

.cg-service-description {
    color: var(--gray);
    line-height: 1.8;
}

@media (max-width: 768px) {
    .cg-services-grid { grid-template-columns: 1fr; }
}
</style>

<section class="cg-services" id="services">
    <div class="cg-services-container">
        <div class="cg-services-header">
            <p class="section-label">WHAT WE OFFER</p>
            <h2 class="section-title">A SMART WEBSITE HAS <span class="highlight">FOUR KEY COMPONENTS</span></h2>
        </div>

        <div class="cg-services-grid">
            <div class="cg-service-card">
                <div class="cg-service-image">
                    <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop" alt="Professional website design">
                </div>
                <div class="cg-service-content">
                    <div class="cg-service-number">01</div>
                    <h3 class="cg-service-title">BEAUTIFUL DESIGN</h3>
                    <p class="cg-service-description">Stand out from your competitors with stunning, modern design that captures attention and builds trust instantly.</p>
                </div>
            </div>

            <div class="cg-service-card">
                <div class="cg-service-image">
                    <img src="https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&h=400&fit=crop" alt="SEO analytics dashboard">
                </div>
                <div class="cg-service-content">
                    <div class="cg-service-number">02</div>
                    <h3 class="cg-service-title">SEO OPTIMIZATION</h3>
                    <p class="cg-service-description">Actually rank on Google above your competition. We build websites that search engines love.</p>
                </div>
            </div>

            <div class="cg-service-card">
                <div class="cg-service-image">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" alt="Lead capture systems">
                </div>
                <div class="cg-service-content">
                    <div class="cg-service-number">03</div>
                    <h3 class="cg-service-title">LEAD CAPTURE SYSTEMS</h3>
                    <p class="cg-service-description">Forms, chat widgets, booking calendars - multiple ways for visitors to become leads.</p>
                </div>
            </div>

            <div class="cg-service-card">
                <div class="cg-service-image">
                    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop" alt="AI chatbot automation">
                </div>
                <div class="cg-service-content">
                    <div class="cg-service-number">04</div>
                    <h3 class="cg-service-title">AI & AUTOMATION</h3>
                    <p class="cg-service-description">Works 24/7 to capture leads, book appointments, and follow up automatically. Never miss an opportunity.</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

### SECTION 4: We Also Offer

```html
<style>
.cg-additional {
    background-color: var(--sage);
    padding: 6rem 2rem;
}

.cg-additional-container {
    max-width: 1200px;
    margin: 0 auto;
}

.cg-additional h2 {
    color: var(--cream);
    text-align: center;
    margin-bottom: 3rem;
}

.cg-additional-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.cg-additional-card {
    background-color: rgba(255,255,255,0.05);
    padding: 2rem;
    border-left: 3px solid var(--orange);
    transition: var(--transition);
}

.cg-additional-card:hover {
    background-color: rgba(255,255,255,0.1);
    transform: translateY(-5px);
}

.cg-additional-card h3 {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    color: var(--cream);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
}

.cg-additional-card p {
    color: var(--cream);
    opacity: 0.8;
    font-size: 0.9rem;
}

@media (max-width: 1024px) {
    .cg-additional-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
    .cg-additional-grid { grid-template-columns: 1fr; }
}
</style>

<section class="cg-additional">
    <div class="cg-additional-container">
        <h2 class="section-title">WE ALSO OFFER</h2>
        <div class="cg-additional-grid">
            <div class="cg-additional-card">
                <h3>Social Media Content Creation</h3>
                <p>Engaging content that grows your audience and drives traffic to your site.</p>
            </div>
            <div class="cg-additional-card">
                <h3>Video Shorts</h3>
                <p>Short-form video content optimized for social platforms.</p>
            </div>
            <div class="cg-additional-card">
                <h3>Brand Strategy</h3>
                <p>Cohesive branding that tells your story and connects with your audience.</p>
            </div>
            <div class="cg-additional-card">
                <h3>Marketing Automation</h3>
                <p>Set it and forget it systems that nurture leads while you sleep.</p>
            </div>
        </div>
    </div>
</section>
```

---

### SECTION 5: Content That Works (Phone GIFs)

**NOTE:** Replace the GIF URLs with your GHL Media Library URLs after uploading.

```html
<style>
.cg-content-showcase {
    background-color: var(--cream);
    padding: 6rem 2rem;
    overflow: hidden;
}

.cg-content-showcase-container {
    max-width: 1400px;
    margin: 0 auto;
}

.cg-content-showcase-header {
    text-align: center;
    margin-bottom: 4rem;
}

.cg-content-subtitle {
    font-size: 1.125rem;
    color: var(--gray);
    max-width: 600px;
    margin: 1rem auto 0;
}

.cg-phone-mockups {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.cg-phone-mockup {
    flex: 0 0 auto;
    width: 280px;
    overflow: hidden;
}

.cg-phone-mockup img {
    width: 100%;
    height: auto;
    display: block;
}

.cg-phone-mockup:nth-child(1) { margin-top: 2rem; }
.cg-phone-mockup:nth-child(2) { margin-top: 0; }
.cg-phone-mockup:nth-child(3) { margin-top: 3rem; }
.cg-phone-mockup:nth-child(4) { margin-top: 1rem; }

@media (max-width: 768px) {
    .cg-phone-mockup { width: 200px; }
    .cg-phone-mockup:nth-child(1),
    .cg-phone-mockup:nth-child(2),
    .cg-phone-mockup:nth-child(3),
    .cg-phone-mockup:nth-child(4) { margin-top: 0; }
}
</style>

<section class="cg-content-showcase">
    <div class="cg-content-showcase-container">
        <div class="cg-content-showcase-header">
            <p class="section-label">SEE IT IN ACTION</p>
            <h2 class="section-title">CONTENT THAT <span class="highlight">WORKS</span></h2>
            <p class="cg-content-subtitle">Real results from real clients. See how we help businesses grow with engaging social content.</p>
        </div>
        <div class="cg-phone-mockups">
            <!-- REPLACE THESE URLs WITH YOUR GHL MEDIA LIBRARY URLs -->
            <div class="cg-phone-mockup">
                <img src="https://static.showit.co/file/OaTCU09gTu-kpV__IjMOXw/229363/new_back_2.gif" alt="Social media content example">
            </div>
            <div class="cg-phone-mockup">
                <img src="https://static.showit.co/file/2oP7-aWBRa6bXkon-8VOpg/229363/new_back_1.gif" alt="Social media content example">
            </div>
            <div class="cg-phone-mockup">
                <img src="https://static.showit.co/file/1OEYQMVmQZ-EoOvekmQm3g/229363/new_back.gif" alt="Social media content example">
            </div>
            <div class="cg-phone-mockup">
                <img src="https://static.showit.co/file/VYCBzXSIQDeMXZZ86K6tLQ/229363/new_back_3.gif" alt="Social media content example">
            </div>
        </div>
    </div>
</section>
```

---

### SECTION 6: Stats Counter

```html
<style>
.cg-stats {
    background-color: var(--cream);
    padding: 4rem 2rem;
    border-top: 1px solid rgba(78, 90, 78, 0.1);
    border-bottom: 1px solid rgba(78, 90, 78, 0.1);
}

.cg-stats-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    text-align: center;
}

.cg-stat-item {
    padding: 1rem;
}

.cg-stat-number {
    font-family: var(--font-heading);
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--orange);
    line-height: 1;
}

.cg-stat-suffix {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: var(--orange);
}

.cg-stat-label {
    font-size: 1rem;
    color: var(--sage);
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

@media (max-width: 768px) {
    .cg-stats-container { grid-template-columns: repeat(2, 1fr); }
    .cg-stat-number { font-size: 2.5rem; }
}
</style>

<section class="cg-stats">
    <div class="cg-stats-container">
        <div class="cg-stat-item">
            <span class="cg-stat-number">150</span>
            <span class="cg-stat-suffix">+</span>
            <p class="cg-stat-label">Happy Clients</p>
        </div>
        <div class="cg-stat-item">
            <span class="cg-stat-number">500</span>
            <span class="cg-stat-suffix">+</span>
            <p class="cg-stat-label">Projects Completed</p>
        </div>
        <div class="cg-stat-item">
            <span class="cg-stat-number">98</span>
            <span class="cg-stat-suffix">%</span>
            <p class="cg-stat-label">Client Satisfaction</p>
        </div>
        <div class="cg-stat-item">
            <span class="cg-stat-number">24</span>
            <span class="cg-stat-suffix">/7</span>
            <p class="cg-stat-label">Support Available</p>
        </div>
    </div>
</section>
```

---

### SECTION 7: Pricing Plans

```html
<style>
.cg-plans {
    background-color: var(--sage);
    padding: 6rem 2rem;
}

.cg-plans-container {
    max-width: 1200px;
    margin: 0 auto;
}

.cg-plans-header {
    text-align: center;
    margin-bottom: 4rem;
}

.cg-plans-header .section-label {
    color: var(--orange);
}

.cg-plans-header .section-title {
    color: var(--cream);
}

.cg-plans-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    align-items: start;
}

.cg-plan-card {
    background-color: var(--white);
    padding: 2.5rem;
    position: relative;
    transition: var(--transition);
}

.cg-plan-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
}

.cg-plan-card.featured {
    transform: scale(1.05);
    box-shadow: var(--shadow-xl);
    border: 3px solid var(--orange);
}

.cg-plan-badge {
    position: absolute;
    top: -12px;
    left: 2rem;
    background-color: var(--sage);
    color: var(--cream);
    font-family: var(--font-heading);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
}

.cg-plan-badge.popular {
    background-color: var(--orange);
}

.cg-plan-name {
    font-size: 1.5rem;
    color: var(--sage);
    margin-bottom: 0.5rem;
    margin-top: 1rem;
}

.cg-plan-tagline {
    color: var(--gray);
    margin-bottom: 1.5rem;
    font-style: italic;
}

.cg-plan-features {
    list-style: none;
    margin-bottom: 1.5rem;
}

.cg-plan-features li {
    padding: 0.5rem 0;
    padding-left: 1.75rem;
    position: relative;
    color: var(--black);
    font-size: 0.95rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.cg-plan-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--orange);
    font-weight: 700;
}

.cg-plan-features li strong {
    color: var(--sage);
}

.cg-plan-note {
    font-size: 0.875rem;
    color: var(--orange);
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
}

.cg-plans-footer {
    margin-top: 4rem;
    text-align: center;
    padding: 2rem;
    background-color: rgba(255,255,255,0.05);
}

.cg-plans-footer h4 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--cream);
    margin-bottom: 1.5rem;
    text-transform: uppercase;
}

.cg-plans-benefits {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.cg-benefit-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--cream);
}

.cg-benefit-item::before {
    content: '✓';
    color: var(--orange);
    font-weight: 700;
}

@media (max-width: 1024px) {
    .cg-plans-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
    .cg-plan-card.featured { transform: none; }
}
</style>

<section class="cg-plans" id="plans">
    <div class="cg-plans-container">
        <div class="cg-plans-header">
            <p class="section-label">SMART WEBSITE SOLUTIONS</p>
            <h2 class="section-title">CHOOSE YOUR <span class="highlight">PLAN</span></h2>
        </div>

        <div class="cg-plans-grid">
            <!-- Starter Plan -->
            <div class="cg-plan-card">
                <div class="cg-plan-badge">Starter</div>
                <h3 class="cg-plan-name">STARTER PLAN</h3>
                <p class="cg-plan-tagline">Perfect for getting started online</p>
                <ul class="cg-plan-features">
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
                <a href="#contact" class="btn btn-secondary btn-full">GET STARTED</a>
            </div>

            <!-- Professional Plan -->
            <div class="cg-plan-card featured">
                <div class="cg-plan-badge popular">Most Popular</div>
                <h3 class="cg-plan-name">PROFESSIONAL PLAN</h3>
                <p class="cg-plan-tagline">Complete online presence</p>
                <ul class="cg-plan-features">
                    <li><strong>Everything in Starter Plan, PLUS:</strong></li>
                    <li>Smart lead capture forms with automation</li>
                    <li>Online appointment booking system</li>
                    <li>Automated email & SMS follow-up sequences</li>
                    <li>Google review automation</li>
                    <li>Advanced SEO optimization</li>
                    <li>Social media integration</li>
                    <li>Monthly analytics reporting</li>
                    <li>Priority support</li>
                </ul>
                <p class="cg-plan-note">Best value for growing businesses</p>
                <a href="#contact" class="btn btn-primary btn-full">GET STARTED</a>
            </div>

            <!-- Enterprise Plan -->
            <div class="cg-plan-card">
                <div class="cg-plan-badge">Enterprise</div>
                <h3 class="cg-plan-name">ENTERPRISE PLAN</h3>
                <p class="cg-plan-tagline">Complete AI-powered business automation</p>
                <ul class="cg-plan-features">
                    <li><strong>Everything in Professional Plan, PLUS:</strong></li>
                    <li>AI voice assistant for phone calls</li>
                    <li>Advanced conversation AI across all channels</li>
                    <li>Custom automation workflows</li>
                    <li>Payment processing integration</li>
                    <li>Advanced analytics dashboard</li>
                    <li>Unlimited additional pages</li>
                    <li>Custom integrations</li>
                    <li>White-glove onboarding</li>
                    <li>24/7 priority support</li>
                </ul>
                <p class="cg-plan-note">Turn your website into a complete sales machine</p>
                <a href="#contact" class="btn btn-secondary btn-full">GET STARTED</a>
            </div>
        </div>

        <div class="cg-plans-footer">
            <h4>All plans include:</h4>
            <div class="cg-plans-benefits">
                <div class="cg-benefit-item">30-day money-back guarantee</div>
                <div class="cg-benefit-item">Free migration from existing website</div>
                <div class="cg-benefit-item">Mobile app access to manage everything</div>
            </div>
        </div>
    </div>
</section>
```

---

### SECTION 8: Testimonials

```html
<style>
.cg-testimonials {
    background-color: var(--cream);
    padding: 6rem 2rem;
}

.cg-testimonials-container {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
}

.cg-testimonials .section-title {
    margin-bottom: 3rem;
}

.cg-testimonial-card {
    background-color: var(--white);
    padding: 3rem;
    box-shadow: var(--shadow-md);
    margin-bottom: 2rem;
    position: relative;
}

.cg-testimonial-card::before {
    content: '"';
    font-family: Georgia, serif;
    font-size: 6rem;
    color: var(--orange);
    opacity: 0.2;
    position: absolute;
    top: 0;
    left: 1rem;
    line-height: 1;
}

.cg-testimonial-card p {
    font-size: 1.25rem;
    color: var(--sage);
    font-style: italic;
    line-height: 1.8;
    position: relative;
    z-index: 1;
}

.cg-testimonial-author {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.cg-testimonial-author img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--orange);
}

.cg-testimonial-author div {
    text-align: left;
}

.cg-testimonial-author strong {
    display: block;
    color: var(--sage);
    font-size: 1.1rem;
}

.cg-testimonial-author span {
    color: var(--gray);
    font-size: 0.9rem;
}
</style>

<section class="cg-testimonials">
    <div class="cg-testimonials-container">
        <h2 class="section-title">WHAT OUR <span class="highlight">CLIENTS SAY</span></h2>

        <div class="cg-testimonial-card">
            <p>"Creatively Grow transformed our online presence. Our leads have increased by 300% since launching our new smart website!"</p>
        </div>
        <div class="cg-testimonial-author">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Client testimonial">
            <div>
                <strong>John Smith</strong>
                <span>CEO, Tech Solutions</span>
            </div>
        </div>
    </div>
</section>
```

---

### SECTION 9: Contact Form

**NOTE:** In GHL, you'll likely use their built-in form element instead of this HTML. But here's the styling if you want a custom code section:

```html
<style>
.cg-contact {
    background: linear-gradient(135deg, var(--sage) 0%, var(--sage-dark) 100%);
    padding: 6rem 2rem;
}

.cg-contact-container {
    max-width: 800px;
    margin: 0 auto;
}

.cg-contact-content {
    text-align: center;
    margin-bottom: 3rem;
}

.cg-contact-content .section-label {
    color: var(--orange);
}

.cg-contact-headline {
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--cream);
    margin-bottom: 1rem;
}

.cg-contact-subtext {
    font-size: 1.125rem;
    color: var(--cream);
    opacity: 0.9;
}

.cg-contact-form {
    background-color: var(--white);
    padding: 3rem;
    box-shadow: var(--shadow-xl);
}

.cg-form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.cg-form-group {
    margin-bottom: 1.5rem;
}

.cg-form-group label {
    display: block;
    font-weight: 600;
    color: var(--sage);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.cg-form-group input,
.cg-form-group textarea,
.cg-form-group select {
    width: 100%;
    padding: 1rem;
    font-family: var(--font-body);
    font-size: 1rem;
    border: 2px solid var(--cream);
    background-color: var(--cream);
    transition: var(--transition);
}

.cg-form-group input:focus,
.cg-form-group textarea:focus,
.cg-form-group select:focus {
    outline: none;
    border-color: var(--orange);
    background-color: var(--white);
}

@media (max-width: 768px) {
    .cg-form-row { grid-template-columns: 1fr; }
    .cg-contact-form { padding: 2rem; }
}
</style>

<section class="cg-contact" id="contact">
    <div class="cg-contact-container">
        <div class="cg-contact-content">
            <p class="section-label">READY TO GROW?</p>
            <h2 class="cg-contact-headline">LET'S TURN YOUR WEBSITE INTO A <span class="highlight">SALES MACHINE</span></h2>
            <p class="cg-contact-subtext">Stop leaving money on the table. Get a website that actually works for your business.</p>
        </div>

        <!-- USE GHL'S BUILT-IN FORM HERE OR CUSTOM CODE -->
        <div class="cg-contact-form">
            <div class="cg-form-row">
                <div class="cg-form-group">
                    <label>Your Name</label>
                    <input type="text" placeholder="John Smith">
                </div>
                <div class="cg-form-group">
                    <label>Your Email</label>
                    <input type="email" placeholder="john@example.com">
                </div>
            </div>
            <div class="cg-form-row">
                <div class="cg-form-group">
                    <label>Your Phone</label>
                    <input type="tel" placeholder="(555) 123-4567">
                </div>
                <div class="cg-form-group">
                    <label>Interested In</label>
                    <select>
                        <option>Select a plan...</option>
                        <option>Starter Plan</option>
                        <option>Professional Plan</option>
                        <option>Enterprise Plan</option>
                    </select>
                </div>
            </div>
            <div class="cg-form-group">
                <label>Tell us about your project</label>
                <textarea rows="4" placeholder="What are your goals?"></textarea>
            </div>
            <button class="btn btn-primary btn-full">SUBMIT</button>
        </div>
    </div>
</section>
```

---

### SECTION 10: Footer

**NOTE:** Replace logo URL with your GHL Media Library URL.

```html
<style>
.cg-footer {
    background-color: var(--sage-dark);
    padding: 2rem;
}

.cg-footer-container {
    max-width: 1200px;
    margin: 0 auto;
}

.cg-footer-main {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.cg-footer-logo {
    width: 200px;
    height: auto;
    margin-bottom: 0.75rem;
}

.cg-footer-tagline {
    color: var(--cream);
    opacity: 0.7;
}

.cg-footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.cg-footer-links a {
    color: var(--cream);
    text-decoration: none;
    opacity: 0.7;
    transition: var(--transition);
}

.cg-footer-links a:hover {
    opacity: 1;
    color: var(--orange);
}

.cg-footer-bottom {
    padding-top: 1rem;
    text-align: center;
}

.cg-footer-copyright {
    color: var(--cream);
    opacity: 0.5;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .cg-footer-main {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
    }
}
</style>

<footer class="cg-footer">
    <div class="cg-footer-container">
        <div class="cg-footer-main">
            <div class="cg-footer-brand">
                <!-- REPLACE WITH YOUR GHL MEDIA LIBRARY LOGO URL -->
                <img src="assets/logo.png" alt="Creatively Grow" class="cg-footer-logo">
                <p class="cg-footer-tagline">A company created to help grow your business creatively</p>
            </div>
            <div class="cg-footer-links">
                <a href="#services">Services</a>
                <a href="#plans">Plans</a>
                <a href="#contact">Contact</a>
            </div>
            <div class="cg-footer-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">LinkedIn</a>
            </div>
        </div>
        <div class="cg-footer-bottom">
            <p class="cg-footer-copyright">© 2024 Creatively Grow. All rights reserved.</p>
        </div>
    </div>
</footer>
```

---

## Step 4: Add Sales Elements (Optional)

### Sticky CTA Bar

Add this to a site-wide custom code section:

```html
<style>
.cg-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--sage);
    padding: 1rem 2rem;
    z-index: 998;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
}

.cg-sticky-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.cg-sticky-text {
    color: var(--cream);
    font-size: 1rem;
}

.cg-sticky-text strong {
    color: var(--orange);
}

@media (max-width: 768px) {
    .cg-sticky-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
</style>

<div class="cg-sticky-bar">
    <div class="cg-sticky-content">
        <span class="cg-sticky-text">
            <strong>FREE Smart Website Design</strong> — No Hidden Fees, No Obligations
        </span>
        <a href="#contact" class="btn btn-primary">Claim Your Free Design</a>
    </div>
</div>
```

---

### Chat Widget

```html
<style>
.cg-chat-widget {
    position: fixed;
    bottom: 100px;
    right: 2rem;
    z-index: 997;
}

.cg-chat-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--orange);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    color: white;
    font-size: 24px;
}

.cg-chat-btn:hover {
    background-color: #d96a2d;
    transform: scale(1.1);
}
</style>

<div class="cg-chat-widget">
    <button class="cg-chat-btn" onclick="location.href='#contact'">💬</button>
</div>
```

---

## Quick Reference: Files to Upload

1. `assets/logo.png` - Main logo (cream color)
2. `assets/favicon.png` - Browser tab icon
3. `assets/new_back.gif` - Phone mockup GIF
4. `assets/new_back_1.gif` - Phone mockup GIF
5. `assets/new_back_2.gif` - Phone mockup GIF
6. `assets/new_back_3.gif` - Phone mockup GIF

---

## Notes

- Each section above is self-contained with its own CSS
- Copy and paste each section into a GHL "Custom Code" or "HTML" element
- For the contact form, consider using GHL's native form builder for better integration with your CRM
- Replace image URLs with your GHL Media Library URLs after uploading
- Test on mobile to ensure responsiveness

Good luck with your GHL setup!
