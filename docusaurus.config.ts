import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/** Optional Yandex Webmaster verification — never commit real values. Google Site Verification not used (RF ops policy, 2026). */
const yandexVerification = process.env.YANDEX_VERIFICATION?.trim();

const verificationHeadTags: NonNullable<Config['headTags']> = [];
if (yandexVerification) {
  verificationHeadTags.push({
    tagName: 'meta',
    attributes: {
      name: 'yandex-verification',
      content: yandexVerification,
    },
  });
}

const config: Config = {
  title: 'Datagent',
  tagline:
    'Документация платформы ИИ-агентов: Cloud, интеграции с российскими сервисами, руководства и API.',
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
            from: '/docs/integrations',
            to: '/docs/integrations/overview',
          },
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

  clientModules: [require.resolve('./src/clientModules/yandex-metrika.ts')],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          // Сохраняем префиксы 01-, 02-… в URL учебника (guides/01-first-day).
          numberPrefixParser: false,
          exclude: [
            '**/getting-started/**',
            '**/BRAND.md',
            '**/_meta/**',
            '**/meta/**',
            '**/UX-SEO-GEO-AUDIT*.md',
            '**/GUIDES-UX-SEO-GEO-AUDIT.md',
            '**/POLISH-PASS-REPORT.md',
            '**/FINAL-DOCS-POLISH-REPORT.md',
            '**/RELEASE-CANDIDATE-QA-REPORT.md',
            '**/MOBILE-UX-QA-REPORT.md',
            '**/SEO-GEO-MASTER-AUDIT.md',
            '**/SEO-CONTENT-BACKLOG.md',
            '**/VISUAL-REFINEMENT-AUDIT.md',
            '**/SEO-OPERATIONS-RUNBOOK.md',
            '**/SECURITY-HARDENING-REPORT.md',
            '**/SECURITY-OPERATIONS-RUNBOOK.md',
          ],
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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [
            '/tags/**',
            '/search/**',
            '**/SEO-GEO-MASTER-AUDIT/**',
            '**/SEO-CONTENT-BACKLOG/**',
            '**/VISUAL-REFINEMENT-AUDIT/**',
            '**/SEO-OPERATIONS-RUNBOOK/**',
            '**/SECURITY-HARDENING-REPORT/**',
            '**/SECURITY-OPERATIONS-RUNBOOK/**',
          ],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    ...verificationHeadTags,
    // ── Security Headers (via <meta> — работает для CSP и Referrer) ──────────
    // Полные HTTP-заголовки (HSTS, X-Frame-Options, nosniff) — только через CDN/Cloudflare.
    // Referrer-Policy через <meta> поддерживается всеми современными браузерами.
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'strict-origin-when-cross-origin',
      },
    },
    // CSP Report-Only: разрешаем Docusaurus + Yandex.Metrika.
    // После инвентаря через Report-Only → переводить в Content-Security-Policy.
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'Content-Security-Policy-Report-Only',
        content: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://mc.yandex.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://mc.yandex.ru https://mc.yandex.com",
          "connect-src 'self' https://mc.yandex.ru https://mc.yandex.com",
          "font-src 'self' data:",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      },
    },
    // ── OG / Social ────────────────────────────────────────────────────────────
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'ru_RU',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:width',
        content: '1200',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:height',
        content: '630',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content: 'Datagent — ИИ-агенты для бизнеса',
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
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://mc.yandex.ru',
      },
    },
    // tag.js as real <script src> so checkers see it in HTML/DOM (not only after IIFE).
    // npm docusaurus-plugin-yandex-metrica is incompatible (Docusaurus 3.0.1 / React 18).
    {
      tagName: 'script',
      attributes: {
        src: 'https://mc.yandex.ru/metrika/tag.js',
      },
    },
    {
      tagName: 'script',
      attributes: {
        src: '/js/yandex-metrika.js',
      },
    },
  ],

  themeConfig: {
    image: 'img/og-datagent-docs.png',
    metadata: [
      {
        name: 'description',
        content:
          'Документация Datagent: ИИ-агенты для бизнеса, Cloud на app.datagent.ru, интеграции с CRM и маркетплейсами, руководства и API.',
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
        'Datagent Cloud запущен — <a href="https://app.datagent.ru">попробуйте бесплатно</a>',
      backgroundColor: '#0f766e',
      textColor: '#ffffff',
      isCloseable: true,
    },
    navbar: {
      title: 'Datagent',
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
          label: 'Начало работы',
          position: 'left',
        },
        {to: '/docs/guides', label: 'Руководства', position: 'left'},
        {
          to: '/docs/cloud/pricing',
          label: 'Тарифы',
          position: 'left',
          className: 'navbar__link--hide-lg',
        },
        {
          to: '/docs/concepts/what-is-datagent',
          label: 'Концепции',
          position: 'left',
          className: 'navbar__link--hide-lg',
        },
        {
          href: 'https://app.datagent.ru/auth',
          label: 'Войти',
          position: 'right',
          className: 'navbar__link--hide-md',
        },
        {
          href: 'https://app.datagent.ru/signup',
          label: 'Начать бесплатно',
          position: 'right',
          className: 'navbar--cta',
        },
        {
          href: 'https://datagent.ru',
          label: 'Сайт',
          position: 'right',
          className: 'navbar__link--hide-md navbar--btn-outline',
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
            {label: 'Введение', to: '/docs/intro'},
            {label: 'Что такое Datagent', to: '/docs/concepts/what-is-datagent'},
            {label: 'Руководства', to: '/docs/guides'},
            {label: 'Сценарии', to: '/docs/tutorials'},
            {label: 'Интеграции', to: '/docs/integrations/overview'},
            {label: 'Шпаргалка по ситуациям', to: '/docs/guides/playbook-index'},
            {label: 'Конвейеры', to: '/docs/workflows/pipelines'},
            {label: 'API Reference', to: '/docs/api-reference/overview'},
            {label: 'Решение проблем', to: '/docs/troubleshooting'},
          ],
        },
        {
          title: 'Материалы',
          items: [
            {label: 'Облачная версия', to: '/docs/cloud'},
            {label: 'Тарифы', to: '/docs/cloud/pricing'},
            {label: 'Лимиты по тарифам', to: '/docs/billing/limits'},
            {label: 'Биллинг', to: '/docs/billing/overview'},
            {label: 'Свой контур', to: '/docs/cloud/on-premise'},
            {label: 'Сценарии', to: '/docs/tutorials'},
            {label: 'История изменений', to: '/docs/changelog'},
            {label: 'Поддержка', href: 'mailto:sales@datagent.ru'},
          ],
        },
        {
          title: 'Продукт',
          items: [
            {label: 'Открыть Datagent', href: 'https://app.datagent.ru'},
            {label: 'Начать бесплатно', href: 'https://app.datagent.ru/signup'},
            {label: 'Сайт', href: 'https://datagent.ru'},
          ],
        },
        {
          title: 'Интеграции',
          items: [
            {label: 'GigaChat (Сбер)', to: '/docs/integrations/gigachat'},
            {label: 'YandexGPT', to: '/docs/integrations/yandexgpt'},
            {label: 'Битрикс24', to: '/docs/integrations/bitrix24'},
            {label: '1С', to: '/docs/integrations/1c-connector'},
            {label: 'Внешние инструменты (MCP)', to: '/docs/integrations/mcp'},
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
