import type {ReactNode} from 'react';
import DocPathCard from '@site/src/components/DocPathCard';
import styles from './styles.module.css';

export type NextStepItem = {
  title: string;
  description: string;
  to: string;
  tag?: string;
};

export type DocNextStepsProps = {
  heading?: string;
  items: NextStepItem[];
};

export default function DocNextSteps({
  heading = 'Дальше',
  items,
}: DocNextStepsProps): ReactNode {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="doc-next-steps-heading">
      <h2 id="doc-next-steps-heading" className={styles.heading}>
        {heading}
      </h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <DocPathCard key={item.to} {...item} />
        ))}
      </div>
    </section>
  );
}
