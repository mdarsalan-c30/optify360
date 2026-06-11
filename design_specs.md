# Optify360 Premium UI Design Specifications

This document outlines the precise visual specifications, components, layout parameters, and animation variables for the **Optify360** website. 

Developers and copywriters should reference this file to maintain absolute design consistency, premium dark-mode styling, and ultra-smooth performance-oriented interactions.

---

## 🎨 Global Visual Tokens

### 1. Color System (Premium Dark Theme)
The site is built on a dark canvas using deep, matte-black shades paired with vibrant, energetic orange accents to draw focus to conversion actions and highlight interactive structures.

| Token | CSS Variable / Tailwind class | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Background** | `var(--color-bg)` / `bg-bg` | `#050505` | Primary body background. Deep, non-harsh pure black. |
| **Surface** | `var(--color-surface)` / `bg-surface` | `#111111` | Card backgrounds, sections background, input fields. |
| **Primary Orange** | `var(--color-primary-orange)` / `bg-primary-orange` | `#FF6B00` | Primary buttons, active highlights, key brand graphics. |
| **Secondary Orange** | `var(--color-secondary-orange)` / `bg-secondary-orange` | `#FF8C42` | Gradient overlays, hover accents, subtle ambient glows. |
| **Text Main** | `var(--color-text-main)` / `text-text-main` | `#F5F5F5` | Off-white reading text for high-contrast accessibility. |
| **Text Muted** | `var(--color-text-muted)` / `text-text-muted` | `#A0A0A0` | Descriptive paragraph text, labels, footers. |

---

### 2. Typography
We use **Outfit** for all headings to establish a bold, geometric, tech-forward feel, paired with **Geist Sans** (default Next.js sans font) for highly readable body copy.

*   **Headings Font:** `Outfit` (weights: `400, 500, 600, 700, 800`)
*   **Body Font:** `Geist Sans` (weights: `300, 400, 500`)

#### Tailwind v4 Theme Configuration Setup (`src/app/globals.css`):
```css
@import "tailwindcss";

:root {
  --background: #050505;
  --foreground: #F5F5F5;
}

@theme {
  --color-bg: #050505;
  --color-surface: #111111;
  --color-primary-orange: #FF6B00;
  --color-secondary-orange: #FF8C42;
  --color-text-main: #F5F5F5;
  --color-text-muted: #A0A0A0;
  
  --font-heading: var(--font-outfit), sans-serif;
  --font-sans: var(--font-geist-sans), sans-serif;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-main);
  font-family: var(--font-sans);
}
```

#### Font Loading in Root Layout (`src/app/layout.tsx`):
```typescript
import { Outfit, Geist } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistSans.variable} antialiased`}>
      <body className="bg-bg text-text-main min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
```

---

### 3. Layout Grid & Spacing Constraints

To ensure consistency across device form factors, use these spacing guidelines:

*   **Max Width:** Layout wrapper constrained to `1280px` (`max-w-7xl mx-auto`).
*   **Horizontal Padding:** `24px` (`px-6` on mobile/tablet, adaptive standard centering).
*   **Vertical Section Spacing:**
    *   **Desktop:** `120px` gap (`py-30` or `py-[120px]`).
    *   **Tablet:** `80px` gap (`py-20` or `py-[80px]`).
    *   **Mobile:** `64px` gap (`py-16` or `py-[64px]`).

---

## 🧱 Component Blueprint & Styling Specs

### 1. Sticky Glassmorphic Navbar
A highly responsive navbar that blends into the background content as users scroll, prioritizing conversion CTAs and brand identity.

*   **Layout:** Horizontal flexbox (`flex justify-between items-center h-20 px-6 md:px-8 max-w-7xl mx-auto`).
*   **Positioning:** Sticky top (`sticky top-0 w-full z-50 transition-all duration-300`).
*   **Styling Specs:**
    *   *Default (Scrolled):* `bg-bg/75 backdrop-blur-md border-b border-white/[0.05] shadow-lg shadow-black/20`.
    *   *Default (At Top):* `bg-transparent border-b border-transparent`.
*   **Interaction Detail:** Navigation link hovers should display a subtle orange indicator or fade to orange (`hover:text-primary-orange transition-colors duration-200`).
*   **Mobile Variant:** A full-width hamburger drop-down menu that slides down using Framer Motion with an overlay filter (`backdrop-blur-lg bg-bg/95`).

---

### 2. Two-Column Immersive Hero Section
The hero introduces the brand with an ultra-premium layout. It positions strong copy on the left and a captivating dynamic interactive mockup/dashboard glow on the right.

*   **Layout Grid:** `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[90vh] py-20`.
*   **Left Column (Typography & Call to Action - Column span: 7):**
    *   **Eyebrow tag:** A rounded pill reading "AI-Powered Conversions" using `text-primary-orange text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full inline-flex`.
    *   **Heading:** `text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-none text-text-main`. Highlight key words with gradient text: `bg-gradient-to-r from-primary-orange to-secondary-orange bg-clip-text text-transparent`.
    *   **Description:** `text-lg md:text-xl text-text-muted mt-6 max-w-xl leading-relaxed`.
    *   **CTA Group:** Flexbox with spacing.
        *   *Primary button:* `bg-primary-orange hover:bg-primary-orange/90 text-text-main font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-orange/20`.
        *   *Secondary button:* `border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] text-text-main px-8 py-4 rounded-xl transition-all duration-200`.
*   **Right Column (Interactive Dashboard Glow - Column span: 5):**
    *   A simulated SaaS dashboard featuring custom charts (recharts or SVG lines) encased inside a premium glass frame.
    *   **Ambient Glow:** Radial gradients behind the panel: `absolute -inset-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-full blur-[100px] opacity-20 pointer-events-none`.
    *   **Card design:** Glass panel with `backdrop-blur-md bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50`.

---

### 3. Bento Grid for Services
A modern, asymmetrical layout grouping Optify360's core services. Different sizes create structural rhythm.

```
+--------------------------------------+--------------------------------------+
| Card 1 (Span 2)                      | Card 2 (Span 1)                      |
| Title: Conversions Optimization      | Title: Smart Insights                |
| Custom analytics chart widget        | Glowing status indicator widget      |
+--------------------------------------+--------------------------------------+
| Card 3 (Span 1)                      | Card 4 (Span 2)                      |
| Title: High-Speed Funnels            | Title: Growth Marketing              |
| Speed dial mockup                    | Detailed client pipeline tracker     |
+--------------------------------------+--------------------------------------+
```

*   **Layout:** CSS Grid configuration `grid grid-cols-1 md:grid-cols-3 gap-6`.
*   **Card Styling:**
    *   `bg-surface border border-white/[0.05] rounded-[24px] p-8 relative overflow-hidden group transition-all duration-300`.
    *   **Interactive Spotlight Hover Effect:**
        A Javascript/CSS spotlight effect tracking the user's cursor. Or, use a static background glow layer that highlights on hover:
        ```css
        /* Add to Card wrapper on hover */
        group-hover:border-primary-orange/30 group-hover:shadow-[0_0_30px_rgba(255,107,0,0.1)]
        ```
    *   *Hover lift animation:* Dynamic translate-y transition (`group-hover:-translate-y-2 transition-all duration-300 ease-out`).
*   **Inner Card Widgets:** Small custom UI representations corresponding to the service (e.g. animated lines, glowing indicators, conversion stats counter).

---

### 4. Masonry Portfolio Showcase
A masonry layout displaying successful client case studies. It features varying grid spans to break symmetry.

*   **Layout:** Adaptive grid configuration:
    ```css
    /* Grid system using CSS Columns or Tailwind Grid Spans for masonry */
    grid grid-cols-1 md:grid-cols-2 gap-8
    ```
    (Note: Alternate card sizes by using classes like `h-[380px]` and `h-[480px]` dynamically in mapping lists).
*   **Card Specifications:**
    *   Relative wrapper with `overflow-hidden rounded-2xl border border-white/[0.05] aspect-[4/3] md:aspect-auto`.
    *   Image zoom effect: `scale-100 group-hover:scale-105 transition-transform duration-500 ease-out`.
    *   **Overlay Design:** A gradient layer at the bottom (`bg-gradient-to-t from-black via-black/40 to-transparent absolute inset-0 opacity-80 group-hover:opacity-95 transition-opacity duration-300`).
    *   **Card Metadata (Visible on Hover / Always visible on Mobile):**
        *   Title: Outfit font, `text-xl font-bold`.
        *   Subtitle/Category: `text-xs uppercase text-primary-orange font-semibold tracking-widest`.
        *   Result metric (e.g. "+140% ROAS"): Positioned in the top-right corner inside a sleek glass pill.

---

### 5. High-Contrast Glassmorphic Testimonials
Social proof cards featuring translucent properties, deep backdrop blur, and gradient borders.

*   **Layout:** CSS Flex or horizontal flex-marquee (`flex flex-wrap lg:grid lg:grid-cols-3 gap-6`).
*   **Card Styling:**
    *   `bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 relative shadow-xl`.
    *   **Light Glow Accent:** A top-left gradient border or glow node emphasizing the glass card border.
*   **Content Layout:**
    *   **Quotes icon:** A styled double quotes svg in `text-primary-orange/20 text-4xl font-serif absolute top-6 right-8`.
    *   **Testimonial text:** `text-text-main/90 italic leading-relaxed text-sm md:text-base`.
    *   **Author Profile:** Flex layout at the bottom:
        *   *Avatar:* Image inside `w-12 h-12 rounded-full border border-primary-orange/40 p-0.5`.
        *   *Name:* Outfit font, `text-sm font-bold text-text-main`.
        *   *Role/Company:* `text-xs text-text-muted mt-0.5`.

---

## 🎬 Interaction & Animation Blueprints (Framer Motion)

Animations must feel premium, structural, and clean. All elements should fade-in and scale-in smoothly using the unified custom ease-out curve.

### 1. Motion Settings & Custom Easing

Use the **Ease Out Expo** cubic bezier for high-end web designs:
```typescript
export const transitionPreset = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] // Ease Out Expo
};
```

### 2. Fade-Up Container (Staggered Children)
Apply this variant configuration to section lists (like Bento grid cards or Portfolio items):

```typescript
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

export const fadeUpVariant = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPreset
  }
};
```

### 3. Scale Hover & Image Zoom
*   **Card Hover Motion:**
    ```typescript
    const cardHover = {
      hover: {
        y: -8,
        scale: 1.01,
        borderColor: "rgba(255, 107, 0, 0.2)",
        transition: { duration: 0.4, ease: "easeOut" }
      }
    };
    ```
*   **Image hover-zoom:** CSS transition is preferred for performance:
    `transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) hover:scale-105`

---

## 📋 Implementation Checklist for Developer Agent
*   [ ] Configure `@theme` in `src/app/globals.css` with the visual color variables.
*   [ ] Load the Google font **Outfit** in `src/app/layout.tsx` and pass its variable class.
*   [ ] Set the global layout styles (wrapper max-width `1280px` and adaptive paddings).
*   [ ] Build the glassmorphic sticky Header component with scrolled-state blur toggling.
*   [ ] Implement Hero with left-column copy and right-column animated SVG/mockup element.
*   [ ] Build Bento Grid using CSS Grid layout with hover lifts and spotlight glows.
*   [ ] Implement Portfolio with zoom animations on image blocks.
*   [ ] Set up Testimonials with glassmorphism values and staggered Framer Motion fades.
