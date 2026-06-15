---
id: llm-adapters
title: Нейросети в Datagent — GigaChat, YandexGPT и адаптеры
sidebar_label: LLM-адаптеры
description: "Как Datagent подключает GigaChat и YandexGPT: выбор модели, ключи и tool calling в облаке app.datagent.ru."
---

> **Зачем:** Вы настраиваете агента и выбираете **нейросеть**. **Datagent** на [app.datagent.ru](https://app.datagent.ru) подключает **GigaChat** и **YandexGPT** через готовые адаптеры — без своего сервера и без кода.

## Это работает так

1. В карточке агента выберите тип адаптера и модель (например GigaChat-2-Pro).
2. Администратор привяжет ключи через **секреты** — не в открытом тексте.
3. При запуске платформа подставит токен и запишет ответ в журнал задачи.

Российские **GigaChat** и **YandexGPT** идут через OpenCode; универсальный вариант без отдельного OAuth-слоя — **OpenCode (локальный)**. Пошаговые инструкции — [GigaChat](/docs/integrations/gigachat), [YandexGPT](/docs/integrations/yandexgpt).

## Сравнительная таблица

| | **GigaChat (Сбер)** | **YandexGPT** | **OpenCode (local)** |
| --- | --- | --- | --- |
| **Тип адаптера** | `gigachat_local` | `yandexgpt_local` | `opencode_local` |
| **Пакет** | `packages/adapters/gigachat-local` | `packages/adapters/yandexgpt-local` | `packages/adapters/opencode-local` |
| **Авторизация** | OAuth 2.0 client credentials: `GIGACHAT_CLIENT_ID` + `GIGACHAT_CLIENT_SECRET` в env агента (`secret_ref`); scope по умолчанию `GIGACHAT_API_PERS` | IAM: полный JSON ключа SA в `YANDEX_SA_KEY_JSON` (`secret_ref`); JWT → `iam.api.cloud.yandex.net` | Ключи/токены провайдеров в env агента (например `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) — как требует OpenCode; **без** `adapter_oauth_tokens` |
| **Кэш в PostgreSQL** | Да — `adapter_oauth_tokens`, provider `gigachat`; TTL ~30 мин, refresh за 120 с до истечения | Да — provider `yandexgpt`; IAM ~12 ч, refresh за 30 мин | Нет — server не кэширует OAuth для этого типа |
| **Примеры model id** | `gigachat/GigaChat-2-Pro`, `gigachat/GigaChat-2-Max` | `yandexgpt/rc` (tools), `yandexgpt-lite/rc`; в run → `gpt://{folderId}/yandexgpt/rc` | `openai/gpt-5.2-codex` (default), `openai/gpt-5.4`, … формат `provider/model` |
| **Доп. поля config** | — | `folderId` (каталог YC, обязателен) | — |
| **Inference** | Через **OpenCode CLI** (`@datagent/adapter-opencode-local`); не прямой REST Chat из Board | То же + proxy `x-folder-id` (`YANDEXGPT_PROXY_DISABLED=1` отключает proxy) | Нативный OpenCode |
| **Tool-use** | Условно — проверить на своих credentials ([гайд](../integrations/gigachat.md)) | Условно — `yandexgpt/rc`; Lite без tools ([гайд](../integrations/yandexgpt.md)) | Зависит от провайдера в OpenCode |
| **Конфиг YAML** | Нет `config/llm/*.yaml` — только `adapterConfig` агента в Board/API | То же | То же |

Подробная настройка: [GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md). Общая схема — [Архитектура](./agent-architecture.md).

## Кэш токенов (GigaChat и YandexGPT)

Платформа **сама обновляет** токены перед запуском; оператор не вставляет ключ доступа в задачу. Токены хранятся **зашифрованно** в базе данных.

**Не делайте:** копировать ключи в системный промпт или комментарии задачи — они попадут в переписку и журнал.

:::note Для инженеров
Таблица `adapter_oauth_tokens`, сервис `adapter-oauth-tokens.ts` — см. [GigaChat](../integrations/gigachat.md), [YandexGPT](../integrations/yandexgpt.md).
:::

## Конфигурация в панели

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

Перед production с tool calling сверьте поведение на **своих** ключах — заявления провайдеров и фактический JSONL OpenCode могут расходиться.

## Tool calling

У **GigaChat** и **YandexGPT** инструменты идут через OpenCode JSONL, не через отдельный REST-слой Datagent. Для Yandex tool calls заявлены на `yandexgpt/rc`. Если агент «не видит» tools — проверьте модель, manifest плагина и журнал run, а не только текст промпта.

## Частые вопросы

**Какую нейросеть выбрать для начала в России?**  
**GigaChat** через адаптер `gigachat_local` — типичный старт: OAuth Сбера, модели Pro/Max, поддержка инструментов через OpenCode.

**Нужно ли ставить CLI на свой компьютер?**  
Нет для облака **app.datagent.ru**: адаптеры и runtime работают на стороне платформы. Вам нужны только ключи в настройках агента.

**Почему агент не вызывает инструменты?**  
Проверьте модель (для Yandex — `yandexgpt/rc`), установленные плагины и журнал запуска, а не только текст промпта.

## Что дальше?

- **Подключите GigaChat** — [интеграция](/docs/integrations/gigachat) · [YandexGPT](/docs/integrations/yandexgpt)
- **Создайте первого агента** — [первый агент](/docs/cloud/first-agent) · [тарифы](/docs/cloud/pricing)
- **Войдите в облако** — [app.datagent.ru](https://app.datagent.ru)
