import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type TaskGuideItem = {
  title: string;
  description: string;
  to: string;
};

export type TaskGuideCatalogProps = {
  items: TaskGuideItem[];
  heading?: string;
};

export default function TaskGuideCatalog({
  items,
  heading = 'Каталог по задачам',
}: TaskGuideCatalogProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="task-guide-catalog-heading">
      <h2 id="task-guide-catalog-heading">{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to} className={styles.item}>
            <Link className={styles.link} to={item.to}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.description}>{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
