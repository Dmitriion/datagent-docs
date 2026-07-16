import {useCallback, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

export type FirstQuestionProps = {
  question: string;
  hint?: string;
  heading?: string;
};

export default function FirstQuestion({
  question,
  hint = 'После подключения спросите агента',
  heading = 'С чего начать',
}: FirstQuestionProps): ReactNode {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [question]);

  return (
    <section className={styles.section} aria-labelledby="first-question-heading">
      <h2 id="first-question-heading">{heading}</h2>
      <p className={styles.hint}>{hint}</p>
      <div className={styles.box}>
        <p className={styles.question}>«{question}»</p>
        <button
          type="button"
          className={styles.copy}
          onClick={onCopy}
          aria-label="Скопировать вопрос"
        >
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
    </section>
  );
}
