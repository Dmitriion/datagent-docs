import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type TaskLink = {
  title: string;
  description: string;
  hrefs: {label: string; to: string}[];
};

export type TaskPickerProps = {
  items: TaskLink[];
  heading?: string;
};

export default function TaskPicker({
  items,
  heading = 'Выберите свою задачу',
}: TaskPickerProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="task-picker-heading">
      <h2 id="task-picker-heading">{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.links}>
              {item.hrefs.map((link, index) => (
                <span key={link.to}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <Link to={link.to}>{link.label}</Link>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
