import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Явный порядок sidebar = путь читателя (от простого к сложному).
 * id документов — из frontmatter (id:) или путь guides/01-first-day.
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
            'concepts/how-it-works',
            'concepts/agent-architecture',
            'concepts/llm-adapters',
          ],
        },
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
            'guides/01-first-day',
            'guides/02-your-team',
            'guides/03-one-task',
            'guides/04-trust-and-approval',
          ],
        },
        {
          type: 'category',
          label: 'Сценарии использования',
          items: [
            'guides/05-office-field',
            'guides/06-channels',
            'guides/07-documents',
            'guides/08-1c-bridge',
            'guides/playbook-index',
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
      label: 'Браузер',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'browser',
        title: 'Браузер',
        description:
          'Локальная служба на рабочей станции, связь с облаком и диагностика.',
      },
      items: ['browser/overview', 'browser/setup'],
    },
    {
      type: 'category',
      label: 'Артефакты',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'artifacts/overview',
      },
      items: ['artifacts/overview', 'artifacts/agent-upload'],
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
      items: ['office/overview', 'office/excel-pptx'],
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
    'troubleshooting',
    'changelog',
  ],
};

export default sidebars;
