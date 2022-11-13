const { writeFile } = require('fs');
require('dotenv').config();

const production = process.env.NODE_ENV === 'production';
const recaptcha = process.env.RECAPTCHA_SITE;

const filePath = production ? './apps/front/src/environments/environment.prod.ts' : './apps/front/src/environments/environment.ts';

const fileContent = `
export const environment = {
   production: ${production},
   recaptchaSiteKey: '${recaptcha}',
};
`;

writeFile(filePath, fileContent, () => {});
