---
id: issues-api
slug: /api-reference/issues
title: REST API — задачи
sidebar_label: Задачи (API)
description: REST API задач Datagent — CRUD, checkout, разбиение плана, work products, вложения.
---

# REST API — задачи

> **Зачем:** Создавать и обновлять задачи из CRM, скриптов или от имени агента — с тем же жизненным циклом, что в панели.

Для оператора — [задачи](/docs/concepts/issues). Как войти в API — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/issues` | Список задач — синхронизация с внешней доской или отчёт |
| `POST` | `/companies/:companyId/issues` | Создать задачу — постановка из CRM или webhook |
| `GET` | `/issues/:id` | Получить задачу — детали перед обновлением |
| `PATCH` | `/issues/:id` | Обновить задачу — смена статуса из интеграции |
| `DELETE` | `/issues/:id` | Удалить задачу — очистка тестовых карточек |
| `POST` | `/issues/:id/checkout` | Взять задачу в работу — атомарно для одного агента |
| `POST` | `/issues/:id/accepted-plan-decompositions` | Разбить принятый план на подзадачи (Studio+) |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` | Прикрепить файл — результат run или входной документ |

## Список и поиск

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/issues` | Фильтр по статусу, исполнителю, проекту — выгрузка в BI |
| `GET` | `/companies/:companyId/issues/count` | Счётчики для виджетов без полного списка |
| `GET` | `/companies/:companyId/search` | Полнотекстовый поиск по компании |
| `GET` | `/issues/:id` | Одна задача по id для детального экрана |
| `GET` | `/issues/:id/heartbeat-context` | Контекст для адаптера в run — что передать агенту |

## Создание и изменение

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/companies/:companyId/issues` | Новая карточка из тикет-системы |
| `POST` | `/issues/:id/children` | Подзадача вручную без плана |
| `PATCH` | `/issues/:id` | Обновить поля после действия во внешней системе |
| `DELETE` | `/issues/:id` | Удалить устаревшую задачу |

В один момент у задачи только один `assigneeAgentId` (один исполнитель-агент).

## Checkout (взятие в работу)

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/issues/:id/checkout` | Агент атомарно берёт задачу — два run не схватят одну карточку |
| `POST` | `/issues/:id/release` | Освободить задачу после ошибки или отмены |
| `POST` | `/issues/:id/admin/force-release` | Принудительно снять checkout оператором |

## План и разбиение на подзадачи

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/issues/:id/documents/:key` | Прочитать plan-документ (`key=plan`) |
| `PUT` | `/issues/:id/documents/:key` | Записать план из скрипта или агента |
| `GET` | `/issues/:id/accepted-plan-decompositions` | Список уже созданных разбиений плана |
| `POST` | `/issues/:id/accepted-plan-decompositions` | Разбить принятый план на дочерние задачи |

### POST /issues/:id/accepted-plan-decompositions

**Доступно на тарифе Studio и выше** ([тарифы](/docs/cloud/pricing)).

Разбивает **принятый план** на дочерние задачи — когда большую задачу нужно распределить по исполнителям после согласования плана.

```http
POST /issues/{id}/accepted-plan-decompositions
```

**Тело запроса:**

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
| **409** | Конфликт разбиения для ревизии |

## Work products и вложения

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/companies/:companyId/issues/:issueId/attachments` | Загрузить файл на задачу — отчёт или входной шаблон |
| `GET` | `/issues/:id/attachments` | Список вложений задачи |
| `GET` | `/attachments/:attachmentId/content` | Открыть или скачать файл (`?download=1`) |
| `GET` | `/issues/:id/work-products` | Типизированные результаты run |
| `POST` | `/issues/:id/work-products` | Зафиксировать результат с метаданными |

Результаты попадают в **Output** и [каталог артефактов](/docs/artifacts/overview).

## Переписка, согласования, run

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/issues/:id/comments` | Комментарии — выгрузка переписки |
| `POST` | `/issues/:id/interactions` | Добавить сообщение от интеграции |
| `GET` | `/issues/:id/approvals` | Согласования на задаче |
| `GET` | `/issues/:issueId/live-runs` | Активные run по задаче |

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
