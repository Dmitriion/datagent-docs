---
id: getting-started-index
title: Начало работы
sidebar_label: Обзор
description: Getting Started Datagent — установка, pnpm dev на :3100, первый агент и heartbeat run через Board.
draft: true
---

Раздел **Getting Started** ведёт от пустого хоста до первого **heartbeat run** агента. Datagent поднимается как **один процесс** `server` на `PORT` (по умолчанию **3100**): REST `/api/*` и Board на том же origin в dev (`SERVE_UI=false` + Vite middleware). См. [Архитектура](../concepts/agent-architecture.md).

Рекомендуемый порядок: [Установка](./installation.md) → [Быстрый старт](./quickstart.md) → [Первый агент](./first-agent.md). Окружение уже есть — сразу [Быстрый старт](./quickstart.md).

## Что понадобится

| Компонент | Минимум |
| --- | --- |
| Node.js | 20 LTS |
| pnpm | 9.x (см. `packageManager` в репозитории Datagent) |
| PostgreSQL | 15+ с `vector` — для production-памяти; в dev часто **embedded** Postgres без `DATABASE_URL` |
| ОС | Linux / macOS; Windows — WSL2 |

Ключи GigaChat / YandexGPT — в **secrets агента** (`secret_ref`), не в корневом `.env` (см. [GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md)).

## После первого агента

| Тема | Документ |
| --- | --- |
| Термины и компоненты | [Что такое Datagent](../concepts/what-is-datagent.md) |
| Сквозной run | [Как это работает](../concepts/how-it-works.md) |
| REST API | [Обзор API](../api-reference/overview.md) |
| Bitrix24 imbot | [Bitrix24](../integrations/bitrix24.md) |
| Telegram | [Telegram](../integrations/telegram.md) |
