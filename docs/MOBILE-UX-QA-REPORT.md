---
id: mobile-ux-qa-report
title: Mobile UX QA — отчёт
sidebar_label: Mobile UX QA
unlisted: true
---

# Mobile UX QA — аудит и доработка

Дата: 2026-07-16  
Область: мобильный chrome документации (header, drawer, breadcrumbs, search, footer, touch, safe areas)  
Preview: `http://127.0.0.1:3001`

| Приоритет | Экран / компонент | Viewport | Проблема | Влияние | Исправление | Статус |
| --- | --- | ---: | --- | --- | --- | --- |
| P0 | Navbar drawer | 320–768 | `backdrop-filter` на `.navbar` создаёт containing block → `position:fixed` sidebar клипится до ~67px | Меню docs на mobile фактически сломано | Убрать `backdrop-filter`; непрозрачный mix-фон | ✅ |
| P0 | Navbar actions | 320–430 | CTA + search пересекаются/обрезают текст | Нельзя надёжно нажать CTA | Скрыть navbar CTA на ≤430px (остаётся в drawer) | ✅ |
| P1 | Hamburger / close / theme | 320–430 | Touch ~30×30 / close ~21×21 | Промахи | Hit area ≥44×44 CSS px | ✅ |
| P1 | Hash links | mobile | `opacity:0` только на `:hover` | Якоря недоступны | `(hover:none)` + `:focus-within` | ✅ |
| P1 | Footer | ≤768 | 4 колонки → длинный «ковёр» | Шум | 1 колонка, spacing | ✅ |
| P1 | Safe areas | phone | Нет `env(safe-area-inset-*)` | Notch / home indicator | announcement, navbar, drawer, footer | ✅ |
| P1 | Menu links in drawer | drawer | Ряды ~34px | Малые touch-зоны | min-height 44px+ | ✅ |
| P1 | Desktop regression | 1440 | `display:inline-flex` на `.navbar__toggle` всегда показывал hamburger | Ломал desktop chrome | `display` только в `@media (max-width:996px)` | ✅ |
| P2 | Breadcrumbs | 320–390 | Высокие hit + truncate | Лишняя высота | компактнее + ellipsis | ✅ |
| P2 | ProductHero CTA | ≤430 | Кнопки в ряд | Узко | column + full width | ✅ |
| P2 | Announcement | ≤430 | Высокий chrome | Меньше контента | компактный padding/font | ✅ |
| P3 | Bottom nav | — | Нет | — | **Не добавлять** (см. ниже) | ⏸ |
| P3 | Lazyweb MCP | — | Недоступен в среде | — | Research через web + MWG | — |

---

## 1. Найдено и исправлено

**Критично:** drawer был высотой ~navbar из‑за `backdrop-filter` на `.navbar` (containing block для `position:fixed`). После снятия filter sidebar = полная высота viewport, пункты меню и docs-tree снова доступны.

Дополнительно: компактная шапка на ≤430 (без CTA), touch ≥44px, safe areas, footer в одну колонку, hash-links без hover-only, desktop toggle не форсируется.

---

## 2. Изменённые компоненты / файлы

| Область | Файл |
| --- | --- |
| Header / drawer / breadcrumbs / footer / announcement / search density | `src/css/custom.css` |
| Sidebar menu touch, pagination | `src/css/doc-content.css` |
| Hero CTA mobile stack | `src/components/ProductHero/styles.module.css` |
| Exclude отчёта | `docusaurus.config.ts` |
| Этот отчёт | `docs/MOBILE-UX-QA-REPORT.md` |

SVG, sidebars, routes, llms.txt, тексты MD — **без изменений**.

---

## 3. Нижняя навигация

**Решение: не добавлять fixed bottom nav.**

Обоснование (research):

- Документация = occasional mobile check-in, не primary mobile app.
- Паттерн SaaS/docs: compact header + off-canvas drawer.
- Bottom nav перекрывает длинные статьи, FAQ, code, CTA footer.

Достаточно: рабочий drawer + breadcrumbs «назад к разделу» + поиск в шапке.

---

## 4. Research

### Modern Web Guidance

- `navigation-drawer` — не клипать drawer родителями с filter/transform; Escape/backdrop/focus; `svh`
- `accessibility` — touch targets, focus-visible, не только цвет
- `css-layout` — flex/grid, intrinsic sizing

### Lazyweb

- MCP / skill в этой среде **недоступны**.
- Референсы через web: UI Potion docs layout, SaaS nav patterns, Watson Drawer, MWG drawer guide.
- Вывод: shallow hierarchy, 44px targets, stacked footer, no floating FAB / bottom tabs by default.

---

## 5. Viewports и сценарии

| Viewport | Проверено |
| ---: | --- |
| 320 | header без CTA, toggle 44+, overflowX false, drawer full height |
| 360 / 390 / 430 | то же + search компактный |
| 768 | tablet transition |
| 1440 | desktop nav + left sidebar; toggle скрыт; без overflow |

Сценарии: open/close drawer, secondary docs tree («← главному меню»), FAQ, ProductHero CTA, footer stack, dark theme.

Escape / focus-return: поведение Infima Docusaurus (не переписывали JS drawer); body `overflow:hidden` при открытом меню подтверждён.

---

## 6. Проверки

| Команда | Результат |
| --- | --- |
| `npm run typecheck` | OK |
| `npm run build` | OK |
| Отчёт в `build/docs/` | отсутствует (exclude) |

---

## 7. Остаточный backlog (≤3, не блокирует)

1. **Focus trap / Escape** — усилить кастомным theme override только если появятся жалобы на Infima drawer (сейчас штатное поведение Docusaurus).
2. **Поиск на 320** — узкое поле; при жалобах вынести в icon-only / DocSearch modal (без нового движка).
3. **Landscape 390** — не автоматизировали отдельно; при необходимости ужать announcement сильнее.
