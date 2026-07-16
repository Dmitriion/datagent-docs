import type {ReactNode} from 'react';
import ConnectorStatus, {
  type ConnectorMaturity,
} from '@site/src/components/ConnectorStatus';
import styles from './styles.module.css';

export type IntegrationHeroProps = {
  serviceName: string;
  /** Короткий результат для пользователя (1 строка) */
  outcome: string;
  version: string;
  toolCount: number;
  categories: string[];
  maturity?: ConnectorMaturity;
  readOnly?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  connectHref?: string;
  connectLabel?: string;
};

export default function IntegrationHero({
  serviceName,
  outcome,
  version,
  toolCount,
  categories,
  maturity = 'available',
  readOnly = true,
  ctaText = 'Зарегистрироваться',
  ctaUrl = 'https://app.datagent.ru/signup',
  connectHref = '#how-to-connect',
  connectLabel = 'Как подключить',
}: IntegrationHeroProps): ReactNode {
  const initial = serviceName.trim().charAt(0).toUpperCase() || 'D';

  return (
    <header className={styles.hero} aria-labelledby="integration-hero-title">
      <div className={styles.top}>
        <div className={styles.mark} aria-hidden="true">
          {initial}
        </div>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>Интеграция Datagent</p>
          <h1 id="integration-hero-title" className={styles.title}>
            Datagent + {serviceName}
          </h1>
          <p className={styles.outcome}>{outcome}</p>
        </div>
      </div>

      <ConnectorStatus
        version={version}
        maturity={maturity}
        readOnly={readOnly}
      />

      <div className={styles.metaRow}>
        <p className={styles.toolCount} aria-label={`${toolCount} инструментов`}>
          <strong>{toolCount}</strong>
          <span>инструментов</span>
        </p>
        <ul className={styles.categories}>
          {categories.slice(0, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <a className={styles.primary} href={ctaUrl} rel="noopener noreferrer">
          {ctaText}
        </a>
        <a className={styles.secondary} href={connectHref}>
          {connectLabel}
        </a>
      </div>
    </header>
  );
}
