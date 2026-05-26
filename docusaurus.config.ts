import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Datagent Docs',
  tagline: 'AI-оркестратор бизнес-процессов для российского МСБ',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.datagent.ru',
  baseUrl: '/',
  organizationName: 'Dmitriion',
  projectName: 'datagent-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Dmitriion/datagent-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/Dmitriion/datagent-docs/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Datagent Docs',
      logo: {
        alt: 'Datagent',
        src: 'img/datagent-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/tutorials/automate-crm',
          label: 'Tutorials',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Dmitriion/datagent-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {label: 'Быстрый старт', to: '/docs/getting-started/quickstart'},
            {label: 'Концепции', to: '/docs/concepts/what-is-datagent'},
            {label: 'API', to: '/docs/api-reference/overview'},
          ],
        },
        {
          title: 'Продукт',
          items: [
            {label: 'Сайт Datagent', href: 'https://datagent.ru'},
            {label: 'GitHub', href: 'https://github.com/Dmitriion/datagent-docs'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Datagent. Документация распространяется под лицензией проекта.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    // TODO: подключить Algolia DocSearch после регистрации индекса
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'datagent',
    //   contextualSearch: true,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
