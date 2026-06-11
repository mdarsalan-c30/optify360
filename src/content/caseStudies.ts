export interface Metric {
  value: number;
  suffix: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  clientName: string;
  industry: string;
  datePublished: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: Metric[];
  image: string;
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "climateverse",
    slug: "climateverse",
    title: "ClimateVerse: Visualizing Global Climate Trends in Real-Time",
    subtitle: "Scaling high-fidelity interactive data visualizations for researchers and climate activists.",
    clientName: "ClimateVerse Foundation",
    industry: "Environmental Tech & Research",
    datePublished: "2026-03-15",
    summary: "ClimateVerse maps global greenhouse gas emissions and surface temperature anomalies across 150 years of data. We re-engineered their data rendering pipelines to support real-time geospatial visualizations at scale.",
    challenge: "Climate datasets are extremely large and multi-dimensional. The legacy platform relied on standard SVG-based charts which crashed mobile devices and choked desktop browsers when visualizing more than 10,000 data points concurrently. Researchers struggled to overlay multiple variables (CO2, temperature, precipitation) without experiencing severe lag.",
    solution: "We engineered a lightweight Canvas and WebGL-based charting pipeline integrated with Next.js Server Components. Geospatial datasets were indexed client-side using a spatial R-tree, and data was streamed in compressed binary format. This allowed us to filter and render over 10 million data points on the fly.",
    result: "The platform achieved a buttery-smooth 60fps interactive visualization performance on standard mobile browsers. Page load time dropped by 82% (under 1.2s), and server bandwidth consumption decreased by 50% due to binary serialization.",
    metrics: [
      { value: 95, suffix: "%", label: "Faster Render Time" },
      { value: 10, suffix: "M+", label: "Data Points Visualized" },
      { value: 50, suffix: "%", label: "Reduction in Server Load" }
    ],
    image: "/images/case-studies/climateverse.jpg",
    tags: ["WebGL", "Data Visualization", "Next.js", "GIS"]
  },
  {
    id: "pdfverse",
    slug: "pdfverse",
    title: "PDFVerse: Transforming PDF Interactions with AI Search",
    subtitle: "Enabling semantic document search and intelligence for enterprise-scale files.",
    clientName: "PDFVerse Inc.",
    industry: "Enterprise SaaS & AI",
    datePublished: "2026-04-22",
    summary: "PDFVerse allows enterprises to chat with their complex internal documentation. We designed and built their semantic AI parsing and retrieval pipeline to deliver sub-second response times.",
    challenge: "Enterprises upload PDFs containing multi-page layouts, embedded complex tables, and architectural diagrams. Traditional text extraction programs lost structural layout hierarchy, causing vector databases to retrieve irrelevant text blocks and resulting in inaccurate AI answers.",
    solution: "We implemented a custom multi-modal visual document parser that keeps layout relationships intact. Using a sliding-window semantic chunking strategy, we mapped tables and figures to distinct vector blocks in a LlamaIndex structure, followed by an optimized hybrid search index using Pgvector.",
    result: "Semantic search accuracy improved to 98% for multi-page documents. Processing speeds for multi-hundred page documents dropped to under 5 seconds, enabling zero-lag enterprise intelligence queries.",
    metrics: [
      { value: 98, suffix: "%", label: "Search Accuracy" },
      { value: 4, suffix: ".8s", label: "Avg. Document Processing Speed" },
      { value: 250, suffix: "K+", label: "Documents Summarized" }
    ],
    image: "/images/case-studies/pdfverse.jpg",
    tags: ["LLMs", "LlamaIndex", "Pgvector", "Next.js"]
  },
  {
    id: "mynra-ai",
    slug: "mynra-ai",
    title: "Mynra AI: Custom Predictive Models for E-Commerce",
    subtitle: "Automating checkout prediction and recommendation pipelines at scale.",
    clientName: "Mynra AI",
    industry: "E-Commerce & Machine Learning",
    datePublished: "2026-05-10",
    summary: "Mynra AI delivers hyper-personalized product recommendation models for fast-fashion e-commerce. We built their low-latency edge inference engine and optimized user funnel.",
    challenge: "High cart-abandonment rate was driven by slow recommendation modules. The client's existing recommendation APIs took over 800ms to respond, causing visual layout shifts (CLS) and user dropouts on high-traffic product pages.",
    solution: "We designed an edge-cached recommendation router using Rust and deployed it to Cloudflare Workers. It evaluates client context signals (current path, geography, device type) and matches them against pre-calculated matrix models stored in a distributed key-value store, bypassing slow database roundtrips.",
    result: "Inference latency plummeted to a consistent 30ms. Re-architecting the checkout recommendation funnel led to a 42% spike in the add-to-cart rate and a 3.5x return on ad spend (ROAS).",
    metrics: [
      { value: 42, suffix: "%", label: "Increase in Add-To-Cart Rate" },
      { value: 30, suffix: "ms", label: "Recommendation API Latency" },
      { value: 3, suffix: ".5x", label: "ROI on Ad Campaigns" }
    ],
    image: "/images/case-studies/mynra-ai.jpg",
    tags: ["Rust", "Cloudflare Workers", "Edge Computing", "Personalization"]
  },
  {
    id: "studycubs",
    slug: "studycubs",
    title: "StudyCubs: Gamified Learning Platform for K-12 Students",
    subtitle: "Fostering remote learning engagement through real-time rewards and adaptive quizzes.",
    clientName: "StudyCubs Academy",
    industry: "EdTech & Gamification",
    datePublished: "2026-05-30",
    summary: "StudyCubs makes learning math and science fun for school students. We helped them architect and build their core interactive gamification dashboard and real-time multiplayer quiz engine.",
    challenge: "Retaining student attention during self-paced remote learning is a massive challenge. Students using the early MVP dropped off after completing just one quiz, leading to poor learning outcomes and low subscription renewals.",
    solution: "We designed a multiplayer quest-like dashboard with interactive avatars and animated accomplishments. Quizzes were modified to adjust dynamically to the student's skill level. We utilized WebSockets for real-time multiplayer lobbies and SVG morphing path animations to show character progression.",
    result: "Student weekly engagement surged to 88%. The platform has successfully powered over 2 million completed quizzes, maintaining a stellar rating on the app stores.",
    metrics: [
      { value: 88, suffix: "%", label: "Weekly Active Engagement" },
      { value: 2, suffix: "M+", label: "Quizzes Completed" },
      { value: 4, suffix: ".9/5", label: "App Store Rating" }
    ],
    image: "/images/case-studies/studycubs.jpg",
    tags: ["WebSockets", "SVG Animation", "EdTech", "Tailwind CSS"]
  }
];
