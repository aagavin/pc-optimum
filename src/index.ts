import { getPdfPath } from './puppiteer';
import { sendEmail } from './email';

console.log('starting app....');

(async () => {
  const path = (await getPdfPath()) || '';
  return {
    statusCode: 200,
    body: {
      emailId: await sendEmail(path),
      sentTo: process.env.E_TO
    }
  };
})();
