import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_eF7mm7Pb_6UuxnKxnhEFRThqWP1fwXzj9";
export const resend = new Resend(apiKey);
