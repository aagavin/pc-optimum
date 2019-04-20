import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.pcOptimum = async (event: { username: string; password: string; }) => {
    const pdf_path: string = await getPDFPath(event.username, event.password);
    return {
        emailId: await sendEmail(pdf_path, event.username),
        sentTo: process.env.E_TO
    }
};
