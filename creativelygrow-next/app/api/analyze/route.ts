import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        let { url, name, email, phone } = await req.json();

        if (!url || !name || !email) {
            return NextResponse.json({ error: 'URL, name, and email are required' }, { status: 400 });
        }

        // Auto-add https:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // 1. Fetch HTML for heuristics
        let heuristics = {
            hasClearCTA: false,
            hasPhone: false,
            hasContactForm: false,
            isHttps: url.startsWith('https'),
            hasTrustIndicators: false,
            hasTitle: false,
            hasMetaDescription: false,
        };

        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': 'CreativelyGrow-Analyzer/1.0' },
                signal: AbortSignal.timeout(10000)
            });
            const html = await res.text();
            const htmlLower = html.toLowerCase();

            heuristics.hasPhone = /href=["']tel:/.test(html) || /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(html);
            heuristics.hasContactForm = /<form[\s>]/i.test(html);
            heuristics.hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
            heuristics.hasMetaDescription = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html);
            heuristics.hasClearCTA = /get started|contact us|call now|book now|schedule|free quote|get a demo|request/i.test(html);
            heuristics.hasTrustIndicators = /years|experience|trusted|certified|guarantee|bbb|ssl|secure/i.test(html);
        } catch (e) {
            console.error("HTML fetch failed:", e);
        }

        // 2. PageSpeed Insights API (no key required for basic usage)
        let metrics = { performance: 50, seo: 50, accessibility: 50, bestPractices: 50 };
        let mobileData = null;
        let desktopData = null;

        try {
            const [mobileRes, desktopRes] = await Promise.all([
                fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices`, { signal: AbortSignal.timeout(30000) }),
                fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&category=performance&category=seo&category=accessibility&category=best-practices`, { signal: AbortSignal.timeout(30000) })
            ]);

            if (mobileRes.ok) {
                mobileData = await mobileRes.json();
                const cats = mobileData.lighthouseResult?.categories;
                if (cats) {
                    metrics.performance = Math.round((cats.performance?.score || 0.5) * 100);
                    metrics.seo = Math.round((cats.seo?.score || 0.5) * 100);
                    metrics.accessibility = Math.round((cats.accessibility?.score || 0.5) * 100);
                    metrics.bestPractices = Math.round((cats['best-practices']?.score || 0.5) * 100);
                }
            }
            if (desktopRes.ok) {
                desktopData = await desktopRes.json();
            }
        } catch (e) {
            console.error("PageSpeed fetch failed:", e);
        }

        // 3. Calculate conversion readiness (0-100)
        let conversionScore = 0;
        if (heuristics.hasClearCTA) conversionScore += 25;
        if (heuristics.hasPhone) conversionScore += 25;
        if (heuristics.hasContactForm) conversionScore += 20;
        if (heuristics.isHttps) conversionScore += 15;
        if (heuristics.hasTrustIndicators) conversionScore += 15;

        // 4. Calculate overall score (weighted)
        const overallScore = Math.round(
            (metrics.performance * 0.30) +
            (metrics.seo * 0.20) +
            (metrics.accessibility * 0.15) +
            (metrics.bestPractices * 0.10) +
            (conversionScore * 0.25)
        );

        // 5. Generate AI Report
        const systemPrompt = `You generate concise website conversion audits.
Be direct, practical, and professional.
No hype. No filler. No explanations.
Never mention Google, Lighthouse, or PageSpeed.
Output valid JSON only.`;

        const userPrompt = `Website: ${url}

Data:
Scores: Performance ${metrics.performance}, SEO ${metrics.seo}, Accessibility ${metrics.accessibility}, Best Practices ${metrics.bestPractices}
Mobile: ${mobileData ? 'Tested' : 'Unavailable'}
Desktop: ${desktopData ? 'Tested' : 'Unavailable'}
Conversion Signals: CTA ${heuristics.hasClearCTA}, Phone ${heuristics.hasPhone}, Form ${heuristics.hasContactForm}, HTTPS ${heuristics.isHttps}, Trust ${heuristics.hasTrustIndicators}

Task:
Identify why this website loses leads and how a Smart AI Website would improve it.

Rules:
- Business-owner language
- Focus on revenue impact
- No technical jargon
- Be specific
- Max clarity, min words

Return JSON exactly in this format:
{
  "headline": "1 sentence summary",
  "topIssues": [
    { "title": "Issue", "whyItMatters": "Revenue impact" }
  ],
  "quickWins": [
    { "title": "Fix", "impact": "Low|Medium|High", "whatToDo": "Action" }
  ],
  "smartWebsiteUpgrades": [
    { "title": "Upgrade", "whatChanges": "Outcome" }
  ],
  "recommendedNextStep": "Direct CTA"
}

Hard limits:
- Total output under 250 words
- No extra text
- No markdown
- No commentary`;

        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 800,
            temperature: 0.5,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const textContent = msg.content[0].type === 'text' ? msg.content[0].text : '';
        let report;
        try {
            report = JSON.parse(textContent);
        } catch {
            report = {
                headline: "Your website has opportunities to capture more leads.",
                topIssues: [
                    { title: "Missing conversion paths", whyItMatters: "Visitors leave without a clear next step" },
                    { title: "No 24/7 engagement", whyItMatters: "Leads slip away after hours" }
                ],
                quickWins: [
                    { title: "Add visible phone number", impact: "High", whatToDo: "Place phone in header" },
                    { title: "Add clear CTA", impact: "High", whatToDo: "Add booking or contact button above fold" }
                ],
                smartWebsiteUpgrades: [
                    { title: "AI Chat Assistant", whatChanges: "Answer questions and capture leads 24/7" },
                    { title: "Automated Follow-up", whatChanges: "Never lose a lead to slow response" }
                ],
                recommendedNextStep: "Book a demo to see how Smart AI Websites capture more leads"
            };
        }

        // Send lead to GoHighLevel
        try {
            const ghlApiKey = process.env.GHL_API_KEY;
            const ghlLocationId = process.env.GHL_LOCATION_ID;

            if (ghlApiKey && ghlLocationId) {
                // Create contact in GHL
                const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${ghlApiKey}`,
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28'
                    },
                    body: JSON.stringify({
                        locationId: ghlLocationId,
                        name: name,
                        email: email,
                        phone: phone || undefined,
                        tags: ['Website Analyzer Lead'],
                        source: 'Website Analyzer',
                        customFields: [
                            { key: 'website_url', value: url },
                            { key: 'analyzer_score', value: String(overallScore) }
                        ]
                    })
                });

                if (ghlResponse.ok) {
                    const contactData = await ghlResponse.json();
                    console.log('Lead sent to GHL:', contactData.contact?.id);

                    // Add note with analysis summary
                    if (contactData.contact?.id) {
                        await fetch(`https://services.leadconnectorhq.com/contacts/${contactData.contact.id}/notes`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${ghlApiKey}`,
                                'Content-Type': 'application/json',
                                'Version': '2021-07-28'
                            },
                            body: JSON.stringify({
                                body: `Website Analyzer Results:\n\nURL: ${url}\nOverall Score: ${overallScore}/100\n\nPerformance: ${metrics.performance}\nSEO: ${metrics.seo}\nAccessibility: ${metrics.accessibility}\nBest Practices: ${metrics.bestPractices}\nConversion Readiness: ${conversionScore}\n\nHeadline: ${report.headline}\n\nRecommended: ${report.recommendedNextStep}`
                            })
                        });
                    }
                } else {
                    console.error('GHL API error:', await ghlResponse.text());
                }
            }
        } catch (ghlError) {
            console.error('GHL integration error:', ghlError);
        }

        console.log('Lead captured:', { name, email, phone, url, score: overallScore });

        return NextResponse.json({
            score: overallScore,
            metrics: {
                performance: metrics.performance,
                seo: metrics.seo,
                accessibility: metrics.accessibility,
                bestPractices: metrics.bestPractices,
                conversionReadiness: conversionScore
            },
            heuristics,
            report
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}
