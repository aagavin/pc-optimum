import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.pcOptimum = async (username, password) => {
    const pdf_path: string = await getPDFPath(username, password);
    // return res.send(await sendEmail(pdf_path));
    return {
        emailId: await sendEmail(pdf_path),
        sentTo: process.env.E_TO
    }
};
