---
id: quickstart
title: Быстрый старт
sidebar_label: Быстрый старт
description: Запуск Datagent за 15 минут — клонирование репозитория, pnpm install, настройка .env и открытие Board UI.
---

Этот гайд поднимает полный стенд Datagent локально: API, Board UI и подключение к PostgreSQL. Предполагается, что у вас уже установлены Node.js 20+ и pnpm 9+.

## 1. Клонировать репозиторий

```bash
git clone https://github.com/Dmitriion/datagent.git
cd datagent
```

Монорепозиторий использует `pnpm workspaces`; корневой `package.json` объявляет пакеты `apps/api`, `apps/board`, `packages/*`.

## 2. Установить зависимости

```bash
corepack enable
pnpm install
```

Первая установка скачивает Playwright-браузеры для BrowserBridge — это может занять несколько минут.

## 3. Настроить `.env`

Скопируйте шаблон и заполните обязательные переменные:

```bash
cp .env.example .env
```

Минимальный набор для локального dev:

```env
DATABASE_URL=postgresql://datagent:datagent@localhost:5432/datagent
API_PORT=3100
BOARD_PORT=3200

# Один из LLM-адаптеров (можно оба)
GIGACHAT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
GIGACHAT_CLIENT_SECRET=********************************
YANDEX_FOLDER_ID=b1gxxxxxxxxxxxxxxxxx
YANDEX_API_KEY=AQVNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Примените миграции:

```bash
pnpm --filter @datagent/db migrate
```

## 4. Запустить dev-режим

```bash
pnpm dev
```

Команда параллельно стартует API (`3100`) и Board (`3200`). Логи агентов пишутся в `apps/api/logs/`.

## 5. Открыть Board

Перейдите в браузере:

```
http://localhost:3200
```

Создайте workspace → **Agents** → **New Agent**. Дальше: [Первый агент](./first-agent).

## Проверка API

```bash
curl -s http://localhost:3100/health | jq
# { "status": "ok", "db": "connected", "version": "1.2.0" }
```

## Типичные проблемы

| Симптом | Решение |
| --- | --- |
| `ECONNREFUSED` к Postgres | Поднимите `docker compose up -d postgres` из `infra/` |
| 401 от GigaChat | Обновите OAuth: `pnpm gigachat:token` |
| Board пустой после логина | Проверьте `BOARD_API_URL=http://localhost:3100` в `.env` |
