---
id: visual-refinement-audit
title: Visual Refinement Audit — docs.datagent.ru
sidebar_label: Visual Refinement
unlisted: true
---

# Visual Refinement Audit — docs.datagent.ru

Дата: 2026-07-16  
Область: публичная документация (после Polish / Mobile / SEO).  
Ограничение: не редизайн, не SEO, не копирайт, не SVG/sidebars/routes.

## Визуальный диагноз

- **Что делает интерфейс дорогим:** спокойная teal-палитра OKLCH, ProductHero без баннеров, prose max-width, Infima-chrome с токенами, читаемые FAQ/таблицы.
- **Что делает дешевле / шаблоннее:** homepage hero с radial-gradient + dot texture + glass chips + 3D preview + scroll-reveal; `.text-gradient` на бренде; glow на CTA; accent-золото в CtaBanner; hover-lift карточек; слишком агрессивный display scale H2.
- **Три принципа refinement:** (1) нейтральный фон и редкий акцент; (2) единый ритм и type scale; (3) убрать декоративные эффекты, оставить структуру.

### Research

- **Modern Web Guidance:** typography (`text-wrap: balance/pretty`, font fallbacks), accessibility/focus — учтены; новые фичи без поддержки не форсировались.
- **Lazyweb MCP:** недоступен в среде — зафиксировано; ориентиры Stripe/Linear/Vercel/Notion только как дисциплина плотности, без копирования.

| Приоритет | Экран / компонент | Проблема | Почему мешает | Точечное исправление | Статус |
| --- | --- | --- | --- | --- | --- |
| P0 | Homepage `.text-gradient` | Градиентный текст на бренде | Запрещённый AI-look, шум | Solid color / снять класс | ✅ |
| P0 | Homepage hero `::before/::after` | Radial glow + texture | Декор ради декора | Убрать псевдоэлементы | ✅ |
| P0 | Homepage chips | `backdrop-filter` glass | Glassmorphism | Solid border/bg | ✅ |
| P1 | Homepage preview | 3D rotate + heavy shadow | Marketing toy | Flat card, лёгкая рамка | ✅ |
| P1 | Homepage cards/journey | Gradient accents, hover lift, scroll-anim | Дёрганый «landing» | Border-only, без lift/anim | ✅ |
| P1 | CTA primary glow | Тяжёлая цветная тень | Рекламный вид | Без glow / shadow-sm | ✅ |
| P1 | CtaBanner primary | Accent gold кнопка | Конкурирует с primary | Primary teal | ✅ |
| P1 | Type scale H2 | До 2.5rem | Marketing headers в docs | Сжать clamp | ✅ |
| P1 | Font fallbacks | Слабый кириллический fallback | CLS / чужой ритм | System Cyrillic stack | ✅ |
| P1 | Navbar CTA | Glow + translate hover | Шум в chrome | Спокойный hover | ✅ |
| P2 | Admonitions / blockquote | Толстая цветная полоса | Радужный шум | 3px, спокойнее tip | ✅ |
| P2 | ProductHero / IntegrationHero | Чуть шумные pills / toolCount | Мелкая иерархия | Weight/padding | ✅ |
| P2 | Markdown rhythm | H2 далеко от текста | Рваный ритм | margin-block tokens | ✅ |
| P2 | Muted contrast | #5a5954 borderline | Читаемость | Чуть темнее muted | ✅ |
| P3 | Fontshare CDN | Внешний font host | Privacy/perf | Не трогать в этом pass | ⏸ |
| P3 | BreadcrumbList visual | — | — | Не в scope | ⏸ |

## Итог внедрения

### 1. Визуальный диагноз (после правок)

**Три главных улучшения**
1. Homepage очищен от AI-декора: нет gradient text, radial glow, glass chips, 3D preview, scroll-reveal, hover-lift.
2. Type scale и prose ужесточены под docs (H2 ≤ ~1.75rem, prose 68ch, системный spacing scale).
3. CTA / callouts / badges приведены к нейтральному accent: без gold glow и радужных tip-фонов.

**Сознательно не меняли**
1. Fontshare Cabinet/Satoshi (внешний CDN) — отдельное privacy/perf решение.
2. SVG, sidebars, routes, SEO metadata, контент MDX.
3. Mobile drawer/safe-area логику из Mobile UX pass.

### 2. Типографика
- Display/H2 clamp снижен; muted темнее для AA; Cyrillic fallbacks (`Segoe UI`…); `text-wrap: balance/pretty` сохранены; tabular-nums для таблиц.

### 3. Сетка и отступы
- `--space-*` tokens; ProductHero/CtaBanner/homepage на общей шкале; карточки без shadow-md lift.

### 4. Визуальный шум
- Убраны: gradients, glass, texture, 3D, glow CTA, accent-gold banner button, rainbow tip backgrounds.
- Сохранены: teal primary, ProductHero frame, FAQ borders, quiet CompareOptions.

### 5. Проверки
- Viewports: 390 (mobile home), 1440 (home + what-is).
- `npm run typecheck` OK; `npm run build` OK; audit excluded from `build/`.
- CSS bundle: нет `text-gradient` / hero radial noise.

### 6. Остаточный backlog (P3)
1. Fontshare → self-host / system stack (privacy + CLS).
2. Mobile search/chrome: пустой прямоугольник справа в узком navbar — точечно в mobile pass.
3. Кастомный scrollbar sidebar — только если появится единый chrome-токен.
