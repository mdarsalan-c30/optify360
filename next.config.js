// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable the app directory (Next 13+). Not required for newer versions but kept for safety.
  experimental: {
    appDir: true,
  },
  // Expose needed env vars to the client side.
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dakusigxm",
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "optify360",
    // Add any Firebase env vars you use in the project (placeholders).
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  images: {
    // Allow Cloudinary domains for next/image if used elsewhere.
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
