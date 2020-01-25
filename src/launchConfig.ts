/**
 * Check if NODE_ENV varable is set
 * if it's not then use local config
 *
 * @returns {object}
 */
export const getLaunchConfig = (): object => {
  let launchConfig = {
    args: [
      '--disable-gpu',
      '--single-process',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list'
    ]
  };

  if (typeof process.env.NODE_ENV === 'undefined') {
    launchConfig['headless'] = false;
  }
  else {
    launchConfig['executablePath'] = './headless-chromium';
  }

  return launchConfig;
}
