---
id: yandexgpt
title: Как подключить YandexGPT к AI-агентам — Datagent
sidebar_label: YandexGPT
description: "YandexGPT в Datagent: сервисный аккаунт Yandex Cloud, агент с tools. Free на app.datagent.ru."
---

# Как подключить YandexGPT к AI-агентам — Datagent

> **Зачем:** Чтобы агенты работали на **YandexGPT** в контуре **Yandex Cloud** — альтернатива или дополнение к GigaChat для российских команд. **Datagent** подключает модель к задачам на [app.datagent.ru](https://app.datagent.ru).

Подключите **YandexGPT** за те же шаги, что и GigaChat: каталог в Yandex Cloud, JSON-ключ сервисного аккаунта, модель в карточке агента.

> **Для подключения YandexGPT нужен JSON-ключ сервисного аккаунта Yandex Cloud.**  
> **Ограничений по тарифу Datagent нет** — подключается на **любом** плане. Оплата вызовов — по тарифам Yandex Cloud; Datagent списывает **запуски** платформы.

## Это работает так

1. В [Yandex Cloud](https://cloud.yandex.ru/) создаёте каталог и **сервисный аккаунт**.
2. Выпускаете **JSON-ключ** сервисного аккаунта.
3. В **Datagent** — агент с адаптером **YandexGPT**, указываете **folder id** и секрет с JSON.
4. Для агентов с инструментами выбираете модель **с поддержкой tools** (`yandexgpt/rc`).
5. Запускаете задачу — ответ и журнал в панели; при связке с CRM — см. [Битрикс24](./bitrix24).

:::tip Доступно бесплатно
**YandexGPT** доступен на **Free** (3 агента, 100 запусков). Оплата вызовов — по тарифам Yandex Cloud.
[Попробовать →](https://app.datagent.ru/signup)
:::

## Какие задачи решать

| Сценарий | Модель |
| --- | --- |
| Агент с **инструментами** (таблицы, плагины) | `yandexgpt/rc` |
| Простые текстовые ответы без tools | `yandexgpt-lite/rc` (без tool calls) |
| Параллельно с GigaChat | Разные агенты на разных моделях в одной компании |

Для диалогов в **Битрикс24** обычно берут модель **с tools**, если агент вызывает плагины.

## Подключение в три шага

### 1. Yandex Cloud

1. Создайте [каталог](https://cloud.yandex.ru/) — скопируйте **folder id** (`b1g…`).
2. Создайте **сервисный аккаунт** с правами на вызов Foundation Models / YandexGPT в этом каталоге.
3. Создайте **авторизованный ключ** (JSON) — сохраните файл целиком.

### 2. Агент в Datagent

1. [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент**.
2. Адаптер: **YandexGPT** (`yandexgpt_local`).
3. **Folder id** — идентификатор каталога.
4. **Model** — `yandexgpt/rc` для агентов с инструментами.
5. Секрет `YANDEX_SA_KEY_JSON` — полный JSON ключа (`secret_ref`).
6. **Проверить окружение**.

### 3. Проверка

Запустите учебную задачу. В журнале не должно быть ошибок IAM или «folder id missing».

## GigaChat или YandexGPT?

| | **GigaChat** | **YandexGPT** |
| --- | --- | --- |
| Ключи | OAuth Сбер (Client ID/Secret) | JSON ключа SA в Yandex Cloud |
| Контур | Сбер | Yandex Cloud |
| В Datagent | `gigachat_local` | `yandexgpt_local` |

Можно держать оба: например, GigaChat на линии Битрикс24, YandexGPT — на внутренних задачах.

## Частые вопросы

**Нужен ли API-ключ вместо JSON?**  
В текущем адаптере Datagent — только **JSON сервисного аккаунта** → автоматический IAM-токен.

**Почему агент не вызывает tools?**  
Проверьте модель: для tools нужен **`yandexgpt/rc`**, не Lite.

**Данные уходят за рубеж?**  
Обработка — в **Yandex Cloud** при корректной настройке каталога и модели.

**Сколько стоит?**  
Тарифы Yandex Cloud + **запуски Datagent** по вашему плану. См. [Запуски и лимиты](../concepts/credits).

## Что дальше

→ [GigaChat (Сбер)](./gigachat)

:::note Для инженеров

Адаптер `yandexgpt_local`, IAM refresh, OpenCode CLI, опциональный локальный proxy с `x-folder-id`.

### Переменные окружения

| Переменная | Где | Обязательность | Описание |
| --- | --- | --- | --- |
| `folderId` | `adapterConfig` | Да | ID каталога YC |
| `YANDEX_SA_KEY_JSON` | env агента | Да | Полный JSON authorized key |
| `OPENAI_API_KEY` | inject server | — | IAM-токен для OpenCode |
| `OPENAI_BASE_URL` | inject/execute | — | Default `https://llm.api.cloud.yandex.net/v1` |
| `YANDEXGPT_PROXY_DISABLED` | env server | Нет | `1` — без локального proxy |

Проверка: `POST /api/companies/{companyId}/adapters/yandexgpt_local/test-environment`.

### Каталог моделей

| `adapterConfig.model` | Tool calls |
| --- | --- |
| `yandexgpt/rc` | Да |
| `yandexgpt-lite/rc` | Нет |

При run URI вида `gpt://{folderId}/{variant}`.

### Пример `adapterConfig`

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

### Типичные ошибки

| Симптом | Что сделать |
| --- | --- |
| IAM 401 | Перевыпустить ключ SA, обновить secret |
| 403 | Права SA на LLM в folder |
| `folderId` пустой | Заполнить в Board |
| `yandexgpt_tools_unsupported_model` | Переключить на `yandexgpt/rc` |

Токен кэшируется в PostgreSQL (`adapter_oauth_tokens`). Исполнение = OpenCode + IAM + опциональный proxy.

См. [GigaChat](./gigachat.md), [LLM-адаптеры](../concepts/llm-adapters.md).

:::
