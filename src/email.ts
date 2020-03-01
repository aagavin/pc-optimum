import nodemailer = require('nodemailer');
import { MailOptions } from 'nodemailer/lib/smtp-pool';
import { unlinkSync } from "fs";

export const sendEmail = async (pdfPath: string): Promise<string> => {
  const transporter = nodemailer.createTransport({
    service: 'FastMail', // no need to set host or port etc.
    auth: {
      user: process.env.E_USERNAME,
      pass: process.env.E_PASSWORD
    }
  });

  const mailOptions: MailOptions = {
    from: process.env.E_FROM,
    bcc: process.env.E_TO,
    subject: 'PC Optimum points',
    text: `PC Optimum points for ${process.env.username}`,
    attachments: [{ path: pdfPath }]
  };

  // send email
  console.info('sending mail using');
  try {
    const mail = await transporter.sendMail(mailOptions);
    console.info('Message sent: %s to %s', mail.messageId, process.env.E_TO);
    unlinkSync(pdfPath);
    console.info('deleteing pdf file');
    return mail.messageId;
  } catch (err) {
    console.error(err);
  }
  finally {
    return '';
  }
};
