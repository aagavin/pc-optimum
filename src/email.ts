import nodemailer = require('nodemailer');
import { MailOptions } from "nodemailer/lib/smtp-pool";


export const sendEmail = async (pdfPath: string, username: string): Promise<string> => {

    const transporter = nodemailer.createTransport({
        service: "FastMail", // no need to set host or port etc.
        auth: {
            user: process.env.E_USERNAME,
            pass: process.env.E_PASSWORD
        }
   });


    const mailOptions: MailOptions = {
        from: process.env.E_FROM,
        to: process.env.E_TO,
        subject: 'PC Optimum points',
        text: `PC Optimum points for ${username}`,
        attachments: [{ path: pdfPath }]
    }


    // send email
    console.info('sending mail using');
    try {
        const mail = await transporter.sendMail(mailOptions);
        console.info('Message sent: %s to %s', mail.messageId, process.env.E_TO);
        return mail.messageId;
    }
    catch (err) { console.error(err) }

}
