import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.handler = async (event) => {
  const pdf_path: string = await getPDFPath(process.env.PC_USERNAME, process.env.PC_PASSWORD);
  return {
    statusCode: 200,
    body: {
      emailId: await sendEmail(pdf_path, process.env.PC_USERNAME),
      sentTo: process.env.E_TO
    }
  }
};

this.handler();