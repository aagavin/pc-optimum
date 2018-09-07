import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.pcOptimum = async (req, res) => {
    const pdf_path: string = await getPDFPath(req.body.username, req.body.password);
    return await sendEmail(pdf_path);
};
