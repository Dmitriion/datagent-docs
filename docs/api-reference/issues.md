---
id: issues-api
slug: /api-reference/issues
title: REST API — задачи
sidebar_label: Задачи (API)
description: REST API задач Datagent — CRUD, checkout, декомпозиция плана, work products, вложения.
---

# REST API — задачи

> **Зачем:** Создавать и обновлять задачи из CRM, скриптов или от имени agent — с тем же жизненным циклом, что в панели.

Для оператора — [задачи](/docs/concepts/issues). Как войти в API — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/issues` | Список задач |
| `POST` | `/companies/:companyId/issues` | Создать задачу |
| `GET` | `/issues/:id` | Получить задачу |
| `PATCH` | `/issues/:id` | Обновить задачу |
| `DELETE` | `/issues/:id` | Удалить задачу |
| `POST` | `/issues/:id/checkout` | Взять задачу в работу |
| `POST` | `/issues/:id/accepted-plan-decompositions` | Декомпозиция принятого плана (Studio+) |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` | Прикрепить файл |

## Список и поиск

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/issues` | Список с фильтрами |
| `GET` | `/companies/:companyId/issues/count` | Счётчики |
| `GET` | `/companies/:companyId/search` | Поиск по компании |
| `GET` | `/issues/:id` | Одна задача |
| `GET` | `/issues/:id/heartbeat-context` | Контекст для адаптера в run |

## Создание и изменение

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/companies/:companyId/issues` | Создать задачу |
| `POST` | `/issues/:id/children` | Подзадача |
| `PATCH` | `/issues/:id` | Обновить поля |
| `DELETE` | `/issues/:id` | Удалить |

**Single-assignee** — в один момент у задачи только один `assigneeAgentId`.

## Checkout (взятие в работу)

| Метод | Путь |
| --- | --- |
| `POST` | `/issues/:id/checkout` |
| `POST` | `/issues/:id/release` |
| `POST` | `/issues/:id/admin/force-release` |

## План и декомпозиция

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:id/documents/:key` — plan-документ (`key=plan`) |
| `PUT` | `/issues/:id/documents/:key` |
| `GET` | `/issues/:id/accepted-plan-decompositions` |
| `POST` | `/issues/:id/accepted-plan-decompositions` |

### Декомпозиция задачи на подзадачи

**Доступно на тарифе Studio и выше** (продуктовое ограничение; см. [тарифы](/docs/cloud/pricing)).

Разбивает **принятый план** задачи на дочерние задачи. План должен иметь подтверждение accepted plan; в теле передаёте список дочерних карточек.

```http
POST /issues/{id}/accepted-plan-decompositions
```

```json
{
  "acceptedPlanRevisionId": "uuid-ревизии-плана",
  "children": [
    { "title": "Собрать данные", "status": "backlog" },
    { "title": "Сформировать отчёт", "status": "backlog" }
  ]
}
```

**Пример ответа:**

```json
{
  "decomposition": { "id": "...", "status": "active", "acceptedPlanRevisionId": "..." },
  "childIssueIds": ["...", "..."],
  "newlyCreatedChildIssueIds": ["...", "..."]
}
```

Повтор с тем же `acceptedPlanRevisionId` и тем же набором детей идемпотентен; другой набор детей для той же ревизии — `409`.

| Код | Когда |
| --- | --- |
| **422** | `acceptedPlanRevisionId` не принят или не относится к плану задачи |
| **403** | Нет доступа к компании / задаче |
| **409** | Конфликт декомпозиции для ревизии |

## Work products и вложения

| Метод | Путь |
| --- | --- |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` |
| `GET` | `/issues/:id/attachments` |
| `GET` | `/attachments/:attachmentId/content` |
| `GET` | `/issues/:id/work-products` |
| `POST` | `/issues/:id/work-products` |

Скачивание вложения: `GET /attachments/:attachmentId/content?download=1`.

Результаты попадают в **Output** и [каталог артефактов](/docs/artifacts/overview).

## Переписка, согласования, run

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:id/comments` |
| `POST` | `/issues/:id/interactions` |
| `GET` | `/issues/:id/approvals` |
| `GET` | `/issues/:issueId/live-runs` |

Запустить run — через [возобновление работы агента](./agents), не отдельный `POST /runs`.

## Пример: создать задачу

```bash
curl -s -X POST "https://app.datagent.ru/api/companies/${COMPANY_ID}/issues" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Сводка по клиенту X",
    "description": "Таблица: тема, статус, следующий шаг",
    "assigneeAgentId": "'"${AGENT_ID}"'",
    "status": "todo"
  }'
```

## Что дальше?

- **Запустите агента** — [агенты (API)](./agents): `POST /agents/:id/wakeup`
- **Каталог файлов** — [артефакты (API)](./artifacts)
- **Цели и проекты** — [цели](/docs/concepts/goals), [проекты](/docs/concepts/projects)
