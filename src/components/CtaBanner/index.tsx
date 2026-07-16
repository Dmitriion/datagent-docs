import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type CtaBannerProps = {
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  variant?: 'primary' | 'subtle';
};

export default function CtaBanner({
  title,
  description,
  buttonText = 'Зарегистрироваться',
  buttonUrl = 'https://app.datagent.ru/signup',
  variant = 'primary',
}: CtaBannerProps): ReactNode {
  return (
    <aside
      className={clsx(styles.banner, variant === 'subtle' ? styles.subtle : styles.primary)}
      aria-label={title}
    >
      <div className={styles.copy}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <a className={styles.button} href={buttonUrl} rel="noopener noreferrer">
        {buttonText}
      </a>
    </aside>
  );
}
