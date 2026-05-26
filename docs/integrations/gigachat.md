---
id: gigachat
title: GigaChat
sidebar_label: GigaChat
description: Настройка адаптера GigaChat в Datagent — OAuth Сбер, переменные окружения и пример конфигурации агента.
---

**GigaChat** — основной облачный LLM Сбера для Datagent в РФ. Адаптер получает OAuth access token и вызывает Chat Completions API с поддержкой function calling.

## Получение OAuth-учётных данных

1. Зарегистрируйте приложение в [developers.sber.ru](https://developers.sber.ru/) → GigaChat API.
2. Выпустите `Client ID` и `Client Secret` (тип: confidential).
3. Убедитесь, что scope включает `GIGACHAT_API_PERS` или корпоративный аналог.

## Переменные окружения

```env
GIGACHAT_CLIENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
GIGACHAT_CLIENT_SECRET=Z0FBQUFBQm9xxxxxxxxxxxxxxxxxxxxxx
GIGACHAT_SCOPE=GIGACHAT_API_PERS
GIGACHAT_MODEL=GigaChat-Pro
# Для корпоративного контура:
# GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
```

Проверка токена вручную:

```bash
curl -X POST 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'RqUID: '"$(uuidgen)" \
  -H 'Authorization: Basic '"$(echo -n "$GIGACHAT_CLIENT_ID:$GIGACHAT_CLIENT_SECRET" | base64)" \
  -d 'scope=GIGACHAT_API_PERS' | jq -r '.access_token'
```

## Конфиг адаптера в Datagent

`config/llm/gigachat.yaml`:

```yaml
provider: gigachat
auth:
  type: oauth2_client_credentials
  clientId: ${GIGACHAT_CLIENT_ID}
  clientSecret: ${GIGACHAT_CLIENT_SECRET}
  scope: ${GIGACHAT_SCOPE}
models:
  - id: GigaChat-Pro
    contextWindow: 8192
  - id: GigaChat-Max
    contextWindow: 32768
defaults:
  temperature: 0.2
  maxTokens: 2048
```

Привязка к агенту в Board: **Model** → `GigaChat-Pro`.

## Пример запроса через API (отладка)

```bash
curl -X POST http://localhost:3100/internal/llm/complete \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: ${ADMIN_TOKEN}" \
  -d '{
    "provider": "gigachat",
    "messages": [{"role": "user", "content": "Ответь одним словом: OK"}]
  }'
```

## Типичные ошибки

| Код | Причина |
| --- | --- |
| 401 | Истёк access token — перезапуск адаптера или `pnpm gigachat:token` |
| 403 | Неверный scope или не активирован продукт в кабинете |
| 429 | Квота — снизьте `maxConcurrentRuns` в API |
