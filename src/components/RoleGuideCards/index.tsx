import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type RoleGuideLink = {
  label: string;
  to: string;
};

export type RoleGuideCard = {
  title: string;
  when: string;
  links: RoleGuideLink[];
};

export type RoleGuideCardsProps = {
  cards: RoleGuideCard[];
  heading?: string;
};

export default function RoleGuideCards({
  cards,
  heading = 'Каталог по ролям',
}: RoleGuideCardsProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="role-guide-cards-heading">
      <h2 id="role-guide-cards-heading">{heading}</h2>
      <div className={styles.grid}>
        {cards.map((card) => (
          <article key={card.title} className={styles.card}>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.when}>{card.when}</p>
            <ul className={styles.links}>
              {card.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
