// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Scholarsome',
  url: 'https://docs.scholarsome.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
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
            href: 'https://github.com/hwgilbert16/scholarsome',
            position: 'left',
            label: 'Back to GitHub'
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation'
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
