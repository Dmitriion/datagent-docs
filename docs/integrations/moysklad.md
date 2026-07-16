---
id: moysklad
title: МойСклад — учёт и склад для агентов (preview)
sidebar_label: МойСклад (preview)
description: "Preview read-only коннектор МойСклад Remap 1.2: каталог, остатки, розница, производство, B2B и отчёты через tools агента. Без write, Basic и Kaya embed."
---

# МойСклад (preview)

:::info[Preview — только чтение]
Плагин **МойСклад** доступен как **preview**: агент может **читать** ассортимент, остатки, документы торговли/финансов, розницу, производство, маркировку (meta), задачи и настройки через Official Remap JSON API 1.2. **Создание и изменение сущностей, мутация webhook/trackingCodes, Basic login/password, произвольный `raw_request`, бинарный export и встраивание Kaya MCP** — **не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official МойСклад Remap API** — не сторонний MCP (theYahia write-tools / Kaya remote) «как есть» и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** write Remap; [1С Коннектор](./1c-connector) (учёт 1С); [Ozon](./ozon) / [Wildberries](./wildberries) (маркетплейсы); [внешними MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **МойСклад** → секрет Bearer-токена (`tokenSecretRef`) → при необходимости **allowedWarehouseIds**.

## Что умеет агент (as-built preview)

**211** инструментов чтения (`PLUGIN_VERSION` **1.12.0**, Waves **MS0–MS17** + resilience **MS-R…MS-R3b**), в том числе:

- Каталог: assortment / products / variants / services / bundles + gets; settings; variant characteristics
- Остатки и оборот: `report_stock*` + `groupBy`; slots/zones; turnover bystore / byoperation
- Маркировка / прослеживаемость: trackingCodes, emission/retire, things, consignments (чтение)
- B2B и лояльность: facture, internalorder, prepayment, bonus; счета и контактные лица контрагентов/организаций
- Розница: demand/shift/store; sales return; drawer cash in/out; cashiers
- Производство / BOM: processing (+plan/order/process); productiontask / stage / completion; stage defs
- Торговля и финансы: orders, demands, supplies, returns, moves, inventories, payments/cash + named gets
- Справочники и настройки: taxrate, region, currency, uom, groups, companysettings, pricetype, context employee
- Задачи и уведомления: task list/get + notes; notification settings + list
- Meta: customentity; entity metadata / attributes / states; embeddedtemplate; files/images (**JSON meta only**)
- Audit / webhooks: audit; webhook + webhookstock (**GET only**)
- Универсальные: `get_document`, `list_document_positions`

**Надёжность (без смены архитектуры):**

- Weight bucket **20 запросов / 3 с** на компанию (stock×5, reports×3) — официальный soft ~45/3s; сознательно ниже; **не ужесточать/ослаблять** до live `rateLimited` (**MS-R4**)
- Таймауты: лёгкие **15 с**, тяжёлые **45 с** (в т.ч. productionstage* / processingprocess)
- Concurrency **2**; GET retries; soft 429 trip 3× → cool `max(5с, X-Lognex-Retry-After ≤ 60с)`
- Auth coalesce 60 с + сброс при 401
- Проверка связи (probe): fail-closed **ассортимент + остатки** (`list_assortment` + `report_stock`)
- Soft warning `moysklad-rate-limit-soft` при `X-RateLimit-Remaining` ≤ 20% от `X-RateLimit-Limit` → сигнал harness `rateLimited`
- Remap headers: `Accept: application/json;charset=utf-8` + `Accept-Encoding: gzip`
- Деньги: **копейки as-is** (без пересчёта в рубли в коннекторе)

**Не умеет (явно NO-GO):** write create/update/delete; POST/DELETE trackingCodes; webhook mutate; binary file/image/export body; Basic login/password; `raw_request`; Kaya remote embed; CRPT.

## Как подключить (кратко)

1. Установите плагин **МойСклад** в менеджере плагинов компании.
2. Укажите **Bearer-токен** через секрет компании (`tokenSecretRef`).
3. При необходимости задайте **allowedWarehouseIds** (склады / slots/zones / cashiers фильтруются по allowlist).
4. В карточке агента → **Подключения** включите МойСклад и при необходимости subset (`moysklad_*`; или Skills readiness).
5. Проверьте: «Список ассортимента» / «Остатки» / «Заказы покупателей» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §6 · Waves **MS-R3b** · package README `packages/plugins/plugin-moysklad`.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / theYahia-parity / Kaya embed клиентам.
- Live pilot и GA — только после harness evidence (`moysklad-pilot.json`), не «вручную passed».
- Часть отчётов (например `report/sales/byemployee|bystore`) может отсутствовать до отдельного live probe — не обещать в пресейле.
- **MS-R4** (SlidingWindow / method-RPM) — backlog: только после live `rateLimited ≥ 1`.

## Что дальше

→ [Ozon Seller (preview)](./ozon) — маркетплейс Ozon

→ [Wildberries (preview)](./wildberries) — Seller API WB

→ [Авито (preview)](./avito) — Business API объявления / Ads / Autoteka

→ [1С Коннектор](./1c-connector) — учёт 1С  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
