import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const JOURNEY_STEPS = [
  {n: '1', title: 'Зарегистрируйтесь', desc: 'Бесплатно, без карты — на app.datagent.ru'},
  {n: '2', title: 'Запустите агента', desc: 'Шаблон или с нуля. Первый результат — 5 минут.'},
  {n: '3', title: 'Подключите инструменты', desc: 'Битрикс24, 1С, внешние сервисы, браузер.'},
  {n: '4', title: 'Выстройте процесс', desc: 'Конвейеры, согласования и контроль по Таймлайну.'},
] as const;

const INTEGRATIONS = ['Битрикс24', '1С', 'GigaChat', 'Телеграм', 'BrowserBridge', 'MCP'] as const;

const CARDS = [
  {
    icon: '🚀',
    title: 'Начало работы',
    desc: 'Регистрация и первый агент — чтобы увидеть результат в панели за пять минут.',
    href: '/docs/cloud/getting-started',
    accent: true,
  },
  {
    icon: '💡',
    title: 'Концепции',
    desc: 'Агенты, задачи и память — как устроена платформа изнутри.',
    href: '/docs/concepts/what-is-datagent',
  },
  {
    icon: '📖',
    title: 'Учебник',
    desc: 'Восемь историй — для ежедневной работы оператора и руководителя.',
    href: '/docs/guides',
  },
  {
    icon: '🔄',
    title: 'Рабочие процессы',
    desc: 'Конвейеры и Таймлайн — многоэтапная работа и контроль запусков.',
    href: '/docs/workflows/pipelines',
    accent: true,
  },
  {
    icon: '🔌',
    title: 'Интеграции',
    desc: 'Битрикс24, 1С, MCP, браузер и Телеграм — подключить к своим агентам.',
    href: '/docs/integrations',
    accent: true,
  },
  {
    icon: '🏢',
    title: 'Office',
    desc: 'Виртуальный офис — чтобы видеть команду агентов на одном экране.',
    href: '/docs/office/overview',
  },
  {
    icon: '📎',
    title: 'Артефакты',
    desc: 'Каталог файлов — найти всё, что агент создал в задачах.',
    href: '/docs/artifacts/overview',
  },
  {
    icon: '🛠',
    title: 'Сценарии',
    desc: 'Пошаговые инструкции — CRM, браузер или свой плагин.',
    href: '/docs/tutorials',
  },
  {
    icon: '⚙️',
    title: 'API Reference',
    desc: 'Справочник REST — для разработчиков, которые строят интеграции.',
    href: '/docs/api-reference/overview',
  },
  {
    icon: '📋',
    title: 'История изменений',
    desc: 'Релизы и обновления — что нового появилось в продукте.',
    href: '/docs/changelog',
  },
] as const;

export default function Home(): ReactNode {
  return (
    <Layout
      title="Datagent — ИИ-исполнители для бизнеса"
      description="ИИ-исполнители для руководителей и операционных команд: задачи, согласования, Битрикс24, 1С и контроль в одной панели.">
      <main className={styles.homePage}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={clsx('container', styles.heroGrid)}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Облачная платформа · app.datagent.ru</p>
              <h1 id="home-title" className={styles.heroTitle}>
                Поручите рутину <span className="text-gradient">ИИ-исполнителям</span>
              </h1>
              <p className={styles.heroSubline}>
                Просроченные сделки, ответы клиентам, сводки из 1С — агент готовит
                результат, а вы контролируете работу в журнале и согласованиях.
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

              <p className={styles.timeBadge}>
                <span aria-hidden="true">⏱</span> ~5 мин до первого агента · Free: 3
                агента, 100 запусков
              </p>
            </div>

            <div className={styles.heroPreview} aria-hidden="true">
              <div className={styles.previewWindow}>
                <div className={styles.previewChrome}>
                  <span className={styles.previewDot} />
                  <span className={styles.previewDot} />
                  <span className={styles.previewDot} />
                  <span className={styles.previewChromeTitle}>Задача · Битрикс24</span>
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
