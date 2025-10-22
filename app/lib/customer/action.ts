"use server";

import { EmailState } from "./definitions";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

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
    // ✅ Directly send the email here (no fetch)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOptions: Mail.Options = {
      from: email,
      to: process.env.NODEMAILER_USER,
      subject: `Bonsai Inquiry from ${firstName} ${lastName}`,
      text: `
      📩 You’ve received a new message from your customer form!
      
      Name: ${firstName} ${lastName}
      Email: ${email}
      Contact Number: ${contact}
      Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return { errors: {}, errorMessage: null };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      errors: {},
      errorMessage: "Something went wrong while sending email.",
    };
  }
}
