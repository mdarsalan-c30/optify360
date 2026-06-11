import React from 'react';

export function OrganizationSchema({
  name = "optify360",
  url = "https://optify360.com",
  logo = "https://optify360.com/logo.png",
  sameAs = [],
  contactPoint = []
}: {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string[];
  }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "sameAs": sameAs,
    ...(contactPoint.length > 0 && {
      "contactPoint": contactPoint.map(cp => ({
        "@type": "ContactPoint",
        "telephone": cp.telephone,
        "contactType": cp.contactType,
        ...(cp.areaServed && { "areaServed": cp.areaServed }),
        ...(cp.availableLanguage && { "availableLanguage": cp.availableLanguage })
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  questions
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CaseStudySchema({
  title,
  description,
  url,
  image,
  clientName,
  industry,
  datePublished
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  clientName: string;
  industry?: string;
  datePublished: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "url": url,
    "image": image,
    "datePublished": datePublished,
    "publisher": {
      "@type": "Organization",
      "name": "optify360",
      "logo": {
        "@type": "ImageObject",
        "url": "https://optify360.com/logo.png"
      }
    },
    "author": {
      "@type": "Person",
      "name": "Md Arsalan"
    },
    "about": [
      {
        "@type": "Thing",
        "name": clientName
      },
      ...(industry ? [{
        "@type": "Thing",
        "name": industry
      }] : [])
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  image,
  url,
  authorName = "Md Arsalan",
  authorUrl = "https://optify360.com/about"
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  authorName?: string;
  authorUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "image": image ? [image] : [],
    "url": url,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "optify360",
      "logo": {
        "@type": "ImageObject",
        "url": "https://optify360.com/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
