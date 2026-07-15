---
id: wildberries
title: Wildberries — Seller API для агентов (preview)
sidebar_label: Wildberries (preview)
description: "Preview read-only коннектор Wildberries: карточки, заказы FBS/DBS/DBW, аналитика, реклама, финансы и отзывы через tools агента. Без записи цен/остатков и без скачивания ZIP."
---

# Wildberries (preview)

:::info[Preview — только чтение]
Плагин **Wildberries** доступен как **preview**: агент может **читать** Seller OpenAPI (карточки, заказы FBS/DBS/DBW/pickup, FBW supplies, аналитика, реклама, финансы, отзывы/вопросы, WBD-каталог без keys). **Запись** цен/остатков, ответы на отзывы, create/deliver supply, скачивание ZIP/стикеров/отчётов-файлов — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Wildberries Seller API** — не сторонний MCP theYahia / schema-dump 307 и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** [Ozon Seller](./ozon) (отдельный seller preview), [Селектел](./selectel) (облако), [внешние MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Wildberries** → secret JWT (`apiTokenSecretRef`, заголовок `Authorization` без `Bearer`) → при необходимости задайте allowlist складов **`allowedWarehouseIds`**.

## Что умеет агент (as-built preview)

**165** инструментов чтения (`PLUGIN_VERSION` **1.10.0**, Waves **W0–W14** + resilience **W-R…W-R3**), в том числе:

- Контент: карточки, категории, справочники (`wb_list_directory`), ошибки/лимиты, бренды
- Marketplace: FBS / DBS / DBW / pickup (lists, new, meta, statuses, clients — pii), supplies, passes
- FBW: supplies list/get, warehouses, transit, package
- Аналитика: funnel v3, search/stocks reports, brand-share, item-rating, async create+status (без ZIP download)
- Реклама: balance/budget/stats, normquery, campaigns v2, payments/upd (money)
- Финансы: баланс, acquiring и sales-reports (period + by reportId, money)
- Отзывы / вопросы / чаты покупателей (pii на chats/clients/courier)
- WBD: offers list/get + catalog (**без** keys)

**Надёжность (без смены архитектуры):**

- Per-company лимит **5 req/s** (общий cap на категорию API WB)
- Таймауты: лёгкие **20 с**, тяжёлые (аналитика/отчёты) **45 с**
- GET: до **2** повторов на 429/5xx; POST read-inventory: **1** soft-retry
- После **трёх** подряд HTTP 429 — пауза `max(5с, Retry-After ≤ 60с)`
- Auth JWT: coalesce **60 с**, сброс кэша при **401**
- Справочники (directory/tariffs/offices/…): process soft TTL **300 с**
- Проверка связи (probe): **карточки + FBS orders/new**

**Не умеет (явно NO-GO):** write цен/остатков; ответы на отзывы/вопросы; create/deliver supply; chat send; set-bids / set-minus; stickers/barcode/trbx/ZIP download; WBD keys; nm-report/file download; `raw_request` / dump 307 YAML; merge WB+Ozon в один плагин.

## Как подключить (кратко)

1. Установите плагин **Wildberries** в менеджере плагинов компании.
2. Создайте secret с Seller API JWT и укажите `apiTokenSecretRef` (токен в запрос уходит **как есть**, без префикса `Bearer`).
3. При ограничении складов заполните **`allowedWarehouseIds`** (пустой allowlist блокирует warehouse-scoped tools).
4. Разрешите нужные tools агенту (`wb_*` в allowlist / Skills readiness). Учитывайте **pii** / **money** tools.
5. Проверьте на тестовой задаче: «Покажи новые FBS-заказы» / «Список карточек» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §10 · Waves **W-R3**.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / parity с 307 dump клиентам.
- Live pilot и GA — только после harness evidence (`wildberries-pilot.json`), не «вручную passed».
- Clients / courier / chats / users содержат ПДн; finance/ads payments — money: выдавайте tools только нужным агентам.
- Повышение RPS / method-aware лимиты — backlog: только после live-метрик `rateLimited`.

## Что дальше

→ [Ozon Seller (preview)](./ozon) — каталог и продажи Ozon  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [Авиасейлс (preview)](./aviasales) — цены / Flight Search  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
