---
id: yandexgpt
title: YandexGPT
sidebar_label: YandexGPT
description: Адаптер yandexgpt_local в Datagent — IAM по ключу сервисного аккаунта, OpenCode CLI, folderId и модели yandexgpt/rc.
---

**YandexGPT** в Datagent подключается адаптером `yandexgpt_local` (`packages/adapters/yandexgpt-local`, npm `@datagent/adapter-yandexgpt-local`). Регистрация в `server/src/adapters/registry.ts`; run выполняет **heartbeat** через **OpenCode CLI** (`@datagent/adapter-opencode-local`), а не прямой вызов Foundation Models API из Board. IAM-токен (JWT сервисного аккаунта → `iam.api.cloud.yandex.net`) получает `server/src/services/adapter-oauth-tokens.ts` и кэширует в PostgreSQL `adapter_oauth_tokens` (~12 ч, refresh за 30 мин до истечения). В runtime env подставляются `OPENAI_API_KEY` (IAM), `OPENAI_BASE_URL` и при execute — локальный proxy с заголовком `x-folder-id`. В Board: адаптер **YandexGPT**, поле **folder id** и модели вида `yandexgpt/rc`.

## Подготовка в Yandex Cloud

1. Создайте [каталог (folder)](https://cloud.yandex.ru/) и скопируйте **folder id** (`b1g…`) — он обязателен в `adapterConfig.folderId` (см. `requireFolderId` в `catalog.ts`).
2. Создайте **сервисный аккаунт** в этом каталоге с доступом к YandexGPT / Foundation Models (роль в коде не зашита; на практике нужны права на вызов LLM API в каталоге).
3. Создайте **авторизованный ключ** сервисного аккаунта (JSON с `service_account_id`, `private_key`, `id`) — содержимое файла целиком пойдёт в secret `YANDEX_SA_KEY_JSON`.
4. Установите **OpenCode CLI** (`opencode` в `PATH`) на хосте, где выполняются агенты. Адаптер не ставит OpenCode сам.

Статический **API-ключ** (`YANDEX_API_KEY`) и ручной `yc iam create-token` в адаптере **не** используются — только JSON ключа SA и автоматический IAM refresh.

## Переменные окружения

В корневом `.env.example` **нет** `YANDEX_*`. Учётные данные — в env агента и полях config.

| Переменная | Где | Обязательность | Описание |
| --- | --- | --- | --- |
| `folderId` | `adapterConfig` (поле агента) | Да | ID каталога Yandex Cloud; в API передаётся как `x-folder-id` (через proxy). |
| `YANDEX_SA_KEY_JSON` | env агента (`secret_ref`) | Да | Полный JSON authorized key сервисного аккаунта. |
| `OPENAI_API_KEY` | inject server | — | IAM-токен для OpenCode (не задавать вручную). |
| `YANDEX_IAM_TOKEN` | inject server | — | Дубликат IAM-токена. |
| `OPENAI_BASE_URL` | inject / execute | — | Базовый URL LLM; default `https://llm.api.cloud.yandex.net/v1` (`YANDEX_LLM_BASE_URL`). На execute может подменяться URL локального proxy. |
| `YANDEX_FOLDER_ID` | inject при execute | — | Копия `folderId` в env процесса OpenCode. |
| `YANDEX_IAM_TOKEN_URL` | env **процесса** server | Нет | Endpoint IAM; default `https://iam.api.cloud.yandex.net/iam/v1/tokens`. |
| `YANDEX_LLM_BASE_URL` | env **процесса** server | Нет | Upstream OpenAI-compatible API Yandex. |
| `YANDEXGPT_PROXY_DISABLED` | env **процесса** server | Нет | `1` — не поднимать локальный proxy, использовать `YANDEX_LLM_BASE_URL` напрямую. |
| `YANDEX_USD_RATE` | env **процесса** server | Нет | Курс RUB→USD для оценки `costUsd` в `pricing.ts`. |

Порт instance: `PORT=3100`, `BETTER_AUTH_SECRET` — [Установка](../getting-started/installation), [Быстрый старт](../getting-started/quickstart).

## Подключение в Datagent

1. Server с зависимостью `@datagent/adapter-yandexgpt-local` (`server/package.json`) — после обновления кода: `pnpm build` и перезапуск процесса на `:3100` (как для [GigaChat](./gigachat.md)).
2. Board → агент → **Adapter** → **`yandexgpt_local`** («YandexGPT»).
3. **Folder id** — идентификатор каталога YC (`b1g…`).
4. **Model** — вариант из каталога (см. ниже); для агентов с tools — `yandexgpt/rc`.
5. **Environment variables** → `YANDEX_SA_KEY_JSON` как **secret_ref** (полный JSON ключа).
6. Сохранить. При run/test server вызывает `injectYandexGPTIamTokenIntoConfigEnv`, затем `execute` поднимает proxy (если не отключён) и запускает `opencode`.

Проверка адаптера:

`POST /api/companies/{companyId}/adapters/yandexgpt_local/test-environment`  
тело: `{ "adapterConfig": { "folderId": "...", "model": "yandexgpt/rc", "env": { ... } } }`.

## Каталог моделей

Статический каталог (`packages/adapters/yandexgpt-local/src/catalog.ts`):

| `adapterConfig.model` | Label | Tool calls |
| --- | --- | --- |
| `yandexgpt/rc` | YandexGPT (tools) | Да |
| `yandexgpt-lite/rc` | YandexGPT Lite | Нет (UI предупреждает) |

При run модель разрешается в URI **`gpt://{folderId}/{variant}`**, например `gpt://b1gxxxxxxxx/yandexgpt/rc`. Можно задать полный `gpt://…` в `model`. Список в UI может расшириться через `listModels` + OpenCode на хосте.

Default: `yandexgpt/rc` (`DEFAULT_YANDEXGPT_MODEL_VARIANT`).

## Пример конфигурации агента

```json
{
  "folderId": "b1g2abc3def4ghijklmnop",
  "model": "yandexgpt/rc",
  "command": "opencode",
  "env": {
    "YANDEX_SA_KEY_JSON": {
      "type": "secret_ref",
      "secretId": "<uuid-company-secret>"
    }
  }
}
```

Опциональная ручная проверка IAM (тот же flow, что `fetchYandexIamToken` в `auth.ts`): сформируйте JWT из SA JSON (логика в `jwt-signer.ts`) и выполните `POST` на `YANDEX_IAM_TOKEN_URL` с телом `{"jwt":"<signed>"}`. Datagent в продакшене делает это автоматически; прямой `curl` к `llm.api.cloud.yandex.net` — только для отладки ключей вне OpenCode.

## Проверка

| Действие | Команда / URL |
| --- | --- |
| API жив | `curl -s http://127.0.0.1:3100/health` |
| Instance | `pnpm datagent doctor` |
| OpenCode | `opencode --version` |
| Адаптер + IAM + folder | Board → test-environment или `POST .../adapters/yandexgpt_local/test-environment` |

Ожидаемые checks: `yandexgpt_folder_configured`, `yandexgpt_sa_key_present`, `yandexgpt_model_configured`, `yandexgpt_proxy_enabled` (если proxy не отключён) — см. `packages/adapters/yandexgpt-local/src/server/test.ts`.

## Типичные ошибки

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| `Yandex IAM token request failed (401)` | Неверный или просроченный SA JSON | Перевыпустить ключ SA, обновить secret |
| `403` / permission denied | SA без прав на LLM в каталоге | Назначить роли на folder, проверить квоты YC |
| `YandexGPT requires adapterConfig.folderId` | Пустой folder id | Заполнить поле в Board |
| `YANDEX_SA_KEY_JSON is not set` | Нет secret_ref | Привязать JSON ключа к агенту |
| `IAM token in env (OPENAI_API_KEY)` | Inject не сработал до run | Проверить сеть до IAM, логи server, `adapter_oauth_tokens` |
| `yandexgpt_tools_unsupported_model` | Выбран Lite | Переключить на `yandexgpt/rc` для tool-use |
| `YandexGPT proxy error` | Локальный proxy не достучался до upstream | Проверить `YANDEX_LLM_BASE_URL`, firewall; попробовать `YANDEXGPT_PROXY_DISABLED=1` если OpenCode шлёт `x-folder-id` |
| 429 / quota | Лимиты Yandex Cloud | Снизить параллелизм run, бюджеты Datagent |
| Адаптер в UI, нет в API | Старый server binary | Rebuild + restart (см. banner pending backend в UI) |

Токен кэшируется в PostgreSQL, не в Redis. Отдельной CLI `pnpm yandexgpt:token` в `package.json` нет.

## Ограничения (по коду)

- Исполнение = **OpenCode** + IAM + опциональный **локальный OpenAI-proxy** (`openai-proxy.ts`).
- **Function calling** только на моделях с `supportsTools: true` (`yandexgpt/rc`); не заявляется как нативный REST-адаптер Datagent.
- Нет `config/llm/yandexgpt.yaml`, нет `POST /internal/llm/complete`.
- **API-key auth** (`YANDEX_API_KEY`) в текущем адаптере не реализован — только `YANDEX_SA_KEY_JSON` → IAM.

## Связанные разделы

- [GigaChat (Сбер)](./gigachat.md) — парный российский провайдер, OAuth + OpenCode.
- [Архитектура платформы](../concepts/agent-architecture.md) — server, adapters, heartbeat.
- [Быстрый старт](../getting-started/quickstart.md) — стенд на `:3100`.

Сравнение провайдеров → [LLM-адаптеры](../concepts/llm-adapters.md).
