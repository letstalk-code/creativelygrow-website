import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
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
                <link rel="icon" type="image/png" href="/assets/favicon.png" />
            </head>
            <body className={`${inter.variable} ${oswald.variable}`}>{children}</body>
        </html>
    );
}
