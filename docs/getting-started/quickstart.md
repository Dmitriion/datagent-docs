---
id: quickstart
title: Быстрый старт
sidebar_label: Быстрый старт
description: Запуск Datagent из исходников за 15 минут — клонирование, .env, миграции, pnpm dev и Board UI на порту 3100.
---

Этот гайд поднимает dev-стенд из монорепозитория: API, Board UI на одном origin и PostgreSQL (встроенная или внешняя). Системные требования и альтернативы (CLI onboard, Docker) — в [Установке](./installation).

**Нужно:** Node.js 20+, pnpm 9.15+ ([`engines`](https://github.com/Dmitriion/datagent/blob/master/package.json) и `packageManager` в корневом `package.json`).

Структура репозитория (pnpm workspaces): `server` (`@datagent/server`), `ui` (`@datagent/ui`), `cli`, `packages/*` (db, adapters, plugins). Отдельного пакета `packages/core` в текущем дереве нет — control plane живёт в `server` + `cli`.

## Схема запуска

```mermaid
flowchart LR
  A[git clone + pnpm install] --> B[.env]
  B --> C[pnpm db:migrate]
  C --> D[pnpm dev]
  D --> E[http://localhost:3100]
  D --> F["GET /health"]
```

## 1. Получить репозиторий и зависимости

```bash
git clone https://github.com/Dmitriion/datagent.git
cd datagent
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

Первая установка может подтянуть тяжёлые dev-зависимости (в т.ч. для BrowserBridge/Playwright) — это нормально.

**Быстрый обход без сборки из исходников** (если [установка через CLI](./installation) уже подходит):

```bash
npx datagent onboard --yes
```

После onboard откройте UI на `http://localhost:3100` и переходите к [Первому агенту](./first-agent).

## 2. Настроить `.env`

```bash
cp .env.example .env
```

Минимальный шаблон из репозитория:

```env
DATABASE_URL=postgres://datagent:datagent@localhost:5432/datagent
PORT=3100
SERVE_UI=false
BETTER_AUTH_SECRET=datagent-dev-secret-change-me
```

В `.env.example` репозитория могут остаться другие dev-значения пароля/секрета — для своего стенда задайте свои.

| Переменная | Для quickstart |
| --- | --- |
| `DATABASE_URL` | **Опционально.** Закомментируйте или удалите строку — `pnpm dev` поднимет **embedded PostgreSQL** в `~/.datagent`. Оставьте, если уже крутите внешний Postgres (см. [Установку](./installation)). |
| `PORT` | HTTP-порт API и Board в dev (по умолчанию `3100`). |
| `SERVE_UI` | `false` — UI через dev middleware сервера (same origin с API). |
| `BETTER_AUTH_SECRET` | Секрет Better Auth; для локального `local_trusted` достаточно dev-значения из примера. |

Ключи LLM (GigaChat, YandexGPT и др.) в `.env.example` нет — их добавляют позже в Board / secrets, когда настраиваете адаптеры.

## 3. Применить миграции

При **внешнем** `DATABASE_URL`:

```bash
pnpm db:migrate
```

Эквивалент: `pnpm --filter @datagent/db migrate` (как в корневом `package.json`).

При **embedded** Postgres миграции обычно применяются при первом `pnpm dev` / `pnpm dev:once` — отдельный шаг можно пропустить, если не используете внешнюю БД.

## 4. Запустить dev-сервер

```bash
pnpm dev
```

Стартует `@datagent/server` в watch-режиме (`scripts/dev-runner.ts`): API на `PORT`, UI с HMR на том же хосте (WebSocket HMR — порт `PORT + 10000`, для `3100` это `13100`).

Полезные варианты:

| Команда | Когда |
| --- | --- |
| `pnpm dev:once` | Один запуск без file watcher; миграции перед стартом |
| `pnpm dev --bind lan` | Доступ с LAN (`authenticated` / private) |
| `pnpm datagent onboard --yes` | Онбординг instance + старт из монорепо |
| `pnpm datagent run` | doctor + старт, если config уже есть |

Не держите два instance на одном `PORT` (например, systemd на `:3100` и одновременно `pnpm dev`) — dev-runner возьмёт тот же порт с другим `DATAGENT_HOME`.

## 5. Открыть Board UI

В браузере:

```
http://localhost:3100
```

В режиме `local_trusted` (типичный quickstart) вход не требуется. В `authenticated` завершите bootstrap CEO по подсказкам UI.

Дальше: создайте компанию/workspace при необходимости → **Agents** → **New Agent**. Пошаговый туториал — [Первый агент](./first-agent).

## Проверка `/health`

```bash
curl -s http://127.0.0.1:3100/health
```

Ответ — JSON; состав полей зависит от режима развёртывания и авторизации запроса.

| Поле (примеры) | Смысл |
| --- | --- |
| `status` | `ok` или `unhealthy` (например, БД недоступна → `503`, `error: database_unreachable`) |
| `deploymentMode` | `local_trusted` или `authenticated` |
| `version` | Версия сервера (при расширенном ответе) |
| `bootstrapStatus` | В `authenticated`: `ready` или `bootstrap_pending` |

Диагностика instance:

```bash
pnpm datagent doctor
```

## Типичные проблемы

| Симптом | Что проверить |
| --- | --- |
| `EADDRINUSE` на `:3100` | Другой Datagent/systemd на том же порту; остановите или задайте `PORT=3101` и откройте UI на новом порту |
| `database_unreachable` в `/health` | Неверный `DATABASE_URL`, Postgres не запущен, или firewall; для dev проще убрать `DATABASE_URL` и использовать embedded |
| Пустая страница / нет HMR | UI на **3100**, не на отдельном `:3200`; при доступе по LAN откройте HMR-порт `13100` или используйте `localhost` |
| `pnpm install` падает | Node 20+, `corepack prepare pnpm@9.15.4`; на Windows — WSL2 |
| `pnpm db:migrate` без БД | Сначала поднимите Postgres или уберите `DATABASE_URL` и полагайтесь на embedded при `pnpm dev` |
| 401 / нет токена LLM | Ключи провайдера в secrets/UI, не в минимальном `.env`; см. [GigaChat](../integrations/gigachat), [YandexGPT](../integrations/yandexgpt) |
| Два instance, «чужие» данные | Разные каталоги: `DATAGENT_HOME` / `DATAGENT_INSTANCE_ID`; не смешивайте prod `:3100` и dev без смены порта |

## Следующий шаг

[Первый агент](./first-agent) — агент «Помощник по лидам», playground run и разбор логов.
