import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Явный порядок sidebar = путь читателя.
 * id документов — из frontmatter (id:) или путь guides/01-first-day.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Облачная версия',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'cloud/cloud-index',
      },
      items: [
        'cloud/cloud-getting-started',
        'cloud/cloud-first-agent',
        'cloud/cloud-pricing',
        'cloud/cloud-plugins',
        'cloud/cloud-on-premise',
        'cloud/cloud-account',
      ],
    },
    'intro',
    {
      type: 'category',
      label: 'Учебник',
      collapsed: false,
      link: {type: 'doc', id: 'guides/index'},
      items: [
        {
          type: 'category',
          label: 'Начало работы',
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
      label: 'Как работают агенты',
      collapsed: true,
      items: [
        'concepts/agents',
        'concepts/heartbeat',
        'concepts/memory',
        'concepts/approvals',
        'concepts/inbox',
      ],
    },
    {
      type: 'category',
      label: 'Платформа и тарифы',
      collapsed: true,
      items: [
        'concepts/what-is-datagent',
        'concepts/credits',
        'concepts/how-it-works',
        'concepts/agent-architecture',
        'concepts/llm-adapters',
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
      label: 'Управление браузером',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'browser',
        title: 'Управление браузером',
        description:
          'Локальная служба на рабочей станции, связь с облаком и диагностика.',
      },
      items: ['browser/overview', 'browser/setup'],
    },
    {
      type: 'category',
      label: 'Офис и документы',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'office',
        title: 'Офис и документы',
        description:
          'Пространство «Офис» в панели и работа с Excel и PowerPoint на задаче.',
      },
      items: ['office/overview', 'office/excel-pptx'],
    },
    {
      type: 'category',
      label: 'Практические сценарии',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'tutorials/index',
      },
      items: ['tutorials/build-plugin', 'tutorials/automate-crm'],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'api-reference',
        title: 'API',
        description: 'REST API на /api: wakeup, heartbeat-runs, issues, plugins.',
      },
      items: ['api-reference/overview'],
    },
    {
      type: 'category',
      label: 'Справка',
      collapsed: true,
      items: ['troubleshooting'],
    },
    'changelog',
  ],
};

export default sidebars;
