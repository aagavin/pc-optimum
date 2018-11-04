import { Page, Browser } from "puppeteer";
import puppeteer = require('puppeteer');
import { getLaunchConfig } from "./launchConfig";

export const getPDFPath = async (username, password) => {
    // puppeteer constants
    const URL: string = "https://www.pcoptimum.ca/login";
    const EMAIL_INPUT: string = "#email";
    const PASS_INPUT: string = "#password";
    const PDF_PATH: string = `/tmp/pc-points-${(new Date()).toDateString().replace(/ /g, '-')}.pdf`;


    const browser: Browser = await puppeteer.launch(getLaunchConfig());

    let page: Page;
    try {
        console.info('opening new tab');
        page = await browser.newPage();
        await page.setCacheEnabled(false);
        await page.setViewport({ 'width': 1920, 'height': 1080 });
    }
    catch (err) {
        console.error(err);
    }

    console.info('going to url');

    await page.goto(URL, { waitUntil: 'networkidle0' });
    console.info('went to url');

    console.info('logging in to pc w/%s, %s', username, password);
    await page.type(EMAIL_INPUT, username);
    await page.waitFor(200);
    await page.type(PASS_INPUT, password);
    await page.waitFor(200);
    await page.focus('#login > button');

    console.info('clicking submit button')
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#login > button')
    ]);


    await page.waitFor(3000);
    await page.evaluate(() => {
        return window.onload = () => {
            return;
        }
    });

    console.info('getting pdf');
    await page.emulateMedia('screen');
    await page.evaluate(() => {
        (document.getElementsByClassName('menu').item(0) as HTMLElement).style.display = 'None';
        (document.getElementsByClassName('site-footer').item(0) as HTMLElement).style.display = 'None';
        return;
    });
    await page.pdf({ path: PDF_PATH, printBackground: true, displayHeaderFooter: false });
    console.info('got pdf and closeing pdf');
    await page.close();
    await browser.close();

    return PDF_PATH;

}