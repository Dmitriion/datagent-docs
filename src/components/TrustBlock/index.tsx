import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type TrustItem = {
  title: string;
  text: string;
};

export type TrustBlockProps = {
  items: TrustItem[];
  heading?: string;
};

export default function TrustBlock({
  items,
  heading = 'Как устроен доступ',
}: TrustBlockProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="trust-block-heading">
      <h2 id="trust-block-heading">{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
