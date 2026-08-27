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
    title: 'Руководства',
    description: 'Ежедневная работа: задачи, доступы, интеграции.',
    to: '/docs/guides',
    tag: 'Практика',
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
    tag: 'Руководства',
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
    description: 'Компания, агент, первая задача и журнал.',
    to: '/docs/guides/01-first-day',
    tag: 'Старт',
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
    tag: 'Настройка',
  },
  {
    title: 'Первая задача',
    description: 'Диалог с агентом и журнал запуска.',
    to: '/docs/guides/03-one-task',
    tag: 'Практика',
  },
  {
    title: 'Первый агент',
    description: 'Поля агента и типичные сбои в облаке.',
    to: '/docs/cloud/first-agent',
    tag: 'Облако',
  },
  {
    title: 'Обзор руководств',
    description: 'Выбор по роли или задаче.',
    to: '/docs/guides',
    tag: 'Каталог',
  },
];

export const officeFieldNextSteps: NextStepItem[] = [
  {
    title: 'Каналы',
    description: 'Битрикс24 и Телеграм в задачах.',
    to: '/docs/guides/06-channels',
    tag: 'Интеграции',
  },
  {
    title: 'Согласования',
    description: 'Очередь решений в панели.',
    to: '/docs/guides/04-trust-and-approval',
    tag: 'Контроль',
  },
  {
    title: 'Обзор «Офис»',
    description: 'Как включить и что видит руководитель.',
    to: '/docs/office/overview',
    tag: 'Справка',
  },
  {
    title: 'Обзор руководств',
    description: 'Вернуться к каталогу.',
    to: '/docs/guides',
    tag: 'Каталог',
  },
];

export const appsIndexNextSteps: NextStepItem[] = [
  {
    title: 'EDPortal',
    description: 'Онбординг, тесты и сертификаты в Битрикс24.',
    to: '/docs/apps/edportal',
    tag: 'LMS',
  },
  {
    title: 'Заявки PRO',
    description: 'Каталог процессов портала и права доступа.',
    to: '/docs/apps/requestspro',
    tag: 'Заявки',
  },
];

export const appsEdportalNextSteps: NextStepItem[] = [
  {
    title: 'Установка',
    description: 'Маркетплейс, лицензия и первый запуск.',
    to: '/docs/apps/edportal/installation',
    tag: 'Старт',
  },
  {
    title: 'Настройка',
    description: 'Роли, отделы и оболочки после установки.',
    to: '/docs/apps/edportal/setup',
    tag: 'Настройка',
  },
  {
    title: 'Курсы',
    description: 'Публикация, назначения и сертификаты.',
    to: '/docs/apps/edportal/courses',
    tag: 'Обучение',
  },
  {
    title: 'API агента',
    description: 'HTTP /api/v1/agent для внешних систем.',
    to: '/docs/apps/edportal/api',
    tag: 'API',
  },
];

export const appsRequestsproNextSteps: NextStepItem[] = [
  {
    title: 'Установка',
    description: 'Маркетплейс, лицензия и пункт меню.',
    to: '/docs/apps/requestspro/installation',
    tag: 'Старт',
  },
  {
    title: 'Каталог',
    description: 'Группы и карточки процессов портала.',
    to: '/docs/apps/requestspro/catalog',
    tag: 'Каталог',
  },
  {
    title: 'Доступ',
    description: 'Всем, отделам или сотрудникам.',
    to: '/docs/apps/requestspro/access',
    tag: 'Права',
  },
];
