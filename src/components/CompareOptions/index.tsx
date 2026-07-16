import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type CompareOption = {
  title: string;
  subtitle: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  recommended?: boolean;
};

export type CompareOptionsProps = {
  options: CompareOption[];
  heading?: string;
};

export default function CompareOptions({
  options,
  heading = 'Какой вариант выбрать',
}: CompareOptionsProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="compare-options-heading">
      <h2 id="compare-options-heading">{heading}</h2>
      <div className={styles.grid}>
        {options.map((option) => (
          <article
            key={option.title}
            className={option.recommended ? styles.cardRecommended : styles.card}
          >
            {option.recommended ? (
              <p className={styles.badge}>Чаще всего подходит</p>
            ) : null}
            <h3 className={styles.title}>{option.title}</h3>
            <p className={styles.subtitle}>{option.subtitle}</p>
            <ul className={styles.points}>
              {option.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link className={styles.cta} to={option.ctaHref}>
              {option.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
