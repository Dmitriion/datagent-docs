import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const JOURNEY_STEPS = [
  {n: '1', title: 'Зарегистрируйтесь', desc: 'Бесплатно, без карты — на app.datagent.ru'},
  {n: '2', title: 'Запустите агента', desc: 'Шаблон или с нуля. Первый результат — 5 минут.'},
  {n: '3', title: 'Подключите инструменты', desc: 'Bitrix24, 1С, Telegram, браузер.'},
  {n: '4', title: 'Контролируйте', desc: 'Одобряйте действия, смотрите отчёты, масштабируйте.'},
] as const;

const INTEGRATIONS = ['Bitrix24', '1С', 'GigaChat', 'Telegram', 'BrowserBridge'] as const;

const CARDS = [
  {
    icon: '🚀',
    title: 'Начало работы',
    desc: 'Первый агент за 5 минут — регистрация, модель, запуск.',
    href: '/docs/cloud/getting-started',
    accent: true,
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
    accent: true,
  },
  {
    icon: '🏢',
    title: 'Office',
    desc: 'Живой виртуальный офис.',
    href: '/docs/office/overview',
  },
  {
    icon: '📎',
    title: 'Артефакты',
    desc: 'Каталог файлов и результатов агентов.',
    href: '/docs/artifacts/overview',
    accent: true,
  },
  {
    icon: '🛠',
    title: 'Сценарии',
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
    title: 'История изменений',
    desc: 'Что нового в каждой версии.',
    href: '/docs/changelog',
  },
] as const;

export default function Home(): ReactNode {
  return (
    <Layout
      title="Datagent"
      description="Запустите AI-агентов для бизнеса за 5 минут. Bitrix24, 1С, GigaChat, Telegram — из коробки.">
      <main className={styles.homePage}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={clsx('container', styles.heroGrid)}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Облачная платформа · app.datagent.ru</p>
              <h1 id="home-title" className={styles.heroTitle}>
                <span className="text-gradient">Datagent</span>
              </h1>
              <p className={styles.heroSubline}>
                Запустите AI-агентов для своего бизнеса за 5 минут. Bitrix24, 1С,
                GigaChat и Telegram — из коробки, с журналом и одобрениями.
              </p>

              <ul className={styles.chipRow} aria-label="Интеграции">
                {INTEGRATIONS.map((name) => (
                  <li key={name} className={styles.chip}>
                    {name}
                  </li>
                ))}
              </ul>

              <div className={styles.heroButtons}>
                <a
                  className={clsx('button button--primary button--lg', styles.ctaPrimary)}
                  href="https://app.datagent.ru/signup">
                  Начать бесплатно →
                </a>
                <Link
                  className={clsx('button button--outline button--lg', styles.ghostOnDark)}
                  to="/docs/cloud/getting-started">
                  Быстрый старт
                </Link>
              </div>

              <p className={styles.timeBadge}>⏱ ~5 мин до первого агента · Free: 3 агента, 100 запусков</p>
            </div>

            <div className={styles.heroPreview} aria-hidden="true">
              <div className={styles.previewWindow}>
                <div className={styles.previewChrome}>
                  <span className={styles.previewDot} />
                  <span className={styles.previewDot} />
                  <span className={styles.previewDot} />
                  <span className={styles.previewChromeTitle}>Задача · Bitrix24</span>
                </div>
                <div className={styles.previewBody}>
                  <div className={styles.previewMeta}>
                    <span className={styles.previewBadge}>GigaChat</span>
                    <span className={styles.previewStatus}>Выполняется</span>
                  </div>
                  <p className={styles.previewLine}>
                    Собрал 12 просроченных сделок из воронки «Продажи»
                  </p>
                  <p className={styles.previewLineMuted}>
                    Ожидает одобрения: отправить напоминания менеджерам
                  </p>
                  <div className={styles.previewFooter}>
                    <span className={styles.previewBtnPrimary}>Одобрить</span>
                    <span className={styles.previewBtnGhost}>Журнал</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={clsx('container', styles.section, styles.journeySection)}
          aria-labelledby="journey-title">
          <header className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Путь новичка</p>
            <h2 id="journey-title" className={styles.sectionTitle}>
              С чего начать
            </h2>
            <p className={styles.sectionLead}>Четыре шага до первого результата в панели.</p>
          </header>

          <ol className={styles.journeySteps}>
            {JOURNEY_STEPS.map((s) => (
              <li key={s.n} className={styles.journeyStep}>
                <span className={styles.journeyN}>{s.n}</span>
                <strong className={styles.journeyTitle}>{s.title}</strong>
                <p className={styles.journeyDesc}>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={clsx('container', styles.section, styles.exploreSection)}
          aria-labelledby="explore-title">
          <header className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Справка</p>
            <h2 id="explore-title" className={styles.sectionTitle}>
              Разделы документации
            </h2>
            <p className={styles.sectionLead}>
              От быстрого старта до API — выберите, что нужно сейчас.
            </p>
          </header>

          <div className={styles.cardsGrid}>
            {CARDS.map((card) => (
              <Link
                key={card.href}
                className={clsx(
                  styles.docCard,
                  'accent' in card && card.accent && styles.docCardAccent,
                )}
                to={card.href}>
                <span className={styles.docCardIcon} aria-hidden="true">
                  {card.icon}
                </span>
                <h3 className={styles.docCardTitle}>{card.title}</h3>
                <p className={styles.docCardDesc}>{card.desc}</p>
                <span className={styles.docCardArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
