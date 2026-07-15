---
id: ozon
title: Ozon Seller — каталог и продажи для агентов (preview)
sidebar_label: Ozon Seller (preview)
description: "Preview read-only коннектор Ozon Seller API: товары, FBO/FBS, поставки, аналитика и финансы через tools агента. Без write, Performance ads и meta call_method."
---

# Ozon Seller (preview)

:::info[Preview — только чтение]
Плагин **Ozon Seller** доступен как **preview**: агент может **читать** каталог, отправления FBO/FBS, поставки, аналитику остатков/продаж и финансы через Official Seller API. **Изменение цен/остатков, отгрузка, ответы в чатах, Performance ads и произвольный `call_method`** — **не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Ozon Seller API** — не сторонний MCP (Oxonomy / woyaxnini / schema-driven 441 YAML) «как есть» и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** write Seller API; buyer scrape / browser-парсинг (eduard256); [Wildberries](./wildberries) (отдельный коннектор); [внешними MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Ozon Seller** → секреты **Client-Id** и **Api-Key** (`clientIdSecretRef` / `apiKeySecretRef`) → при необходимости **allowedWarehouseIds**.

## Что умеет агент (as-built preview)

**105** инструментов чтения (`PLUGIN_VERSION` **1.6.0**, Waves **O0–O9** + resilience **OR/OR2/OR3/OR4**), в том числе:

- Каталог: list/get product, attributes, prices, stocks, related SKU, pictures, rating
- Заказы: FBO/FBS postings, unfulfilled, cancel reasons, FBS acts (list / postings / status)
- Поставки и склады: supply orders / bundle / timeslots, delivery methods, warehouses (v2), Ozon logistics
- Аналитика: sales analytics, stock_on_warehouses (v2), liquidity / turnover / manage-stocks, ADT, Premium product-queries / search-queries
- Финансы: transactions / totals / realization / compensation / balance / B2B sales JSON / cash-flow
- Q&A и рейтинг: reviews, questions, chats (v3), FBS rating index
- Compliance: certificates, statuses/types, rejection reasons (meta отчётов — без скачивания файла)

**Надёжность (без смены архитектуры):**

- SlidingWindow **20 запросов/с** на компанию (официальный soft ~50 rps — сознательно ниже)
- Таймауты: лёгкие **15 с**, тяжёлые (аналитика / финансы / списки) **45 с**
- POST soft-retry + GET kit retries; auth coalesce 60 с + сброс при 401
- После **трёх** подряд HTTP 429 — пауза `max(5с, Retry-After ≤ 60с)`
- Проверка связи (probe): fail-closed **каталог + аналитика остатков** (`ozon_list_products` + `ozon_analytics_stocks`)
- Soft warning `ozon-rate-limit-soft` при низких remaining-like заголовках (если провайдер их отдаёт) → сигнал harness `rateLimited`

**Не умеет (явно NO-GO):** write prices/stocks/products/ship/cancel/act create/reply; meta `call_method` / `raw_request`; label PDF / ZIP / report download; giveout PDF/PNG; Ozon Performance ads; buyer scrape.

## Как подключить (кратко)

1. Установите плагин **Ozon Seller** в менеджере плагинов компании.
2. Укажите **Client-Id** и **Api-Key** через секреты компании (`clientIdSecretRef`, `apiKeySecretRef`).
3. При необходимости задайте **allowedWarehouseIds** (остатки / склады / поставки фильтруются по allowlist).
4. Разрешите нужные tools агенту (`ozon_*` в allowlist / Skills readiness).
5. Проверьте: «Список товаров» / «Невыполненные FBS» / «Остатки по складам» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §9 · Waves **OR4** · package README `packages/plugins/plugin-ozon-seller`.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / Oxonomy parity клиентам.
- Live pilot и GA — только после harness evidence (`ozon-seller-pilot.json`), не «вручную passed».
- Часть Premium-эндпоинтов (product-queries / search-queries / realization by-day) может вернуть 403 без подписки продавца.
- **OR4b** (method-aware / tighter RPS) и **O10** (finance accrual depth) — backlog: OR4b только после live `rateLimited`; O10 — отдельный depth PR.

## Что дальше

→ [Wildberries (preview)](./wildberries) — Seller API WB  

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
