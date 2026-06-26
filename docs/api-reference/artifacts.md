---
id: artifacts-api
slug: /api-reference/artifacts
title: REST API — каталог артефактов
sidebar_label: Артефакты (API)
description: GET /api/companies/:id/artifacts — список файлов компании; прикрепление и скачивание.
---

# REST API — каталог артефактов

> **Зачем:** Выгрузить медиатеку компании в свой дашборд или скрипт — те же данные, что в панели `/{префикс}/artifacts`.

Обзор в панели — [каталог артефактов](/docs/artifacts/overview). Как агент прикрепляет файлы — [прикрепление агентом](/docs/artifacts/agent-upload).

**Тариф:** каталог артефактов и Excel Workbench — **Solo и выше** ([тарифы](/docs/cloud/pricing)).

**Аутентификация:** `Authorization: Bearer <your-api-key>` или сессия панели.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/artifacts` | Список артефактов — медиатека для портала или отчёта |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` | Прикрепить файл — загрузка результата run |
| `GET` | `/attachments/:attachmentId/content` | Скачать или открыть вложение в браузере |
| `POST` | `/issues/:issueId/work-products` | Зафиксировать типизированный результат run |

## Основной маршрут каталога

```http
GET /companies/:companyId/artifacts
```

Возвращает JSON с `artifacts[]`, при необходимости `groups`, `selectedGroup`, `nextCursor`.

### Query-параметры

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `kind` | `all` \| `image` \| `video` \| `text` \| `document` \| `file` | `all` | Фильтр по типу медиа |
| `q` | строка, ≤160 | — | Поиск по названию |
| `projectId` | UUID | все проекты | Только артефакты задач проекта |
| `groupBy` | `none` \| `task` \| `parent_task` | `none` | Группировка в ответе |
| `groupIssueId` | UUID | — | Провалиться в группу задачи |
| `limit` | 1–100 | `30` | Размер страницы |
| `cursor` | строка | — | Курсор из `nextCursor` предыдущего ответа |

## Поля артефакта

- `id`, `source` (`document` \| `attachment` \| `work_product`)
- `mediaKind`, `title`, `contentType`
- `openPath`, `downloadPath` — просмотр и скачивание
- `issue`, `project`, `createdByAgent`, `updatedAt`

## Скачивание и прикрепление

### GET /attachments/:attachmentId/content

Отдаёт содержимое файла — для скачивания в архив или открытия в браузере.

```http
GET /attachments/:attachmentId/content?download=1
```

### POST /companies/:companyId/issues/:issueId/attachments

Принимает multipart-файл — когда агент или скрипт прикрепляет результат к задаче.

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
