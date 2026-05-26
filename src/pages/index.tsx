import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/quickstart">
            Быстрый старт
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/concepts/what-is-datagent">
            Концепции
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Datagent Docs"
      description="Документация AI-оркестратора Datagent для российского МСБ — GigaChat, YandexGPT, Bitrix24, BrowserBridge.">
      <HomepageHeader />
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--4">
            <h3>Getting Started</h3>
            <p>Установка, переменные окружения и первый агент в Board.</p>
            <Link to="/docs/getting-started/installation">Установка →</Link>
          </div>
          <div className="col col--4">
            <h3>Интеграции</h3>
            <p>Bitrix24, Telegram и российские LLM из коробки.</p>
            <Link to="/docs/integrations/bitrix24">Bitrix24 →</Link>
          </div>
          <div className="col col--4">
            <h3>API</h3>
            <p>Запуск run из ваших систем через REST.</p>
            <Link to="/docs/api-reference/overview">REST API →</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
