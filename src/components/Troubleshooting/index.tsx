import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type TroubleshootingItem = {
  problem: string;
  cause?: string;
  check: string;
  href?: string;
  linkLabel?: string;
};

export type TroubleshootingProps = {
  items: TroubleshootingItem[];
  heading?: string;
};

export default function Troubleshooting({
  items,
  heading = 'Если что-то не получилось',
}: TroubleshootingProps): ReactNode {
  if (!items.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="troubleshooting-heading">
      <h2 id="troubleshooting-heading">{heading}</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.problem} className={styles.item}>
            <summary className={styles.summary}>{item.problem}</summary>
            <div className={styles.body}>
              {item.cause ? (
                <p>
                  <strong>Возможная причина:</strong> {item.cause}
                </p>
              ) : null}
              <p>
                <strong>Что проверить:</strong> {item.check}
              </p>
              {item.href ? (
                <p>
                  <a href={item.href}>{item.linkLabel ?? 'Подробнее'}</a>
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
