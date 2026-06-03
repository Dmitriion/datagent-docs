---
id: gigachat
title: GigaChat (Сбер)
sidebar_label: GigaChat
description: Адаптер gigachat_local в Datagent — OAuth Сбер, OpenCode CLI, модели gigachat/GigaChat-2-* и кэш токена в PostgreSQL.
---

**GigaChat** в Datagent подключается встроенным адаптером `gigachat_local` (`packages/adapters/gigachat-local`, npm `@datagent/adapter-gigachat-local`). Сервер регистрирует его в `server/src/adapters/registry.ts`; выполнение run идёт через **heartbeat** и делегирует в **OpenCode CLI**, а не в прямой HTTP Chat Completions из Board. OAuth client credentials обменивает `server/src/services/adapter-oauth-tokens.ts`: токен кэшируется в таблице `adapter_oauth_tokens` (шифрование), затем подставляется в runtime env агента как `GIGACHAT_ACCESS_TOKEN`. Board UI использует тип адаптера `gigachat_local` и идентификаторы моделей вида `gigachat/<ModelId>`.

## Получение OAuth (developers.sber.ru)

1. Создайте проект в [developers.sber.ru](https://developers.sber.ru/) с продуктом **GigaChat API**.
2. Выпустите **Client ID** и **Client Secret** (confidential client).
3. Для персонального API по умолчанию в коде задан scope **`GIGACHAT_API_PERS`** (`DEFAULT_GIGACHAT_SCOPE` в `oauth-client.ts`). Корпоративный контур может требовать другой scope — задайте его в env агента (см. ниже).
4. Установите на хосте, где крутятся агенты, **OpenCode CLI** (`opencode` в `PATH`). Адаптер **не** устанавливает OpenCode автоматически (в отличие от `opencode_local`).

## Переменные окружения

В корневом `.env.example` репозитория **нет** `GIGACHAT_*` — учётные данные задаются в **окружении агента** (Company / Agent → Environment variables) как `secret_ref` на secrets компании. Опционально на процесс API:

| Переменная | Где задаётся | Обязательность | Описание |
| --- | --- | --- | --- |
| `GIGACHAT_CLIENT_ID` | env агента (`adapterConfig.env`) | Да | Client ID из кабинета Сбер. |
| `GIGACHAT_CLIENT_SECRET` | env агента | Да | Client Secret. |
| `GIGACHAT_SCOPE` | env агента | Нет | Scope OAuth; по умолчанию `GIGACHAT_API_PERS`. |
| `GIGACHAT_OAUTH_URL` | env **процесса** server (`process.env`) | Нет | URL token endpoint; default `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`. Не читается из env агента при refresh. |
| `GIGACHAT_ACCESS_TOKEN` | подставляет server | — | Не задавать вручную; refresh через `adapter_oauth_tokens`. |
| `GIGACHAT_API_KEY`, `GIGACHAT_CREDENTIALS` | подставляет server | — | Дубликаты access token для OpenCode. |

Порт API и auth instance: `PORT=3100`, `BETTER_AUTH_SECRET` — см. [Установку](../getting-started/installation) и [Быстрый старт](../getting-started/quickstart).

## Подключение в Datagent

1. Убедитесь, что server собран с зависимостью `@datagent/adapter-gigachat-local` (входит в `server/package.json`) и перезапущен после обновления кода (`pnpm build` в монорепо, затем restart процесса на `:3100`).
2. В Board создайте или откройте агента → **Adapter** → **`gigachat_local`** (в UI: «GigaChat (Сбер)»).
3. **Model** — одна из каталогных моделей, например `gigachat/GigaChat-2-Pro` (default) или `gigachat/GigaChat-2-Max`. Список в `packages/adapters/gigachat-local/src/catalog.ts`; при наличии OpenCode на хосте server может подтянуть модели через `listModels`.
4. В **Environment variables** добавьте `GIGACHAT_CLIENT_ID` и `GIGACHAT_CLIENT_SECRET` с типом **secret_ref** (не plain text в production).
5. Сохраните агента. При run/test server вызовет `injectGigaChatAccessTokenIntoConfigEnv` и запустит `opencode` с выбранной моделью.

Проверка окружения адаптера в UI или API:

`POST /api/companies/{companyId}/adapters/gigachat_local/test-environment`  
тело: `{ "adapterConfig": { ... } }` — тот же config, что у агента (см. `server/src/routes/agents.ts`).

## Пример конфигурации агента

Фрагмент `adapterConfig` (после сохранения в API; секреты — ссылки):

```json
{
  "model": "gigachat/GigaChat-2-Pro",
  "command": "opencode",
  "env": {
    "GIGACHAT_CLIENT_ID": {
      "type": "secret_ref",
      "secretId": "<uuid-company-secret>"
    },
    "GIGACHAT_CLIENT_SECRET": {
      "type": "secret_ref",
      "secretId": "<uuid-company-secret>"
    }
  }
}
```

Опционально в том же `env`: `"GIGACHAT_SCOPE": { "type": "plain", "value": "GIGACHAT_API_PERS" }`.

Локальная отладка OAuth (совпадает с `fetchGigaChatAccessToken` в адаптере):

```bash
curl -sS -X POST "${GIGACHAT_OAUTH_URL:-https://ngw.devices.sberbank.ru:9443/api/v2/oauth}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "Authorization: Basic $(printf '%s' "${GIGACHAT_CLIENT_ID}:${GIGACHAT_CLIENT_SECRET}" | base64 | tr -d '\n')" \
  -H "RqUID: $(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)" \
  --data-urlencode "scope=${GIGACHAT_SCOPE:-GIGACHAT_API_PERS}"
```

## Проверка

| Действие | Команда / URL |
| --- | --- |
| API жив | `curl -s http://127.0.0.1:3100/health` |
| Instance / БД | `pnpm datagent doctor` (из [quickstart](../getting-started/quickstart)) |
| OpenCode на хосте | `opencode --version` (или путь из `adapterConfig.command`) |
| Адаптер + OAuth + OpenCode | Board → тест окружения адаптера или `POST .../adapters/gigachat_local/test-environment` |

Успешный probe адаптера возвращает checks с кодами вроде `gigachat_oauth_ready`, `gigachat_model_configured` (см. `packages/adapters/gigachat-local/src/server/test.ts`).

## Типичные ошибки

| Симптом / код | Причина | Что сделать |
| --- | --- | --- |
| `GigaChat OAuth failed (401)` | Неверные client id/secret | Проверить secrets в кабинете Сбер и `secret_ref` в агенте |
| `GigaChat OAuth failed (403)` | Scope или продукт не активирован | Уточнить scope (`GIGACHAT_SCOPE`), тариф в developers.sber.ru |
| `403` / TLS handshake | Корпоративный MITM, свой CA | На хосте server: `NODE_EXTRA_CA_CERTS` к bundle CA (заметка в `catalog.ts` agentConfigurationDoc) |
| `GigaChat credentials are not configured` | Нет `GIGACHAT_CLIENT_ID` / `SECRET` в resolved env | Привязать secrets к агенту, пересохранить config |
| `GIGACHAT_ACCESS_TOKEN is not present` | OAuth не отработал до test | Проверить сеть до `GIGACHAT_OAUTH_URL`, логи server, таблицу `adapter_oauth_tokens` |
| `gigachat_model_missing` | Неверный `model` | Формат строго `gigachat/<ModelId>`, см. catalog |
| `gigachat_opencode_prerequisite` / OpenCode fail | Нет `opencode` в PATH | Установить OpenCode на execution target агента |
| Адаптер в UI, но не в API | Старый процесс server без нового кода | `git pull`, `pnpm install`, `pnpm build`, restart; см. banner `adapterManager.pendingBackend` в UI |
| 429 / квота провайдера | Лимиты GigaChat | Снизить параллелизм run, бюджеты компании в Datagent |

Токен обновляется с запасом **120 с** до `expires_at` (`GIGACHAT_TOKEN_REFRESH_SKEW_MS`). После истечения — новый запрос OAuth, без отдельной CLI-команды `pnpm gigachat:token` (такого script в `package.json` нет).

## Ограничения (по коду)

- **Не** отдельный HTTP-адаптер к GigaChat API: исполнение = **OpenCode** + инъекция токена.
- **Function calling / streaming** — поведение OpenCode и моста GigaChat; в `agentConfigurationDoc` зафиксирован условный статус tool-use (см. `doc/plans/2026-05-18-ru-02-gigachat-phase0-spike.md` в upstream).
- Прямого маршрута `POST /internal/llm/complete` в server **нет**.

## Связанные разделы

- [Архитектура платформы](../concepts/agent-architecture.md) — server, adapters, heartbeat, plugins.
- [Быстрый старт](../getting-started/quickstart.md) — поднять стенд на `:3100`.

Сравнение провайдеров → [LLM-адаптеры](../concepts/llm-adapters.md).
