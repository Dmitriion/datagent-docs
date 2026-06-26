---
id: memory-api
slug: /api-reference/memory
title: REST API — память агента
sidebar_label: Память (API)
description: REST endpoints памяти Datagent — слои, chunks, operator vs agent scope; для интеграторов.
---

# REST API — память

> **Зачем:** Подключить память к скриптам, agent по API-ключу или внешней системе — не только через панель.

Настройка для оператора — [память в панели](/docs/concepts/memory). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/memory/dashboard` | Сводка памяти компании |
| `GET` | `/companies/:companyId/memory/chunks/:chunkId` | Chunk по id |
| `POST` | `/companies/:companyId/memory/agents/ensure-default-layers` | Слои для всех агентов |
| `GET` | `/agents/:agentId/memory/layers` | Слои агента |
| `POST` | `/agents/:agentId/memory/query` | Запрос к памяти агента |

## Кто и что видит

| Контур | Читает | Пишет | Описание |
| --- | --- | --- | --- |
| **Агент** (ключ агента) | `/agents/:agentId/memory/*` — только свой `agentId` | Свои слои, если на binding включён `selfEditEnabled`; capture/query в своём scope | Личная память агента; чужие агенты и компании — `403` |
| **Оператор** (сессия / ключ панели) | `/companies/:companyId/memory/*`, audit, gardener preview | bindings, policy, gardener run, freeze, review flagged | Память всей компании и администрирование |

Агент **не читает** chunks и слои других агентов. Операторские операции (gardener, freeze, audit export) для ключа агента — `403`.

## Привязка слоёв (binding targets)

| `targetType` | Описание |
| --- | --- |
| `agent` | Слой подключён к конкретному агенту (`memory_agent_layers`) |
| `company` | Общий слой компании (shared knowledge base) |

Типы слоёв в коде: `rag`, `wiki`, `episodic`, `working`, `graph`, `reflective`. Роли сборки: `knowledge_base`, `episodic_log`, `working_memory`, и др. — см. `packages/shared/src/constants/memory.ts`.

## Scope фрагментов (MemoryScope)

Каждый chunk привязан к scope с полями (не все обязательны):

| Поле | Смысл |
| --- | --- |
| `companyId` | Компания (обязательно) |
| `agentId` | Память конкретного агента |
| `projectId` | Контекст проекта |
| `issueId` | Контекст задачи |
| `runId` | Контекст run |
| `namespace` | Дополнительное пространство имён binding |

Контракт V1 — `doc/SPEC-implementation.md` §22; as-built — `doc/memory-control-plane-as-built.md` §5–6.

## Уровни API

### Компания — `/companies/:companyId/memory/*`

| Группа | Примеры маршрутов |
| --- | --- |
| Bindings | `GET/POST/PATCH/DELETE …/bindings` |
| Policy | `GET/PUT …/policy` |
| Chunks | `GET …/chunks/:chunkId`, flagged, duplicates |
| Gardener | `GET …/gardener/preview`, `POST …/gardener/run` |
| Утилиты | `POST …/ensure-defaults`, `…/agents/ensure-default-layers` |

### Агент — `/agents/:agentId/memory/*`

| Группа | Примеры |
| --- | --- |
| Слои | `GET/PUT/DELETE …/layers` |
| Query | `POST …/query` → `layerResults` + `combined` |
| Kernel | `GET/POST …/kernel/snapshots` |

Полный список — `server/src/routes/memory.ts`. Частичная OpenAPI: `doc/openapi/memory-control-plane.yaml`.

## Типичные ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный UUID chunk |
| **404** | Chunk или слой не найден |
| **403** | Чужая компания, слой другого агента, board-only операция |
| **422** | Конфликт политики |

## Пример: получить chunk

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/memory/chunks/${CHUNK_ID}" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

## Что дальше?

- **Память в панели** — [концепция](/docs/concepts/memory)
- **Аутентификация** — [обзор REST API](./overview)
- **Задачи** — [задачи](/docs/concepts/issues): откуда в память попадает контекст после run
