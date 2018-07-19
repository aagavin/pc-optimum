import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.handler = async (event, context) => {
    const pdf_path: string = await getPDFPath();
    return await sendEmail(pdf_path);
};
