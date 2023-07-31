// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
require("dotenv").config();
const path = require("path");

let PROTOCOL = 'http';
if (
  process.env.SSL_KEY_BASE64 && process.env.SSL_KEY_BASE64.length > 0 &&
  process.env.SSL_CERT_BASE64 && process.env.SSL_CERT_BASE64.length > 0
){
  PROTOCOL = 'https';
}

const HOST = process.env.HOST === 'localhost:4200' ? '127.0.0.1:4200' : process.env.HOST;
const specs = [];
if(!(HOST === 'undefined')){
  specs.push({spec: `${PROTOCOL}://${HOST}/api/openapi`,route: '/api/'})
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Scholarsome Handbook',
  url: `http://${process.env.HOST}`,
  baseUrl: '/handbook/',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Scholarsome',
  projectName: 'Scholarsome',
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/hwgilbert16/scholarsome/tree/develop/apps/docs',
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false
      }),
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: specs,

        // Theme Options for modifying how redoc renders them
        theme: {
          primaryColor: '#8338ff',
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Scholarsome',
          src: 'img/logo.svg',
          href: '/'
        },
        items: [
          {
            to: `http://${process.env.HOST}`,
            position: 'left',
            label: 'Back to Scholarsome',
            target: "_self"
          }
        ],
      },
      prism: {
        theme: lightCodeTheme
      },
      colorMode: {
        disableSwitch: true,
        respectPrefersColorScheme: false,
      }
    }),
};

module.exports = config;
