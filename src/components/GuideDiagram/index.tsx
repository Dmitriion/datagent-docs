import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type GuideDiagramProps = {
  src: string;
  alt: string;
  scrollHint?: boolean;
  children?: ReactNode;
};

/**
 * Responsive frame for guide/workflow diagrams (SVG or raster).
 * Preserves source URLs; does not convert or replace assets.
 */
export default function GuideDiagram({
  src,
  alt,
  scrollHint = false,
  children,
}: GuideDiagramProps): ReactNode {
  return (
    <figure className={styles.figure}>
      <div
        className={scrollHint ? styles.scrollFrame : styles.frame}
        tabIndex={scrollHint ? 0 : undefined}
        role={scrollHint ? 'region' : undefined}
        aria-label={scrollHint ? 'Схема: прокрутите по горизонтали при необходимости' : undefined}
      >
        <img className={styles.media} src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {children}
      {scrollHint ? (
        <p className={styles.hint}>На узком экране прокрутите схему в сторону, чтобы увидеть детали.</p>
      ) : null}
    </figure>
  );
}
