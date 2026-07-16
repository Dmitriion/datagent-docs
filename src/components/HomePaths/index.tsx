import type {ReactNode} from 'react';
import DocPathCard from '@site/src/components/DocPathCard';
import styles from './styles.module.css';

const paths = [
  {
    title: 'Что такое Datagent',
    description:
      'Платформа ИИ-агентов для бизнеса: задачи, доступы и журнал — не одиночный чат.',
    to: '/docs/concepts/what-is-datagent',
    tag: 'О продукте',
  },
  {
    title: 'Быстрый старт в Cloud',
    description:
      'Регистрация на app.datagent.ru: компания, агент и первая задача в журнале.',
    to: '/docs/cloud/getting-started',
    tag: 'Старт',
  },
  {
    title: 'Интеграции',
    description:
      'МойСклад, Wildberries, Ozon, amoCRM и другие сервисы — только чтение.',
    to: '/docs/integrations/overview',
    tag: 'Данные',
  },
  {
    title: 'Руководства',
    description:
      'Ежедневная работа в панели: задачи, согласования, каналы и доступы.',
    to: '/docs/guides',
    tag: 'Практика',
  },
  {
    title: 'Тарифы',
    description:
      'Free, Solo 990 ₽, Studio 3 900 ₽, Business 12 900 ₽ — лимиты и состав.',
    to: '/docs/cloud/pricing',
    tag: 'Цены',
  },
  {
    title: 'Первый агент',
    description: 'Как выбрать модель, подключить ключи и запустить задачу.',
    to: '/docs/cloud/first-agent',
    tag: 'Практика',
  },
  {
    title: 'REST API',
    description: 'Справочник для разработчиков: автоматизация запусков и плагинов.',
    to: '/docs/api-reference/overview',
    tag: 'Для IT',
  },
  {
    title: 'MCP и BrowserBridge',
    description: 'Внешние инструменты и браузер для агентов с расширенными сценариями.',
    to: '/docs/integrations/mcp',
    tag: 'Для IT',
  },
] as const;

const stackPills = [
  'Cloud SaaS',
  'Free · 3 агента',
  'GigaChat',
  'YandexGPT',
  '16 коннекторов',
  'Только чтение',
] as const;

export default function HomePaths(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.pillStrip} aria-label="Возможности">
          {stackPills.map((pill) => (
            <span key={pill} className={styles.pill}>
              {pill}
            </span>
          ))}
        </div>
        <div className={styles.grid}>
          {paths.map((path) => (
            <DocPathCard key={path.to} {...path} />
          ))}
        </div>
      </div>
    </section>
  );
}
