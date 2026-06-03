import type {ReactNode} from 'react';
import DocPathCard from '@site/src/components/DocPathCard';
import styles from './styles.module.css';

const paths = [
  {
    title: 'Начало работы',
    description: 'Установка, переменные окружения и первый агент в Board.',
    to: '/docs/getting-started/quickstart',
    tag: 'Старт',
  },
  {
    title: 'Концепции',
    description: 'Control plane, архитектура server/ui, heartbeat и плагины.',
    to: '/docs/concepts/what-is-datagent',
    tag: 'Платформа',
  },
  {
    title: 'Работа с платформой',
    description: 'Board, агенты, задачи, одобрения — для оператора и менеджера.',
    to: '/docs/guides',
    tag: 'Пользователям',
  },
  {
    title: 'Интеграции',
    description: 'GigaChat, YandexGPT, Bitrix24, Телеграм из коробки.',
    to: '/docs/integrations/gigachat',
    tag: 'LLM и CRM',
  },
  {
    title: 'Офис и документы',
    description: 'Пространство «Офис», 1С MCP-коннектор и Office Plugin для Excel/PPTX.',
    to: '/docs/office/overview',
    tag: 'Оператору',
  },
  {
    title: 'Туториалы',
    description: 'CRM-автоматизация, BrowserBridge и свой плагин.',
    to: '/docs/tutorials/automate-crm',
    tag: 'Практика',
  },
  {
    title: 'API',
    description: 'Wakeup, heartbeat-runs и выполнение tools плагинов.',
    to: '/docs/api-reference/overview',
    tag: 'Инженерам',
  },
  {
    title: 'История версий',
    description: 'Changelog и изменения документации.',
    to: '/docs/changelog',
    tag: 'Обновления',
  },
] as const;

const stackPills = ['Node 20+', 'pnpm', 'PostgreSQL', ':3100', 'self-hosted'] as const;

export default function HomePaths(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.pillStrip} aria-label="Стек">
          {stackPills.map((pill) => (
            <span key={pill} className={styles.pill}>
              {pill}
            </span>
          ))}
        </div>
        <h2 className={styles.heading}>Разделы документации</h2>
        <div className={styles.grid}>
          {paths.map((item) => (
            <DocPathCard key={item.to} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
