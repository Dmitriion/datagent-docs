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
        id: 'cloud/cloud-index',
      },
      items: [
        'intro',
        'cloud/cloud-getting-started',
        'cloud/cloud-first-agent',
        'cloud/cloud-pricing',
        'billing/billing-overview',
        'billing/billing-limits',
        'cloud/cloud-plugins',
        'cloud/cloud-skills',
        'cloud/cloud-on-premise',
        'cloud/cloud-account',
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
            {
              type: 'doc',
              id: 'concepts/how-it-works',
              label: 'Как работает Datagent',
            },
            'concepts/agent-architecture',
            'concepts/llm-adapters',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Интеграции',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'integrations',
        title: 'Интеграции',
        description:
          'GigaChat, YandexGPT, Битрикс24, Телеграм, 1С и управление браузером.',
      },
      items: [
        'integrations/gigachat',
        'integrations/yandexgpt',
        'integrations/bitrix24',
        'integrations/telegram',
        'integrations/1c-connector',
        'integrations/browserbridge',
      ],
    },
    {
      type: 'category',
      label: 'Учебник',
      collapsed: false,
      link: {type: 'doc', id: 'guides/index'},
      items: [
        {
          type: 'category',
          label: 'Первые шаги',
          items: [
            {type: 'doc', id: 'guides/01-first-day', label: 'Первый день'},
            {type: 'doc', id: 'guides/02-your-team', label: 'Ваша команда'},
            {type: 'doc', id: 'guides/03-one-task', label: 'Первая задача'},
            {
              type: 'doc',
              id: 'guides/04-trust-and-approval',
              label: 'Доверие и контроль',
            },
          ],
        },
        {
          type: 'category',
          label: 'На практике',
          items: [
            'guides/05-office-field',
            'guides/06-channels',
            {
              type: 'doc',
              id: 'guides/07-documents',
              label: 'Работа с документами',
            },
            {type: 'doc', id: 'guides/08-1c-bridge', label: 'Подключение 1С'},
            'guides/playbook-index',
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
          'Локальная служба на рабочей станции, связь с облаком и диагностика.',
      },
      items: [
        {type: 'doc', id: 'browser/overview', label: 'Обзор'},
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
        {type: 'doc', id: 'artifacts/overview', label: 'Обзор'},
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
        {type: 'doc', id: 'office/overview', label: 'Обзор'},
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
        {type: 'doc', id: 'api-reference/overview', label: 'Обзор'},
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
