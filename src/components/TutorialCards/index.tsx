import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type TutorialCard = {
  title: string;
  audience: string;
  result: string;
  href: string;
};

export type TutorialCardsProps = {
  items: TutorialCard[];
  heading?: string;
};

export default function TutorialCards({
  items,
  heading = 'Практические сценарии',
}: TutorialCardsProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="tutorial-cards-heading">
      <h2 id="tutorial-cards-heading">{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href} className={styles.card}>
            <p className={styles.audience}>{item.audience}</p>
            <Link className={styles.title} to={item.href}>
              {item.title}
            </Link>
            <p className={styles.result}>{item.result}</p>
            <Link className={styles.more} to={item.href}>
              Открыть сценарий
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
