import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type GuideMetaProps = {
  audience: string;
  level: string;
  estimatedTime?: string;
};

export default function GuideMeta({
  audience,
  level,
  estimatedTime,
}: GuideMetaProps): ReactNode {
  return (
    <p className={styles.meta} role="note">
      <span>
        <span className={styles.label}>Для кого:</span> {audience}
      </span>
      <span className={styles.sep} aria-hidden="true">
        ·
      </span>
      <span>
        <span className={styles.label}>Уровень:</span> {level}
      </span>
      {estimatedTime ? (
        <>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span>
            <span className={styles.label}>Время:</span> {estimatedTime}
          </span>
        </>
      ) : null}
    </p>
  );
}
