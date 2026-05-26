---
id: telegram
title: Telegram
sidebar_label: Telegram
description: Интеграция Telegram Bot с Datagent — webhook, команды бота и согласование действий агента через апрувы.
---

Telegram-бот Datagent служит каналом уведомлений, командного запуска run и **human-in-the-loop** апрувов для чувствительных tools.

## Создать бота

1. [@BotFather](https://t.me/BotFather) → `/newbot` → имя `Datagent Alerts`.
2. Сохраните токен: `7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

## Webhook

`.env`:

```env
TELEGRAM_BOT_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_WEBHOOK_SECRET=8f3c2a1b9e7d4f6a0c5b8e2d1a9f4c7b
TELEGRAM_WEBHOOK_URL=https://api.your-domain.ru/integrations/telegram/webhook
```

Установка webhook:

```bash
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -d "url=${TELEGRAM_WEBHOOK_URL}" \
  -d "secret_token=${TELEGRAM_WEBHOOK_SECRET}"
```

Локальная разработка — ngrok:

```bash
ngrok http 3100
# TELEGRAM_WEBHOOK_URL=https://abc123.ngrok-free.app/integrations/telegram/webhook
```

## Команды бота

| Команда | Действие |
| --- | --- |
| `/start` | Привязка chat_id к workspace |
| `/status` | Последние 5 run и их статусы |
| `/run <agent_slug> <текст>` | Запуск агента |
| `/approve <approval_id>` | Подтверждение tool |
| `/reject <approval_id>` | Отклонение |

Пример:

```
/run lead-helper Проверь новые лиды
```

## Апрувы через бота

При политике `requireApprovalFor: ["bitrix24_update_lead"]` Runner создаёт `approval` и шлёт в Telegram:

```text
🔔 Агент lead-helper хочет обновить лид #4821
Новый статус: IN_PROCESS
/approve aprv_01JXYZ  |  /reject aprv_01JXYZ
```

Таймаут ожидания по умолчанию — 30 минут, затем run → `cancelled`.

## Безопасность

- Whitelist `TELEGRAM_ALLOWED_CHAT_IDS=123456789,-987654321`.
- Подпись webhook проверяется заголовком `X-Telegram-Bot-Api-Secret-Token`.

Туториал: [Автоматизация CRM](../tutorials/automate-crm).
