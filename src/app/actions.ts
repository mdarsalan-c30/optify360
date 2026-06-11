"use server";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resend } from "@/lib/resend";

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export interface LeadInput {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget: string;
  details: string;
}

export async function submitContactForm(data: ContactInput) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "Please fill out all required fields." };
    }

    // Save to Firestore
    const contactsRef = collection(db, "contacts");
    await addDoc(contactsRef, {
      ...data,
      company: data.company || "",
      service: data.service || "General Inquiry",
      createdAt: new Date().toISOString(),
    });

    // Send email via Resend
    const recipients = (process.env.RESEND_TO_EMAILS || "optify360@protonmail.com,optify360official@gmail.com")
      .split(",")
      .map(email => email.trim());
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `New Contact Submission from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #0A0A0A; color: #F5F5F5;">
          <h2 style="color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">BLACKHOLE - New Contact Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #A0A0A0;">Name:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Email:</td>
              <td style="padding: 8px 0; color: #F5F5F5;"><a href="mailto:${data.email}" style="color: #FF8C42; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Company:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.company || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Service Category:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.service || "General Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 20px 0 8px 0; font-weight: bold; color: #A0A0A0;" colspan="2">Message:</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-radius: 4px; background-color: #111111; color: #F5F5F5; line-height: 1.6;" colspan="2">
                ${data.message.replace(/\n/g, "<br/>")}
              </td>
            </tr>
          </table>
          <div style="margin-top: 30px; border-top: 1px solid #222; padding-top: 15px; text-align: center; font-size: 12px; color: #A0A0A0;">
            Received at ${new Date().toLocaleString()} | BLACKHOLE Integration System
          </div>
        </div>
      `,
    });

    return { success: true, message: "Thank you! Your message has been sent successfully." };
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: error?.message || "Failed to submit message. Please try again." };
  }
}

export async function submitBudgetCalculator(data: LeadInput) {
  try {
    if (!data.name || !data.email || !data.projectType || !data.budget || !data.timeline) {
      return { success: false, error: "Please fill out all required fields." };
    }

    // Save to Firestore
    const leadsRef = collection(db, "leads");
    await addDoc(leadsRef, {
      ...data,
      company: data.company || "",
      createdAt: new Date().toISOString(),
    });

    // Send email via Resend
    const recipients = (process.env.RESEND_TO_EMAILS || "optify360@protonmail.com,optify360official@gmail.com")
      .split(",")
      .map(email => email.trim());
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `New Project Lead: ${data.projectType} ($${data.budget})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #0A0A0A; color: #F5F5F5;">
          <h2 style="color: #FF6B00; border-bottom: 2px solid #FF6B00; padding-bottom: 10px;">BLACKHOLE - New Lead Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #A0A0A0;">Lead Name:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Email:</td>
              <td style="padding: 8px 0; color: #F5F5F5;"><a href="mailto:${data.email}" style="color: #FF8C42; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Company:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.company || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Project Type:</td>
              <td style="padding: 8px 0; color: #FF8C42; font-weight: bold;">${data.projectType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Estimated Budget:</td>
              <td style="padding: 8px 0; color: #FF6B00; font-weight: bold;">${data.budget}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #A0A0A0;">Launch Timeline:</td>
              <td style="padding: 8px 0; color: #F5F5F5;">${data.timeline}</td>
            </tr>
            <tr>
              <td style="padding: 20px 0 8px 0; font-weight: bold; color: #A0A0A0;" colspan="2">Project Details:</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-radius: 4px; background-color: #111111; color: #F5F5F5; line-height: 1.6;" colspan="2">
                ${data.details ? data.details.replace(/\n/g, "<br/>") : "No details provided."}
              </td>
            </tr>
          </table>
          <div style="margin-top: 30px; border-top: 1px solid #222; padding-top: 15px; text-align: center; font-size: 12px; color: #A0A0A0;">
            Received at ${new Date().toLocaleString()} | BLACKHOLE Integration System
          </div>
        </div>
      `,
    });

    return { success: true, message: "Thank you! Your project request has been submitted successfully." };
  } catch (error: any) {
    console.error("Error submitting budget calculator:", error);
    return { success: false, error: error?.message || "Failed to submit calculator. Please try again." };
  }
}
