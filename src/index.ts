import { getPDFPath } from "./puppeteer";
import { sendEmail } from "./email";

console.log('Loading function');

exports.pcOptimum = async (req, res) => {
    const pdf_path: string = await getPDFPath(req.body.username, req.body.password);
    // return res.send(await sendEmail(pdf_path));
    return res.send({
        emailId: await sendEmail(pdf_path),
        sentTo: process.env.E_TO
    })
};
