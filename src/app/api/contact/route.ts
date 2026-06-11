import { NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, service } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Save to Firebase Firestore
    const firebaseResult = await saveContactSubmission({
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
      service: service || "General Inquiry",
      source: "Contact Form"
    });

    return NextResponse.json({
      success: true,
      message: "Submission received and saved to database.",
      docId: firebaseResult.id || null
    });

  } catch (error: any) {
    console.error("Error in contact route handler:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
