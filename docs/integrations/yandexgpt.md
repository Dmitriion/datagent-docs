---
id: yandexgpt
title: YandexGPT
sidebar_label: YandexGPT
description: Настройка YandexGPT в Datagent — IAM-токен и API-ключ Яндекс Облака, folder_id и пример конфигурации адаптера.
---

**YandexGPT** подключается через Yandex Cloud Foundation Models API. Datagent поддерживает авторизацию **API-ключом сервисного аккаунта** (рекомендуется для серверов) и обмен на IAM при необходимости.

## Подготовка в Yandex Cloud

1. Создайте каталог (folder), запомните `folder_id`: `b1g2abc3def4ghijklmnop`.
2. Сервисный аккаунт с ролью `ai.languageModels.user`.
3. Создайте **API-ключ** (не путать с OAuth для пользователей).

## Переменные окружения

```env
YANDEX_FOLDER_ID=b1g2abc3def4ghijklmnop
YANDEX_API_KEY=AQVNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
YANDEX_MODEL=yandexgpt
YANDEX_BASE_URL=https://llm.api.cloud.yandex.net/foundationModels/v1/completion
```

Альтернатива — IAM-токен (короткоживущий):

```bash
yc iam create-token
# export YANDEX_IAM_TOKEN=t1.9eu...
```

В `.env` задайте `YANDEX_IAM_TOKEN` вместо `YANDEX_API_KEY` (не оба одновременно).

## Конфиг адаптера

`config/llm/yandexgpt.yaml`:

```yaml
provider: yandexgpt
folderId: ${YANDEX_FOLDER_ID}
auth:
  type: api_key
  apiKey: ${YANDEX_API_KEY}
models:
  - id: yandexgpt
    uri: gpt://b1g2abc3def4ghijklmnop/yandexgpt/latest
  - id: yandexgpt-lite
    uri: gpt://b1g2abc3def4ghijklmnop/yandexgpt-lite/latest
defaults:
  temperature: 0.3
  maxTokens: 2000
```

## Проверка вызова

```bash
curl -X POST "${YANDEX_BASE_URL}" \
  -H "Authorization: Api-Key ${YANDEX_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "modelUri": "gpt://'"${YANDEX_FOLDER_ID}"'/yandexgpt/latest",
    "completionOptions": {"stream": false, "temperature": 0.3, "maxTokens": 100},
    "messages": [{"role": "user", "text": "Привет"}]
  }' | jq '.result.alternatives[0].message.text'
```

## Сравнение с GigaChat

См. [LLM-адаптеры](../concepts/llm-adapters). Для гибридных сценариев можно назначить разным агентам разных провайдеров в одном workspace.
