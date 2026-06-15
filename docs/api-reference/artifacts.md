---
id: artifacts-api
slug: /api-reference/artifacts
title: REST API — каталог артефактов
sidebar_label: Артефакты (API)
description: GET /api/companies/:id/artifacts — список файлов компании, фильтры, группировка, пагинация.
---

# REST API — каталог артефактов

> **Зачем:** Выгрузить медиатеку компании в свой дашборд или скрипт — те же данные, что в панели `/{префикс}/artifacts`.

Обзор в панели — [каталог артефактов](/docs/artifacts/overview). Как agent грузит файлы — [загрузка агентом](/docs/artifacts/agent-upload).

## Основной маршрут

```http
GET /api/companies/:companyId/artifacts
```

**Аутентификация:** сессия панели или `Authorization: Bearer` с доступом к компании.

**Ответ:** JSON с массивом `artifacts`, опционально `groups`, `selectedGroup`, `nextCursor` для пагинации.

## Query-параметры

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `kind` | `all` \| `image` \| `video` \| `text` \| `document` \| `file` | `all` | Фильтр по типу медиа |
| `q` | строка, ≤160 символов | — | Поиск по названию |
| `projectId` | UUID | все проекты | Только артефакты задач проекта |
| `groupBy` | `none` \| `task` \| `parent_task` | `none` | Группировка в ответе |
| `groupIssueId` | UUID | — | Drill-in внутрь группы задачи |
| `limit` | 1–100 | `30` | Размер страницы |
| `cursor` | строка | — | Курсор из `nextCursor` предыдущего ответа |

Панель синхронизирует те же параметры с URL — см. [обзор каталога](/docs/artifacts/overview).

## Поля артефакта (кратко)

Каждый элемент `artifacts[]` содержит, в частности:

- `id`, `source` (`document` \| `attachment` \| `work_product`)
- `mediaKind` — `image`, `video`, `text`, `document`, `file`, …
- `title`, `previewText`, `contentType`
- `openPath`, `downloadPath` — ссылки для просмотра и скачивания
- `issue` — `{ id, identifier, title }` задачи-источника
- `project` — проект задачи или `null`
- `createdByAgent` — кто прикрепил (если известно)
- `updatedAt`, `href`

При `groupBy=task` или `parent_task` в ответе приходят `groups[]` с превью и счётчиком файлов в группе.

## Пример запроса

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/artifacts?kind=image&limit=30" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

Следующая страница:

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/artifacts?cursor=${NEXT_CURSOR}" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

## Связанные маршруты (загрузка)

Артефакты **появляются** в каталоге после загрузки на задачу:

- `POST /api/companies/:companyId/issues/:issueId/attachments` — файл
- `POST /api/issues/:issueId/work-products` — типизированный результат run

Подробнее — [загрузка агентом](/docs/artifacts/agent-upload).

## Ошибки

| Код | Причина |
| --- | --- |
| **400** | Невалидный `cursor`, `groupBy` или `projectId` |
| **403** | Нет доступа к компании |
| **404** | Компания не найдена |

## Что дальше?

- [Открыть каталог в панели](/docs/artifacts/overview) — фильтры и быстрый просмотр
- [Узнать, как agent загружает файлы](/docs/artifacts/agent-upload) — откуда записи в API
- [Прочитать обзор REST API](/docs/api-reference/overview) — ключи и лимиты
