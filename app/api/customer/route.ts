import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, contact, message } = await req.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const transport = nodemailer.createTransport({
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

    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
