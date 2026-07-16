import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';

export type IntegrationListItem = {
  name: string;
  url: string;
};

export type IntegrationListSchemaProps = {
  name?: string;
  items: IntegrationListItem[];
};

export default function IntegrationListSchema({
  name = 'Интеграции Datagent с российскими сервисами',
  items,
}: IntegrationListSchemaProps): ReactNode {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          url: item.url,
        })),
      }}
    />
  );
}
