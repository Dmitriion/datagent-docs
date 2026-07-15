---
id: amocrm
title: amoCRM — чтение CRM для агентов (preview)
sidebar_label: amoCRM (preview)
description: "Preview read-only коннектор amoCRM: сделки, контакты, покупатели и справочники через tools агента. Без записи в CRM до GA."
---

# amoCRM (preview)

:::info[Preview — только чтение]
Плагин **amoCRM** доступен как **preview**: агент может **читать** воронку, сделки, контакты, покупателей и связанные справочники. **Создание и изменение** сделок, accept unsorted, запись транзакций — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого pilot.
:::

Коннектор даёт агенту **управляемые инструменты** (tools) к **Official amoCRM API v4** — не сторонний «готовый MCP-сервер вендора» и не чат-мост вроде [Битрикс24](./bitrix24). Вызовы идут через виртуальный MCP **`datagent-plugins`** (plugin tools host-а).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Менеджер плагинов** / **Интеграции** → плагин **amoCRM** → установить → указать токен (secret) и **разрешённые pipeline ID**.

## Чем это отличается от Битрикс24 и реестра MCP

| Связка | Что делает |
| --- | --- |
| **[Битрикс24](./bitrix24)** | Чаты и открытые линии ↔ задачи Datagent |
| **[Реестр внешних MCP](./mcp)** | Любой HTTP/SSE MCP (Context7, свой сервис) → Cursor |
| **amoCRM (эта страница)** | Read-only CRM API: сделки, контакты, каталоги, беседы (метаданные), роли… |

Не путайте с write-heavy сторонними MCP amoCRM: в Datagent **V1 = только чтение**.

## Что умеет агент (as-built preview)

Примерно **48** инструментов чтения, в том числе:

- Сделки, контакты, компании, покупатели (включая сегменты и транзакции — list/get)
- Воронки и статусы, пользовательские поля, каталоги и элементы
- Задачи, примечания, события, unsorted (get), источники, причины отказа
- Беседы (talks) — с пометкой PII; роли и подписки сущностей
- Поиск с фильтрами, embeds (`with`), альфа-фильтрами (`ids` / сортировка / цена / статус покупателя)

**Не умеет (явно NO-GO):** create/update/batch, link write, unsorted accept/reject, закрытие talk, запись транзакций, произвольный `raw_request`.

## Как подключить (кратко)

1. Установите плагин **amoCRM** в менеджере плагинов компании.
2. В настройках укажите **Bearer-токен** через **секрет компании** (`secret_ref`) и **непустой** список `allowedPipelineIds`.
3. Разрешите нужные plugin tools агенту (allowlist / Skills readiness, если skill требует tools).
4. Проверьте на тестовой задаче: «Покажи сделки в воронке X» — агент должен вызвать tools чтения, не пытаться писать в CRM.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md).

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write CRM клиентам.
- Rate limit и egress — со стороны control plane (в т.ч. ~7 rps); длинные выгрузки режьте фильтрами.
- Данные контактов и notes/talks могут содержать **ПДн** — выдавайте tools только нужным агентам.

## Что дальше

→ [ВКонтакте (preview)](./vk) — сообщества Social  

→ [VK Реклама (preview)](./vk-ads) — кабинеты Ads  

→ [Яндекс 360 (preview)](./yandex360) — Directory / Mail / Security  

→ [Яндекс Трекер (preview)](./yandex-tracker) — задачи и очереди  

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [Авиасейлс (preview)](./aviasales) — цены / Flight Search  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Битрикс24](./bitrix24) — чаты CRM  

→ [Плагины](../cloud/plugins)
