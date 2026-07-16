import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ScenarioCard = {
  role: string;
  problem: string;
  question: string;
  result: string;
};

export type ScenarioCardsProps = {
  items: ScenarioCard[];
  heading?: string;
};

export default function ScenarioCards({
  items,
  heading = 'Сценарии для разных ролей',
}: ScenarioCardsProps): ReactNode {
  const cards = items.slice(0, 4);

  return (
    <section className={styles.section} aria-labelledby="scenario-cards-heading">
      <h2 id="scenario-cards-heading">{heading}</h2>
      <div className={styles.grid}>
        {cards.map((card) => (
          <article key={`${card.role}-${card.question}`} className={styles.card}>
            <p className={styles.role}>{card.role}</p>
            <p className={styles.problem}>{card.problem}</p>
            <blockquote className={styles.question}>
              <span className={styles.questionLabel}>Спросите</span>
              <p>«{card.question}»</p>
            </blockquote>
            <p className={styles.result}>
              <span className={styles.resultLabel}>Результат</span>
              {card.result}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
