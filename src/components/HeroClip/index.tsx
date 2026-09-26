import {useEffect, useRef, type ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * Same ~8s loop as datagent.ru: Голос → Задачи → Документы → Компьютер →
 * Браузер → Навыки → Контроль. Stylized clip, not a product screenshot.
 */
const FRAMES = [
  {scene: '1', context: 'Голос', hold: 1100},
  {scene: '2', context: 'Задачи', hold: 1000},
  {scene: '3', context: 'Документы', hold: 1000},
  {scene: '4', context: 'Компьютер', hold: 1000},
  {scene: '5', context: 'Браузер', hold: 1000},
  {scene: '6', context: 'Навыки', hold: 1300},
  {scene: '7', context: 'Контроль', hold: 1600},
] as const;

type HeroFrame = (typeof FRAMES)[number];

function MicIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true">
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function subscribeMotion(query: MediaQueryList, handler: () => void): () => void {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }

  const legacy = query as MediaQueryList & {
    addListener?: (listener: () => void) => void;
    removeListener?: (listener: () => void) => void;
  };
  legacy.addListener?.(handler);
  return () => legacy.removeListener?.(handler);
}

export default function HeroClip(): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const bitrixLogo = useBaseUrl('/img/integrations/bitrix24.svg');
  const telegramLogo = useBaseUrl('/img/integrations/telegram.svg');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = root.querySelector<HTMLElement>('[data-hero-context]');
    const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-hc-scene]'));
    const railDots = Array.from(root.querySelectorAll<HTMLElement>('[data-hc-rail]'));
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyFrame = (frame: HeroFrame) => {
      root.dataset.scene = frame.scene;
      if (context) context.textContent = frame.context;
      scenes.forEach((scene) => {
        const active = scene.dataset.hcScene === frame.scene;
        scene.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      railDots.forEach((dot, i) => {
        const activeIndex = Math.min(Number(frame.scene) - 1, railDots.length - 1);
        dot.classList.toggle(styles.isActive, i === activeIndex);
      });
    };

    let index = 0;
    let timer = 0;
    let running = false;

    const stop = () => {
      running = false;
      window.clearTimeout(timer);
    };

    const tick = () => {
      if (!running) return;
      const frame = FRAMES[index];
      if (!frame) return;
      applyFrame(frame);
      timer = window.setTimeout(() => {
        index = (index + 1) % FRAMES.length;
        tick();
      }, frame.hold);
    };

    const start = () => {
      if (running || root.classList.contains(styles.isStatic) || motionQuery.matches) return;
      running = true;
      tick();
    };

    const applyMotionPreference = () => {
      if (motionQuery.matches) {
        stop();
        root.classList.add(styles.isStatic);
        const last = FRAMES[FRAMES.length - 1];
        if (last) applyFrame(last);
        return;
      }
      root.classList.remove(styles.isStatic);
      index = 0;
      if (!document.hidden) start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) applyMotionPreference();
    };

    applyMotionPreference();
    const unsubscribeMotion = subscribeMotion(motionQuery, applyMotionPreference);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);

    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) start();
          else stop();
        },
        {rootMargin: '120px', threshold: 0.05},
      );
      observer.observe(root);
    }

    return () => {
      stop();
      observer?.disconnect();
      unsubscribeMotion();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.clip}
      data-hero-clip=""
      data-scene="1"
      role="img"
      aria-label="Datagent: голос, задачи, документы, компьютер, браузер, навыки, память и подтверждение">
      <div className={styles.window}>
        <div className={styles.glow} aria-hidden="true" />
        <header className={styles.chrome}>
          <div className={styles.traffic} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className={styles.brand}>Datagent</p>
          <p className={styles.context} data-hero-context="">
            Голос
          </p>
        </header>
        <div className={styles.body}>
          <aside className={styles.rail} aria-hidden="true">
            {FRAMES.map((frame, i) => (
              <span
                key={frame.scene}
                className={clsx(styles.railDot, i === 0 && styles.isActive)}
                data-hc-rail=""
              />
            ))}
          </aside>
          <div className={styles.workspace}>
            <div className={clsx(styles.scene, styles.scene1)} data-hc-scene="1">
              <div className={styles.voice}>
                <div className={styles.voiceBubble}>
                  <span className={styles.voiceMic} aria-hidden="true">
                    <MicIcon />
                  </span>
                  <div className={styles.voiceBody}>
                    <p className={styles.voiceText}>
                      Голос: «Собери отчёт по продажам за неделю и разошли в чат команды.»
                    </p>
                    <div className={styles.wave} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <span className={styles.voiceLabel}>AI-помощник</span>
                </div>
              </div>
            </div>

            <div
              className={clsx(styles.scene, styles.scene2)}
              data-hc-scene="2"
              aria-hidden="true">
              <span className={styles.pill}>Задачи</span>
              <div className={styles.pair}>
                <article className={clsx(styles.tile, styles.stagger)}>
                  <img
                    className={styles.tileLogo}
                    src={bitrixLogo}
                    alt=""
                    width={20}
                    height={20}
                    decoding="async"
                  />
                  <div>
                    <strong>Bitrix24: задача создана</strong>
                    <span className={styles.meta}>Новая задача в контуре</span>
                  </div>
                  <span className={clsx(styles.dot, styles.dotOk)} aria-hidden="true" />
                </article>
                <article className={clsx(styles.tile, styles.stagger)}>
                  <img
                    className={styles.tileLogo}
                    src={telegramLogo}
                    alt=""
                    width={20}
                    height={20}
                    decoding="async"
                  />
                  <div>
                    <strong>Telegram: сообщение готово</strong>
                    <span className={styles.meta}>В канал команды</span>
                  </div>
                  <span className={clsx(styles.dot, styles.dotOk)} aria-hidden="true" />
                </article>
              </div>
            </div>

            <div
              className={clsx(styles.scene, styles.scene3)}
              data-hc-scene="3"
              aria-hidden="true">
              <span className={styles.pill}>Документы</span>
              <div className={styles.docs}>
                <article className={clsx(styles.doc, styles.docActive, styles.stagger)}>
                  <span className={styles.docMark} aria-hidden="true">
                    W
                  </span>
                  <strong>Word</strong>
                  <span className={styles.meta}>Отчёт создан</span>
                  <em className={styles.docReady}>Готово</em>
                </article>
                <article className={clsx(styles.doc, styles.stagger)}>
                  <span className={styles.docMark} aria-hidden="true">
                    X
                  </span>
                  <strong>Excel</strong>
                  <span className={styles.meta}>Таблица обновлена</span>
                </article>
                <article className={clsx(styles.doc, styles.stagger)}>
                  <span className={styles.docMark} aria-hidden="true">
                    P
                  </span>
                  <strong>PowerPoint</strong>
                  <span className={styles.meta}>Презентация</span>
                </article>
              </div>
            </div>

            <div
              className={clsx(styles.scene, styles.scene4)}
              data-hc-scene="4"
              aria-hidden="true">
              <div className={styles.tabs} aria-hidden="true">
                <span>Задачи</span>
                <span className={styles.tabActive}>Компьютер</span>
                <span>Браузер</span>
              </div>
              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <strong>Повторяющаяся задача: обновить отчёт</strong>
                  <span className={clsx(styles.status, styles.statusWorking)}>
                    <span className={styles.statusPulse} aria-hidden="true" />
                    В работе
                  </span>
                </div>
                <div className={styles.progress} aria-hidden="true">
                  <span />
                </div>
                <p className={styles.panelNote}>Работа на ПК под вашим контролем</p>
              </article>
            </div>

            <div
              className={clsx(styles.scene, styles.scene5)}
              data-hc-scene="5"
              aria-hidden="true">
              <span className={styles.pill}>Браузер</span>
              <div className={styles.browser}>
                <p className={styles.browserHint}>Форма заявки</p>
                <label className={styles.field}>
                  <span>Имя</span>
                  <span className={styles.fieldValue} data-fill="1">
                    ООО «Север»
                  </span>
                </label>
                <label className={styles.field}>
                  <span>ИНН</span>
                  <span className={styles.fieldValue} data-fill="2">
                    7707083893
                  </span>
                </label>
                <label className={styles.field}>
                  <span>Адрес</span>
                  <span className={styles.fieldValue} data-fill="3">
                    Москва
                  </span>
                </label>
              </div>
              <p className={styles.caption}>Datagent заполняет данные вместо вас</p>
            </div>

            <div
              className={clsx(styles.scene, styles.scene6)}
              data-hc-scene="6"
              aria-hidden="true">
              <div className={styles.split}>
                <div className={styles.stack}>
                  <span className={styles.pill}>Навыки</span>
                  <article className={clsx(styles.row, styles.stagger)}>
                    <span className={styles.rowIcon} aria-hidden="true" />
                    <div>
                      <strong>Навык: отчёты по продажам</strong>
                    </div>
                  </article>
                  <article className={clsx(styles.row, styles.stagger)}>
                    <span className={styles.rowIcon} aria-hidden="true" />
                    <div>
                      <strong>Навык: ответы клиентам</strong>
                    </div>
                  </article>
                </div>
                <div className={clsx(styles.stack, styles.stackMemory)}>
                  <span className={styles.pill}>Память</span>
                  <article className={styles.row}>
                    <div>
                      <strong>Память: прошлые отчёты</strong>
                    </div>
                  </article>
                  <article className={clsx(styles.row, styles.rowFocus)}>
                    <div>
                      <strong>Память: решения совета</strong>
                      <span className={styles.meta}>Помнит всё по вашим задачам</span>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <div
              className={clsx(styles.scene, styles.scene7)}
              data-hc-scene="7"
              aria-hidden="true">
              <div className={styles.confirm}>
                <h3 className={styles.confirmTitle}>Подтвердить опасное действие</h3>
                <p className={styles.confirmText}>
                  Удалить файл / отправить письмо / провести документ
                </p>
                <div className={styles.confirmActions}>
                  <span className={clsx(styles.confirmBtn, styles.confirmBtnPrimary)}>Разрешить</span>
                  <span className={styles.confirmBtn}>Отменить</span>
                </div>
                <p className={styles.confirmTrust}>
                  Важное — только с вашим подтверждением. Всё видимое — в журнале.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
