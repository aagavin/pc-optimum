import { Page, Browser, ElementHandle } from "puppeteer";
import puppeteerLambda = require('puppeteer-lambda');

console.log('Loading function');

const URL: string = "https://www.pcoptimum.ca/login";
const EMAIL_INPUT: string = "#email";
const PASS_INPUT: string = "#password";
const SIGNIN_BUTTON: string = ".button--block";

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
        await page.type(EMAIL_INPUT, process.env.USERNAME)
    ]);

    await page.click(PASS_INPUT)    
    await Promise.all([
        await page.type(PASS_INPUT.toString(), process.env.PASSWORD)
    ]);

    await Promise.all([
        await page.click(SIGNIN_BUTTON),
        await page.waitForNavigation()
    ]);

    await page.waitFor(1000);

    await page.pdf({path: `pc-points-${(new Date).toDateString().replace(/ /g, '-')}.pdf`, printBackground: true});
    await page.close();
    await browser.close();
    
    return event.key1;  // Echo back the first key value
};


h({'key1': 'sdfdsf'}, null)
.then(val => console.log(val))
.catch(err => console.log(err))