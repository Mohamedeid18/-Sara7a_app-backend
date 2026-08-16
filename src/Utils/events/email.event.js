import { EventEmitter } from "node:events";
import {sendEmail,emailSubject} from '../emails/email.util.js'
import { template } from './../emails/generateHTML.js';
export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (Data) => {
    try {
        await sendEmail({
        to:Data.to,
        subject: emailSubject.confirmEmail,
        html: template(Data.otp, Data.userName, emailSubject.confirmEmail),
      });
    } catch (error) {
        console.log('Error Sending Email:', error);
    }
});
emailEvent.on("forgetPassword", async (Data) => {
    try {
        await sendEmail({
        to:Data.to,
        subject: emailSubject.resetPassword,
        html: template(Data.otp, Data.userName, emailSubject.resetPassword),
      });
    } catch (error) {
        console.log('Error Sending Email:', error);
    }
});