---
id: installation
title: Установка
sidebar_label: Установка
description: Системные требования и установка Datagent — CLI onboard, Docker Compose или сборка из исходников.
---

На этой странице — как получить работающий экземпляр Datagent. Интерактивная настройка компании и первого агента — в [Быстром старте](./quickstart).

## Системные требования

| Ресурс | Минимум | Рекомендуется |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB (с BrowserBridge и Chromium) |
| Диск | 20 GB SSD | 40 GB SSD |
| Node.js | 20+ | 20 LTS |
| pnpm | 9.15+ (в репозитории: 9.15.4) | как в `packageManager` репозитория |
| PostgreSQL | не обязателен для старта | 15–17 с `pgvector` для production RAG |
| ОС | Linux, macOS | Windows — через WSL2 |

По умолчанию Datagent поднимает **встроенную PostgreSQL** в каталоге instance (`~/.datagent`). Отдельный сервер БД нужен, если вы задаёте `DATABASE_URL` или разворачиваете production с внешней БД и pgvector для памяти.

Сеть (по желанию): исходящий HTTPS к провайдерам LLM (GigaChat, YandexGPT и др.) и к вашим интеграциям.

## Способ 1 — CLI (рекомендуется)

Open-core. Аккаунт Datagent Cloud не нужен. Node.js 20+ должен быть установлен.

```bash
npx datagent onboard --yes
```

После онбординга API и Board UI доступны на **`http://localhost:3100`** (один порт: UI отдаётся через API, см. `SERVE_UI` в dev).

Приватный доступ по LAN или Tailscale:

```bash
npx datagent onboard --yes --bind lan
# или:
npx datagent onboard --yes --bind tailnet
```

Данные instance, embedded БД и миграции создаются автоматически. Повторный запуск с `--yes` на уже настроенном instance сохраняет config и только стартует сервер.

Проверка здоровья instance:

```bash
datagent doctor
```

## Способ 2 — Docker Compose

Без локальной установки Node/pnpm:

```bash
git clone https://github.com/Dmitriion/datagent.git
cd datagent
docker compose -f docker/docker-compose.quickstart.yml up --build
```

Откройте [http://localhost:3100](http://localhost:3100). Перед запуском задайте `BETTER_AUTH_SECRET` (в compose он обязателен). Данные по умолчанию монтируются в `./data/docker-datagent`.

Переопределение порта и каталога данных:

```bash
DATAGENT_PORT=3200 DATAGENT_DATA_DIR=../data/pc \
  docker compose -f docker/docker-compose.quickstart.yml up --build
```

## Способ 3 — из исходников

Для разработки и кастомных деплоев:

```bash
git clone https://github.com/Dmitriion/datagent.git
cd datagent
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

- API: `http://localhost:3100`
- UI в dev — с того же origin, что и API (`pnpm dev` поднимает server + Vite HMR)
- Встроенная PostgreSQL и миграции применяются при первом старте

Онбординг из монорепозитория:

```bash
pnpm datagent onboard --yes
```

Production-сборка:

```bash
pnpm build
pnpm db:migrate
# запуск через datagent run / ваш process manager
```

## Внешняя PostgreSQL (опционально)

Если нужен отдельный Postgres (например, для production RAG с pgvector):

```bash
docker run -d --name datagent-pg \
  -e POSTGRES_USER=datagent \
  -e POSTGRES_PASSWORD=datagent \
  -e POSTGRES_DB=datagent \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

В БД:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Скопируйте пример окружения и укажите строку подключения:

```bash
cp .env.example .env
```

Минимальный набор из `.env.example` в корне репозитория:

```env
DATABASE_URL=postgres://datagent:datagent@localhost:5432/datagent
PORT=3100
SERVE_UI=false
BETTER_AUTH_SECRET=datagent-dev-secret-change-me
```

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URL` | Внешний Postgres; без неё — embedded БД в `DATAGENT_HOME` |
| `PORT` | Порт HTTP API (по умолчанию `3100`) |
| `SERVE_UI` | `false` — UI через dev middleware; в production обычно встроенная раздача статики |
| `BETTER_AUTH_SECRET` | Секрет сессий Better Auth; в `authenticated` также используется для agent JWT (или задайте `DATAGENT_AGENT_JWT_SECRET`) |

Для production замените `BETTER_AUTH_SECRET` на криптостойкое значение, например `openssl rand -hex 32`. Режимы `local_trusted` / `authenticated` и bind (`loopback`, `lan`, `tailnet`) задаются при `datagent onboard` или через `DATAGENT_DEPLOYMENT_MODE`, `DATAGENT_BIND` — подробнее в upstream: `docs/deploy/overview.md` в репозитории Datagent.

Миграции схемы:

```bash
pnpm db:migrate
```

## Проверка установки

```bash
curl -s http://127.0.0.1:3100/health
```

Ожидается JSON со статусом instance (детали зависят от режима `local_trusted` / `authenticated`).

При внешней БД:

```bash
# DATABASE_URL должен быть в окружении или в .env instance
pnpm db:migrate
```

## Следующий шаг

[Быстрый старт](./quickstart) — первая компания, агент и run в Board UI.
