---
id: vk-ads
title: VK Реклама — кабинеты и статистика (preview)
sidebar_label: VK Реклама (preview)
description: "Preview read-only коннектор VK Ads: планы, кампании, баннеры и статистика через tools агента. Без write и без raw_request."
---

# VK Реклама (preview)

:::info[Preview — только чтение]
Плагин **VK Реклама** (`datagent.vk-ads`) доступен как **preview**: агент может **читать** иерархию кабинета (ad_plan → campaign → ad_group → banner), статистику, remarketing и связанные справочники. **Создание и изменение** объявлений, `raw_request` и mutate ОРД — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official ads.vk.com API** — не сторонний MCP [askads/mcp-vk-ads](https://github.com/askads/mcp-vk-ads) и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** [ВКонтакте (Social)](./vk) (отдельный плагин `api.vk.com`), [Битрикс24](./bitrix24), [реестром внешних MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **VK Реклама** → Bearer-токен (`secret_ref`) → **непустой** список `allowedAccountIds`.

## Что умеет агент (as-built preview)

**69** инструментов чтения (`PLUGIN_VERSION` **1.6.0**, Wave **VA-R3**), в том числе:

- Планы / кампании / группы / баннеры (list/get) + автопагинация списков (с circuit на rate limit)
- Статистика и измерения; feeds / content library
- Remarketing: segments, lookalike, counters/goals, users lists, VK groups
- LeadForms / Surveys (respondents с cap); Subscriptions; transaction groups
- Справочники: pads tree, banner patterns, mobile OS/vendors, apps (Apple/Google)

**Надёжность (без смены архитектуры, Wave VA-R3):** RPS ~5/s; soft-таймауты light **15 с** / heavy **45 с**; fallback альтернативного path только на **404**; soft-block по nested `READ.remaining.{60,3600}==0` из `throttling.json` (CREATE ignored); soft-trip после **3** подряд HTTP `rate_limited` (cooldown ~5 с).

**Не умеет (явно NO-GO):** write Ads / ОРД mutate; `raw_request`; Social API (см. [ВКонтакте](./vk)); execute batch.

## Как подключить (кратко)

1. Установите плагин **VK Реклама** в менеджере плагинов компании.
2. Укажите **Bearer-токен** через секрет компании и **непустой** `allowedAccountIds`.
3. Разрешите нужные tools агенту (`vk_ads_*` в allowlist / Skills readiness).
4. Проверьте на тестовой задаче: «Покажи кампании кабинета X» / «Статистику за период» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §11a · Waves **VA-R3**.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write Ads клиентам.
- Данные LeadForms / respondents могут содержать **ПДн** — выдавайте tools только нужным агентам.
- Live pilot и GA — только после harness evidence (`vk-ads-pilot.json`).
- Per-company limiter Map и Prefer-primary path lock — **R4**, после live `rateLimited`.

## Что дальше

→ [ВКонтакте (preview)](./vk) — сообщества и контент Social  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
