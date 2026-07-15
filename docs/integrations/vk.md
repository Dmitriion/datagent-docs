---
id: vk
title: ВКонтакте — сообщества и контент (preview)
sidebar_label: ВКонтакте (preview)
description: "Preview read-only коннектор VK Social: сообщества, стена, медиа, маркет и лид-формы через tools агента. Без записи на стену и без Ads."
---

# ВКонтакте (preview)

:::info[Preview — только чтение]
Плагин **ВКонтакте** (`datagent.vk`) доступен как **preview**: агент может **читать** данные разрешённых сообществ — стену, медиа, маркет, stories, LeadForms, wiki и связанные справочники. **Публикация** постов, комментариев, write market/stories/LeadForms и личные ленты friends/newsfeed — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official VK API** (`api.vk.com`, `v=5.199`) — не сторонний MCP [bulatko/vk-mcp-server](https://github.com/bulatko/vk-mcp-server) и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** [VK Реклама](./vk-ads) (отдельный плагин Ads API), [Битрикс24](./bitrix24) (чат-мост), [реестром внешних MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **ВКонтакте** → токен сообщества (`secret_ref`) → **непустой** список `allowedGroupIds`.

## Что умеет агент (as-built preview)

**93** инструментов чтения (`PLUGIN_VERSION` **1.7.0**, Wave **V-R3**), в том числе:

- Сообщества: участники, заявки, баны, настройки, Short Links / stats
- Стена и поиск по стене; фото / видео / документы / albums / tags / комментарии (с жёсткими лимитами PII)
- Маркет и сервисы; stories; LeadForms list/get/leads
- Wiki / pages; AppWidgets images; polls voters (cap); Donut donors/subscriptions (cap)
- Справочники `database.*` (города, регионы, вузы…) — с soft-cache

**Надёжность (без смены архитектуры, Wave V-R3):** RPS ~3/s; flood `error_code` 6/9 → `rate_limited` с мягким повтором (≤2) и soft-trip после 3 подряд (cooldown ~5 с); таймауты light **15 с** / heavy **45 с** для тяжёлых списков.

**Не умеет (явно NO-GO):** write wall/market/stories/LeadForms/AppWidgets/polls/Donut/Callback; LongPoll / confirmation secrets; bulk `likes.getList`; friends/newsfeed; personal scrape; Ads API (см. [VK Реклама](./vk-ads)); `raw_request` / `execute` batch.

## Как подключить (кратко)

1. Установите плагин **ВКонтакте** в менеджере плагинов компании.
2. Укажите **access token** через секрет компании и **непустой** `allowedGroupIds`.
3. Разрешите нужные tools агенту (`vk_*` в allowlist / Skills readiness).
4. Проверьте на тестовой задаче: «Покажи последние посты сообщества X» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §11 · Waves **V-R3**.

## Ограничения

- Статус каталога: **`preview`** — не считать GA.
- Данные участников, лидов и Donut — **ПДн**; выдавайте tools только нужным агентам.
- Live pilot и GA — только после harness evidence (`vk-pilot.json`), не «вручную passed».
- Калибровка community-token RPS и per-company limiter — **R4**, после live `rateLimited`.

## Что дальше

→ [VK Реклама (preview)](./vk-ads) — кабинеты и статистика Ads  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
