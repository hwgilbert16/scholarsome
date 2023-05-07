const { writeFile } = require('fs');
require('dotenv').config();

const prodContent = `
export const environment = {
   production: true,
   recaptchaSiteKey: '${process.env.RECAPTCHA_SITE}',
};
`;

const nonProdContent = `
export const environment = {
   production: false,
   recaptchaSiteKey: '${process.env.RECAPTCHA_SITE}',
};
`;

writeFile('./apps/front/src/environments/environment.prod.ts', prodContent, () => {});
writeFile('./apps/front/src/environments/environment.ts', nonProdContent, () => {});
