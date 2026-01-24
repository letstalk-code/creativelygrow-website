// =========================================
// CREATIVELY GROW - Interactive Features
// =========================================

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =========================================
    // MOBILE MENU TOGGLE
    // =========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // =========================================
    // SCROLL ANIMATIONS
    // =========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // =========================================
    // COUNTER ANIMATION
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // =========================================
    // TESTIMONIAL SLIDER
    // =========================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (dots[i]) dots[i].classList.remove('active');
        });

        testimonialCards[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }

    // Auto-advance testimonials
    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            startTestimonialSlider();
        });
    });

    if (testimonialCards.length > 0) {
        startTestimonialSlider();
    }

    // =========================================
    // BACK TO TOP BUTTON
    // =========================================
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // FORM INTERACTIONS
    // =========================================
    const form = document.querySelector('.contact-form');

    if (form) {
        // Add floating label effect
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add focus class for styling
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate submission (replace with actual submission logic)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>SENDING...</span>';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<span>SENT!</span>';
                submitBtn.style.backgroundColor = '#4e5a4e';

                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';

                    // Show success message (you can customize this)
                    alert('Thank you for your message! We\'ll be in touch soon.');
                }, 1500);
            }, 2000);
        });
    }

    // =========================================
    // PLAN CARD HOVER EFFECTS
    // =========================================
    const planCards = document.querySelectorAll('.plan-card');

    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle parallax effect on hover
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            // Subtle tilt effect
            if (!this.classList.contains('featured')) {
                this.style.transform = `translateY(-10px) rotateX(${-deltaY * 2}deg) rotateY(${deltaX * 2}deg)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = '';
            }
        });
    });

    // =========================================
    // SERVICE CARD IMAGE PARALLAX
    // =========================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const image = card.querySelector('.service-image img');

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            if (image) {
                image.style.transform = `scale(1.1) translate(${deltaX * 5}px, ${deltaY * 5}px)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

    // =========================================
    // SCROLL PROGRESS INDICATOR (Optional)
    // =========================================
    // Uncomment below to add a scroll progress bar at the top
    /*
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ef7938, #d96a2d);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    */

    // =========================================
    // CURSOR EFFECT (Optional - Uncomment to enable)
    // =========================================
    /*
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #ef7938;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#4e5a4e';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#ef7938';
        });
    });
    */

});

// =========================================
// PRELOADER (Optional)
// =========================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// =========================================
// STICKY CTA BAR
// =========================================
const stickyCta = document.querySelector('.sticky-cta-bar');
const stickyCtaClose = document.querySelector('.sticky-cta-close');
let stickyCtaClosed = false;

if (stickyCta) {
    // Show sticky bar after scrolling past hero
    window.addEventListener('scroll', function() {
        if (stickyCtaClosed) return;

        if (window.scrollY > 600) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });

    // Close button
    if (stickyCtaClose) {
        stickyCtaClose.addEventListener('click', function() {
            stickyCta.classList.remove('visible');
            stickyCta.classList.add('hidden');
            stickyCtaClosed = true;
        });
    }

    // Close when CTA is clicked
    const stickyCtaBtn = stickyCta.querySelector('.sticky-cta-btn');
    if (stickyCtaBtn) {
        stickyCtaBtn.addEventListener('click', function() {
            stickyCta.classList.remove('visible');
            stickyCtaClosed = true;
        });
    }
}

// =========================================
// LIVE CHAT WIDGET
// =========================================
const chatWidget = document.querySelector('.chat-widget');
const chatWidgetBtn = document.querySelector('.chat-widget-btn');
const chatPopup = document.querySelector('.chat-widget-popup');
const chatPopupClose = document.querySelector('.chat-popup-close');
const chatBadge = document.querySelector('.chat-widget-badge');

if (chatWidgetBtn && chatPopup) {
    chatWidgetBtn.addEventListener('click', function() {
        chatPopup.classList.toggle('active');
        // Hide badge when opened
        if (chatBadge) {
            chatBadge.style.display = 'none';
        }
    });

    if (chatPopupClose) {
        chatPopupClose.addEventListener('click', function() {
            chatPopup.classList.remove('active');
        });
    }

    // Close popup when clicking CTA inside
    const chatCta = chatPopup.querySelector('.btn');
    if (chatCta) {
        chatCta.addEventListener('click', function() {
            chatPopup.classList.remove('active');
        });
    }
}

// =========================================
// EXIT INTENT POPUP
// =========================================
const exitPopupOverlay = document.querySelector('.exit-popup-overlay');
const exitPopupClose = document.querySelector('.exit-popup-close');
const exitPopupCta = document.querySelector('.exit-popup-cta');
let exitPopupShown = false;

if (exitPopupOverlay) {
    // Show popup when mouse leaves viewport (exit intent)
    document.addEventListener('mouseout', function(e) {
        // Only trigger if mouse leaves from top of page
        if (e.clientY < 10 && !exitPopupShown) {
            exitPopupOverlay.classList.add('active');
            exitPopupShown = true;
            document.body.style.overflow = 'hidden';
        }
    });

    // Close popup functions
    function closeExitPopup() {
        exitPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (exitPopupClose) {
        exitPopupClose.addEventListener('click', closeExitPopup);
    }

    // Close when clicking overlay background
    exitPopupOverlay.addEventListener('click', function(e) {
        if (e.target === exitPopupOverlay) {
            closeExitPopup();
        }
    });

    // Close when clicking CTA
    if (exitPopupCta) {
        exitPopupCta.addEventListener('click', closeExitPopup);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && exitPopupOverlay.classList.contains('active')) {
            closeExitPopup();
        }
    });

    // =========================================
    // WEBSITE ANALYZER
    // =========================================
    const analyzerForm = document.getElementById('analyzer-form');
    const analyzerLoading = document.getElementById('analyzer-loading');
    const analyzerError = document.getElementById('analyzer-error');
    const analyzerFormCard = document.getElementById('analyzer-form-card');
    const analyzerResults = document.getElementById('analyzer-results');
    const analyzerSection = document.querySelector('.analyzer-section');

    // API endpoint - using the Next.js backend
    const ANALYZER_API = 'https://creativelygrow-next.vercel.app/api/analyze';

    if (analyzerForm) {
        analyzerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const url = document.getElementById('analyzer-url').value;
            const name = document.getElementById('analyzer-name').value;
            const email = document.getElementById('analyzer-email').value;
            const phone = document.getElementById('analyzer-phone').value;

            // Show loading
            analyzerLoading.style.display = 'flex';
            analyzerError.style.display = 'none';

            try {
                const response = await fetch(ANALYZER_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, name, email, phone })
                });

                const data = await response.json();

                if (data.error) {
                    analyzerError.textContent = data.error;
                    analyzerError.style.display = 'block';
                    analyzerLoading.style.display = 'none';
                    return;
                }

                // Hide form, show results
                displayAnalyzerResults(data, url);

            } catch (err) {
                analyzerError.textContent = 'Analysis failed. Please try again.';
                analyzerError.style.display = 'block';
                analyzerLoading.style.display = 'none';
            }
        });
    }

    function displayAnalyzerResults(data, url) {
        // Hide form section content
        document.querySelector('.analyzer-container').style.display = 'none';
        analyzerResults.style.display = 'block';

        // Set URL
        document.getElementById('results-url').textContent = url;

        // Set headline
        document.getElementById('results-headline').textContent = data.report.headline;

        // Animate score circle
        const score = data.score;
        const scoreColor = score >= 70 ? '#22c55e' : score >= 50 ? '#ef7938' : '#ef4444';
        const scoreCircle = document.getElementById('score-circle');
        const strokeDashoffset = 440 - (440 * score) / 100;

        scoreCircle.style.stroke = scoreColor;
        scoreCircle.style.transition = 'stroke-dashoffset 1s ease-out';
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = strokeDashoffset;
        }, 100);

        // Animate score number
        const scoreNumber = document.getElementById('score-number');
        animateNumber(scoreNumber, 0, score, 1000);

        // Set recommended next step
        document.getElementById('results-next-step').textContent = data.report.recommendedNextStep;

        // Metrics grid
        const metricsGrid = document.getElementById('metrics-grid');
        metricsGrid.innerHTML = '';
        const metrics = [
            { label: 'Performance', value: data.metrics.performance, weight: '30%' },
            { label: 'SEO', value: data.metrics.seo, weight: '20%' },
            { label: 'Accessibility', value: data.metrics.accessibility, weight: '15%' },
            { label: 'Best Practices', value: data.metrics.bestPractices, weight: '10%' },
            { label: 'Conversion', value: data.metrics.conversionReadiness, weight: '25%' }
        ];
        metrics.forEach(m => {
            const div = document.createElement('div');
            div.className = 'analyzer-metric-item';
            div.innerHTML = `
                <div class="analyzer-metric-value">${m.value}</div>
                <div class="analyzer-metric-label">${m.label}</div>
                <div class="analyzer-metric-weight">${m.weight}</div>
            `;
            metricsGrid.appendChild(div);
        });

        // Issues
        const issuesSection = document.getElementById('issues-section');
        issuesSection.innerHTML = '';
        if (data.report.topIssues && data.report.topIssues.length > 0) {
            issuesSection.innerHTML = '<h4 class="analyzer-section-title">⚠️ Top Issues</h4>';
            data.report.topIssues.slice(0, 3).forEach(issue => {
                const div = document.createElement('div');
                div.className = 'analyzer-issue-card';
                div.innerHTML = `<h5>${issue.title}</h5><p>${issue.whyItMatters}</p>`;
                issuesSection.appendChild(div);
            });
        }

        // Quick wins
        const winsSection = document.getElementById('wins-section');
        winsSection.innerHTML = '';
        if (data.report.quickWins && data.report.quickWins.length > 0) {
            winsSection.innerHTML = '<h4 class="analyzer-section-title">✓ Quick Wins</h4>';
            data.report.quickWins.slice(0, 3).forEach(win => {
                const div = document.createElement('div');
                div.className = 'analyzer-win-card';
                const impactClass = win.impact === 'High' ? 'analyzer-impact-high' :
                                    win.impact === 'Medium' ? 'analyzer-impact-medium' : 'analyzer-impact-low';
                div.innerHTML = `
                    <span class="analyzer-impact-badge ${impactClass}">${win.impact}</span>
                    <h5>${win.title}</h5>
                    <p>${win.whatToDo}</p>
                `;
                winsSection.appendChild(div);
            });
        }

        // Upgrades
        const upgradesSection = document.getElementById('upgrades-section');
        upgradesSection.innerHTML = '';
        if (data.report.smartWebsiteUpgrades && data.report.smartWebsiteUpgrades.length > 0) {
            upgradesSection.innerHTML = `
                <h4 class="analyzer-section-title">⚡ Smart Website Upgrades</h4>
                <div class="analyzer-upgrades-box">
                    <p>Your website isn't broken — it's outdated. Smart AI Websites engage visitors, answer questions, capture leads, and follow up automatically.</p>
                    <div id="upgrades-list"></div>
                </div>
            `;
            const upgradesList = document.getElementById('upgrades-list');
            data.report.smartWebsiteUpgrades.forEach(upgrade => {
                const div = document.createElement('div');
                div.className = 'analyzer-upgrade-item';
                div.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <div><strong style="color: var(--sage)">${upgrade.title}:</strong> <span>${upgrade.whatChanges}</span></div>
                `;
                upgradesList.appendChild(div);
            });
        }

        // Scroll to results
        analyzerSection.scrollIntoView({ behavior: 'smooth' });
    }

    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(start + range * progress);
            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }
}

// Reset analyzer (global function)
function resetAnalyzer() {
    document.querySelector('.analyzer-container').style.display = 'block';
    document.getElementById('analyzer-results').style.display = 'none';
    document.getElementById('analyzer-form').reset();
    document.getElementById('analyzer-loading').style.display = 'none';
    document.getElementById('score-circle').style.strokeDashoffset = '440';
    document.querySelector('.analyzer-section').scrollIntoView({ behavior: 'smooth' });
}
