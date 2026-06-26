---
id: yandexgpt
title: Как подключить YandexGPT к AI-агентам — Datagent
sidebar_label: YandexGPT
description: "YandexGPT в Datagent: сервисный аккаунт Yandex Cloud, агент с действиями. Free на app.datagent.ru."
---

# Как подключить YandexGPT к AI-агентам — Datagent

Агент **отвечает на задачи**, **вызывает плагины** (таблицы, CRM) и **работает в контуре Yandex Cloud** — альтернатива или дополнение к GigaChat в одной компании.

Если у вас уже есть каталог в Yandex Cloud и политика «данные не за рубеж» — YandexGPT держит обработку в РФ, часто дешевле на коротких ответах Lite-моделью, а оплату считает Яндекс по своему тарифу.

**Начните так:** выпустите **JSON-ключ** сервисного аккаунта в [Yandex Cloud](https://cloud.yandex.ru/) → [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент** → **YandexGPT** → укажите **идентификатор каталога** и секрет с JSON.

> **Нужен JSON-ключ сервисного аккаунта Yandex Cloud.**  
> **Ограничений по тарифу Datagent нет** — на **любом** плане. Datagent списывает **запуски**; вызовы модели — по тарифам Yandex Cloud.

## Какие задачи решать

| Сценарий | Модель |
| --- | --- |
| Агент с **плагинами** (таблицы, CRM) | `yandexgpt/rc` |
| Простые текстовые ответы | `yandexgpt-lite/rc` |
| Параллельно с GigaChat | Разные агенты на разных моделях в одной компании |

Для **Битрикс24** обычно берут модель **с поддержкой действий**, если агент вызывает плагины.

## Подключение в три шага

### 1. Yandex Cloud

1. Создайте [каталог](https://cloud.yandex.ru/) — скопируйте **идентификатор каталога** (`b1g…`).
2. Создайте **сервисный аккаунт** с правами на вызов YandexGPT в этом каталоге.
3. Создайте **авторизованный ключ** (JSON) — сохраните файл целиком.

### 2. Агент в Datagent

1. [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент**.
2. Адаптер: **YandexGPT**.
3. **Идентификатор каталога** — из Yandex Cloud.
4. **Модель** — `yandexgpt/rc` для агентов с плагинами.
5. Секрет с полным JSON ключа.
6. **Проверить окружение**.

### 3. Проверка

Запустите учебную задачу. В журнале не должно быть ошибок доступа или «не указан каталог».

## GigaChat или YandexGPT?

| | **GigaChat** | **YandexGPT** |
| --- | --- | --- |
| Ключи | Client ID/Secret Сбера | JSON ключа в Yandex Cloud |
| Контур | Сбер | Yandex Cloud |
| В Datagent | `gigachat_local` | `yandexgpt_local` |

Можно держать оба: GigaChat на линии Битрикс24, YandexGPT — на внутренних задачах.

## Частые вопросы

**Нужен ли отдельный API-ключ вместо JSON?**  
В адаптере Datagent — только **JSON сервисного аккаунта**; токен доступа обновляется автоматически.

**Почему агент не вызывает плагины?**  
Проверьте модель: нужен **`yandexgpt/rc`**, не Lite.

**Данные уходят за рубеж?**  
При корректной настройке каталога — обработка в **Yandex Cloud**.

**Сколько стоит?**  
Тарифы Yandex Cloud + **запуски Datagent**. См. [Запуски и лимиты](../concepts/credits).

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

См. [GigaChat](./gigachat.md), [LLM-адаптеры](../concepts/llm-adapters.md).

:::
