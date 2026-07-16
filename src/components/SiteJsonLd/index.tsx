import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';

/**
 * Site-level WebSite + Organization for the docs homepage.
 * No SearchAction: local search has no crawlable ?q= URL.
 */
export default function SiteJsonLd(): ReactNode {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://docs.datagent.ru/#website',
            name: 'Документация Datagent',
            url: 'https://docs.datagent.ru/',
            inLanguage: 'ru',
            description:
              'Документация платформы ИИ-агентов Datagent: Cloud, интеграции, руководства и API.',
            publisher: {'@id': 'https://datagent.ru/#organization'},
          },
          {
            '@type': 'Organization',
            '@id': 'https://datagent.ru/#organization',
            name: 'Datagent',
            url: 'https://datagent.ru',
            sameAs: [
              'https://app.datagent.ru',
              'https://docs.datagent.ru',
              'https://github.com/Dmitriion/datagent',
            ],
          },
        ],
      }}
    />
  );
}
