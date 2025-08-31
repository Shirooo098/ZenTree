"user server";

import transporter from "../lib/nodemailer";

const styles = {
    container: 'max-width: 500px; margin: 20px auto; padding: 20px, border: 1px solid #000; border-radius:6px;',
    header: 'font-size: 20px; color:#333;',
    paragraph: 'font-size: 16px;',
    link: 'display: inline-block; margin-top:15 px; padding: 10px; background: #007bff; color: #fff; text-decoration:none; border-radius: 4px;'
}

export async function sendEmailAction({
    to,
    subject,
    meta,

}: {
    to: string,
    subject: string,
    meta: {
        description: string,
        link: string
    }
}) {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to,
        subject: `ZenTree - ${subject}`,
        html:`
            <div style="${styles.container}">
                <h1 style="${styles.header}">${subject}</h1>
                <p style="${styles.paragraph}">${meta.description}</p>
                <a href="${meta.link}" styles="${styles.link}">CLick Here</a>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions)
        return { success: true}
    } catch (error) {
        console.error("Send Email Action", error)
        return { success: false }
    }
}