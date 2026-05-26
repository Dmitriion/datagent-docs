---
id: installation
title: Установка
sidebar_label: Установка
description: Системные требования и пошаговая установка Datagent — Node 20, pnpm 9, PostgreSQL 15 с pgvector, Docker Compose.
---

Установка Datagent рассчитана на Linux-сервер или macOS в dev. Продакшен обычно разворачивают через Docker Compose или Kubernetes; здесь — базовый bare-metal/VM сценарий.

## Системные требования

| Ресурс | Минимум | Рекомендуется |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB (с BrowserBridge + Chromium) |
| Диск | 20 GB SSD | 40 GB SSD |
| Node.js | 20.x LTS | 20.x LTS |
| pnpm | 9.x | 9.x |
| PostgreSQL | 15+ | 16 |
| Расширения БД | `pgvector` 0.5+ | `pgvector` 0.7+ |

Сеть: исходящий HTTPS к `ngw.devices.sberbank.ru` (GigaChat), `llm.api.cloud.yandex.net` (YandexGPT), при необходимости — к порталу Bitrix24.

## Пошаговая установка

### 1. Node.js и pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

### 2. PostgreSQL с pgvector

```bash
docker run -d --name datagent-pg \
  -e POSTGRES_USER=datagent \
  -e POSTGRES_PASSWORD=datagent \
  -e POSTGRES_DB=datagent \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

Включите расширение:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Клонирование и сборка

```bash
git clone https://github.com/Dmitriion/datagent.git /opt/datagent
cd /opt/datagent
pnpm install --frozen-lockfile
pnpm build
```

### 4. Конфигурация окружения

Файл `/opt/datagent/.env`:

```env
NODE_ENV=production
DATABASE_URL=postgresql://datagent:datagent@127.0.0.1:5432/datagent
API_PORT=3100
BOARD_PORT=3200
JWT_SECRET=<сгенерируйте: openssl rand -hex 32>

BROWSERBRIDGE_URL=http://127.0.0.1:9247
```

### 5. Миграции и systemd (опционально)

```bash
pnpm --filter @datagent/db migrate
sudo cp deploy/datagent-api.service /etc/systemd/system/
sudo systemctl enable --now datagent-api datagent-board
```

## Проверка установки

```bash
curl http://127.0.0.1:3100/health
pnpm --filter @datagent/api exec node -e "require('pg').Pool({connectionString:process.env.DATABASE_URL}).query('SELECT 1').then(()=>console.log('db ok'))"
```

## Следующий шаг

[Быстрый старт](./quickstart) — если нужен интерактивный dev без systemd.
