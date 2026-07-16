---
id: yandex360
title: Яндекс 360 — Directory, почта и безопасность (preview)
sidebar_label: Яндекс 360 (preview)
description: "Preview read-only коннектор Яндекс 360: оргструктура, Admin Mail и Security audit через tools агента. Без записи и без Wiki/Forms."
---

# Яндекс 360 (preview)

:::info[Preview — только чтение]
Плагин **Яндекс 360** доступен как **preview**: агент может **читать** Directory (орг, пользователи, подразделения), Admin Mail (общие ящики, маршрутизация) и Security (audit/policies). **Создание и изменение** пользователей, ящиков, политик, Wiki и Forms — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Яндекс 360 API** — не сторонний MCP `ycli` и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** [Яндекс Трекер](./yandex-tracker) (отдельный плагин задач), [YandexGPT](./yandexgpt) (LLM-адаптер), [Яндекс Метрика](https://github.com/Dmitriion/datagent/blob/master/doc/guides/yandex-metrika.md) (analytics).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Яндекс 360** → OAuth-токен (секрет компании) → непустые allowlists организаций и подразделений.

## Что умеет агент (as-built preview)

**36** инструментов чтения (`PLUGIN_VERSION` **0.7.0**, Wave **J0+J+K+L+Y360-R+R2+R3**), в том числе:

- Организация, пользователи, подразделения, группы и участники
- Домены, DNS, роли, лицензии, контакты, 2FA-статус пользователя
- Admin Mail: общие/делегированные ящики, actors, правила маршрутизации, настройки почты
- Security: audit (org/disk/mail), password/session/OAuth policies, service apps, domain 2FA status

**Надёжность (без смены архитектуры):** мягкие таймауты (лёгкие/тяжёлые списки), повтор при 429/сети, audit по умолчанию за последние **24 часа**, если не задано окно дат. Жёсткий RPS-лимитер не включён: у Official API нет опубликованного RPS.

**Не умеет (явно NO-GO):** write Directory/Mail/Security; logout сессий; включение/выключение 2FA; Wiki/Forms; IMAP/тело писем; Tracker (см. [отдельный плагин](./yandex-tracker)).

## Как подключить (кратко)

1. Установите плагин **Яндекс 360** в менеджере плагинов компании.
2. Укажите **OAuth-токен** через секрет компании и **непустые** `allowedOrganizationIds` / `allowedDepartmentIds`.
3. В карточке агента → **Подключения** включите Яндекс 360 и при необходимости subset (`y360_*`; или Skills readiness).
4. Проверьте на тестовой задаче: «Покажи пользователей отдела X» / «События аудита за сутки» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §5 · Waves **Y360-R3**.

## Ограничения

- Статус каталога: **`preview`** — не считать GA.
- Данные пользователей, ящиков и audit — **ПДн**; выдавайте tools только нужным агентам.
- Live pilot и GA — только после harness evidence (`yandex360-pilot.json`), не «вручную passed».

## Что дальше

→ [Яндекс Трекер (preview)](./yandex-tracker) — задачи и очереди  

→ [ВКонтакте (preview)](./vk) — сообщества Social  

→ [VK Реклама (preview)](./vk-ads) — кабинеты Ads  

→ [Селектел (preview)](./selectel) — облачный инвентарь  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
