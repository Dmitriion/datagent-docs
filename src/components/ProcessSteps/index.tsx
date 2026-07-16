import type {ReactNode} from 'react';
import HowToSchema from '@site/src/components/HowToSchema';
import styles from './styles.module.css';

export type ProcessStep = {
  title: string;
  text: string;
};

export type ProcessStepsProps = {
  steps: ProcessStep[];
  heading?: string;
  /** When set with pageUrl, emits HowTo JSON-LD matching visible steps. */
  howToName?: string;
  howToDescription?: string;
  pageUrl?: string;
};

export default function ProcessSteps({
  steps,
  heading = 'Как выглядит работа',
  howToName,
  howToDescription,
  pageUrl,
}: ProcessStepsProps): ReactNode {
  const emitHowTo = Boolean(howToName && howToDescription && pageUrl);

  return (
    <>
      {emitHowTo ? (
        <HowToSchema
          name={howToName!}
          description={howToDescription!}
          pageUrl={pageUrl!}
          steps={steps.map((step, index) => ({
            name: step.title,
            text: step.text,
            url: `${pageUrl!}#step-${index + 1}`,
          }))}
        />
      ) : null}
      <section className={styles.section} aria-labelledby="process-steps-heading">
        <h2 id="process-steps-heading">{heading}</h2>
        <ol className={styles.list}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              id={emitHowTo ? `step-${index + 1}` : undefined}
              className={styles.item}>
              <span className={styles.num} aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <p className={styles.title}>{step.title}</p>
                <p className={styles.text}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
