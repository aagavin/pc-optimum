import { Page, Browser } from "puppeteer";
import puppeteer = require('puppeteer');
import { getLaunchConfig } from "./launchConfig";

export const getPDFPath = async (username: string, password: string) => {
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

    console.info('logging in to pc w/ %s', username);
    await page.type(EMAIL_INPUT, username);
    await page.waitFor(200);
    await page.type(PASS_INPUT, password);
    await page.waitFor(200);
    await page.focus('#login > button');

    console.info('clicking submit button');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#login > button')
    ]);

    await page.waitFor(3000);

    console.info('getting pdf');
    await page.emulateMedia('screen');
    await page.addStyleTag({
        content: `
      *,
      *::after,
      *::before {
          transition: none !important
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          animation-delay: -0.0001s !important;
          animation-duration: 0s !important;
          animation-play-state: paused !important;
          caret-color: transparent !important;
      }
    `
    });
    await page.evaluate((username: string) => {
        const menu: HTMLCollection = document.getElementsByClassName('menu');
        const siteFooter: HTMLCollection = document.getElementsByClassName('site-footer');
        const promotedAction: HTMLCollection = document.getElementsByClassName('promoted-action');
        const offersHeaderPoints: HTMLCollection = document.getElementsByClassName('offers-header-points__value');

        document.querySelectorAll('li.invisible-offer').forEach((li: HTMLElement, index) => {
          li.setAttribute('tabindex', index+'');
          li.focus();
          li.click();
        });

        // remove uneeded items
        menu.length != 0 ? (menu.item(0) as HTMLElement).style.display = 'None' : '';
        siteFooter.length != 0 ? (siteFooter.item(0) as HTMLElement).style.display = 'None' : '';
        promotedAction.length != 0 ? (promotedAction.item(0) as HTMLElement).style.display = 'None' : '';
        offersHeaderPoints.length != 0 ? (offersHeaderPoints.item(0) as HTMLElement).innerText = username.split('@')[0] : '';
        return;
    }, username);
    console.log('getting pdf');
    await page.pdf({ path: PDF_PATH, printBackground: true, displayHeaderFooter: false });
    console.info('got pdf and closeing pdf');
    await page.close();
    await browser.close();

    return PDF_PATH;

}