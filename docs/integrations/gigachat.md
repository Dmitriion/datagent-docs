---
id: gigachat
title: Как подключить GigaChat к AI-агентам — Datagent
sidebar_label: GigaChat
description: "GigaChat в Datagent: ключи Сбера, агент в облаке, Битрикс24. Работает на Free. app.datagent.ru."
---

# Как подключить GigaChat к AI-агентам — Datagent

> **Зачем:** Чтобы агенты отвечали через **российскую нейросеть Сбера** — без VPN и без отправки переписки в зарубежные чаты. **Datagent** подключает **GigaChat** к задачам и **Битрикс24** на [app.datagent.ru](https://app.datagent.ru).

Подключите **GigaChat** один раз — и агент отвечает в российском контуре без VPN. Ключи из [кабинета разработчика Сбера](https://developers.sber.ru/), модель выбираете в панели.

## Это работает так

1. Регистрируетесь в developers.sber.ru и получаете **Client ID** и **Client Secret**.
2. В **Datagent** создаёте агента → тип адаптера **GigaChat (Сбер)** → вставляете секреты.
3. Нажимаете **Проверить окружение** — платформа проверяет доступ.
4. Ставите задачу или подключаете **Битрикс24** — клиент пишет в CRM, агент отвечает на GigaChat.
5. Каждый запуск списывает **кредиты**; журнал шагов — в задаче.

Обычно настройка первого агента — **10–20 минут**, если ключи уже есть.

:::tip Доступно бесплатно
**GigaChat** можно использовать на тарифе **Free** (3 агента, 100 запусков в месяц). Нужны свои ключи Сбера.
[Начать бесплатно →](https://app.datagent.ru/signup)
:::

## Какие задачи решать

| Сценарий | Что делает агент |
| --- | --- |
| **Битрикс24** | Отвечает в чате CRM по инструкции компании |
| **Поддержка** | Краткие ответы по базе знаний в задаче |
| **Внутренние процессы** | Чек-листы, черновики писем, разбор входящих |
| **С инструментами** | Таблицы, браузер (PRO+) — если включены плагины |

Типовая связка для России: **Битрикс24 + GigaChat + Datagent** — то, чего нет «из коробки» у n8n без долгой сборки.

## Подключение в три шага

### 1. Ключи GigaChat

1. Создайте проект с продуктом **GigaChat API** на [developers.sber.ru](https://developers.sber.ru/).
2. Скопируйте **Client ID** и **Client Secret**.

### 2. Агент в Datagent

1. Откройте [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент**.
2. Адаптер: **GigaChat (Сбер)** (`gigachat_local`).
3. Модель: например **GigaChat-2-Pro** или **GigaChat-2-Max**.
4. В переменных окружения добавьте `GIGACHAT_CLIENT_ID` и `GIGACHAT_CLIENT_SECRET` как **секреты** (не plain text в проде).
5. Сохраните и нажмите **Проверить окружение**.

Подробнее про поля агента: [Первый агент](../cloud/first-agent).

### 3. Проверка на задаче

Создайте задачу, нажмите **Запустить**, задайте простой запрос на русском. Откройте **журнал запуска** — должны быть шаги модели без ошибки OAuth.

Дальше — [Битрикс24](./bitrix24) или [учебник по каналам](../guides/06-channels).

## Частые вопросы

**Нужен ли VPN?**  
Нет для работы с GigaChat через Datagent в РФ.

**Это отдельная оплата GigaChat?**  
Ключи и квоты — у **Сбера** по их тарифу. **Datagent** списывает **кредиты за запуски** платформы.

**Можно ли без программиста?**  
Да: ключи и агент настраиваются в браузере. OpenCode на стороне облака — забота оператора Datagent.

**Чем GigaChat лучше «просто ChatGPT»?**  
Журнал, задачи на команду, **Битрикс24**, [согласования](../concepts/approvals) — не один личный чат.

**Что если ошибка 401?**  
Проверьте Client ID/Secret и что продукт GigaChat API активен в кабинете Сбера.

## Что дальше?

- [Подключить Битрикс24 →](./bitrix24)
- [YandexGPT →](./yandexgpt)
- [Агенты и запуски →](../concepts/agents)
- [Тарифы →](../cloud/pricing)
- [Зарегистрироваться →](https://app.datagent.ru/signup)

:::note Для инженеров

Адаптер `gigachat_local`, пакет `@datagent/adapter-gigachat-local`, выполнение через OpenCode CLI и кэш OAuth в PostgreSQL.

### OAuth (developers.sber.ru)

1. Проект с **GigaChat API**.
2. **Client ID** и **Client Secret** (confidential client).
3. Scope по умолчанию **`GIGACHAT_API_PERS`** (`DEFAULT_GIGACHAT_SCOPE` в `oauth-client.ts`).
4. На хосте выполнения агентов — **OpenCode CLI** (`opencode` в `PATH`). Адаптер не ставит OpenCode сам.

### Переменные окружения

В корневом `.env.example` **нет** `GIGACHAT_*` — учётные данные в env агента (`secret_ref`).

| Переменная | Где | Обязательность | Описание |
| --- | --- | --- | --- |
| `GIGACHAT_CLIENT_ID` | env агента | Да | Client ID из кабинета Сбер. |
| `GIGACHAT_CLIENT_SECRET` | env агента | Да | Client Secret. |
| `GIGACHAT_SCOPE` | env агента | Нет | По умолчанию `GIGACHAT_API_PERS`. |
| `GIGACHAT_OAUTH_URL` | env процесса server | Нет | Default `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`. |
| `GIGACHAT_ACCESS_TOKEN` | inject server | — | Не задавать вручную. |

Проверка: `POST /api/companies/{companyId}/adapters/gigachat_local/test-environment`.

### Пример `adapterConfig`

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

Локальная отладка OAuth:

```bash
curl -sS -X POST "${GIGACHAT_OAUTH_URL:-https://ngw.devices.sberbank.ru:9443/api/v2/oauth}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "Authorization: Basic $(printf '%s' "${GIGACHAT_CLIENT_ID}:${GIGACHAT_CLIENT_SECRET}" | base64 | tr -d '\n')" \
  -H "RqUID: $(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)" \
  --data-urlencode "scope=${GIGACHAT_SCOPE:-GIGACHAT_API_PERS}"
```

### Типичные ошибки

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| OAuth 401 | Неверные id/secret | Проверить secrets и `secret_ref` |
| OAuth 403 | Scope или продукт | `GIGACHAT_SCOPE`, тариф в developers.sber.ru |
| `gigachat_opencode_prerequisite` | Нет `opencode` | Установить OpenCode на execution target |
| 429 | Квота GigaChat | Снизить параллелизм, бюджеты в Datagent |

Токен обновляется с запасом **120 с** до `expires_at`. Исполнение = **OpenCode** + инъекция токена, не прямой HTTP к GigaChat API.

См. [LLM-адаптеры](../concepts/llm-adapters.md), [Архитектура](../concepts/agent-architecture.md).

:::
