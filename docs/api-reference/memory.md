---
id: memory-api
slug: /api-reference/memory
title: REST API — память агента
sidebar_label: Память (API)
description: REST endpoints памяти Datagent — слои, chunks, bindings, gardener; для интеграторов облака.
---

# REST API — память

:::info В разработке
Страница в очереди [DOC-PLAN-2026-Q3](/docs/meta/DOC-PLAN-2026-Q3) (Priority 1).
:::

Память в Datagent доступна через REST под префиксом `/api`. Оператор панели использует UI; интеграторы и агенты с **API-ключом** — эти маршруты.

## Что будет на этой странице

- `GET/POST /api/companies/:id/memory/*` — слои, chunks, bindings, политики
- `GET/POST /api/agents/:id/memory/*` — память в scope агента (ключ агента не видит чужие слои)
- Gardener, trust tiering, freeze, bulk ensure layers
- Коды ошибок: 400 (invalid UUID), 404 (chunk missing), 403 (company boundary)
- Связь с MCP `@datagent/mcp-server` (отдельная заметка)

## Источники в продукте

- `server/src/routes/memory.ts`
- `server/src/services/memory/` (61 файл)
- `doc/MEMORY-DOCS-INDEX.md`, `doc/memory-control-plane-as-built.md`
- `doc/SPEC-implementation.md` §22 (V1 contract)

## См. также

- [Память для оператора](../concepts/memory)
- [Обзор API](./overview)
