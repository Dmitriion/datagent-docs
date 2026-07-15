---
id: aviasales
title: Авиасейлс — цены и поиск рейсов (preview)
sidebar_label: Авиасейлс (preview)
description: "Preview read-only коннектор Travelpayouts/Aviasales: Data API, Flight Search и справочники через tools агента. Без массового harvest ссылок и без write."
---

# Авиасейлс (preview)

:::info[Preview — преимущественно чтение]
Плагин **Авиасейлс** доступен как **preview**: агент может **искать цены**, справочники и предложения Flight Search через Travelpayouts. **Массовый сбор booking-URL**, write API и live Hotellook — **не в продукте**. Hotellook-tools в каталоге fail-closed (API закрыт с 2025-10-20). Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Travelpayouts Data API + Flight Search** — не сторонний MCP (stufently / flights-mcp) «как есть» и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** записью билетов/бронированием «под ключ»; [внешними MCP](./mcp) в реестре компании.

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Авиасейлс** → секрет Travelpayouts token (`tokenSecretRef`) → для live-поиска задать **partnerMarker** и **searchHost** → booking-clicks только при явном **`enableBookingClicks`**.

## Что умеет агент (as-built preview)

**32** инструмента (`PLUGIN_VERSION` **0.11.0**, Waves **AS\*–AS\*\*\*\*\*\*** + resilience **AS-R–AS-R4**), в том числе:

- Data API v1–v3: cheap/direct/calendar, prices_for_dates, grouped, special offers, popular directions, search by price
- Справочники: airlines/airports/cities/countries/alliances/planes/routes (с company cache)
- Курсы yasen + whereami (публичный IP → IATA)
- Flight Search: `live_search` → `live_options` / `live_option_detail` / `list_offer_agencies`
- Booking UX: `request_booking_link` — **только** при `enableBookingClicks: true` (одна ссылка по `offer_id` + `agency_id`)

**Надёжность (без смены архитектуры):**

- Таймауты: лёгкие запросы **15 с**, тяжёлые (dumps / live) **45 с**
- Жёсткие лимиты (AS-R3): Data ~**75%** official RPM; Flight Search **80/ч** на `user_ip`
- После **трёх** подряд HTTP 429 — пауза `max(5с, Retry-After ≤ 60с)` (Data + FS)
- Параллельные miss справочников — один egress (dump coalesce); секрет токена — coalesce 60 с
- Soft-serve: currency / dumps / кэш поиска при кратковременных сбоях провайдера

**Не умеет (явно NO-GO):** live Hotellook; tickets-api (MAU); write; массовый harvest booking-URL; multi-region marker; произвольный `raw_request`.

## Как подключить (кратко)

1. Установите плагин **Авиасейлс** в менеджере плагинов компании.
2. Укажите **Travelpayouts token** через секрет компании (`tokenSecretRef`).
3. Для Flight Search задайте **partnerMarker** и **searchHost**; передавайте **публичный** `user_ip` (не localhost).
4. Booking-clicks: включите **`enableBookingClicks`** только при пользовательском intent; сначала `list_offer_agencies`.
5. Разрешите нужные tools агенту (`aviasales_*` в allowlist / Skills readiness).
6. Проверьте: «Дешёвые цены MOW→LED на август» / «Живой поиск на завтра» — агент должен читать, без массовых кликов.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §7 · Waves **AS-R4** · package README `packages/plugins/plugin-aviasales`.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / mass booking scrape клиентам.
- Live pilot и GA — только после harness evidence (`aviasales-pilot.json`), не «вручную passed».
- Ответы Data API и Flight Search — **внешний недоверенный текст**; booking URL — ToS-риск при массовом использовании.
- Ужесточение SlidingWindow (ещё ниже RPM) — backlog: только после live-метрик `rateLimited`.

## Что дальше

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
