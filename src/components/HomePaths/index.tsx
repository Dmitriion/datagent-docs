import type {ReactNode} from 'react';
import DocPathCard from '@site/src/components/DocPathCard';
import styles from './styles.module.css';

const paths = [
  {
    title: 'Быстрый старт',
    description:
      'Регистрация на app.datagent.ru и первый запущенный агент — пять шагов, около 5 минут.',
    to: '/docs/cloud/getting-started',
    tag: 'Старт',
  },
  {
    title: 'Что такое Datagent',
    description:
      'Облачная платформа AI-агентов: зачем бизнесу, чем отличается от чата с GPT.',
    to: '/docs/concepts/what-is-datagent',
    tag: 'О продукте',
  },
  {
    title: 'Тарифы и кредиты',
    description: 'Free, PRO 990 ₽, Business 3 900 ₽ — что входит и как тратятся кредиты.',
    to: '/docs/cloud/pricing',
    tag: 'Цены',
  },
  {
    title: 'Учебник',
    description:
      'Восемь коротких историй: задачи, согласования, «Офис», Битрикс24 и документы.',
    to: '/docs/guides',
    tag: 'Для команды',
  },
  {
    title: 'Битрикс24 и GigaChat',
    description:
      'Российские интеграции из коробки — то, чего нет у n8n и Dify без доработок.',
    to: '/docs/integrations/bitrix24',
    tag: 'Интеграции',
  },
  {
    title: 'Первый агент',
    description: 'Как выбрать модель, подключить ключи и нажать «Запустить».',
    to: '/docs/cloud/first-agent',
    tag: '5 минут',
  },
  {
    title: 'Программный интерфейс',
    description: 'Для разработчиков: автоматизация запусков и плагинов через API.',
    to: '/docs/api-reference/overview',
    tag: 'Для IT',
  },
  {
    title: 'История версий',
    description: 'Что изменилось в справке и продукте.',
    to: '/docs/changelog',
    tag: 'Обновления',
  },
] as const;

const stackPills = [
  'Облако SaaS',
  'Free · 3 агента',
  'GigaChat',
  'YandexGPT',
  'Битрикс24',
  'Кредиты',
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
        <h2 className={styles.heading}>Куда идти дальше</h2>
        <div className={styles.grid}>
          {paths.map((item) => (
            <DocPathCard key={item.to} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
