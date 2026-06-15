---
title: Установка и настройка
sidebar_label: Установка и настройка
description: Установка службы управления браузером на рабочей станции и настройка в облачной панели.
---

Пошаговая настройка **управления браузером** на компьютере оператора. Работает с [app.datagent.ru](https://app.datagent.ru). Контракт плагина — в [интеграции](../integrations/browserbridge).

## Установка плагина в облаке

1. Войдите в панель → **Менеджер плагинов**.
2. Установите `datagent.browserbridge` (если ещё не установлен).
3. Включите плагин для компании.

## Установка Local Service (рабочая станция)

Демон `@datagent/browserbridge-local` ставится **на ПК оператора**, не на сервер Datagent. Из checkout monorepo (для разработки):

```bash
pnpm install
pnpm --filter @datagent/browserbridge-local build
pnpm run datagent-bridge install
```

Установка плагина для instance:

```bash
pnpm --filter @datagent/plugin-browserbridge build
pnpm datagent plugin install ./packages/plugins/plugin-browserbridge
```

В Board: **Plugin Manager** → включить **BrowserBridge** для компании.

`pnpm dev` поднимает **только server + UI** на `PORT=3100`; BrowserBridge **не** стартует автоматически в dev-runner. По умолчанию плагин может **встроенно** поднять Local Service в plugin worker (`autoStartLocalService: true`).

## Запуск Local Service

**Вариант A — вручную (отдельный процесс):**

```bash
pnpm run datagent-bridge start
# или после build:
pnpm --filter @datagent/browserbridge-local run start
```

**Вариант B — автозапуск в plugin worker** (по умолчанию): отдельный `datagent-bridge start` не нужен, если на `127.0.0.1:9247` ещё никто не слушает.

Подключение к уже запущенному браузеру с CDP:

```bash
pnpm run datagent-bridge connect
# или connect-chrome / connect-yandex / connect-comet
```

Проверка статуса:

```bash
pnpm run datagent-bridge status
```

### Переменные окружения (Local Service / CLI)

В корневом `.env.example` Datagent **нет** `BROWSERBRIDGE_*` — настройка через `~/.datagent/` и config плагина на компанию.

| Переменная | Где | Default | Описание |
| --- | --- | --- | --- |
| `DATAGENT_BRIDGE_PORT` | процесс `browserbridge-local` | `9247` | Порт HTTP Local Service |
| `DATAGENT_BRIDGE_HOME` | CLI / config | `~/.datagent` | Корень данных bridge |
| `DATAGENT_BRIDGE_KIT_DIR` | CLI | — | Путь к kit для cloud setup |
| `DATAGENT_BROWSER` | CLI launch/connect | auto-detect | `chrome` \| `yandex` \| `comet` |
| `DATAGENT_BROWSER_EXECUTABLE` | browser-discovery | — | Явный путь к binary |
| `DATAGENT_BROWSER_NATIVE_MESSAGING` | native host | — | Браузер для Native Messaging |
| `DATAGENT_BROWSER_HEADLESS` | executor fallback | `0` | `1` или `CI=true` → headless |
| `DATAGENT_BROWSER_PATCHRIGHT` / `USE_PATCHRIGHT` | `browser.ts` | off | patchright вместо playwright |
| `BROWSERBRIDGE_FULL_RELAY_E2E` | server tests only | — | Полный E2E relay-тест |

Порт **9247** задан в `server.ts`, `DEFAULT_CONFIG.localServicePort` плагина и `DATAGENT_BRIDGE_PORT`. Переопределение — env или `localServicePort` в настройках компании.

Токен: файл `~/.datagent/bridge.token`, заголовок **`X-Datagent-Bridge-Token`** на всех запросах к Local Service.

## Подключение server и агентов к bridge

1. **Plugin worker** → HTTP `http://{localServiceHost}:{localServicePort}/execute` (defaults `127.0.0.1:9247`) с токеном из `~/.datagent/bridge.token` или `bridgeTokenSecretRef`.
2. **Cloud / split machine:** `tunnelMode: true` → WebSocket tunnel на server, pairing через Board.
3. **Политика URL** для `browser_navigate` — в Board, не через env allowlist.

Подробнее поля config и API server — [интеграция BrowserBridge](../integrations/browserbridge).

## HTTP API Local Service

| Method | Path | Назначение |
| --- | --- | --- |
| `GET` | `/health` | `ok`, `browserConnected`, `cdpHost`, `cdpPort`, `port` |
| `GET` | `/sessions` | Список сессий CDP |
| `POST` | `/connect` | Подключиться к CDP `{ cdpPort?, cdpHost? }` (default `9222`, `127.0.0.1`) |
| `POST` | `/execute` | Выполнить action + params (см. integration doc) |
| `GET` | `/screenshot/:id` | Бинарный скриншот по id |
| WebSocket | `/ws` | Расширение браузера (approval overlay) |

Маршрутов **`POST /session`**, **`/session/:id/snapshot`**, **`DELETE /session`** в `server.ts` **нет**.

## Проверка

1. Токен после `datagent-bridge install`:

```bash
TOKEN=$(cat ~/.datagent/bridge.token)
curl -s "http://127.0.0.1:9247/health" \
  -H "X-Datagent-Bridge-Token: $TOKEN"
```

Ожидается JSON с `"ok": true` (и `"browserConnected": true` после `connect`).

2. Навигация через `/execute`:

```bash
curl -s -X POST "http://127.0.0.1:9247/execute" \
  -H "Content-Type: application/json" \
  -H "X-Datagent-Bridge-Token: $TOKEN" \
  -d '{"action":"navigate","params":{"url":"https://example.com","waitUntil":"load"},"runId":"test-run-001"}'
```

3. Статус с Board (нужна сессия пользователя):

```bash
curl -s "http://127.0.0.1:3100/api/companies/<companyId>/browserbridge/status" \
  -H "Cookie: ..."
```

4. `pnpm datagent doctor` — общая проверка instance.

5. Интеграционный тест: `packages/plugins/plugin-browserbridge/src/worker.integration.test.ts`.

## Настройка в UI

- **Company → Settings → BrowserBridge**: `/company/settings/browserbridge`
- Мастер onboarding (local / cloud), tunnel, pairing codes, **browser policy** (allowlist/denylist)
- Блок в общих настройках: `/settings?scope=company&tab=general`

Workstation kit: `GET /api/browserbridge/workstation-kit` (tar.gz).

## Типичные проблемы

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| Playwright / browser failed to launch | Нет Chromium для Playwright | `playwright install chromium` |
| `ECONNREFUSED` на `:9247` | Local Service не запущен | `datagent-bridge start` или `autoStartLocalService` |
| `Invalid token` / 401 | Неверный заголовок | `X-Datagent-Bridge-Token` = `bridge.token` |
| `browserConnected: false` | CDP не поднят | `launch-chrome` / `connect` |
| Порт занят | Два экземпляра bridge | Один процесс на `localServicePort` |
| Headless на Linux без дисплея | `DATAGENT_BROWSER_HEADLESS=1` | Xvfb или удалённый CDP через `POST /connect` |
| Tool «bridge недоступен» | Tunnel offline | Board → статус tunnel; `tunnelMode` + pairing |
| Navigate blocked | Company policy | allowlist на `/company/settings/browserbridge` |

## Частые вопросы

**Обязателен ли туннель, если сервер в облаке?**  
Да, если браузер на вашем ПК, а Datagent на [app.datagent.ru](https://app.datagent.ru) — нужен туннель или VPN до Local Service.

**Какая команда проверяет, что служба жива?**  
`GET http://127.0.0.1:9247/health` после `datagent-bridge start` — см. шаги выше.

**Где включить плагин?**  
**Менеджер плагинов** в панели → BrowserBridge → настройки компании.

## Что дальше?

- [Обзор управления браузером](./overview) · [Интеграция BrowserBridge](../integrations/browserbridge)
- [Старт в Cloud](../cloud/getting-started) · [app.datagent.ru](https://app.datagent.ru)

## Связанные разделы

- [BrowserBridge (интеграция)](../integrations/browserbridge)
- [Обзор управления браузером](./overview)
- [Архитектура платформы](../concepts/agent-architecture.md)
- [Старт в Cloud](../cloud/getting-started) — Plugin Manager в Board
