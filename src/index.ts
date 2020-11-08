import { getPdfPath } from './puppiteer';
import { sendEmail } from './email';

console.log('starting app....');

(async () => {
  const account = process.argv.slice(2);
  const path = await getPdfPath(account[0], account[1]).catch(err => {
    console.error(err);
    return err;
  });

  return {
    body: {
      emailId: await sendEmail(path),
      sentTo: process.env.E_TO
    }
  };
})();
