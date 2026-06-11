import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Optify360",
  description: "Learn about how Optify360 collects, uses, and safeguards your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-4 mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none text-text-muted space-y-6 text-sm md:text-base leading-relaxed">
            <p><strong>Last Updated: June 11, 2026</strong></p>
            
            <p>
              At <strong>Optify360</strong> (founded by Md Arsalan, accessible via <a href="https://optify360.vercel.app" className="text-primary-orange hover:underline">optify360.vercel.app</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Optify360 and how we use it.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">1. Information We Collect</h2>
            <p>
              We collect information in the following ways when you interact with our website:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Forms:</strong> When you contact us using our inquiry forms, we collect your name, email address, phone number, company name, and the contents of your message. This data is securely stored in our Firebase database and forwarded to our official email channels (`optify360official@gmail.com` and `optify360@protonmail.com`) via Resend.</li>
              <li><strong>Newsletter Signups:</strong> When you subscribe to our insights, we collect your email address, stored in our Firestore database leads collection.</li>
              <li><strong>Analytics Data:</strong> We utilize third-party analytics tools (Google Analytics and Microsoft Clarity) to collect logs, IP addresses, browser types, and user interactions to improve our page performance and usability.</li>
            </ul>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">2. How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve, personalize, and expand our website performance and features.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you directly, including responding to inquiries, providing project estimates, and sending newsletters.</li>
              <li>Process and manage client agreements.</li>
            </ul>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">3. Log Files & Cookies</h2>
            <p>
              Optify360 follows a standard procedure of using log files and cookies. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">4. Third-Party Partners</h2>
            <p>
              Our operations rely on selected third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Firebase (Google Cloud):</strong> Cloud hosting, database (Firestore), and secure data logging.</li>
              <li><strong>Resend:</strong> Transactional email delivery and lead forwarding.</li>
              <li><strong>Vercel:</strong> Core web application hosting and serverless hosting routing.</li>
            </ul>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">5. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have rights regarding your personal data, including the right to access, rectify, or request erasure of your personal records. If you wish to query, modify, or delete any contact details submitted through our site, please contact us directly at <a href="mailto:optify360official@gmail.com" className="text-primary-orange hover:underline">optify360official@gmail.com</a>.
            </p>

            <h2 className="text-xl font-bold font-heading text-text-main pt-4">6. Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
