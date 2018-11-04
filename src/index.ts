import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.pcOptimum = async (event) => {
    const pdf_path: string = await getPDFPath(event.username, event.password);
    // return res.send(await sendEmail(pdf_path));
    return {
        emailId: await sendEmail(pdf_path, event.username),
        sentTo: process.env.E_TO
    }
};
