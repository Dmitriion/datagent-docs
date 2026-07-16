import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type DiagramContextProps = {
  title: string;
  description: string;
};

export default function DiagramContext({
  title,
  description,
}: DiagramContextProps): ReactNode {
  return (
    <div className={styles.context}>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
