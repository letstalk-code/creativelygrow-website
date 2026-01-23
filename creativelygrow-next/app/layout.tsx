import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
    title: "Smart Website Design & AI Automation | Creatively Grow",
    description: "Get a FREE smart website design with AI automation, SEO optimization, and lead capture systems. Turn your website into a 24/7 sales machine.",
    metadataBase: new URL("https://creativelygrow.com"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="icon" type="image/png" href="/favicon.png" />
            </head>
            <body className={`${inter.variable} ${oswald.variable}`}>
                {children}

                {/* GHL Chat Widget */}
                <Script
                    src="https://widgets.leadconnectorhq.com/loader.js"
                    data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
                    data-widget-id="696e7962639c14e449f511fd"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
