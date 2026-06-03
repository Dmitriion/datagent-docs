---
title: Шпаргалка — если ситуация X, откройте Y
sidebar_label: Шпаргалка
description: Типовые ситуации оператора и руководителя — куда идти в учебнике и техдоках Datagent за одну минуту.
sidebar_position: 10
---

Нужен маршрут, а не перечитывать восемь глав? Ниже — **ситуация → действие → ссылка**. Детали настройки — в «Глубже».

## Ежедневная работа

| Ситуация | Вы делаете | Куда |
| --- | --- | --- |
| Первый вход, страшно | Sidebar: Задачи, Агенты, Одобрения | [1. Первый день](./01-first-day) |
| Нужен ответ по теме | Задача → Wakeup → журнал run | [3. Одна задача](./03-one-task) |
| Висит «ждёт решения» | Board → **Одобрения** | [4. Одобрения](./04-trust-and-approval) |
| Непонятно, что агент умеет | Tools агента + плагины | [2. Команда](./02-your-team) |

## Руководитель

| Ситуация | Вы делаете | Куда |
| --- | --- | --- |
| Картина команды за 5 сек | **Офис** (если `enableOffice`) | [5. Офис](./05-office-field) |
| Кто ждёт hire / approval | Shield, amber, панель АГЕНТЫ | [5. Офис](./05-office-field) |
| Портфель проектов | Вкладка **Проекты** | [Обзор «Офис»](../office/overview) |

## Каналы и файлы

| Ситуация | Вы делаете | Куда |
| --- | --- | --- |
| Пишут в Bitrix | Найти задачу → run | [6. Каналы](./06-channels), [Bitrix24](../integrations/bitrix24) |
| Апрув в Телеграм | Кнопки → то же в Board | [Телеграм](../integrations/telegram) |
| Правка Excel | Вложение → plan → одобрение → apply | [7. Документы](./07-documents) |
| Проверить pptx | inspect / validate / preview | [7. Документы](./07-documents) |
| 1С для разработки | Connector page, Cursor mcp.json | [8. 1С](./08-1c-bridge) |

## Когда звать инженера

| Симптом | Вероятная причина | Док |
| --- | --- | --- |
| run `failed` | Адаптер, секреты, timeout tool | [Первый агент](../getting-started/first-agent) |
| tool не виден | Плагин не установлен / не у агента | [build-plugin](../tutorials/build-plugin) |
| Office apply ждёт | Очередь одобрений | [4. Одобрения](./04-trust-and-approval) |
| 1С upstream down | Публикация, auth, IIS | [1С Коннектор](../office/1c-connector) |

## Чего нет в продукте

- Публичный `POST /api/runs`
- Board на `:3200`
- `bitrix24_list_*`, `telegram_send_message` как штатные agent tools
- `datagent.1c-connector:*` в heartbeat

## Порядок чтения с нуля

1. [Обложка](./)  
2. [01](./01-first-day) → [02](./02-your-team) → [03](./03-one-task) → [04](./04-trust-and-approval)  
3. По роли: [05](./05-office-field), [06](./06-channels), [07](./07-documents), [08](./08-1c-bridge)
