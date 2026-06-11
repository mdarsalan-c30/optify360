import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions | Optify360",
  description: "Read the terms of service governing the use of the Optify360 website and consulting services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-4 mb-8">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-invert max-w-none text-text-muted space-y-6 text-sm md:text-base leading-relaxed">
            <p><strong>Last Updated: June 11, 2026</strong></p>
            
            <p>
              Welcome to <strong>Optify360</strong>. These terms and conditions outline the rules and regulations for the use of Optify360's Website and digital consulting services, located at <a href="https://optify360.vercel.app" className="text-primary-orange hover:underline">optify360.vercel.app</a>.
            </p>

            <p>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Optify360 if you do not agree to all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">1. Definitions</h2>
            <p>
              "The Agency", "Optify360", "We", "Our", and "Us" refers to our business, founded by Md Arsalan. "Client", "You", and "Your" refers to you, the person accessing this website and accepting the Company's terms and conditions.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">2. Professional Services & Consulting</h2>
            <p>
              All technical solutions, SaaS developments, AI integrations, and technical SEO engagements are subject to detailed statements of work (SOW) executed separately. The materials and information presented on this website are for marketing and portfolio demonstration purposes (referencing Md Arsalan's software works, also seen on his personal portfolio <a href="https://mdarsalan.vercel.app" className="text-primary-orange hover:underline">mdarsalan.vercel.app</a>).
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">3. Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, Optify360 and/or its licensors own the intellectual property rights for all material on Optify360. All intellectual property rights are reserved. You may view and/or print pages from https://optify360.vercel.app for your own personal use subject to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republish material from our website.</li>
              <li>Sell, rent, or sub-license material from our website.</li>
              <li>Reproduce, duplicate, or copy material from our website.</li>
              <li>Redistribute content from Optify360 (unless content is specifically made for redistribution).</li>
            </ul>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">4. User Content & Contact Submissions</h2>
            <p>
              Users are responsible for ensuring that all data submitted through our forms (leads, contacts) is accurate, truthful, and does not violate any third-party rights or spam regulations. We reserve the right to delete database entries or reject consultations from users who supply malicious inputs.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">5. Disclaimer & Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. We do not warrant that the information on this website is completely correct or that the website will remain available at all times.
            </p>
            <p>
              Optify360 will not be liable for any consequential or indirect loss or damage arising under or in connection with the use of our website or related marketing materials.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of New Delhi, India.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
