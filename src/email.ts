import nodemailer = require('nodemailer');
import { MailOptions } from 'nodemailer/lib/smtp-pool';
import { unlinkSync } from 'fs';

export const sendEmail = async (pdfPath: string | Error): Promise<string> => {

  const transporter = nodemailer.createTransport({
    service: 'FastMail', // no need to set host or port etc.
    auth: {
      user: process.env.E_USERNAME,
      pass: process.env.E_PASSWORD
    }
  });

  const mailOptions: MailOptions = {
    from: process.env.E_FROM
  };

  if (typeof pdfPath === "string") {
    mailOptions.bcc = process.env.E_TO;
    mailOptions.subject = 'PC Optimum points';
    mailOptions.text = `PC Optimum points for ${process.env.username}`;
    mailOptions.attachments = [{ path: pdfPath }];
  }
  else {
    mailOptions.to = process.env.E_USERNAME;
    mailOptions.subject = 'PC Optimum points ERROR';

    mailOptions.html = `
    <h3>ERROR --> PC Optimum points for ${process.env.username}</h3><br />
    <pre>${JSON.stringify(pdfPath, null, 2)}</pre><br />
    <p>message: ${pdfPath.message}</p><br />
    `;
  }

  // send email
  console.info('sending mail using');
  try {
    const mail = await transporter.sendMail(mailOptions);
    console.info('Message sent: %s to %s', mail.messageId, process.env.E_TO);
    typeof pdfPath === 'string' && unlinkSync(pdfPath);
    console.info('deleteing pdf file');
    process.exit(0);
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
