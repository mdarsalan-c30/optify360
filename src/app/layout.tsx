import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BLACKHOLE | High-Performance Web Engineering & SEO",
    template: "%s | BLACKHOLE",
  },
  description: "BLACKHOLE is an elite product development and SEO agency led by Md Arsalan, delivering lightning-fast web applications, optimized conversions, and search engine dominance under optify360.",
  metadataBase: new URL("https://optify360.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BLACKHOLE | High-Performance Web Engineering & SEO",
    description: "Elite product development and SEO agency led by Md Arsalan, delivering lightning-fast web applications and search engine dominance.",
    url: "https://optify360.com",
    siteName: "BLACKHOLE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://optify360.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BLACKHOLE Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACKHOLE | High-Performance Web Engineering & SEO",
    description: "Elite product development and SEO agency led by Md Arsalan, delivering lightning-fast web applications and search engine dominance.",
    images: ["https://optify360.com/og-image.jpg"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
