import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ProductHeroProps = {
  eyebrow?: string;
  title: string;
  lead: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
  secondaryHref?: string;
  facts?: string[];
};

export default function ProductHero({
  eyebrow = 'Документация Datagent',
  title,
  lead,
  primaryText = 'Зарегистрироваться',
  primaryUrl = 'https://app.datagent.ru/signup',
  secondaryText,
  secondaryHref,
  facts = [],
}: ProductHeroProps): ReactNode {
  return (
    <header className={styles.hero} aria-labelledby="product-hero-title">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 id="product-hero-title" className={styles.title}>
        {title}
      </h1>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.actions}>
        <a className={styles.primary} href={primaryUrl} rel="noopener noreferrer">
          {primaryText}
        </a>
        {secondaryText && secondaryHref ? (
          <a className={styles.secondary} href={secondaryHref}>
            {secondaryText}
          </a>
        ) : null}
      </div>
      {facts.length > 0 ? (
        <ul className={styles.facts}>
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
