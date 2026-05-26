---
id: overview
title: Обзор REST API
sidebar_label: Обзор API
description: REST API Datagent — POST /runs, GET /runs/:id, структура запроса и ответа, примеры curl для запуска и мониторинга агентов.
---

Публичный REST API Datagent доступен на базовом пути `/` (по умолчанию порт `3100`). Аутентификация — заголовок `Authorization: Bearer <api_token>` с правами workspace.

Все тела — `application/json`. Время в ISO 8601 UTC, если не указано иное.

## Эндпоинты

| Метод | Путь | Описание |
| --- | --- | --- |
| `POST` | `/runs` | Создать и поставить run в очередь |
| `GET` | `/runs/:id` | Статус, результат и trace |
| `GET` | `/agents` | Список агентов workspace |
| `GET` | `/health` | Healthcheck (без auth) |

## POST /runs

### Запрос

```json
{
  "agentId": "agt_01HYZ8K3QW2M9N4P6R7S8T0V",
  "input": "Суммируй новые лиды за сегодня",
  "metadata": {
    "source": "crm-cron",
    "chatId": "-1002345678901"
  },
  "options": {
    "maxSteps": 12,
    "sync": false
  }
}
```

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `agentId` | string | да | ID агента |
| `input` | string | да | Пользовательская задача |
| `metadata` | object | нет | Произвольный контекст для tools |
| `options.maxSteps` | number | нет | Лимит шагов (default 10) |
| `options.sync` | boolean | нет | Дождаться завершения в ответе |

### Ответ `202 Accepted`

```json
{
  "id": "run_01JABC123DEF456",
  "status": "queued",
  "agentId": "agt_01HYZ8K3QW2M9N4P6R7S8T0V",
  "createdAt": "2026-05-26T10:15:00.000Z",
  "links": {
    "self": "/runs/run_01JABC123DEF456"
  }
}
```

### Пример curl

```bash
export DATAGENT_API=http://localhost:3100
export DATAGENT_TOKEN=dag_live_8k2m9p4q7r1s6t0v3x8z

curl -X POST "${DATAGENT_API}/runs" \
  -H "Authorization: Bearer ${DATAGENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: crm-digest-2026-05-26" \
  -d '{
    "agentId": "agt_01HYZ8K3QW2M9N4P6R7S8T0V",
    "input": "Новые лиды за сегодня"
  }'
```

## GET /runs/:id

### Ответ `200 OK` (завершён)

```json
{
  "id": "run_01JABC123DEF456",
  "status": "succeeded",
  "agentId": "agt_01HYZ8K3QW2M9N4P6R7S8T0V",
  "input": "Новые лиды за сегодня",
  "output": "За сегодня 3 новых лида: ООО Ромашка, ...",
  "usage": {
    "promptTokens": 1240,
    "completionTokens": 380,
    "totalTokens": 1620
  },
  "trace": {
    "steps": [
      {"type": "tool", "name": "bitrix24_list_leads", "durationMs": 290},
      {"type": "llm", "provider": "gigachat", "durationMs": 1100}
    ]
  },
  "finishedAt": "2026-05-26T10:15:42.000Z"
}
```

Статусы: `queued` | `running` | `succeeded` | `failed` | `cancelled`.

### Polling

```bash
RUN_ID=run_01JABC123DEF456
until [ "$(curl -s -H "Authorization: Bearer ${DATAGENT_TOKEN}" \
  "${DATAGENT_API}/runs/${RUN_ID}" | jq -r '.status')" != "running" ]; do
  sleep 2
done
curl -s -H "Authorization: Bearer ${DATAGENT_TOKEN}" \
  "${DATAGENT_API}/runs/${RUN_ID}" | jq '.output'
```

## Коды ошибок

| HTTP | code | Описание |
| --- | --- | --- |
| 400 | `INVALID_REQUEST` | Невалидное тело |
| 401 | `UNAUTHORIZED` | Токен отсутствует или неверен |
| 404 | `AGENT_NOT_FOUND` | Нет агента |
| 429 | `RATE_LIMITED` | Превышен лимит run |
| 500 | `INTERNAL_ERROR` | Ошибка сервера |

## OpenAPI

Спецификация: `apps/api/openapi.yaml` в репозитории продукта. Импорт в Postman: **Import → Link** → `http://localhost:3100/openapi.json`.
