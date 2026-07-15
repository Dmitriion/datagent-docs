---
id: changelog
title: История изменений
sidebar_label: История изменений
description: Что нового в Datagent — новые функции, улучшения и исправления для пользователей app.datagent.ru.
---

# История изменений

Здесь — значимые обновления продукта и справки на [docs.datagent.ru](https://docs.datagent.ru). Технические правки «под капотом» в список не попадают.

---

## Июль 2026 — MCP hardening + границы коннекторов

**Что нового в справке:**

- [Внешние инструменты (MCP)](./integrations/mcp) — уточнены адаптеры с `supportsExternalMcp` (не только Cursor); политика id / legacy `1c-*`; граница с Russia connectors через `datagent-plugins`
- [Архитектура](./concepts/agent-architecture) — plugin tools / fail-closed `desiredTools` без изменений по сути; опора на тот же путь для preview-коннекторов
- Preview-страницы [amoCRM](./integrations/amocrm), [Ozon](./integrations/ozon), [Wildberries](./integrations/wildberries), [VK](./integrations/vk), [VK Ads](./integrations/vk-ads), [Selectel](./integrations/selectel), [Aviasales](./integrations/aviasales) — единый паттерн «установить → secret refs → allowlist tools → read-only»

**Для инженеров (монорепо):** managed gateway origin (`DATAGENT_MCP_GATEWAY_ORIGIN` / listen port), redacted `cursor-config` vs internal `runtime-config`, live fail-closed smoke Russia connectors — `doc/guides/mcp-plugin.md`, `doc/DEVELOPING.md` § Russia connector plugins.

**Для кого:** админы Studio+ с внешним MCP; операторы preview Russia connectors без путаницы с реестром MCP.

---

## Июль 2026 — Ozon Seller (preview MCP)

**Что нового в справке:**

- [Ozon Seller (preview)](./integrations/ozon) — Official Seller API (**105** tools, Waves O0–O9 + OR/OR2/OR3/OR4, `PLUGIN_VERSION` 1.6.0): read-only через `datagent-plugins`; SlidingWindow 20/s; dual probe; soft `ozon-rate-limit-soft`; без write / Performance ads / meta `call_method`
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** операторы маркетплейса Ozon на preview; live pilot и GA — после harness evidence (`ozon-seller-pilot.json`).

---

## Июль 2026 — Wildberries (preview MCP)

**Что нового в справке:**

- [Wildberries (preview)](./integrations/wildberries) — Seller OpenAPI (**165** tools, Waves W0–W14 + W-R…W-R3, `PLUGIN_VERSION` 1.10.0): read-only через `datagent-plugins`; per-company 5 rps; soft 429; auth coalesce; без write / ZIP / keys
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** продавцы WB на preview; live pilot и GA — после harness evidence.

---

## Июль 2026 — Авиасейлс (preview MCP)

**Что нового в справке:**

- [Авиасейлс (preview)](./integrations/aviasales) — Travelpayouts Data API + Flight Search (**32** tools, Waves AS\*–AS\*\*\*\*\*\* + AS-R–AS-R4, `PLUGIN_VERSION` 0.11.0): read-only через `datagent-plugins`; SlidingWindow RPM / FS 80/ч; soft 429 trip; без mass booking harvest / Hotellook live / write
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** операторы travel / аналитики цен на preview; live pilot и GA — после harness evidence.

---

## Июль 2026 — Селектел (preview MCP)

**Что нового в справке:**

- [Селектел (preview)](./integrations/selectel) — облачный инвентарь Selectel (**139** tools, Waves SE0–SE12 + SE-R…SE-R3, `PLUGIN_VERSION` 1.10.0): read-only через `datagent-plugins`; dual probe; soft 429 с Retry-After; без write / kubeconfig / object body
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** операторы облака Selectel на preview; live pilot и GA — после harness evidence.

---

## Июль 2026 — ВКонтакте и VK Реклама (preview MCP)

**Что нового в справке:**

- [ВКонтакте (preview)](./integrations/vk) — group-scoped Social API (**93** tools, Wave **V-R3**): стена/медиа/маркет/LeadForms; flood soft-retry + light/heavy timeouts; без write / friends / newsfeed
- [VK Реклама (preview)](./integrations/vk-ads) — Official ads.vk.com (**69** tools, Wave **VA-R3**): планы/кампании/баннеры/статистика; nested READ hint + 429 soft-trip; без write / `raw_request`
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** операторы SMM / performance на preview; live pilot и GA — после harness evidence (`vk-pilot.json` / `vk-ads-pilot.json`).

---

## Июль 2026 — Яндекс 360 и Трекер (preview MCP)

**Что нового в справке:**

- [Яндекс 360 (preview)](./integrations/yandex360) — Directory + Admin Mail + Security (**36** tools, Wave Y360-R3): read-only через `datagent-plugins`; audit по умолчанию 24ч; без write / Wiki / Forms
- [Яндекс Трекер (preview)](./integrations/yandex-tracker) — issues/очереди + Official search scroll (**76** tools); отдельный плагин от 360; без write
- Уточнены границы Russia connectors на [внешних инструментах (MCP)](./integrations/mcp) и в [плагинах](./cloud/plugins)

**Для кого:** операторы Яндекс 360 / Трекер на preview; live pilot и GA — после harness evidence.

---

## Июль 2026 — amoCRM preview (чтение CRM)

**Что нового в справке:**

- [amoCRM (preview)](./integrations/amocrm) — read-only коннектор воронки/сделок/контактов через plugin tools (`datagent-plugins`); не путать с [реестром внешних MCP](./integrations/mcp) и чат-мостом [Битрикс24](./integrations/bitrix24)
- Уточнены границы «четырёх MCP» на странице [внешних инструментов](./integrations/mcp)

**Для кого:** операторы CRM на preview; write в amoCRM — ещё не в продукте.

---

## Июль 2026 — Конвейеры, Таймлайн, MCP и браузер из магазина

**Что нового в справке:**

- [Конвейеры](./workflows/pipelines) и [Таймлайн](./workflows/timeline) — стандартные рабочие процессы для всех пользователей
- [Внешние инструменты (MCP)](./integrations/mcp) — реестр подключений для Cursor-агентов (Studio+)
- [BrowserBridge](./integrations/browserbridge) — основной путь через [Chrome Web Store](https://chromewebstore.google.com/detail/datagent-browserbridge/onlphfpiiegbgjmfihbimgnmpbleaelh)
- [1С](./integrations/1c-connector) — доступ Cursor-агента к разрешённым инструментам после настройки коннектора
- [Свой сервер](./cloud/on-premise) — короткая Enterprise-страница с заявкой на [sales@datagent.ru](mailto:sales@datagent.ru)

**Для кого:** операторы и руководители на [app.datagent.ru](https://app.datagent.ru).

---

## Июнь 2026 — Биллинг, лимиты и справка API

**Что нового:** страницы [Тарифы](./cloud/pricing), [Биллинг](./billing/overview) и [Лимиты по тарифам](./billing/limits) — единая сетка Free → Enterprise. Для разработчиков — [обзор REST API](./api-reference/overview) и [плагины (API)](./api-reference/plugins).

**Для кого:** владельцы аккаунта и интеграторы. Цены без НДС; при годовой оплате действует скидка 20%.

---

## Июнь 2026 — Каталог навыков и управление плагинами

**Что нового:** в панели появился **каталог навыков** — готовые сценарии для агентов: таблицы, отчёты, презентации. В настройках — раздел **управления плагинами**: подключите Битрикс24, Телеграм и другие расширения без правки кода.

**Для кого:** все пользователи облака. Платные навыки — по тарифу (**Solo** — 6 из 14, **Studio** — все 14). Подробнее — [Первый агент](./cloud/first-agent).

---

## Июнь 2026 — Пять минут от регистрации до первого ответа

**Что нового:** справка ведёт в [app.datagent.ru](https://app.datagent.ru) — регистрация, мастер первых шагов, первый агент и задача без установки программ на свой сервер.

**Для кого:** все, кто начинает с нуля. Установка на своём оборудовании — [Свой сервер](./cloud/on-premise) (тариф **Enterprise**).

Также обновили:

- [Начало работы](./cloud/getting-started) — пошаговый путь в облаке
- [Учебник](./guides) — сценарии от первого дня до Битрикс24 и 1С
- [Управление браузером](./browser/setup) — подключение из облака
- [Обзор API](./api-reference/overview) — для своих интеграций

---

## Май 2026 — Публичная справка и российские модели

**Что нового:** открыли docs.datagent.ru — можно разобраться с платформой без доступа к репозиторию. Пошаговые инструкции по **GigaChat**, **YandexGPT**, **Битрикс24** и **Телеграм**.

**Для кого:** все пользователи.

---

## Апрель 2026 — Первый релиз платформы

**Что нового:** агенты работают в задачах с журналом каждого шага; перед рискованным действием вы подтверждаете его в панели. Встроены российские модели и плагины для CRM и мессенджеров.

**Для кого:** все пользователи облака.

---

## Что дальше?

[Начать за 5 минут →](./cloud/getting-started)
