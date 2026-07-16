import type {ReactNode} from 'react';

export type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Escape so `</script>` inside string values cannot break out of the script element. */
function serializeJsonLd(data: JsonLdProps['data']): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** SSR-safe JSON-LD for schema.org (Google / Yandex / AI crawlers). */
export default function JsonLd({data}: JsonLdProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: serializeJsonLd(data)}}
    />
  );
}
