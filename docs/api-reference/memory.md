---
id: memory-api
slug: /api-reference/memory
title: REST API — память агента
sidebar_label: Память (API)
description: REST endpoints памяти Datagent — слои, chunks, bindings, gardener; для интеграторов облака.
---

# REST API — память

> **Зачем:** Подключить память к своим скриптам, агенту по API-ключу или внешней системе — не только через панель.

Операторская настройка — в [памяти для оператора](/docs/concepts/memory). Здесь — маршруты под префиксом `/api` на `https://app.datagent.ru/api/...`.

## Аутентификация

| Кто вызывает | Как |
| --- | --- |
| Оператор панели | Сессия (cookie после входа) |
| Интеграция | `Authorization: Bearer <ключ панели>` |
| Агент | `Authorization: Bearer <ключ агента>` — **только свои** слои и chunks |

Агент **не видит** память других агентов и других компаний. Нарушение границы — `403`.

## Уровни API

### Компания — ` /api/companies/:companyId/memory/*`

Управление памятью на уровне организации (оператор или ключ с доступом к компании).

| Группа | Примеры маршрутов | Назначение |
| --- | --- | --- |
| **Привязки (bindings)** | `GET/POST/PATCH/DELETE …/bindings` | Какие слои к кому подключены |
| **Политика** | `GET/PUT …/policy` | Лимиты, freeze, правила записи |
| **Chunks** | `GET …/chunks/:chunkId`, аудит, flagged, duplicates | Фрагменты знаний |
| **Gardener** | `GET …/gardener/preview`, `POST …/gardener/run` | Очистка и обслуживание памяти |
| **Дашборд** | `GET …/dashboard`, `…/health`, `…/operations` | Сводки для админа |
| **Экспорт / аудит** | `GET …/export`, `…/audit-log` | Выгрузка и журнал |
| **Утилиты** | `POST …/ensure-defaults`, `…/agents/ensure-default-layers` | Стартовый набор слоёв |

### Агент — `/api/agents/:agentId/memory/*`

Память в scope одного агента (ключ агента или панель).

| Группа | Примеры | Назначение |
| --- | --- | --- |
| **Слои** | `GET/PUT/DELETE …/layers` | Подключённые слои агента |
| **Запись** | `POST …/layers`, ensure-defaults | Создание и bootstrap |
| **Kernel snapshots** | `GET/POST …/kernel/snapshots` | Снимки ядра контекста (продвинутое) |

Полный список — в `server/src/routes/memory.ts` (~50+ handlers). Частичная OpenAPI-спека для памяти есть в репозитории продукта.

## Gardener и заморозка

- **Gardener** — фоновое обслуживание: устаревшие chunks, дубликаты, флаги на проверку. Превью: `GET …/gardener/preview`; ручной запуск: `POST …/gardener/run`.
- **Freeze (заморозка)** — через политику компании: новые записи в память временно запрещены (аудит, инцидент).

## Типичные ошибки

| Код | Когда |
| --- | --- |
| **400** | Невалидный UUID chunk или тело запроса |
| **404** | Chunk или слой не найден |
| **403** | Чужая компания или слой агента |
| **422** | Конфликт политики или бизнес-правило |

Тело ошибки обычно `{ "error": "<текст>" }`.

## MCP

Сервер `@datagent/mcp-server` экспонирует часть операций памяти для агентов в IDE — параллельный путь к тем же данным, не замена REST.

:::note Для инженеров
Внутренний индекс: `doc/MEMORY-DOCS-INDEX.md`, контракт V1 — `doc/SPEC-implementation.md` §22. Не копируйте ADR целиком в интеграции — опирайтесь на маршруты и validators в `@datagent/shared`.
:::

## Пример: получить chunk

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/memory/chunks/${CHUNK_ID}" \
  -H "Authorization: Bearer ${BOARD_API_KEY}"
```

## Что дальше?

- [Настроить память в панели](/docs/concepts/memory) — слои и Gardener без кода
- [Обзор REST API](/docs/api-reference/overview) — аутентификация и общая схема
- [Задачи и run](/docs/concepts/issues) — откуда в память попадает контекст после выполнения
