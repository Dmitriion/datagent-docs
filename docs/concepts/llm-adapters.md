---
id: llm-adapters
title: LLM-адаптеры
sidebar_label: LLM-адаптеры
description: Сравнение адаптеров GigaChat, YandexGPT и OpenCode в Datagent — авторизация, статус, особенности function calling.
---

Datagent подключает языковые модели через тонкий слой **LLM Adapters**. Каждый адаптер реализует общий контракт и отвечает за OAuth/IAM, формат tool calls и нормализацию ошибок.

## Сравнительная таблица

| Провайдер | Авторизация | Статус | Особенности |
| --- | --- | --- | --- |
| **GigaChat** (Сбер) | OAuth 2.0 client credentials (`GIGACHAT_CLIENT_ID` / `SECRET`), scope `GIGACHAT_API_PERS` | GA | Function calling, потоковая генерация, модели Pro/Max, сертификаты Минцифры |
| **YandexGPT** | IAM: API-ключ сервисного аккаунта или OAuth + `folder_id` | GA | `yandexgpt` / `yandexgpt-lite`, json-mode, низкая задержка в `ru-central1` |
| **OpenCode** (базовый шлюз) | Bearer `OPENCODE_API_KEY` к совместимому OpenAI API | Beta | Прокси для self-hosted vLLM/Ollama; схема tools как OpenAI Chat Completions |

## Конфигурация в агенте

В Board или в `agents.yaml`:

```yaml
model:
  provider: gigachat
  name: GigaChat-Pro
  temperature: 0.3
  maxTokens: 4096
```

Переключение на YandexGPT:

```yaml
model:
  provider: yandexgpt
  name: yandexgpt
  folderId: ${YANDEX_FOLDER_ID}
```

## Кэширование токенов

GigaChat access token живёт ~30 минут. Адаптер кэширует в Redis:

```
Key: llm:gigachat:access_token
TTL: 25m
```

При `401` выполняется принудительный refresh без падения run (один retry).

## Выбор модели

| Сценарий | Рекомендация |
| --- | --- |
| Длинные документы, сложный reasoning | GigaChat-Pro / YandexGPT Pro |
| Высокий QPS, короткие ответы | YandexGPT Lite |
| Локальная модель без облака | OpenCode → vLLM |

Подробные гайды: [GigaChat](../integrations/gigachat), [YandexGPT](../integrations/yandexgpt).

## Ограничения tool calling

Не все модели одинаково стабильно возвращают JSON arguments. Runner включает **repair pass**: при невалидном JSON повторный запрос с `response_format: json_object` (если поддерживается провайдером).
