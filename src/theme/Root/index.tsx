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

function SearchLabelSync(): null {
  React.useEffect(() => {
    const localizeSearchLabel = () => {
      document.querySelectorAll<HTMLInputElement>('input[aria-label="Search"]').forEach((input) => {
        input.setAttribute('aria-label', 'Поиск');
      });
    };

    localizeSearchLabel();
    const observer = new MutationObserver(localizeSearchLabel);
    observer.observe(document.body, {childList: true, subtree: true});

    return () => observer.disconnect();
  }, []);
  return null;
}

export default function RootWrapper(props: Props): ReactNode {
  return (
    <>
      <FaviconThemeSync />
      <SearchLabelSync />
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/110571227"
            className="metrika-pixel"
            alt=""
          />
        </div>
      </noscript>
      <Root {...props} />
    </>
  );
}
