---
id: yandex-tracker
title: Яндекс Трекер — задачи и очереди (preview)
sidebar_label: Яндекс Трекер (preview)
description: "Preview read-only коннектор Яндекс Трекер: issues, очереди, agile, automation и Official search scroll через tools агента. Без записи."
---

# Яндекс Трекер (preview)

:::info[Preview — только чтение]
Плагин **Яндекс Трекер** доступен как **preview**: агент может **читать** очереди, задачи, комментарии, agile, каталоги, automation и искать через Official scroll. **Создание и изменение** задач, макросов, триггеров, скачивание вложений — **ещё не в продукте**. Не GA до live pilot.
:::

Коннектор — к **Official Tracker API** (`api.tracker.yandex.net`), не Directory Яндекс 360 и не write-heavy сторонние MCP. Вызовы через **`datagent-plugins`**.

**Не путать с:** [Яндекс 360](./yandex360) (оргструктура / почта / security).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Яндекс Трекер** → OAuth-токен + Cloud Org Id → непустой allowlist ключей очередей (`allowedQueueKeys`).

## Что умеет агент (as-built preview)

**76** инструментов чтения (`PLUGIN_VERSION` **0.9.0**, Wave **T\*–T\*\*\*\*\*\*\*\***), в том числе:

- Issues: get/search/count, changelog, links, comments, worklogs, transitions; soft `webUrl`
- Очереди, поля, пользователи (pii), метаданные (`/v3`)
- Agile / catalog / projects / portfolios / goals / entities
- Remotelinks, schema, macros (list/get), automation list/get, filter/ACL (тонкий read)
- Official **search scroll** + `ytracker_clear_search_scroll` (гигиена курсора, не write issue)

**Не умеет (явно NO-GO):** create/update issues; execute macros; create/update triggers/autoactions; binary download вложений; Wiki/Forms; merge в плагин 360.

## Как подключить (кратко)

1. Установите плагин **Яндекс Трекер**.
2. Укажите **OAuth-токен** (секрет) и **X-Cloud-Org-Id**; задайте **непустой** `allowedQueueKeys`.
3. Разрешите tools агенту (`ytracker_*`).
4. Проверьте: «Найди открытые задачи в очереди ENG» — только чтение; scroll — через search + clear scroll.

Технический канон: [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) · package README в монорепо `packages/plugins/plugin-yandex-tracker`.

## Ограничения

- Статус: **`preview`**.
- Users / comments / filters могут содержать **ПДн**.
- Live pilot: harness + `yandex-tracker-pilot.json` (`status: passed` только через harness).

## Что дальше

→ [Яндекс 360 (preview)](./yandex360) — Directory / Mail / Security  

→ [amoCRM (preview)](./amocrm)  

→ [Селектел (preview)](./selectel)  

→ [Внешние инструменты (MCP)](./mcp)  

→ [Плагины](../cloud/plugins)
