import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Явный порядок sidebar = путь читателя (от простого к сложному).
 * Подписи пунктов — операторские; переопределяют sidebar_label в frontmatter.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Начало работы',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'concepts/what-is-datagent',
      },
      items: [
        'intro',
        'concepts/what-is-datagent',
        {
          type: 'doc',
          id: 'concepts/how-it-works',
          label: 'Как это работает',
        },
        'cloud/cloud-index',
        'cloud/cloud-getting-started',
        'cloud/cloud-first-agent',
        'cloud/cloud-account',
      ],
    },
    {
      type: 'category',
      label: 'Тарифы и расширения',
      collapsed: true,
      items: [
        'cloud/cloud-pricing',
        'billing/billing-overview',
        'billing/billing-limits',
        'cloud/cloud-plugins',
        'cloud/cloud-skills',
        'cloud/cloud-on-premise',
        'cloud/cloud-or-self-hosted',
      ],
    },
    {
      type: 'category',
      label: 'Концепции',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'concepts/what-is-datagent',
      },
      items: [
        {
          type: 'category',
          label: 'Как работают агенты',
          items: [
            'concepts/agents',
            'concepts/issues',
            'concepts/projects',
            'concepts/goals',
            'concepts/workspaces',
            'concepts/collaboration',
            'concepts/heartbeat',
            'concepts/memory',
            'concepts/routines',
            'concepts/approvals',
            'concepts/inbox',
            'concepts/channels',
          ],
        },
        {
          type: 'category',
          label: 'Платформа и тарифы',
          items: [
            'concepts/credits',
            'concepts/budgets',
            'concepts/secrets',
            'concepts/company-settings',
            'concepts/agent-architecture',
            'concepts/llm-adapters',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Рабочие процессы',
      collapsed: false,
      link: {
        type: 'generated-index',
        slug: 'workflows',
        title: 'Рабочие процессы',
        description:
          'Конвейеры многоэтапной работы и Таймлайн запусков — стандартные возможности панели.',
      },
      items: [
        {type: 'doc', id: 'workflows/pipelines', label: 'Конвейеры'},
        {type: 'doc', id: 'workflows/timeline', label: 'Таймлайн'},
      ],
    },
    {
      type: 'category',
      label: 'Интеграции',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'integrations/overview',
      },
      items: [
        'integrations/overview',
        {
          type: 'category',
          label: 'Продажи и торговля',
          collapsed: false,
          items: [
            'integrations/moysklad',
            'integrations/ozon',
            'integrations/wildberries',
            'integrations/avito',
            'integrations/amocrm',
            'integrations/yookassa',
          ],
        },
        {
          type: 'category',
          label: 'Маркетинг и коммуникации',
          collapsed: true,
          items: [
            'integrations/vk',
            'integrations/vk-ads',
            'integrations/mailru',
          ],
        },
        {
          type: 'category',
          label: 'Работа и управление',
          collapsed: true,
          items: [
            'integrations/yandex360',
            'integrations/yandex-tracker',
          ],
        },
        {
          type: 'category',
          label: 'Проверка и финансы',
          collapsed: true,
          items: ['integrations/fns-egrul'],
        },
        {
          type: 'category',
          label: 'Данные и инфраструктура',
          collapsed: true,
          items: [
            'integrations/postgresql',
            'integrations/selectel',
            'integrations/cloud-ru',
          ],
        },
        {
          type: 'category',
          label: 'Поездки и туризм',
          collapsed: true,
          items: ['integrations/aviasales'],
        },
        {
          type: 'category',
          label: 'Другие возможности',
          collapsed: true,
          items: [
            'integrations/gigachat',
            'integrations/yandexgpt',
            'integrations/bitrix24',
            'integrations/telegram',
            'integrations/1c-connector',
            'integrations/mcp',
            'integrations/browserbridge',
          ],
        },
        {
          type: 'category',
          label: 'Сравнение',
          collapsed: true,
          items: ['integrations/vs-zapier', 'integrations/vs-make'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Приложения',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'apps/index',
      },
      items: [
        {type: 'doc', id: 'apps/index', label: 'Обзор', key: 'apps-overview'},
        {
          type: 'category',
          label: 'EDPortal',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'apps/edportal/index',
          },
          items: [
            {
              type: 'doc',
              id: 'apps/edportal/index',
              label: 'Обзор',
              key: 'apps-edportal-overview',
            },
            'apps/edportal/installation',
            'apps/edportal/setup',
            'apps/edportal/courses',
            'apps/edportal/tests',
            'apps/edportal/api',
          ],
        },
        {
          type: 'category',
          label: 'Заявки PRO',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'apps/requestspro/index',
          },
          items: [
            {
              type: 'doc',
              id: 'apps/requestspro/index',
              label: 'Обзор',
              key: 'apps-requestspro-overview',
            },
            'apps/requestspro/installation',
            'apps/requestspro/catalog',
            'apps/requestspro/access',
          ],
        },
        {
          type: 'category',
          label: 'Datagent Connector',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'apps/connector/index',
          },
          items: [
            {
              type: 'doc',
              id: 'apps/connector/index',
              label: 'Обзор',
              key: 'apps-connector-overview',
            },
            'apps/connector/installation',
            'apps/connector/channels',
            'apps/connector/lines',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Руководства',
      collapsed: false,
      link: {type: 'doc', id: 'guides/index'},
      items: [
        {
          type: 'category',
          label: 'Начало работы',
          key: 'guides-getting-started',
          items: [
            {type: 'doc', id: 'guides/01-first-day', label: 'Первый день'},
            {type: 'doc', id: 'guides/02-your-team', label: 'Команда агентов'},
            {type: 'doc', id: 'guides/03-one-task', label: 'Первая задача'},
          ],
        },
        {
          type: 'category',
          label: 'Работа с агентами',
          key: 'guides-agent-work',
          items: [
            {
              type: 'doc',
              id: 'guides/04-trust-and-approval',
              label: 'Согласования',
            },
            {
              type: 'doc',
              id: 'guides/05-office-field',
              label: 'Офис (экспериментально)',
            },
            {type: 'doc', id: 'guides/playbook-index', label: 'Шпаргалка'},
          ],
        },
        {
          type: 'category',
          label: 'Интеграции и данные',
          key: 'guides-integrations-data',
          items: [
            {type: 'doc', id: 'guides/06-channels', label: 'Каналы'},
            {
              type: 'doc',
              id: 'guides/07-documents',
              label: 'Документы',
            },
            {type: 'doc', id: 'guides/08-1c-bridge', label: 'Подключение 1С'},
            {
              type: 'doc',
              id: 'guides/ask-postgresql',
              label: 'Вопрос к PostgreSQL',
            },
            {
              type: 'doc',
              id: 'guides/regular-reports',
              label: 'Регулярные отчёты',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Браузер',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'browser',
        title: 'Браузер',
        description:
          'Расширение BrowserBridge, персональный токен и работа боковой панели.',
      },
      items: [
        {type: 'doc', id: 'browser/overview', label: 'Обзор', key: 'browser-overview'},
        'browser/setup',
      ],
    },
    {
      type: 'category',
      label: 'Артефакты',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'artifacts/overview',
      },
      items: [
        {type: 'doc', id: 'artifacts/overview', label: 'Обзор', key: 'artifacts-overview'},
        'artifacts/agent-upload',
      ],
    },
    {
      type: 'category',
      label: 'Office',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'office',
        title: 'Office',
        description:
          'Пространство «Офис» в панели и работа с Excel и PowerPoint на задаче.',
      },
      items: [
        {type: 'doc', id: 'office/overview', label: 'Обзор', key: 'office-overview'},
        'office/excel-pptx',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'api-reference',
        title: 'API Reference',
        description: 'REST API на /api: wakeup, heartbeat-runs, issues, plugins.',
      },
      items: [
        'api-reference/overview',
        'api-reference/agents-api',
        'api-reference/issues-api',
        'api-reference/memory-api',
        'api-reference/plugins-api',
        'api-reference/artifacts-api',
        'api-reference/access-api',
      ],
    },
    {
      type: 'category',
      label: 'Сценарии',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'tutorials/index',
      },
      items: ['tutorials/automate-crm', 'tutorials/build-plugin'],
    },
    {
      type: 'doc',
      id: 'troubleshooting',
      label: 'Решение проблем',
    },
    {
      type: 'doc',
      id: 'changelog',
      label: 'История изменений',
    },
  ],
};

export default sidebars;
