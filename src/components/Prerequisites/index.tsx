import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type PrerequisitesProps = {
  items: string[];
  heading?: string;
};

export default function Prerequisites({
  items,
  heading = 'До начала',
}: PrerequisitesProps): ReactNode {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="prerequisites-heading">
      <h2 id="prerequisites-heading" className={styles.heading}>
        {heading}
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
