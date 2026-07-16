import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';

export type HowToStep = {
  name: string;
  text: string;
  /** Only set when a matching visible anchor exists on the page. */
  url?: string;
};

export type HowToSchemaProps = {
  name: string;
  description: string;
  steps: HowToStep[];
  pageUrl: string;
};

/**
 * FAQPage-style: schema must match visible steps on the page.
 * Do not invent totalTime, cost, supply, or images.
 */
export default function HowToSchema({
  name,
  description,
  steps,
  pageUrl,
}: HowToSchemaProps): ReactNode {
  if (steps.length === 0) {
    return null;
  }

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        url: pageUrl,
        step: steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          ...(step.url
            ? {url: step.url}
            : {}),
        })),
      }}
    />
  );
}
