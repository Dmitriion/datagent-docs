import type {NextStepItem} from './index';

export const introNextSteps: NextStepItem[] = [
  {
    title: 'Быстрый старт',
    description: 'Поднять Board на :3100 за 10–15 минут из монорепо.',
    to: '/docs/getting-started/quickstart',
    tag: 'Начало',
  },
  {
    title: 'Учебник',
    description: 'Восемь историй для оператора и руководителя.',
    to: '/docs/guides',
    tag: 'Пользователям',
  },
  {
    title: 'Что такое Datagent',
    description: 'Control plane, heartbeat, плагины — для инженеров.',
    to: '/docs/concepts/what-is-datagent',
    tag: 'Платформа',
  },
  {
    title: 'Обзор API',
    description: 'Wakeup, heartbeat-runs, issues — без POST /api/runs.',
    to: '/docs/api-reference/overview',
    tag: 'Инженерам',
  },
];

export const quickstartNextSteps: NextStepItem[] = [
  {
    title: 'Первый агент',
    description: 'Создать агента, wakeup и разобрать журнал run.',
    to: '/docs/getting-started/first-agent',
    tag: 'Следующий шаг',
  },
  {
    title: 'Первый день в Board',
    description: 'Сценарий оператора: задачи и одобрения.',
    to: '/docs/guides/01-first-day',
    tag: 'Учебник',
  },
  {
    title: 'Как это работает',
    description: 'Heartbeat, плагины и один процесс на :3100.',
    to: '/docs/concepts/how-it-works',
    tag: 'Концепции',
  },
  {
    title: 'Решение проблем',
    description: 'Board, run, Офис — типичные симптомы.',
    to: '/docs/troubleshooting',
    tag: 'Справка',
  },
];

export const guidesIndexNextSteps: NextStepItem[] = [
  {
    title: 'Первый день в Board',
    description: 'Мария: одобрения, задачи, wakeup.',
    to: '/docs/guides/01-first-day',
    tag: 'Глава 1',
  },
  {
    title: 'Команда агентов',
    description: 'Роли, tools и границы на агента.',
    to: '/docs/guides/02-your-team',
    tag: 'Глава 2',
  },
  {
    title: 'Одобрения',
    description: 'Рискованные действия под контролем.',
    to: '/docs/guides/04-trust-and-approval',
    tag: 'Глава 4',
  },
  {
    title: 'Быстрый старт',
    description: 'Если Board ещё не поднят.',
    to: '/docs/getting-started/quickstart',
    tag: 'Установка',
  },
];

export const firstDayNextSteps: NextStepItem[] = [
  {
    title: 'Команда агентов',
    description: 'Собрать роли и не выдать лишние tools.',
    to: '/docs/guides/02-your-team',
    tag: 'Глава 2',
  },
  {
    title: 'Одна задача',
    description: 'Issue, диалог и журнал run.',
    to: '/docs/guides/03-one-task',
    tag: 'Глава 3',
  },
  {
    title: 'Первый агент',
    description: 'Технический туториал по агенту.',
    to: '/docs/getting-started/first-agent',
    tag: 'Старт',
  },
  {
    title: 'Обложка учебника',
    description: 'Все главы и шпаргалка.',
    to: '/docs/guides',
    tag: 'Учебник',
  },
];

export const officeFieldNextSteps: NextStepItem[] = [
  {
    title: 'Пульт в мессенджерах',
    description: 'Bitrix24 и Телеграм в задачах.',
    to: '/docs/guides/06-channels',
    tag: 'Глава 6',
  },
  {
    title: 'Одобрения',
    description: 'Shield и очередь в Board.',
    to: '/docs/guides/04-trust-and-approval',
    tag: 'Глава 4',
  },
  {
    title: 'Обзор «Офис»',
    description: 'As-built и enableOffice для инженеров.',
    to: '/docs/office/overview',
    tag: 'Техника',
  },
  {
    title: 'Обложка учебника',
    description: 'Вернуться к оглавлению.',
    to: '/docs/guides',
    tag: 'Учебник',
  },
];
