import { Page, Browser, ElementHandle } from "puppeteer";
import puppeteerLambda = require('puppeteer-lambda');


export const getPDFPath = async () => {
    // puppeteer constants
    const URL: string = "https://www.pcoptimum.ca/login";
    const EMAIL_INPUT: string = "#email";
    const PASS_INPUT: string = "#password";
    const PDF_PATH: string = `/tmp/pc-points-${(new Date).toDateString().replace(/ /g, '-')}.pdf`;


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


    await page.evaluate(() => (document.querySelector('button[type=submit]') as HTMLElement).click());

    await page.waitFor(3000);

    console.log('getting pdf');
    await page.emulateMedia('screen');
    await page.evaluate(() => {
        (document.getElementsByClassName('menu').item(0) as HTMLElement).style.display = 'None';
        return;
    });
    await page.pdf({ path: PDF_PATH, printBackground: true, displayHeaderFooter: false });
    await page.close();
    await browser.close();


    return PDF_PATH;

}