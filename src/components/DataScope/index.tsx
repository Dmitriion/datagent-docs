import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type DataScopeProps = {
  canAnalyze: string[];
  cannotChange: string[];
  heading?: string;
  note?: string;
};

export default function DataScope({
  canAnalyze,
  cannotChange,
  heading = 'Что агент видит и чего не делает',
  note = 'Агент анализирует данные подключённого аккаунта. Изменения в сервисе вы выполняете сами.',
}: DataScopeProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="data-scope-heading">
      <h2 id="data-scope-heading">{heading}</h2>
      <p className={styles.note}>{note}</p>
      <div className={styles.grid}>
        <div className={styles.can}>
          <h3 className={styles.colTitle}>Может анализировать</h3>
          <ul>
            {canAnalyze.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.cannot}>
          <h3 className={styles.colTitle}>Не изменяет</h3>
          <ul>
            {cannotChange.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
