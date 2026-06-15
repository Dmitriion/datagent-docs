---
id: memory-api
slug: /api-reference/memory
title: REST API — память агента
sidebar_label: Память (API)
description: REST endpoints памяти Datagent — слои, chunks, bindings, gardener; для интеграторов облака.
---

# REST API — память

:::info В разработке
Полная справка по endpoints готовится — очередь в [плане документации на Q3](/docs/meta/DOC-PLAN-2026-Q3).
:::

Если вы настраиваете память в панели — достаточно [руководства для оператора](/docs/concepts/memory). Эта страница для тех, кто подключает память через скрипты или **API-ключ агента**: все маршруты идут под префиксом `/api`.

## Что будет на этой странице

- Слои, фрагменты (chunks), привязки и политики компании — `GET/POST /api/companies/:id/memory/*`
- Память конкретного агента — `GET/POST /api/agents/:id/memory/*` (ключ агента не открывает чужие слои)
- **Gardener** — фоновая очистка устаревших записей; заморозка слоёв, массовое создание слоёв по умолчанию
- Типичные ответы: 400 (неверный UUID), 404 (фрагмент не найден), 403 (чужая компания)
- Связь с MCP-сервером `@datagent/mcp-server` — отдельным блоком

## Источники в продукте

- `server/src/routes/memory.ts`
- `server/src/services/memory/` (61 файл)
- `doc/MEMORY-DOCS-INDEX.md`, `doc/memory-control-plane-as-built.md`
- `doc/SPEC-implementation.md` §22 (V1 contract)

## См. также

- [Память для оператора](../concepts/memory) — настройка в панели без кода
- [Обзор API](./overview) — аутентификация и общая схема

## Что дальше

- [Настроить память агента в панели](/docs/concepts/memory) — слои, Gardener и заморозка простым языком
- [Открыть обзор REST API](/docs/api-reference/overview) — как авторизоваться и вызывать другие маршруты
