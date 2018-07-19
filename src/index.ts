import { Page, Browser, ElementHandle } from "puppeteer";
import puppeteerLambda = require('puppeteer-lambda');
import nodemailer = require('nodemailer');
import { MailOptions } from "nodemailer/lib/smtp-pool";

console.log('Loading function');

// puppeteer constants
const URL: string = "https://www.pcoptimum.ca/login";
const EMAIL_INPUT: string = "#email";
const PASS_INPUT: string = "#password";
const SIGNIN_BUTTON: string = "form > button";
const ELEMENT_WAIT_FOR: string = ".product-offer .offer__image-element--default, .hero-product-offer .offer__image-element--default";
const PDF_NAME: string = `/tmp/pc-points-${(new Date).toDateString().replace(/ /g, '-')}.pdf`;

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

exports.handler = async (event, context) => {
    const browser: Browser = await puppeteerLambda.getBrowser({
        headless: true,
        // args: ['--no-sandbox'],
    });

    console.log('opening new tab');
    const page: Page = await browser.newPage();
    await page.setViewport({ 'width': 1920, 'height': 1080 });
    console.log('going to url');

    await page.goto(URL);
    // await page.waitForNavigation({waitUntil: "networkidle0"});
    console.log('went to url');
    await page.waitForSelector(EMAIL_INPUT);

    await page.type(EMAIL_INPUT, process.env.PC_USERNAME);
    await page.waitFor(200);
    await page.type(PASS_INPUT, process.env.PC_PASSWORD);
    await page.waitFor(200);
    
    
    await page.evaluate(()=> (document.querySelector('button[type=submit]') as HTMLElement).click());

    await page.waitFor(3000);
    
    console.log('getting pdf');
    await page.emulateMedia('screen');
    await page.evaluate(()=>{
        (document.getElementsByClassName('menu').item(0) as HTMLElement).style.display = 'None';
        return;
    });
    await page.pdf({path: PDF_NAME, printBackground: true, displayHeaderFooter: false});
    await page.close();
    await browser.close();

    console.log('sending mail');
    let mail = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', mail.messageId);
    
    return PDF_NAME;
};

// h({},{}).then(val => console.log(val)).catch(err => console.log(err));
