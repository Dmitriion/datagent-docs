import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type GuideStartStep = {
  label: string;
  to?: string;
};

export type GuideStartPath = {
  title: string;
  description: string;
  steps: GuideStartStep[];
};

export type GuideStartPathsProps = {
  paths: GuideStartPath[];
  heading?: string;
};

export default function GuideStartPaths({
  paths,
  heading = 'С чего начать',
}: GuideStartPathsProps): ReactNode {
  return (
    <nav className={styles.section} aria-labelledby="guide-start-paths-heading">
      <h2 id="guide-start-paths-heading">{heading}</h2>
      <ol className={styles.list}>
        {paths.map((path) => (
          <li key={path.title} className={styles.item}>
            <h3 className={styles.title}>{path.title}</h3>
            <p className={styles.description}>{path.description}</p>
            <ol className={styles.steps}>
              {path.steps.map((step) => (
                <li key={step.label}>
                  {step.to ? <Link to={step.to}>{step.label}</Link> : step.label}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
