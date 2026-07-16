---
id: ux-seo-geo-audit
title: UX / SEO / GEO аудит раздела интеграций
sidebar_label: UX-аудит (внутренний)
unlisted: true
---

# UX / SEO / GEO аудит раздела интеграций Datagent

Дата: 2026-07-16  
Объект: `docs/integrations/` + связанные компоненты  
Источники правды: `C:\Datagent\packages\plugins\plugin-*`, `doc\mcp-russia-connectors.md` (as-built)

## Исследование референсов

### Lazyweb
MCP/skill Lazyweb в Cursor **недоступен** (нет сервера в каталоге MCP, skill не найден).  
Вместо этого: паттерны из публичных каталогов Stripe Docs, Linear Developers, Notion API/docs, Zapier/Make marketplace UX, плюс Modern Web Guidance (Google Chrome).

### Паттерны, которые берём (не копируем UI)
| Паттерн | Откуда | Как применяем |
| --- | --- | --- |
| Каталог по задачам + по продуктам | Zapier / Make marketplace | Overview: «Выберите задачу» + категории сервисов |
| Компактная карточка: название → 1 строка пользы → глубина | Stripe product pages / Linear | IntegrationCatalog |
| Trust: что можно / чего нельзя | Notion / Stripe permissions | DataScope |
| FAQ на native `<details>` | MWG `search-hidden-content` | FaqSchema |
| Container queries для карточек | MWG `size-aware-styling` | ScenarioCards / catalog grid |
| Первый экран = ответ за 10–20 с | Linear / Vercel docs | IntegrationHero |
| CTA один, спокойный | Stripe | CtaBanner |

### Modern Web Guidance (применено)
- FAQ: native `<details>` / `summary`
- Карточки: `container-type: inline-size` + `@container`
- Контраст AA, `focus-visible`, `prefers-reduced-motion`
- Без тяжёлого JS ради аккордеона и сетки

## Проблемы (на момент аудита) и статус

P0–P1 закрыты реализацией в этой итерации: единый hero, DataScope, ScenarioCards, FirstQuestion, каталог по задачам, статусы «Доступно»/«Развивается», убраны фальшивые даты и «3 минуты».

## Cloud.ru

Подключается в UI (`settingsPage`), 2 инструмента, preview. Публикуется со статусом **Развивается**.
