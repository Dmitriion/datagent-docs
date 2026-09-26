import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import SiteJsonLd from '@site/src/components/SiteJsonLd';
import styles from './index.module.css';

const JOURNEY_STEPS = [
  {n: '1', title: 'Зарегистрируйтесь', desc: 'Бесплатно, без карты, на app.datagent.ru'},
  {n: '2', title: 'Запустите агента', desc: 'Шаблон или с нуля; первый итог — в журнале задачи'},
  {
    n: '3',
    title: 'Подключите данные',
    desc: 'CRM, маркетплейсы, склад, почта; готовые коннекторы — только чтение',
  },
  {
    n: '4',
    title: 'Выстройте работу',
    desc: 'Регулярные задачи, согласования, обзор запусков',
  },
] as const;

const PRIMARY_CARDS = [
  {
    title: 'Что такое Datagent',
    desc: 'Платформа для ИИ-агентов компании: задачи, права доступа, согласование и журнал.',
    href: '/docs/concepts/what-is-datagent',
  },
  {
    title: 'Управление ИИ-агентами',
    desc: 'Для ИТ: права, согласования, журнал и лимиты расходов.',
    href: '/docs/concepts/upravlenie-ii-agentami',
  },
  {
    title: 'Начало работы / Cloud',
    desc: 'Регистрация на app.datagent.ru и первый агент — без своего сервера.',
    href: '/docs/cloud/getting-started',
  },
  {
    title: 'Согласования',
    desc: 'Рискованный шаг ждёт «да». Кто разрешил и что сделано — в журнале задачи.',
    href: '/docs/concepts/approvals',
  },
  {
    title: 'Интеграции',
    desc: 'МойСклад, WB, Ozon, CRM, почта и облако — ответы по живым данным, только чтение.',
    href: '/docs/integrations/overview',
  },
] as const;

const MORE_LINKS = [
  {title: 'Руководства', href: '/docs/guides'},
  {title: 'Сценарии', href: '/docs/tutorials'},
  {title: 'Рабочие процессы', href: '/docs/workflows/pipelines'},
  {title: 'API Reference', href: '/docs/api-reference/overview'},
  {title: 'Office и артефакты', href: '/docs/office/overview'},
  {title: 'История обновлений', href: '/docs/changelog'},
] as const;

/**
 * Intentional stub until a real panel PNG exists. Do not invent a fake product UI.
 * TODO(Dmitrii): drop a PNG of the panel (задача → «да» → журнал) at
 * `static/img/product/task-approval.png` and set PRODUCT_SHOT to
 * '/img/product/task-approval.png'.
 */
const PRODUCT_SHOT: string | null = null;

export default function Home(): ReactNode {
  return (
    <Layout
      title="Документация Datagent — платформа ИИ-агентов для бизнеса"
      description="Как запускать и вести ИИ-агентов компании в Datagent: задачи, права доступа, согласования, журнал и интеграции с российскими сервисами. Старт в Cloud без своего сервера.">
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
                Задачи агентам, права на данные, согласование риска и журнал.
              </p>
              <p className={styles.heroLead}>
                Поручайте сводки и отчёты по разрешённым данным. Результат — в
                задаче, шаги — в журнале, рискованные действия — после вашего
                «да».
              </p>

              <div className={styles.heroButtons}>
                <a
                  className={clsx('button button--primary button--lg', styles.ctaPrimary)}
                  href="https://app.datagent.ru/signup">
                  Зарегистрироваться
                </a>
                <Link
                  className={clsx('button button--outline button--lg', styles.ghostOnDark)}
                  to="/docs/cloud/getting-started">
                  Начало работы
                </Link>
              </div>

              <p className={styles.timeBadge}>
                Бесплатно: до 3 агентов и 100 запусков в месяц, без карты
              </p>
            </div>

            <figure className={styles.heroPreview}>
              {PRODUCT_SHOT ? (
                <img
                  className={styles.previewImage}
                  src={PRODUCT_SHOT}
                  width={720}
                  height={480}
                  alt="Панель Datagent: задача, согласование и журнал"
                />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <p className={styles.previewPlaceholderTitle}>Кадр панели</p>
                  <p className={styles.previewPlaceholderHint}>
                    задача, согласование, журнал
                  </p>
                </div>
              )}
              <figcaption className={styles.previewCaption}>
                Здесь будет кадр панели
              </figcaption>
            </figure>
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
            {PRIMARY_CARDS.map((card) => (
              <Link key={card.href} className={clsx(styles.docCard, styles.docCardAccent)} to={card.href}>
                <h3 className={styles.docCardTitle}>{card.title}</h3>
                <p className={styles.docCardDesc}>{card.desc}</p>
                <span className={styles.docCardArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>

          <nav className={styles.moreNav} aria-label="Другие разделы">
            <p className={styles.moreLabel}>Ещё в документации</p>
            <ul className={styles.moreList}>
              {MORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link className={styles.moreLink} to={item.href}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
    </Layout>
  );
}
