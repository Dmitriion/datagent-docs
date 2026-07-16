---
id: avito
title: Авито — Business API для агентов (preview)
sidebar_label: Авито (preview)
description: "Preview read-only коннектор Avito Business API: объявления, заказы, чаты, CPA/Ads, Autoteka, STR/realty и автозагрузка через tools агента. Без write, 3PL sandbox и scraper."
---

# Авито (preview)

:::info[Preview — только чтение]
Плагин **Авито** доступен как **preview**: агент может **читать** объявления, статистику, заказы, чаты, продвижение/CPA, Ads-кабинет, Autoteka (по id), STR/realty и отчёты автозагрузки через Official Business API. **Запись цен/VAS/остатков, переходы заказов, отправка в чат, Ads funds/budget, Autoteka postReport, 3PL delivery-sandbox и scraper** — **не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Avito Business API** (`api.avito.ru`) — не сторонний MCP ([elchin92/avito-mcp](https://github.com/elchin92/avito-mcp) ~148) «как есть», не Ascard scraper и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** write Business API; Ascard Playwright scraper (ToS-risk); [Ozon](./ozon) / [Wildberries](./wildberries) (отдельные seller preview); [внешними MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Авито** → секрет Bearer Business API (`accessTokenSecretRef`) + **userId** → allowlist **allowedItemIds** → при Ads: отдельный токен кабинета + **allowedAdsAccountIds**.

## Что умеет агент (as-built preview)

**104** инструмента чтения (`PLUGIN_VERSION` **1.6.5**, Waves **AV0–AV12** + resilience **AV-R…AV-R4a**), в том числе:

- Пользователь / объявления: account, list/get item, account-scoped item, analytics / spendings / VAS prices / calls stats
- Автозагрузка: reports v2/v3 + **v4** uploads/current/last_successful (+ items); docs tree/fields/profile
- Заказы и мессенджер: list/get, courier range, confirm-code check; chats / messages v3 (без send)
- Продвижение / CPA: BBIP, CPA balance/chats/calls, cpxpromo, auction, TrxPromo commissions
- Job / autostrategy / SBC: vacancies/applications; campaigns; special-offers
- **Ads** (`/ads/v1`): account/balance/children; advertisers/contracts; campaigns/groups/creatives; campaign/group stats
- **Autoteka** (RO): active package, preview/report **by id**, reports list, teaser, leads (без `postReport`)
- **STR / realty**: bookings; market price; realty report (POST-read)
- Hierarchy / calltracking: employees; call meta (без audio binary); packs overview/triage

**Надёжность (без смены архитектуры):**

- Таймауты: лёгкие **15 с**, тяжёлые (аналитика / packs / ads stats) **45 с**; concurrency **2**
- GET kit `maxRetries:2`; POST-read outer soft-retry budget **2** (client `maxRetries:0`)
- Auth coalesce **60 с** (main + ads) + invalidate при 401
- После **трёх** подряд HTTP 429 — пауза `max(5с, Retry-After ≤ 60с)`
- Проверка связи (probe): fail-closed **list items + item analytics**
- Soft warning `avito-rate-limit-soft` (в т.ч. packs overview/triage) → harness `rateLimited`
- Ref-cache TTL **300 с** для dict/tariff-like tools (`ref-cache-hit`)
- CallTracking path-limiter **5 запросов/мин** (официальный RPM секции)
- Stock `itemIds` max **10** (prose cap Avito — fail-closed до HTTP)
- Global SlidingWindow — только через env `DATAGENT_AVITO_RATE_LIMIT_MAX_PER_WINDOW` (**default off**; рекомендовать `5` после live `rateLimited`)

**Не умеет (явно NO-GO):** write price/VAS/stock/order/messenger/review/autoload upload; money (BBIP create / CPA bid save / Ads funds|budget|price / Autoteka postReport); 3PL `delivery-sandbox`; labels PDF/ZIP; call audio; Ascard scraper; elchin92 embed; in-plugin OAuth; `raw_request`.

## Как подключить (кратко)

1. Установите плагин **Авито** в менеджере плагинов компании.
2. Укажите Bearer Business API через секрет компании (`accessTokenSecretRef`) и **userId**.
3. Задайте **allowedItemIds** (объявления / STR / realty фильтруются по allowlist).
4. Для Ads-кабинета: `adsAccessTokenSecretRef` + `adsAccountId` + **allowedAdsAccountIds**.
5. В карточке агента → **Подключения** включите Авито и при необходимости subset (`avito_*`; или Skills readiness).
6. Проверьте: «Список объявлений» / «Баланс» / «Аналитика» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §13 · Waves **AV-R4a** · package README `packages/plugins/plugin-avito`.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / 148-tool parity клиентам.
- Live pilot и GA — только после harness evidence (`avito-pilot.json`), не «вручную passed».
- Verticals Ads / Autoteka / STR — curated READ Datagent; часть elchin92 surface (write/3PL/PDF/audio) намеренно вне scope.
- **AV-R4b** (default-on SlidingWindow / method-RPM) — backlog: только после live `rateLimited > 0`.

## Что дальше

→ [Ozon Seller (preview)](./ozon) — каталог и продажи Ozon  

→ [Wildberries (preview)](./wildberries) — Seller API WB  

→ [МойСклад (preview)](./moysklad) — склад / учёт Remap  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
