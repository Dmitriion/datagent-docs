import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomePaths from '@site/src/components/HomePaths';

import styles from './index.module.css';

function HomepageHero() {
  return (
    <header className={clsx(styles.hero)}>
      <div className={clsx('container', styles.heroInner)}>
        <p className={styles.eyebrow}>Битрикс24 · GigaChat · облако · app.datagent.ru</p>
        <Heading as="h1" className={clsx(styles.heroTitle, 'text-gradient')}>
          AI-агенты для Битрикс24 и GigaChat — в облаке, без программиста
        </Heading>
        <p className={styles.heroSubline}>
          <strong>Datagent</strong> связывает чаты Битрикс24 с агентами на{' '}
          <strong>GigaChat</strong> и <strong>YandexGPT</strong>: клиент пишет в CRM —
          агент отвечает, а вы видите каждый шаг и одобряете важные действия.
          Регистрация на app.datagent.ru — ничего не ставите на сервер.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            href="https://app.datagent.ru/signup">
            Начать бесплатно
          </Link>
          <Link
            className={clsx('button button--outline button--lg', styles.ghostOnDark)}
            to="/docs/cloud/getting-started">
            Быстрый старт
          </Link>
        </div>
        <div className={styles.pricingBanner}>
          <p className={styles.pricingBannerTitle}>Тарифы</p>
          <p className={styles.pricingBannerText}>
            <strong>Free</strong> — 0 ₽, 3 агента, 100 запусков в месяц.
            <br />
            <strong>PRO</strong> — 990 ₽/мес · <strong>Business</strong> — 3 900 ₽/мес.
          </p>
          <Link className={styles.pricingBannerLink} to="/docs/cloud/pricing">
            Сравнить тарифы →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Datagent — облачные AI-агенты для бизнеса"
      description="Datagent: AI-агенты для Битрикс24 и GigaChat в облаке. Free — 3 агента. Старт на app.datagent.ru.">
      <a href="#main-content" className="skip-to-content">
        Перейти к содержимому
      </a>
      <HomepageHero />
      <main id="main-content">
        <HomePaths />
      </main>
    </Layout>
  );
}
