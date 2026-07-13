import type {NextStepItem} from './index';

export const introNextSteps: NextStepItem[] = [
  {
    title: 'Старт в облаке',
    description: 'Регистрация на app.datagent.ru и первичная настройка.',
    to: '/docs/cloud/getting-started',
    tag: 'Начало',
  },
  {
    title: 'Первый агент',
    description: 'GigaChat или YandexGPT, запуск и журнал выполнения.',
    to: '/docs/cloud/first-agent',
    tag: 'Практика',
  },
  {
    title: 'Учебник',
    description: 'Восемь историй для оператора и руководителя.',
    to: '/docs/guides',
    tag: 'Пользователям',
  },
  {
    title: 'Программный интерфейс',
    description: 'Для разработчиков: запуск агентов и задачи.',
    to: '/docs/api-reference/overview',
    tag: 'Инженерам',
  },
];

export const cloudFirstAgentNextSteps: NextStepItem[] = [
  {
    title: 'Первый день в панели',
    description: 'Сценарий оператора: задачи и согласования.',
    to: '/docs/guides/01-first-day',
    tag: 'Учебник',
  },
  {
    title: 'Тарифы',
    description: 'Бесплатный, Solo, Studio, Business и корпоративный.',
    to: '/docs/cloud/pricing',
    tag: 'Облако',
  },
  {
    title: 'Как это работает',
    description: 'Запуски, плагины и устройство системы.',
    to: '/docs/concepts/how-it-works',
    tag: 'Основы',
  },
  {
    title: 'Решение проблем',
    description: 'Типичные затруднения при работе в панели.',
    to: '/docs/troubleshooting',
    tag: 'Справка',
  },
];

export const guidesIndexNextSteps: NextStepItem[] = [
  {
    title: 'Первый день в панели',
    description: 'Мария: согласования, задачи, запуск агента.',
    to: '/docs/guides/01-first-day',
    tag: 'Глава 1',
  },
  {
    title: 'Конвейеры',
    description: 'Многоэтапные процессы и очередь проверки.',
    to: '/docs/workflows/pipelines',
    tag: 'Процессы',
  },
  {
    title: 'Таймлайн',
    description: 'Когда и кто из агентов работал.',
    to: '/docs/workflows/timeline',
    tag: 'Контроль',
  },
  {
    title: 'Старт в облаке',
    description: 'Если ещё не регистрировались на app.datagent.ru.',
    to: '/docs/cloud/getting-started',
    tag: 'Облако',
  },
];

export const firstDayNextSteps: NextStepItem[] = [
  {
    title: 'Команда агентов',
    description: 'Собрать роли и не выдать лишних прав.',
    to: '/docs/guides/02-your-team',
    tag: 'Глава 2',
  },
  {
    title: 'Одна задача',
    description: 'Диалог с агентом и журнал запуска.',
    to: '/docs/guides/03-one-task',
    tag: 'Глава 3',
  },
  {
    title: 'Первый агент',
    description: 'Пошаговое создание агента в облаке.',
    to: '/docs/cloud/first-agent',
    tag: 'Облако',
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
    description: 'Битрикс24 и Телеграм в задачах.',
    to: '/docs/guides/06-channels',
    tag: 'Глава 6',
  },
  {
    title: 'Согласования',
    description: 'Очередь решений в панели.',
    to: '/docs/guides/04-trust-and-approval',
    tag: 'Глава 4',
  },
  {
    title: 'Обзор «Офис»',
    description: 'Как включить и что видит руководитель.',
    to: '/docs/office/overview',
    tag: 'Справка',
  },
  {
    title: 'Обложка учебника',
    description: 'Вернуться к оглавлению.',
    to: '/docs/guides',
    tag: 'Учебник',
  },
];
