import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page, LaunchOptions } from 'puppeteer';
import { existsSync } from 'fs';

puppeteer.use(StealthPlugin());
// puppeteer constants
const URL: string = 'https://www.pcoptimum.ca/login';
const EMAIL_INPUT: string = '#email';
const PASS_INPUT: string = '#password';
const username = process.env.username || '';
const password = process.env.password || '';
const PDF_PATH: string = `./pc-points-${username}-${(new Date()).toDateString().replace(/ /g, '-')}.pdf`;
const launchConfig: LaunchOptions = {
  headless: true,
    executablePath: existsSync('/usr/bin/chromium-browser')
    ? '/usr/bin/chromium-browser'
    : '/usr/bin/chromium',
		ignoreHTTPSErrors: true,
  defaultViewport: { width: 1920, height: 1080 }
};

export const getPdfPath = async (): Promise<string | null> => {
  console.info('launching browser');

	try{
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
      page.click('#login > button', { delay: 20 }),
      page.waitForNavigation()
    ]);
    console.log('...done navigation');

    await page.waitForSelector('.offer-content__loaded', { visible: true });
    await page.evaluate(_ => {
      window.scrollTo(0, document.body.scrollHeight);
      (document.querySelector('nav.menu') as HTMLElement).style.display =
        'none';
      (document.querySelector(
        'footer.site-footer'
      ) as HTMLElement).style.display = 'none';
      (document.querySelector(
        'div.offers-header-points__value'
      ) as HTMLElement).innerText = 'pcplus@aagavin.ca';
    });

    await page.waitFor(1000);

    await page.emulateMediaType('screen');

    await page.pdf({
      path: PDF_PATH,
      printBackground: true,
      displayHeaderFooter: false
    });

    await browser.close();
    return PDF_PATH;
  } catch (err) {
	// await page.screenshot({ path: './screen-err.png', fullPage: true });
    console.error(err);
	// await browser.close();
    return './screen-err.png';
  }
};
