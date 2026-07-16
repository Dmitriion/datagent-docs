import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';

export type SoftwareAppSchemaProps = {
  name: string;
  description: string;
  featureList: string[];
  url: string;
  offerDescription?: string;
};

export default function SoftwareAppSchema({
  name,
  description,
  featureList,
  url,
  offerDescription = 'Cloud: Free для старта; готовые Russia-коннекторы — Studio и выше',
}: SoftwareAppSchemaProps): ReactNode {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description,
        url,
        // Не указываем price: 0 — для Studio+/платных возможностей это вводит в заблуждение.
        // Free-тариф и цены описаны на /docs/cloud/pricing и в видимом тексте страниц.
        offers: {
          '@type': 'Offer',
          description: offerDescription,
          url: 'https://docs.datagent.ru/docs/cloud/pricing',
          availability: 'https://schema.org/OnlineOnly',
        },
        featureList: featureList.join(', '),
      }}
    />
  );
}
