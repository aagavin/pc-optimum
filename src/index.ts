import { getPdfPath } from './puppiteer';
import { sendEmail } from './email';

console.log('starting app....');

(async () => {
  const account = process.argv.slice(2);
  let maxRetries = 3;
  let path: string | Error = '';

  do{
    try {
      path = await getPdfPath(account[0], account[1]);
      break;
    } catch (err: any) {
      path = err;
      maxRetries--;
    }
  } while(maxRetries !==0);

  return {
    body: {
      emailId: await sendEmail(path),
      sentTo: process.env.E_TO
    }
  };
})();
