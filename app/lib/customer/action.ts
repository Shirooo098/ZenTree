"use server";

import { EmailState } from "./definitions";

export async function submitEmail(
  prevState: EmailState,
  formData: FormData
): Promise<EmailState> {
  // Extract form data
  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const contact = formData.get("contact")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  // Validation
  const errors: EmailState["errors"] = {};
  if (!firstName) errors.firstName = ["First name is required"];
  if (!email || !email.includes("@")) errors.email = ["Valid email required"];
  if (!message) errors.message = ["Message cannot be empty"];

  if (Object.keys(errors).length > 0) {
    return { errors, errorMessage: "Please fix the fields below." };
  }

  try {
    // Send email via API route
    const res = await fetch('http://localhost:3000/api/customer', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, contact, message }),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        errors: {},
        errorMessage: result.error || "Failed to send email.",
      };
    }

    console.log("Email sent:", result);
    return { errors: {}, errorMessage: null };
  } catch (error) {
    console.error("Submit Email Error:", error);
    return {
      errors: {},
      errorMessage: "Something went wrong while sending email.",
    };
  }
}
