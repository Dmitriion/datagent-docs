import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type DocPathCardProps = {
  title: string;
  description: string;
  to: string;
  tag?: string;
};

export default function DocPathCard({
  title,
  description,
  to,
  tag,
}: DocPathCardProps): ReactNode {
  return (
    <Link to={to} className={clsx('surface surface--lift', styles.card)}>
      {tag ? <span className={styles.tag}>{tag}</span> : null}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.cta}>Перейти →</span>
    </Link>
  );
}
