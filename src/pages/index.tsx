import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import SiteJsonLd from '@site/src/components/SiteJsonLd';
import styles from './index.module.css';

const JOURNEY_STEPS = [
  {n: '1', title: 'Зарегистрируйтесь', desc: 'Бесплатно, без карты — на app.datagent.ru'},
  {n: '2', title: 'Запустите агента', desc: 'Шаблон или с нуля — первый ответ в журнале задачи.'},
  {n: '3', title: 'Подключите данные', desc: 'CRM, маркетплейсы, склад, почта — только чтение.'},
  {n: '4', title: 'Выстройте процесс', desc: 'Конвейеры, согласования и контроль по Таймлайну.'},
] as const;

const INTEGRATIONS = [
  'МойСклад',
  'Wildberries',
  'amoCRM',
  'Битрикс24',
  '1С',
  'GigaChat',
] as const;

const CARDS = [
  {
    title: 'Что такое Datagent',
    desc: 'Платформа ИИ-агентов для бизнеса: задачи, доступы и журнал — не одиночный чат.',
    href: '/docs/concepts/what-is-datagent',
    accent: true,
  },
  {
    title: 'Начало работы',
    desc: 'Регистрация в Cloud и первый агент — чтобы увидеть результат в панели.',
    href: '/docs/cloud/getting-started',
    accent: true,
  },
  {
    title: 'Интеграции',
    desc: 'МойСклад, WB, Ozon, CRM, почта и облако — ответы по живым данным, только чтение.',
    href: '/docs/integrations/overview',
    accent: true,
  },
  {
    title: 'Руководства',
    desc: 'Ежедневная работа в панели: задачи, доступы, каналы и согласования.',
    href: '/docs/guides',
  },
  {
    title: 'Сценарии',
    desc: 'Практические пути: CRM-канал, плагин и следующий шаг после онбординга.',
    href: '/docs/tutorials',
  },
  {
    title: 'Cloud',
    desc: 'Работа в браузере на app.datagent.ru — без своего сервера для старта.',
    href: '/docs/cloud',
  },
  {
    title: 'Рабочие процессы',
    desc: 'Конвейеры и Таймлайн — многоэтапная работа и контроль запусков.',
    href: '/docs/workflows/pipelines',
  },
  {
    title: 'API Reference',
    desc: 'REST API Datagent — для разработчиков и автоматизации.',
    href: '/docs/api-reference/overview',
  },
  {
    title: 'Office и артефакты',
    desc: 'Документы на задаче и каталог файлов, которые подготовил агент.',
    href: '/docs/office/overview',
  },
  {
    title: 'История изменений',
    desc: 'Релизы и обновления продукта.',
    href: '/docs/changelog',
  },
] as const;

export default function Home(): ReactNode {
  return (
    <Layout
      title="Документация Datagent — ИИ-агенты для бизнеса"
      description="Документация Datagent: ИИ-агенты для рабочих задач, Cloud, интеграции с российскими сервисами, руководства оператора и API. Старт на app.datagent.ru.">
      <SiteJsonLd />
      <main className={styles.homePage}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={clsx('container', styles.heroGrid)}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Документация · app.datagent.ru</p>
              <h1 id="home-title" className={styles.heroTitle}>
                Документация <span className="text-brand">Datagent</span>
              </h1>
              <p className={styles.heroSubline}>
                Поручайте ИИ-агентам сводки, контроль отклонений и регулярные
                отчёты по разрешённым данным компании. Результат — в задаче, с
                журналом шагов и согласованиями.
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
                Free: до 3 агентов и 100 запусков в месяц · без карты
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
              Понять продукт → Cloud → интеграции → ежедневные руководства.
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
