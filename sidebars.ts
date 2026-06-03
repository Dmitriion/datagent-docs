import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Явный порядок sidebar = путь читателя.
 * id документов — из frontmatter (id:) или путь guides/01-first-day.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Начало работы',
      collapsed: false,
      link: {
        type: 'generated-index',
        slug: 'getting-started',
        title: 'Начало работы',
        description:
          'Установка, быстрый старт и первый агент в Datagent на :3100.',
      },
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
        'getting-started/first-agent',
      ],
    },
    {
      type: 'category',
      label: 'Работа с платформой',
      collapsed: false,
      link: {type: 'doc', id: 'guides/index'},
      items: [
        'guides/01-first-day',
        'guides/02-your-team',
        'guides/03-one-task',
        'guides/04-trust-and-approval',
        'guides/05-office-field',
        'guides/06-channels',
        'guides/07-documents',
        'guides/08-1c-bridge',
        'guides/playbook-index',
      ],
    },
    {
      type: 'category',
      label: 'Концепции',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'concepts',
        title: 'Концепции',
        description:
          'Control plane Datagent: heartbeat, агенты, плагины и LLM-адаптеры.',
      },
      items: [
        'concepts/what-is-datagent',
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
          'GigaChat, YandexGPT, Bitrix24 imbot bridge и плагин Телеграм.',
      },
      items: [
        'integrations/gigachat',
        'integrations/yandexgpt',
        'integrations/bitrix24',
        'integrations/telegram',
      ],
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
          'Пространство «Офис», 1С MCP-коннектор и Office Plugin для Excel/PPTX.',
      },
      items: ['office/overview', 'office/1c-connector', 'office/excel-pptx'],
    },
    {
      type: 'category',
      label: 'Туториалы',
      collapsed: true,
      link: {
        type: 'generated-index',
        slug: 'tutorials',
        title: 'Туториалы',
        description:
          'BrowserBridge, свой плагин и сценарий Bitrix24 → Телеграм.',
      },
      items: [
        'tutorials/browserbridge-setup',
        'tutorials/build-plugin',
        'tutorials/automate-crm',
      ],
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
