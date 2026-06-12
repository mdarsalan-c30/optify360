import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Optify360 | Custom Web, App & SaaS Development Agency",
  description: "Optify360 builds high-performance custom SaaS platforms, WordPress sites, mobile apps, and automates business workflows with AI agents. Led by Md Arsalan.",
  keywords: [
    "Custom Web Development", "Next.js Development Agency", "WordPress Development",
    "Mobile App Development", "SaaS Development Company", "Technical SEO Experts",
    "AI Workflow Automation", "Full Stack Development", "React Developers",
    "React Native App Development", "Enterprise Software Engineering",
    "Shopify Development", "E-commerce Development"
  ],
  metadataBase: new URL("https://optify360.vercel.app"),
  openGraph: {
    title: "Optify360 | Elite Software Engineering & Digital Growth Systems",
    description: "High-end custom software development, technical SEO, and intelligent workflow automation designed to maximize business revenue.",
    url: "https://optify360.vercel.app",
    siteName: "Optify360",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Optify360 - Custom SaaS Development, Technical SEO & AI Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optify360 | Elite Software Engineering & Digital Growth Systems",
    description: "High-end custom software development, technical SEO, and intelligent workflow automation designed to maximize business revenue.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    other: {
      "msvalidate.01": ["71670B3E3740B9FC63A0243268DDD757"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Optify360",
    "url": "https://optify360.vercel.app",
    "logo": "https://lh3.googleusercontent.com/a/ACg8ocLIBL0-kfIXrdOvJzF8t4I_wTT_YiHH0AvthkMfKd8ZWVv7hc0=s360-c-no",
    "description": "Optify360 builds high-performance custom SaaS platforms, automates business workflows with AI agents, and executes technical SEO strategies that drive enterprise growth. Led by Md Arsalan.",
    "founder": {
      "@type": "Person",
      "name": "Md Arsalan",
      "url": "https://mdarsalan.vercel.app",
      "image": "https://media.licdn.com/dms/image/v2/D4D03AQHIE7r-qR8DEA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1685817504775?e=2147483647&v=beta&t=Saj7Y97G4vqro-E134AFloMbU_MCG1Kc6qFM8z6Nx04",
      "sameAs": "https://www.instagram.com/optify360.official/",
      "jobTitle": "COO",
      "worksFor": {
        "@type": "Organization",
        "name": "studycubs"
      }
    },
    "sameAs": [
      "https://www.instagram.com/optify360.official/"
    ]
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body className="bg-bg text-text-main min-h-screen flex flex-col selection:bg-primary-orange/30 selection:text-text-main">
        <SmoothScroll>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LH4M28WJBY"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LH4M28WJBY');`}
        </script>
      </body>
    </html>
  );
}
