import { Page, Browser, ElementHandle } from "puppeteer";
import puppeteerLambda = require('puppeteer-lambda');
import nodemailer = require('nodemailer');
import { MailOptions } from "nodemailer/lib/smtp-pool";

console.log('Loading function');

// puppeteer constants
const URL: string = "https://www.pcoptimum.ca/login";
const EMAIL_INPUT: string = "#email";
const PASS_INPUT: string = "#password";
const SIGNIN_BUTTON: string = ".button--block";
const ELEMENT_WAIT_FOR: string = ".product-offer .offer__image-element--default, .hero-product-offer .offer__image-element--default";
const PDF_NAME: string = `pc-points-${(new Date).toDateString().replace(/ /g, '-')}.pdf`;

// nodemailer constants
let transporter = nodemailer.createTransport({
    host: process.env.E_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.E_USERNAME,
        pass: process.env.E_PASSWORD
    }
});


let mailOptions:MailOptions = {
    from: process.env.E_FROM,
    to: process.env.E_TO,
    subject: process.env.E_Subject,
    text: process.env.E_Subject,
    attachments: [{path: PDF_NAME}]
}

const h = exports.handler = async (event, context) => {
    const browser: Browser = await puppeteerLambda.getBrowser({
        headless: true,
        args: ['--no-sandbox']
    });

    const page: Page = await browser.newPage();
    await page.setViewport({ 'width': 1920, 'height': 1080 });
    await page.goto(URL);
    await page.click(EMAIL_INPUT);

    await Promise.all([
        await page.type(EMAIL_INPUT, process.env.PC_USERNAME)
    ]);

    await page.click(PASS_INPUT)    
    await Promise.all([
        await page.type(PASS_INPUT.toString(), process.env.PC_PASSWORD)
    ]);

    await Promise.all([
        await page.click(SIGNIN_BUTTON),
        await page.waitForNavigation({waitUntil: "networkidle0"})
    ]);

    // await page.waitForSelector(ELEMENT_WAIT_FOR);

    await page.emulateMedia('screen');
    await page.evaluate(()=>{
        (document.getElementsByClassName('menu').item(0) as HTMLElement).style.display = 'None';
        return;
    })
    await page.pdf({path: PDF_NAME, printBackground: true, displayHeaderFooter: false});
    await page.close();
    await browser.close();

    let mail = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', mail.messageId);
    
    return PDF_NAME;
};


h({}, null)
.then(val => console.log(val))
.catch(err => console.log(err))
