import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type ConnectorMaturity = 'available' | 'developing';

export type ConnectorStatusProps = {
  version: string;
  /** Доступно | Развивается */
  maturity?: ConnectorMaturity;
  /** Показывать чип «Только чтение» */
  readOnly?: boolean;
  /** Подпись статуса (перекрывает maturity) */
  statusLabel?: string;
  /** Дата/метка обновления — только если подтверждена, без дефолта */
  updatedLabel?: string;
};

function labelForMaturity(maturity: ConnectorMaturity): string {
  switch (maturity) {
    case 'available':
      return 'Доступно';
    case 'developing':
      return 'Развивается';
    default: {
      const _exhaustive: never = maturity;
      return _exhaustive;
    }
  }
}

export default function ConnectorStatus({
  version,
  maturity = 'available',
  readOnly = true,
  statusLabel,
  updatedLabel,
}: ConnectorStatusProps): ReactNode {
  const status = statusLabel ?? labelForMaturity(maturity);
  const isDeveloping = maturity === 'developing' || status === 'Развивается';

  return (
    <p
      className={clsx(styles.row, isDeveloping ? styles.developing : styles.available)}
      role="status"
    >
      <span className={styles.chip}>
        <span className={styles.dot} aria-hidden="true" />
        {status}
      </span>
      {readOnly ? <span className={styles.chipMuted}>Только чтение</span> : null}
      <span className={styles.meta}>Версия {version}</span>
      {updatedLabel ? <span className={styles.meta}>{updatedLabel}</span> : null}
    </p>
  );
}
