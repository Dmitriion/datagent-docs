---
id: artifacts-api
slug: /api-reference/artifacts
title: REST API — каталог артефактов
sidebar_label: Артефакты (API)
description: GET /api/companies/:id/artifacts — список файлов компании; прикрепление и скачивание.
---

# REST API — каталог артефактов

> **Зачем:** Выгрузить медиатеку компании в свой дашборд или скрипт — те же данные, что в панели `/{префикс}/artifacts`.

Обзор в панели — [каталог артефактов](/docs/artifacts/overview). Как agent прикрепляет файлы — [прикрепление агентом](/docs/artifacts/agent-upload).

**Тариф:** каталог артефактов и Excel Workbench — **Solo и выше** ([тарифы](/docs/cloud/pricing)).

**Аутентификация:** `Authorization: Bearer <your-api-key>` или сессия панели.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/artifacts` | Список артефактов компании |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` | Прикрепить файл к задаче (агент или board) |
| `GET` | `/attachments/:attachmentId/content` | Скачать или открыть вложение |
| `POST` | `/issues/:issueId/work-products` | Типизированный результат run |

## Основной маршрут каталога

```http
GET /companies/:companyId/artifacts
```

**Ответ:** JSON с `artifacts[]`, опционально `groups`, `selectedGroup`, `nextCursor`.

### Query-параметры

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `kind` | `all` \| `image` \| `video` \| `text` \| `document` \| `file` | `all` | Фильтр по типу |
| `q` | строка, ≤160 | — | Поиск по названию |
| `projectId` | UUID | все проекты | Артефакты задач проекта |
| `groupBy` | `none` \| `task` \| `parent_task` | `none` | Группировка |
| `groupIssueId` | UUID | — | Drill-in в группу задачи |
| `limit` | 1–100 | `30` | Размер страницы |
| `cursor` | строка | — | Пагинация |

## Поля артефакта

- `id`, `source` (`document` \| `attachment` \| `work_product`)
- `mediaKind`, `title`, `contentType`
- `openPath`, `downloadPath` — просмотр и скачивание
- `issue`, `project`, `createdByAgent`, `updatedAt`

## Скачивание и прикрепление

**Скачать файл:**

```http
GET /attachments/:attachmentId/content?download=1
```

**Прикрепить файл агентом** (multipart, ключ агента или board):

```http
POST /companies/:companyId/issues/:issueId/attachments
```

После загрузки запись появляется в `GET /companies/:companyId/artifacts` и в Output задачи.

## Пример: список артефактов

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/artifacts?kind=image&limit=30" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

## Ошибки

| Код | Причина |
| --- | --- |
| **400** | Невалидный `cursor` или `groupBy` |
| **403** | Нет доступа к компании |
| **404** | Компания или вложение не найдены |

## Что дальше?

- **Каталог в панели** — [обзор](/docs/artifacts/overview)
- **Прикрепление агентом** — [agent-upload](/docs/artifacts/agent-upload)
- **Аутентификация** — [обзор REST API](./overview)
