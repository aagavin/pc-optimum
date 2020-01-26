import { LaunchOptions } from "puppeteer";

/**
 * Check if NODE_ENV varable is set
 * if it's not then use local config
 *
 * @returns {object}
 */
export const getLaunchConfig = (): object => {
  let launchConfig: LaunchOptions = {
    args: [
      '--disable-gpu'
    ]
  }

  if (typeof process.env.NODE_ENV === 'undefined') {
    launchConfig['headless'] = false;
  }
  else if (process.env.NODE_ENV === 'headless' || process.env.NODE_ENV === 'production') {
    launchConfig['headless'] = true;
  }
  else {
    // launchConfig['executablePath'] = './headless-chromium';
  }

  return launchConfig;
}
