import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const headingFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "optify360 | High-Performance Web Engineering & SEO",
    template: "%s | optify360",
  },
  description: "optify360 is an elite digital systems and SEO agency led by Md Arsalan, delivering lightning-fast web applications, optimized conversions, and search engine dominance.",
  metadataBase: new URL("https://optify360.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "optify360 | High-Performance Web Engineering & SEO",
    description: "Elite digital systems and SEO agency led by Md Arsalan, delivering lightning-fast web applications and search engine dominance.",
    url: "https://optify360.vercel.app",
    siteName: "optify360",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://optify360.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "optify360 Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "optify360 | High-Performance Web Engineering & SEO",
    description: "Elite digital systems and SEO agency led by Md Arsalan, delivering lightning-fast web applications and search engine dominance.",
    images: ["https://optify360.vercel.app/og-image.jpg"],
    creator: "@mdarsalan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased`}
    >
      <body className="flex flex-col bg-[#030303] text-[#F5F5F5]">{children}</body>
    </html>
  );
}
