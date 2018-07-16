import { Page, Browser, ElementHandle } from "puppeteer";
import puppeteerLambda = require('puppeteer-lambda');

console.log('Loading function');

const URL: string = "https://www.pcoptimum.ca/login";
const EMAIL_INPUT: string = "#email";
const PASS_INPUT: string = "#password";
const SIGNIN_BUTTON: string = ".button--block";

exports.handler = async (event, context) => {
    const browser: Browser = await puppeteerLambda.getBrowser({
        headless: true
    });

    const page: Page = await browser.newPage();
    await page.goto(URL);
    await page.click(EMAIL_INPUT);
    await Promise.all([
        await page.type(EMAIL_INPUT, "hello")
    ]);

    await page.click(PASS_INPUT)
    await Promise.all([
        await page.type(PASS_INPUT, "Password")
    ]);

    await page.click(SIGNIN_BUTTON);
    
    return event.key1;  // Echo back the first key value
};
