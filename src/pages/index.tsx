import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const JOURNEY_STEPS = [
  {n: '1', title: 'Зарегистрируйтесь', desc: 'Бесплатно, без карты — на app.datagent.ru'},
  {n: '2', title: 'Запустите агента', desc: 'Шаблон или с нуля. Первый результат — 5 минут.'},
  {n: '3', title: 'Подключите инструменты', desc: 'Bitrix24, 1С, Telegram, браузер.'},
  {n: '4', title: 'Контролируйте', desc: 'Одобряйте действия, смотрите отчёты, масштабируйте.'},
] as const;

const CARDS = [
  {
    icon: '🚀',
    title: 'Начало работы',
    desc: 'Первый агент за 5 минут.',
    href: '/docs/cloud/getting-started',
  },
  {
    icon: '💡',
    title: 'Концепции',
    desc: 'Как работает платформа.',
    href: '/docs/concepts/what-is-datagent',
  },
  {
    icon: '📖',
    title: 'Учебник',
    desc: '8 реальных сценариев.',
    href: '/docs/guides',
  },
  {
    icon: '🔌',
    title: 'Интеграции',
    desc: 'Bitrix24, 1С, GigaChat, Telegram.',
    href: '/docs/integrations/bitrix24',
  },
  {
    icon: '🏢',
    title: 'Офис агентов',
    desc: 'Живой виртуальный офис.',
    href: '/docs/office/overview',
  },
  {
    icon: '🛠',
    title: 'Туториалы',
    desc: 'CRM, браузер, плагины пошагово.',
    href: '/docs/tutorials',
  },
  {
    icon: '⚙️',
    title: 'API',
    desc: 'Справочник для разработчиков.',
    href: '/docs/api-reference/overview',
  },
  {
    icon: '📋',
    title: 'Changelog',
    desc: 'Что нового в каждой версии.',
    href: '/docs/changelog',
  },
] as const;

export default function Home(): ReactNode {
  return (
    <Layout
      title="Документация Datagent"
      description="Запустите AI-агентов для бизнеса за 5 минут. Bitrix24, 1С, GigaChat, Telegram — из коробки.">
      <main className="container home-page">
        <div className="hero-block">
          <h1>Документация Datagent</h1>
          <p>
            Запустите AI-агентов для своего бизнеса за 5 минут.
            <br />
            Bitrix24, 1С, GigaChat, Telegram — из коробки.
          </p>
          <div className="hero-actions">
            <a href="https://app.datagent.ru">Начать бесплатно →</a>
            <Link to="/docs/cloud/getting-started">Быстрый старт</Link>
          </div>
        </div>

        <p className="time-estimate">⏱ ~5 мин до первого агента</p>

        <div className="journey-steps">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.n} className="journey-step">
              <span className="journey-n">{s.n}</span>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="cards-grid">
          {CARDS.map((card) => (
            <Link key={card.href} className="doc-card" to={card.href}>
              <div className="doc-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
