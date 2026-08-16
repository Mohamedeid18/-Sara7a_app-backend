import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "../../config/configService.js";

export async function sendEmail({ to,html,subject,text,cc,bcc,attachments}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"Route Academy" <${USER_EMAIL}>`,
      to,
      html,
      subject,
      text,
      cc,
      bcc,
      attachments
    });
    console.log(`send email ${info.messageId}`)
  } catch (error) {
    console.log(`Error while sending Email:${error}`)
  }
}
export const emailSubject = {
  confirmEmail:"Confirm Your Email",
  resetPassword:"Reset Your Password",
  welcome:"Welcome to Route Academy",
  contactUs:"Contact Us"
}
