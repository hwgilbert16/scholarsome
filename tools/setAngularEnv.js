const { writeFile } = require('fs');
require('dotenv').config();

const fileContent = `
export const environment = {
   production: ${process.env.NODE_ENV === 'production' ? 'true' : 'false'},
   recaptchaSiteKey: '${process.env.RECAPTCHA_SITE}',
};
`;

writeFile('./apps/front/src/environments/environmet.ts', fileContent, () => {});
