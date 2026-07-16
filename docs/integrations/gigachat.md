---
id: gigachat
title: Как подключить GigaChat к ИИ-агентам Datagent
sidebar_label: GigaChat
description: "GigaChat в Datagent: ключи Сбера, агент в облаке, Битрикс24. Работает на Free. app.datagent.ru."
---

# Как подключить GigaChat к AI-агентам — Datagent

Агент **отвечает клиентам и коллегам на русском** через нейросеть Сбера, **ведёт задачи в панели** и **подключается к Битрикс24** — переписка не уходит в зарубежные чаты и не теряется в личном ChatGPT.

Если команда уже платит за GigaChat в Сбере и не хочет VPN ради западных моделей — вы получаете данные в российском контуре, отклик обычно быстрее по РФ, а стоимость вызовов считает Сбер по своему тарифу, не Datagent.

**Начните так:** получите **Client ID** и **Client Secret** на [developers.sber.ru](https://developers.sber.ru/) → [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент** → адаптер **GigaChat (Сбер)** → вставьте ключи как **секреты**.

> **Нужны собственные ключи от Сбера.**  
> **Ограничений по тарифу Datagent нет** — подключается на **любом** плане, включая **Free**. Datagent списывает **запуски** платформы; вызовы модели — по тарифу Сбера.

## Какие задачи решать

| Сценарий | Что делает агент |
| --- | --- |
| **Битрикс24** | Отвечает в чате CRM по инструкции компании |
| **Поддержка** | Краткие ответы по базе знаний в задаче |
| **Внутренние процессы** | Чек-листы, черновики писем, разбор входящих |
| **С плагинами** | Таблицы, [браузер](../browser/overview) (**Studio+**) — если включены |

Типовая связка для России: **Битрикс24 + GigaChat + Datagent**.

## Подключение в три шага

### 1. Ключи GigaChat

1. Создайте проект с продуктом **GigaChat API** на [developers.sber.ru](https://developers.sber.ru/).
2. Скопируйте **Client ID** и **Client Secret**.

### 2. Агент в Datagent

1. [app.datagent.ru](https://app.datagent.ru) → **Агенты** → **Новый агент**.
2. Адаптер: **GigaChat (Сбер)**.
3. Модель: например **GigaChat-2-Pro** или **GigaChat-2-Max**.
4. В переменных окружения добавьте ключи как **секреты компании** (не открытым текстом).
5. Сохраните и нажмите **Проверить окружение**.

Подробнее: [Первый агент](../cloud/first-agent).

### 3. Проверка на задаче

Создайте задачу, нажмите **Запустить**, задайте простой запрос на русском. В **журнале запуска** — шаги модели без ошибки авторизации.

Дальше — [Битрикс24](./bitrix24) или [учебник по каналам](../guides/06-channels).

## Частые вопросы

**Нужен ли VPN?**  
Нет для работы с GigaChat через Datagent в РФ.

**Это отдельная оплата GigaChat?**  
Ключи и квоты — у **Сбера**. **Datagent** списывает **запуски** с лимита вашего плана.

**Можно ли без программиста?**  
Да: ключи и агент настраиваются в браузере.

**Чем GigaChat лучше «просто ChatGPT»?**  
Журнал, задачи на команду, **Битрикс24**, [согласования](../concepts/approvals) — не один личный чат.

**Что если ошибка 401?**  
Проверьте Client ID/Secret и что продукт GigaChat API активен в кабинете Сбера.

## Что дальше

→ [Подключить Битрикс24](./bitrix24)

:::note[Для инженеров]

Адаптер `gigachat_local`, пакет `@datagent/adapter-gigachat-local`, выполнение через OpenCode CLI и кэш OAuth в PostgreSQL.

### Авторизация (developers.sber.ru)

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

### Типичные ошибки

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| OAuth 401 | Неверные id/secret | Проверить secrets и `secret_ref` |
| OAuth 403 | Scope или продукт | `GIGACHAT_SCOPE`, тариф в developers.sber.ru |
| `gigachat_opencode_prerequisite` | Нет `opencode` | Установить OpenCode на execution target |
| 429 | Квота GigaChat | Снизить параллелизм, бюджеты в Datagent |

См. [LLM-адаптеры](../concepts/llm-adapters), [Архитектура](../concepts/agent-architecture).

:::
