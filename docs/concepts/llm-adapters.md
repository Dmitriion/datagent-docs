---
id: llm-adapters
title: LLM-адаптеры
sidebar_label: LLM-адаптеры
description: Сравнение GigaChat, YandexGPT и OpenCode в Datagent — тип адаптера, auth, model id, кэш токенов в PostgreSQL и исполнение через OpenCode.
---

Datagent подключает облачные и multi-provider LLM через пакеты `packages/adapters/*`. Сервер регистрирует модули в `server/src/adapters/registry.ts` и вызывает их из **heartbeat** (см. [Архитектура](./agent-architecture.md)). Российские провайдеры **GigaChat** и **YandexGPT** — тонкие обёртки над `@datagent/adapter-opencode-local`: тот же **OpenCode CLI**, плюс обмен учётных данных на стороне server. Универсальный путь без отдельного OAuth-слоя — **`opencode_local`**.

## Сравнительная таблица

| | **GigaChat (Сбер)** | **YandexGPT** | **OpenCode (local)** |
| --- | --- | --- | --- |
| **Adapter type** | `gigachat_local` | `yandexgpt_local` | `opencode_local` |
| **Пакет** | `packages/adapters/gigachat-local` | `packages/adapters/yandexgpt-local` | `packages/adapters/opencode-local` |
| **Авторизация** | OAuth 2.0 client credentials: `GIGACHAT_CLIENT_ID` + `GIGACHAT_CLIENT_SECRET` в env агента (`secret_ref`); scope по умолчанию `GIGACHAT_API_PERS` | IAM: полный JSON ключа SA в `YANDEX_SA_KEY_JSON` (`secret_ref`); JWT → `iam.api.cloud.yandex.net` | Ключи/токены провайдеров в env агента (например `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) — как требует OpenCode; **без** `adapter_oauth_tokens` |
| **Кэш в PostgreSQL** | Да — `adapter_oauth_tokens`, provider `gigachat`; TTL ~30 мин, refresh за 120 с до истечения | Да — provider `yandexgpt`; IAM ~12 ч, refresh за 30 мин | Нет — server не кэширует OAuth для этого типа |
| **Примеры model id** | `gigachat/GigaChat-2-Pro`, `gigachat/GigaChat-2-Max` | `yandexgpt/rc` (tools), `yandexgpt-lite/rc`; в run → `gpt://{folderId}/yandexgpt/rc` | `openai/gpt-5.2-codex` (default), `openai/gpt-5.4`, … формат `provider/model` |
| **Доп. поля config** | — | `folderId` (каталог YC, обязателен) | — |
| **Inference** | Через **OpenCode CLI** (`@datagent/adapter-opencode-local`); не прямой REST Chat из Board | То же + proxy `x-folder-id` (`YANDEXGPT_PROXY_DISABLED=1` отключает proxy) | Нативный OpenCode |
| **Tool-use** | Conditional — проверить на своих credentials ([гайд](../integrations/gigachat.md)) | Conditional — `yandexgpt/rc`; Lite без tools ([гайд](../integrations/yandexgpt.md)) | Зависит от провайдера в OpenCode |
| **Конфиг YAML** | Нет `config/llm/*.yaml` — только `adapterConfig` агента в Board/API | То же | То же |

Подробная настройка: [GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md). Общая схема адаптеров и heartbeat — [Архитектура](./agent-architecture.md).

## Кэш токенов (GigaChat и YandexGPT)

Оба адаптера используют `server/src/services/adapter-oauth-tokens.ts`:

| Провайдер | Таблица | Ключ кэша | Инъекция в env перед run |
| --- | --- | --- | --- |
| GigaChat | `adapter_oauth_tokens` | hash(clientId, secret) | `GIGACHAT_ACCESS_TOKEN`, `GIGACHAT_API_KEY`, … |
| YandexGPT | `adapter_oauth_tokens` | hash SA | `OPENAI_API_KEY`, `YANDEX_IAM_TOKEN`, `OPENAI_BASE_URL` |

Токены хранятся **шифрованно** в PostgreSQL instance, не в Redis. При смене secrets server может инвалидировать записи (`invalidateGigaChatTokens` / `invalidateYandexGPTTokens`).

## Конфигурация в Board

В UI выбирается **тип адаптера** (`gigachat_local`, `yandexgpt_local`, `opencode_local`), поле **model** и env bindings (`secret_ref`). Отдельных файлов `config/llm/*.yaml` и поля `provider: gigachat` в API нет — только `adapterConfig` агента.

Примеры `adapterConfig.model`:

```text
gigachat/GigaChat-2-Pro
yandexgpt/rc
openai/gpt-5.2-codex
```

## Выбор модели

| Сценарий | Рекомендация |
| --- | --- |
| Российский LLM, OAuth Сбер | `gigachat_local` + `gigachat/GigaChat-2-Pro` |
| Российский LLM, Yandex Cloud + tools | `yandexgpt_local` + `folderId` + `yandexgpt/rc` |
| Дешёвый чат без tools в YC | `yandexgpt-lite/rc` |
| Несколько облачных провайдеров через один CLI | `opencode_local` + `provider/model` |
| Self-hosted OpenAI-compatible endpoint | `opencode_local`, ключи в env OpenCode |

## Tool calling

У **GigaChat** и **YandexGPT** инструменты идут через OpenCode JSONL, не через отдельный REST-слой Datagent. Для Yandex tool calls заявлены только на `yandexgpt/rc`. Перед production tool-use сверьте поведение на своих ключах (см. integration-гайды).

## Связанные разделы

- [GigaChat](../integrations/gigachat.md) — OAuth `GIGACHAT_CLIENT_ID` / `GIGACHAT_CLIENT_SECRET`, модели `gigachat/GigaChat-2-*`
- [YandexGPT](../integrations/yandexgpt.md) — `YANDEX_SA_KEY_JSON`, `folderId`, `yandexgpt/rc`
- [Как это работает](./how-it-works.md) — heartbeat run и tool dispatch
- [Первый агент](../getting-started/first-agent.md) — выбор адаптера в Board
- [Быстрый старт](../getting-started/quickstart)
