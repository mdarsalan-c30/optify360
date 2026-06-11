import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBvZtbrQ51BLZP4hmOcKwEqWZFlEr6AFCY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "optify360-2895b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "optify360-2895b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "optify360-2895b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "336534198831",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:336534198831:web:72364c650954c5666584da",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LH4M28WJBY"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
  source?: string;
}

export interface LeadSubmission {
  email: string;
  source?: string;
}

/**
 * Saves a contact form submission to the "contacts" collection
 */
export async function saveContactSubmission(submission: ContactSubmission) {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      ...submission,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving contact submission to Firebase:", error);
    throw error;
  }
}

/**
 * Saves a newsletter signup or general lead to the "leads" collection
 */
export async function saveLeadSubmission(submission: LeadSubmission) {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...submission,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving lead to Firebase:", error);
    throw error;
  }
}

/**
 * Retrieves all contact form submissions ordered by creation date
 */
export async function getContacts() {
  try {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const submissions: any[] = [];
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return submissions;
  } catch (error) {
    console.error("Error retrieving contacts from Firebase:", error);
    return [];
  }
}

/**
 * Retrieves all newsletter lead signups ordered by creation date
 */
export async function getLeads() {
  try {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const leads: any[] = [];
    querySnapshot.forEach((doc) => {
      leads.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return leads;
  } catch (error) {
    console.error("Error retrieving leads from Firebase:", error);
    return [];
  }
}

