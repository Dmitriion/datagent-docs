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
              'Как запускать и вести ИИ-агентов компании в Datagent: задачи, права доступа, согласования, журнал и интеграции с российскими сервисами. Старт в Cloud без своего сервера.',
            publisher: {'@id': 'https://datagent.ru/#organization'},
          },
          {
            '@type': 'Organization',
            '@id': 'https://datagent.ru/#organization',
            name: 'Datagent',
            url: 'https://datagent.ru',
            description:
              'Datagent — платформа ИИ-агентов для среднего бизнеса: права доступа, согласования и журнал, данные в РФ.',
            sameAs: [
              'https://app.datagent.ru',
              'https://docs.datagent.ru',
              'https://t.me/datagent_ru',
            ],
          },
        ],
      }}
    />
  );
}
