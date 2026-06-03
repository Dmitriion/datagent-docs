import React, {type ReactNode} from 'react';
import Root from '@theme-original/Root';

type Props = {children: ReactNode};

function FaviconThemeSync(): null {
  React.useEffect(() => {
    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      (() => {
        const el = document.createElement('link');
        el.rel = 'icon';
        document.head.appendChild(el);
        return el;
      })();

    const apply = () => {
      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark';
      link.href = `${dark ? '/img/brand/favicon-dark.svg' : '/img/brand/favicon-light.svg'}`;
      link.type = 'image/svg+xml';
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  return null;
}

export default function RootWrapper(props: Props): ReactNode {
  return (
    <>
      <FaviconThemeSync />
      <Root {...props} />
    </>
  );
}
