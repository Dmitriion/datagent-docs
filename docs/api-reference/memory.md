---
id: memory-api
slug: /api-reference/memory
title: REST API — память агента
sidebar_label: Память (API)
description: REST endpoints памяти Datagent — слои, фрагменты, область доступа оператора и агента.
---

# REST API — память

> **Зачем:** Подключить память к скриптам, агенту по API-ключу или внешней системе — не только через панель.

Настройка для оператора — [память в панели](/docs/concepts/memory). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/memory/dashboard` | Сводка памяти — мониторинг объёма и здоровья |
| `GET` | `/companies/:companyId/memory/chunks/:chunkId` | Фрагмент по id — разбор конкретной записи |
| `POST` | `/companies/:companyId/memory/agents/ensure-default-layers` | Слои для всех агентов — bootstrap после миграции |
| `GET` | `/agents/:agentId/memory/layers` | Слои агента — проверка перед run |
| `POST` | `/agents/:agentId/memory/query` | Запрос к памяти — RAG из внешнего оркестратора |

## Кто и что видит

| Контур | Читает | Пишет | Описание |
| --- | --- | --- | --- |
| **Агент** (ключ агента) | `/agents/:agentId/memory/*` — только свой `agentId` | Свои слои при `selfEditEnabled`; capture/query в своей **области доступа** | Личная память агента; чужие агенты — `403` |
| **Оператор** (сессия / ключ панели) | `/companies/:companyId/memory/*`, audit, gardener preview | bindings, policy, gardener run, freeze | Память всей компании и администрирование |

Операторские операции (gardener, freeze, audit export) для ключа агента — `403`.

## Привязка слоёв (binding targets)

| `targetType` | Описание |
| --- | --- |
| `agent` | Слой подключён к конкретному агенту (`memory_agent_layers`) |
| `company` | Общий слой компании — база знаний для всех агентов |

Типы слоёв в коде: `rag`, `wiki`, `episodic`, `working`, `graph`, `reflective`. Роли сборки: `knowledge_base`, `episodic_log`, `working_memory`, и др. — см. `packages/shared/src/constants/memory.ts`.

## Область доступа фрагментов (MemoryScope)

Каждый фрагмент привязан к **области доступа** с полями (не все обязательны):

| Поле | Смысл |
| --- | --- |
| `companyId` | Компания (обязательно) |
| `agentId` | Память конкретного агента |
| `projectId` | Контекст проекта |
| `issueId` | Контекст задачи |
| `runId` | Контекст run |
| `namespace` | Дополнительное **пространство памяти** binding |

Контракт V1 — `doc/SPEC-implementation.md` §22; as-built — `doc/memory-control-plane-as-built.md` §5–6.

## Уровни API

### Компания — `/companies/:companyId/memory/*`

| Группа | Примеры маршрутов | Назначение |
| --- | --- | --- |
| Bindings | `GET/POST/PATCH/DELETE …/bindings` | Подключить провайдер памяти к компании или агенту |
| Policy | `GET/PUT …/policy` | Лимиты, freeze, правила записи |
| Chunks | `GET …/chunks/:chunkId`, flagged, duplicates | Чтение и модерация фрагментов |
| Gardener | `GET …/gardener/preview`, `POST …/gardener/run` | Превью и запуск очистки устаревших записей |
| Утилиты | `POST …/ensure-defaults`, `…/agents/ensure-default-layers` | Стартовый набор слоёв после создания компании |

### Агент — `/agents/:agentId/memory/*`

| Группа | Примеры | Назначение |
| --- | --- | --- |
| Слои | `GET/PUT/DELETE …/layers` | Какие слои видит агент в run |
| Query | `POST …/query` → `layerResults` + `combined` | Семантический поиск перед ответом пользователю |
| Kernel | `GET/POST …/kernel/snapshots` | Снимки ядра контекста (продвинутое) |

Полный список — `server/src/routes/memory.ts`. Частичная OpenAPI: `doc/openapi/memory-control-plane.yaml`.

## Типичные ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный UUID фрагмента |
| **404** | Фрагмент или слой не найден |
| **403** | Чужая компания, слой другого агента, операция только для панели |
| **422** | Конфликт политики |

## Пример: получить фрагмент

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/memory/chunks/${CHUNK_ID}" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

## Что дальше?

- **Память в панели** — [концепция](/docs/concepts/memory)
- **Аутентификация** — [обзор REST API](./overview)
- **Задачи** — [задачи](/docs/concepts/issues): откуда в память попадает контекст после run
