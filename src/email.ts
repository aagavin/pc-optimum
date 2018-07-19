import nodemailer = require('nodemailer');
import { MailOptions } from "nodemailer/lib/smtp-pool";


export const sendEmail = async (pdfPath: string): Promise<string> => {

    // nodemailer constants
    let transporter = nodemailer.createTransport({
        host: process.env.E_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.E_USERNAME,
            pass: process.env.E_PASSWORD
        }
    });


    let mailOptions: MailOptions = {
        from: process.env.E_FROM,
        to: process.env.E_TO,
        subject: process.env.E_Subject,
        text: process.env.E_Subject,
        attachments: [{ path: pdfPath }]
    }


    // send email
    console.log('sending mail');
    let mail = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', mail.messageId);

    return mail.messageId;
    
}