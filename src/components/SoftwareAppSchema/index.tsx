import type {ReactNode} from 'react';
import JsonLd from '@site/src/components/JsonLd';

export type SoftwareAppSchemaProps = {
  name: string;
  description: string;
  featureList: string[];
  url: string;
  offerDescription?: string;
  alternateName?: string;
};

export default function SoftwareAppSchema({
  name,
  description,
  featureList,
  url,
  offerDescription = 'Бесплатный тариф: до 3 агентов и 100 запусков в месяц',
  alternateName,
}: SoftwareAppSchemaProps): ReactNode {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        ...(alternateName ? {alternateName} : {}),
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description,
        url,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'RUB',
          description: offerDescription,
          url: 'https://docs.datagent.ru/docs/cloud/pricing',
          availability: 'https://schema.org/OnlineOnly',
        },
        featureList: featureList.join(', '),
      }}
    />
  );
}
