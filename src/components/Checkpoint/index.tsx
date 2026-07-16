import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type CheckpointProps = {
  children: ReactNode;
  heading?: string;
};

export default function Checkpoint({
  children,
  heading = 'Проверьте результат',
}: CheckpointProps): ReactNode {
  return (
    <aside className={styles.box} aria-labelledby="checkpoint-heading">
      <h2 id="checkpoint-heading" className={styles.heading}>
        {heading}
      </h2>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
