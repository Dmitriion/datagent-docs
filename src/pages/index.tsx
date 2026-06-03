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
        <p className={styles.eyebrow}>Control plane · self-hosted</p>
        <Heading as="h1" className={clsx(styles.heroTitle, 'text-gradient')}>
          Документация Datagent
        </Heading>
        <p className={styles.heroSubline}>
          Операционная платформа для AI-агентов: Board, API на{' '}
          <code>:3100</code>, heartbeat и плагины. Прозрачное исполнение для
          оператора и инженера.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quickstart">
            Быстрый старт
          </Link>
          <Link
            className={clsx('button button--outline button--lg', styles.ghostOnDark)}
            to="/docs/intro">
            Введение
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Документация Datagent"
      description="Документация операционной платформы Datagent: установка, control plane, API :3100, GigaChat, YandexGPT, Bitrix24, BrowserBridge.">
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
