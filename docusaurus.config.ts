import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Документация Datagent',
  tagline:
    'Единый центр управления ИИ-агентами в компании. Облачная версия на app.datagent.ru.',
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
        searchBarShortcutHint: true,
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/office/1c-connector',
            to: '/docs/integrations/1c-connector',
          },
          {
            from: '/docs/tutorials/browserbridge-setup',
            to: '/docs/browser/setup',
          },
          {
            from: '/docs/getting-started',
            to: '/docs/cloud/getting-started',
          },
          {
            from: '/docs/getting-started/quickstart',
            to: '/docs/cloud/getting-started',
          },
          {
            from: '/docs/getting-started/installation',
            to: '/docs/cloud/on-premise',
          },
          {
            from: '/docs/getting-started/first-agent',
            to: '/docs/cloud/first-agent',
          },
        ],
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
          exclude: ['**/getting-started/**', '**/BRAND.md'],
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
          'Справка по Datagent: облачная версия, первые шаги, GigaChat, YandexGPT, Битрикс24 и работа с агентами.',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'cloud_launch_2026',
      content:
        '🚀 Datagent Cloud запущен — <a href="https://app.datagent.ru">попробуйте бесплатно</a>',
      backgroundColor: '#0f766e',
      textColor: '#ffffff',
      isCloseable: true,
    },
    navbar: {
      title: 'Документация Datagent',
      logo: {
        alt: 'Логотип Datagent',
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
          to: '/docs/cloud/getting-started',
          label: 'Начало',
          position: 'left',
        },
        {to: '/docs/guides', label: 'Учебник', position: 'left'},
        {
          to: '/docs/concepts/what-is-datagent',
          label: 'О платформе',
          position: 'left',
        },
        {
          href: 'https://app.datagent.ru',
          label: 'Открыть Datagent →',
          position: 'right',
          className: 'navbar--cta',
        },
        {
          href: 'https://datagent.ru',
          label: 'Сайт',
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
            {label: 'Быстрый старт', to: '/docs/cloud/getting-started'},
            {label: 'Свой сервер', to: '/docs/cloud/on-premise'},
            {label: 'Введение', to: '/docs/intro'},
            {label: 'Учебник', to: '/docs/guides'},
            {label: 'О платформе', to: '/docs/concepts/what-is-datagent'},
            {label: 'Программный интерфейс', to: '/docs/api-reference/overview'},
            {label: 'Решение проблем', to: '/docs/troubleshooting'},
          ],
        },
        {
          title: 'Ещё',
          items: [
            {label: 'Облачная версия', to: '/docs/cloud'},
            {label: 'Тарифы', to: '/docs/cloud/pricing'},
            {label: 'Приложение', href: 'https://app.datagent.ru'},
            {label: 'Сайт', href: 'https://datagent.ru'},
            {label: 'Практические сценарии', to: '/docs/tutorials/automate-crm'},
            {label: 'История версий', to: '/docs/changelog'},
          ],
        },
        {
          title: 'Интеграции',
          items: [
            {label: 'GigaChat (Сбер)', to: '/docs/integrations/gigachat'},
            {label: 'YandexGPT', to: '/docs/integrations/yandexgpt'},
            {label: 'Битрикс24', to: '/docs/integrations/bitrix24'},
            {label: '1С', to: '/docs/integrations/1c-connector'},
            {label: 'Управление браузером', to: '/docs/integrations/browserbridge'},
            {label: 'Телеграм', to: '/docs/integrations/telegram'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Datagent. Документация продукта.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
