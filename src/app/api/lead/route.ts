import { NextResponse } from "next/server";
import { saveLeadSubmission } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate inputs
    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    // Save to Firebase Firestore "leads" collection
    const result = await saveLeadSubmission({
      email,
      source: source || "Newsletter Signup",
    });

    return NextResponse.json({
      success: true,
      message: "Lead successfully saved to database.",
      docId: result.id,
    });
  } catch (error: any) {
    console.error("Error in lead route handler:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
