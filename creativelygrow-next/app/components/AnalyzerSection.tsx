"use client";

import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, ArrowRight, Phone, Zap, Sparkles } from 'lucide-react';

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+18135821526';
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || '#';

export default function AnalyzerSection() {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, name, email, phone })
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Results View
    if (result) {
        const scoreColor = result.score >= 70 ? '#22c55e' : result.score >= 50 ? 'var(--orange)' : '#ef4444';
        const strokeDashoffset = 440 - (440 * result.score) / 100;

        return (
            <section className="analyzer-results" id="analysis-results">
                <div className="analyzer-results-card">
                    {/* Header */}
                    <div className="analyzer-results-header">
                        <h2>Website Analysis Report</h2>
                        <p>{url}</p>
                    </div>

                    <div className="analyzer-results-body">
                        {/* 1. Headline Summary */}
                        <p style={{ fontSize: '1.25rem', color: 'var(--gray)', marginBottom: '2rem', textAlign: 'center' }}>
                            {result.report.headline}
                        </p>

                        {/* 2. Overall Score */}
                        <div className="analyzer-score-circle">
                            <svg viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke={scoreColor}
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="440"
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                />
                            </svg>
                            <div className="analyzer-score-value">
                                <span>{result.score}</span>
                                <span>Overall</span>
                            </div>
                        </div>

                        {/* 3. Score Breakdown */}
                        <div className="analyzer-metrics-grid">
                            {[
                                { label: 'Performance', value: result.metrics.performance, weight: '30%' },
                                { label: 'SEO', value: result.metrics.seo, weight: '20%' },
                                { label: 'Accessibility', value: result.metrics.accessibility, weight: '15%' },
                                { label: 'Best Practices', value: result.metrics.bestPractices, weight: '10%' },
                                { label: 'Conversion', value: result.metrics.conversionReadiness, weight: '25%' },
                            ].map((item) => (
                                <div key={item.label} className="analyzer-metric-item">
                                    <div className="analyzer-metric-value">{item.value}</div>
                                    <div className="analyzer-metric-label">{item.label}</div>
                                    <div className="analyzer-metric-weight">{item.weight}</div>
                                </div>
                            ))}
                        </div>

                        {/* 4. Top Issues */}
                        {result.report.topIssues?.length > 0 && (
                            <div className="analyzer-issues-section">
                                <h4 className="analyzer-section-title">
                                    <AlertCircle style={{ color: '#ef4444' }} size={20} />
                                    Top Issues
                                </h4>
                                <div>
                                    {result.report.topIssues.slice(0, 3).map((issue: any, i: number) => (
                                        <div key={i} className="analyzer-issue-card">
                                            <h5>{issue.title}</h5>
                                            <p>{issue.whyItMatters}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Quick Wins */}
                        {result.report.quickWins?.length > 0 && (
                            <div className="analyzer-wins-section">
                                <h4 className="analyzer-section-title">
                                    <CheckCircle style={{ color: '#16a34a' }} size={20} />
                                    Quick Wins
                                </h4>
                                <div className="analyzer-wins-grid">
                                    {result.report.quickWins.slice(0, 3).map((win: any, i: number) => (
                                        <div key={i} className="analyzer-win-card">
                                            <span className={`analyzer-impact-badge ${win.impact === 'High' ? 'analyzer-impact-high' : win.impact === 'Medium' ? 'analyzer-impact-medium' : 'analyzer-impact-low'}`}>
                                                {win.impact}
                                            </span>
                                            <h5>{win.title}</h5>
                                            <p>{win.whatToDo}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 6. Smart Website Upgrades */}
                        {result.report.smartWebsiteUpgrades?.length > 0 && (
                            <div className="analyzer-upgrades-section">
                                <h4 className="analyzer-section-title">
                                    <Sparkles style={{ color: 'var(--orange)' }} size={20} />
                                    Smart Website Upgrades
                                </h4>
                                <div className="analyzer-upgrades-box">
                                    <p>
                                        Your website isn't broken — it's outdated. Smart AI Websites engage visitors, answer questions, capture leads, and follow up automatically.
                                    </p>
                                    <div>
                                        {result.report.smartWebsiteUpgrades.map((upgrade: any, i: number) => (
                                            <div key={i} className="analyzer-upgrade-item">
                                                <Zap size={18} />
                                                <div>
                                                    <span style={{ fontWeight: 700, color: 'var(--sage)' }}>{upgrade.title}:</span>{' '}
                                                    <span style={{ color: 'var(--gray)' }}>{upgrade.whatChanges}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7. CTAs */}
                        <div className="analyzer-cta-box">
                            <p>{result.report.recommendedNextStep}</p>
                            <div className="analyzer-cta-buttons">
                                <a
                                    href={BOOKING_URL}
                                    target="_blank"
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    Book a Smart Website Demo <ArrowRight size={18} />
                                </a>
                                <a
                                    href={`tel:${BUSINESS_PHONE}`}
                                    className="btn"
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'var(--sage)',
                                        border: '1px solid rgba(78, 90, 78, 0.2)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Phone size={18} /> Call Our Business Line
                                </a>
                            </div>
                            <p className="analyzer-cta-disclaimer">
                                Automated analysis of public pages. Final recommendations may vary after review.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Analyze Another */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={() => setResult(null)} className="analyzer-back-link">
                        Analyze another website
                    </button>
                </div>
            </section>
        );
    }

    // Form View
    return (
        <section className="analyzer-section" id="analyzer">
            <div className="analyzer-container">
                {/* Section Header */}
                <div className="analyzer-header">
                    <h2 className="analyzer-title">
                        See Why Most Websites <span className="highlight">Don't Convert</span>
                    </h2>
                    <p className="analyzer-subtitle">
                        Most websites look fine — but quietly lose leads every day.
                    </p>
                    <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
                        We built AI tools that show you exactly what's broken and how to fix it.
                    </p>
                </div>

                <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
                    {/* Attention arrows */}
                    <div style={{
                        position: 'absolute',
                        left: '-80px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        animation: 'bounceRight 1s ease-in-out infinite'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </div>
                    <div style={{
                        position: 'absolute',
                        right: '-80px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        animation: 'bounceLeft 1s ease-in-out infinite'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </div>

                    <div className="analyzer-card" style={{ position: 'relative' }}>
                        {loading && (
                            <div className="analyzer-loading-overlay">
                                <Loader2 style={{ width: '2.5rem', height: '2.5rem', color: 'var(--orange)', animation: 'spin 1s linear infinite' }} />
                                <p className="analyzer-loading-text">Analyzing...</p>
                                <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Checking performance & conversion</p>
                            </div>
                        )}

                        <form onSubmit={handleAnalyze} className="analyzer-form">
                            <input
                                type="text"
                                required
                                placeholder="www.yourwebsite.com"
                                className="analyzer-input"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="analyzer-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                required
                                placeholder="Email"
                                className="analyzer-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone (optional)"
                                className="analyzer-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            {error && (
                                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
                            )}

                            <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ padding: '0.75rem' }}>
                                {loading ? 'Analyzing...' : 'Analyze My Website'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
                                No install. No commitment. Results load instantly.
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounceRight {
                    0%, 100% { transform: translateY(-50%) translateX(0); }
                    50% { transform: translateY(-50%) translateX(10px); }
                }
                @keyframes bounceLeft {
                    0%, 100% { transform: translateY(-50%) translateX(0); }
                    50% { transform: translateY(-50%) translateX(-10px); }
                }
            `}</style>
        </section>
    );
}
