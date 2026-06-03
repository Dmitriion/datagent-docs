import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Datagent Docs',
  tagline:
    'Операционная платформа для AI-агентов. Self-hosted. До первого одобрения — 10 минут.',
  favicon: 'img/brand/favicon-light.svg',

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

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['ru', 'en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: 'docs',
        blogRouteBasePath: 'blog',
        searchBarShortcutHint: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          // Сохраняем префиксы 01-, 02-… в URL учебника (guides/01-first-day).
          numberPrefixParser: false,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/css/custom.css',
            './src/css/doc-content.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'ru_RU',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'application/llms.txt',
        href: '/llms.txt',
      },
    },
  ],

  themeConfig: {
    image: 'img/og-datagent-docs.svg',
    metadata: [
      {
        name: 'description',
        content:
          'Документация Datagent — control plane для AI-агентов: установка, API :3100, интеграции GigaChat, YandexGPT, Bitrix24.',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Datagent Docs',
      logo: {
        alt: 'Datagent',
        src: 'img/brand/mark-header.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Документация',
        },
        {
          to: '/docs/tutorials/automate-crm',
          label: 'Туториалы',
          position: 'left',
        },
        {to: '/blog', label: 'Блог', position: 'left'},
        {to: '/docs/guides', label: 'Руководство', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {label: 'Быстрый старт', to: '/docs/getting-started/quickstart'},
            {label: 'Введение', to: '/docs/intro'},
            {label: 'Концепции', to: '/docs/concepts/what-is-datagent'},
            {label: 'API', to: '/docs/api-reference/overview'},
          ],
        },
        {
          title: 'Интеграции',
          items: [
            {label: 'GigaChat', to: '/docs/integrations/gigachat'},
            {label: 'YandexGPT', to: '/docs/integrations/yandexgpt'},
            {label: 'Bitrix24', to: '/docs/integrations/bitrix24'},
            {label: '1С', to: '/docs/office/1c-connector'},
            {label: 'Телеграм', to: '/docs/integrations/telegram'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Datagent. Документация проекта.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
