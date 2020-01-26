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
            "--proxy-server='direct://'",
            '--proxy-bypass-list=*',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ]
    }

    if (typeof process.env.NODE_ENV === 'undefined') {
        launchConfig['headless'] = false;
    }
    else {
        launchConfig['executablePath'] = './headless-chromium';
    }

    return launchConfig;
}
