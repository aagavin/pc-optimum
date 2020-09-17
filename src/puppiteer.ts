import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page, LaunchOptions } from 'puppeteer';
import { existsSync } from 'fs';

puppeteer.use(StealthPlugin());
// puppeteer constants
const URL: string = 'https://www.pcoptimum.ca/login';
const EMAIL_INPUT: string = '#email';
const PASS_INPUT: string = '#password';

const launchConfig: LaunchOptions = {
  headless: true,
  executablePath: existsSync('/usr/bin/chromium-browser')
    ? '/usr/bin/chromium-browser'
    : '/usr/bin/chromium',
  ignoreHTTPSErrors: true,
  defaultViewport: { width: 1920, height: 1080 }
};

export const getPdfPath = async (username: string, password: string): Promise<string | null> => {
  console.info('launching browser');

  const PDF_PATH: string = `./pc-points-${username}-${new Date()
    .toDateString()
    .replace(/ /g, '-')}.pdf`;

  try {
    const browser: Browser = await puppeteer.launch(launchConfig);
    const page: Page = await browser.newPage();

    console.info(`going to ${URL}`);
    await page.goto(URL, { waitUntil: 'networkidle0' });

    console.info('logging in to pc w/ %s', username);
    await page.focus(EMAIL_INPUT);
    await page.keyboard.type(username);
    console.info('typed username');

    console.info('typeing password');
    await page.focus(PASS_INPUT);
    await page.keyboard.type(password);
    console.info('typed password');

    console.log('navigate to login page');
    await Promise.all([
      page.click('#login > fieldset > button', { delay: 20 }),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    console.log('...done navigation');

    await page.waitForSelector('.header-points__points-balance');
    await page.waitForSelector('.offers-grid--main');
    await page.waitForSelector('.product-offer');
    await page.waitForSelector('div.image');
    await page.evaluate(username => {
      (document.querySelector('nav.menu') as HTMLElement).style.display = 'None';
      (document.querySelector('.video-tile') as HTMLElement).style.display = 'None';
      (document.querySelector('section.tile-list') as HTMLElement).style.display = 'None';
      (document.querySelector('footer.site-footer') as HTMLElement).style.display = 'None';
      // header-points__redeemable-value
      (document.querySelector('div.header-points__redeemable-value') as HTMLElement).innerHTML = `<b><i>Points for ${username}</i></b>`;
    }, username);

    await page.emulateMediaType('screen');

    await page.pdf({
      path: PDF_PATH,
      printBackground: true,
      displayHeaderFooter: false
    });

    console.log('closeing browser');
    await browser.close();
    console.log('closed broweser');
    return PDF_PATH;
  } catch (err) {
    console.error(err);
    return '';
  }
};
