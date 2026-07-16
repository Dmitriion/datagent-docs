import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type DiagramCaptionProps = {
  children: ReactNode;
};

export default function DiagramCaption({
  children,
}: DiagramCaptionProps): ReactNode {
  return <figcaption className={styles.caption}>{children}</figcaption>;
}
