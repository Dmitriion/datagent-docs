import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ToolCountProps = {
  count: number;
  serviceName: string;
  categories: string[];
  note?: string;
};

export default function ToolCount({
  count,
  serviceName,
  categories,
  note = 'Только чтение · агент использует нужные данные для ответа · Studio и выше',
}: ToolCountProps): ReactNode {
  return (
    <div className={styles.card} role="group" aria-label={`${count} инструментов для ${serviceName}`}>
      <div className={styles.numberBlock}>
        <span className={styles.number}>{count}</span>
        <span className={styles.numberLabel}>инструментов</span>
      </div>
      <div className={styles.body}>
        <p className={styles.lead}>
          Datagent даёт ИИ-агенту доступ к данным <strong>{serviceName}</strong> — без ручных выгрузок.
        </p>
        <ul className={styles.categories}>
          {categories.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={styles.note}>{note}</p>
      </div>
    </div>
  );
}
