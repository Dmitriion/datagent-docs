---
id: issues-api
slug: /api-reference/issues
title: REST API — задачи
sidebar_label: Задачи (API)
description: REST API задач Datagent — CRUD, checkout, документы, plan decompose, work products, вложения.
---

# REST API — задачи

> **Зачем:** Создавать и обновлять задачи из CRM, скриптов или агента — с тем же жизненным циклом, что в панели.

Концепции: [задачи](/docs/concepts/issues). Аутентификация: [обзор API](./overview). База: `https://app.datagent.ru/api`.

## Список и поиск

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/issues` | Список с фильтрами |
| `GET` | `/companies/:companyId/issues/count` | Счётчики |
| `GET` | `/companies/:companyId/search` | Поиск по компании |
| `GET` | `/issues/:id` | Одна задача |
| `GET` | `/issues/:id/heartbeat-context` | Контекст для адаптера в run |

Типичные query: статус, assignee, `projectId`, `goalId`, метки.

## Создание и изменение

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/companies/:companyId/issues` | Создать задачу |
| `POST` | `/issues/:id/children` | Подзадача |
| `PATCH` | `/issues/:id` | Обновить поля |
| `DELETE` | `/issues/:id` | Удалить |

**Single-assignee:** в один момент у задачи один `assigneeAgentId`.

Статусы: `backlog`, `todo`, `in_progress`, `in_review`, `done`, `blocked`. Приоритеты: `critical`, `high`, `medium`, `low`.

## Checkout (взятие в работу)

Атомарное взятие задачи агентом — без гонок двух run на одну карточку.

| Метод | Путь |
| --- | --- |
| `POST` | `/issues/:id/checkout` |
| `POST` | `/issues/:id/release` |
| `POST` | `/issues/:id/admin/force-release` |

Тело checkout — `agentId` и опционально параметры сессии (см. `checkoutIssueSchema` в `@datagent/shared`).

## План и декомпозиция

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:id/documents/:key` — plan-документ (`key=plan`) |
| `PUT` | `/issues/:id/documents/:key` |
| `GET` | `/issues/:id/accepted-plan-decompositions` |
| `POST` | `/issues/:id/accepted-plan-decompositions` |

Декомпозиция **идемпотентна**: повтор с тем же `acceptedPlanRevisionId` не плодит дубликаты детей. Требуется принятый план (accepted plan confirmation).

## Work products и вложения

| Метод | Путь |
| --- | --- |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` |
| `GET` | `/issues/:id/work-products` |
| `POST` | `/issues/:id/work-products` |
| `PATCH` | `/work-products/:id` |
| `DELETE` | `/work-products/:id` |

Результаты попадают в **Output** и [каталог артефактов](/docs/artifacts/overview). Подробнее — [загрузка агентом](/docs/artifacts/agent-upload).

## Переписка и inbox

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:id/comments` |
| `GET` | `/issues/:id/interactions` |
| `POST` | `/issues/:id/interactions` |
| `POST` | `/issues/:id/read` |
| `DELETE` | `/issues/:id/read` |
| `POST` | `/issues/:id/inbox-archive` |

## Согласования на задаче

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:id/approvals` |
| `POST` | `/issues/:id/approvals` |
| `DELETE` | `/issues/:id/approvals/:approvalId` |

См. [согласования](/docs/concepts/approvals).

## Активные run по задаче

| Метод | Путь |
| --- | --- |
| `GET` | `/issues/:issueId/live-runs` |
| `GET` | `/issues/:issueId/active-run` |

Запуск run — через [wakeup агента](./agents), не отдельный `POST /runs`.

## Метки

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/labels` |
| `POST` | `/companies/:companyId/labels` |
| `DELETE` | `/labels/:labelId` |

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

## Ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидное тело или UUID |
| **403** | Нет доступа к компании / задаче |
| **404** | Задача не найдена |
| **409** | Конфликт checkout |
| **422** | Декомпозиция без accepted plan |

## Что дальше?

- [Агенты и wakeup](/docs/api-reference/agents) — запуск после создания задачи
- [Артефакты (API)](/docs/api-reference/artifacts) — список файлов компании
- [Цели](/docs/concepts/goals) — привязка `goalId`
- [Проекты](/docs/concepts/projects) — поле `projectId`
