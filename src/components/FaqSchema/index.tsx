import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';
import styles from './styles.module.css';

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSchemaProps = {
  items: FaqItem[];
  heading?: string;
  pageUrl?: string;
};

export default function FaqSchema({
  items,
  heading = 'Часто задаваемые вопросы',
  pageUrl,
}: FaqSchemaProps): ReactNode {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(pageUrl ? {url: pageUrl} : {}),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className={styles.section} aria-labelledby="faq-schema-heading">
      <JsonLd data={schema} />
      <h2 id="faq-schema-heading">{heading}</h2>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.summary}>{item.question}</summary>
            <div className={styles.answer}>
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
