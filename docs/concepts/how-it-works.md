---
id: how-it-works
title: Как работает Datagent — задачи, агенты и нейросети
sidebar_label: Как это работает
description: Цикл задачи и запуска агента в Datagent — от постановки до результата в облаке app.datagent.ru.
---

> **Зачем:** Вы хотите понять, **как Datagent доводит задачу до результата** — без разбора кода. **Datagent** на [app.datagent.ru](https://app.datagent.ru) связывает задачи, агентов, **GigaChat** и интеграции вроде **Битрикс24** в один управляемый цикл.

## Это работает так

1. Создаётся **задача**, назначается **агент** (вручную или из CRM).
2. **Пробуждение** запускает цикл: нейросеть + инструменты плагинов.
3. Рискованные шаги — через **согласование**; итог — в журнале задачи.

Когда вы **запускаете агента**, сервер ведёт цикл: обращается к нейросети (GigaChat, YandexGPT и др.), при необходимости вызывает **инструменты** плагинов и повторяет шаги до ответа или лимита.

Для вас это **задача → Запуск → журнал**. Ниже — схема для тех, кто хочет понять цепочку глубже. Карта компонентов — в [Архитектуре](./agent-architecture.md).

## Сквозная схема

```mermaid
flowchart TB
  subgraph Client["Client Layer"]
    UI["@datagent/ui — Board :3100"]
    Ext["REST clients / bridges"]
  end

  subgraph Core["server — /api/*"]
    API["Express routes"]
    HB["heartbeatService"]
    AdpReg["adapters registry"]
    TD["Plugin tool dispatcher"]
    PWM["PluginWorkerManager"]
  end

  subgraph Adapters["packages/adapters/*"]
    GC["gigachat_local → OpenCode"]
    YG["yandexgpt_local → OpenCode"]
    OC["opencode_local"]
  end

  subgraph Plugins["packages/plugins/*"]
    B24["datagent.bitrix24 worker"]
    TG["datagent.plugin-telegram worker"]
    BBPlg["datagent.browserbridge tools"]
  end

  subgraph Bridge["BrowserBridge"]
    BB["datagent-bridge + tunnel API"]
  end

  subgraph Infra["Infrastructure"]
    PG["PostgreSQL — heartbeat_runs, issues, adapter_oauth_tokens"]
  end

  UI -->|same origin /api| API
  Ext --> API
  API --> HB
  HB --> AdpReg
  AdpReg --> GC
  AdpReg --> YG
  AdpReg --> OC
  HB --> TD
  TD --> PWM
  PWM --> B24
  PWM --> TG
  PWM --> BBPlg
  HB -->|tunnel| BB
  BBPlg --> BB
  HB --> PG
  B24 -->|issue + wakeup| API
  TG -->|issues / approvals| API
```

## Board и API

| Действие | Путь / механизм |
| --- | --- |
| Board UI | `http://localhost:3100` (при `SERVE_UI=false` UI на том же origin, что API) |
| Запуск run из UI | Wakeup агента → `POST /api/agents/:id/wakeup` |
| Статус run | `GET /api/heartbeat-runs/:runId`, `/events`, `/log` |
| Список run компании | `GET /api/companies/:companyId/heartbeat-runs` |
| Вызов tool (отладка) | `POST /api/plugins/tools/execute` |

Маршруты heartbeat и агентов — `server/src/routes/agents.ts`; монтирование — `server/src/app.ts` (`app.use("/api", api)`).

Для интеграций начните с [Обзора API](../api-reference/overview.md).

## Этапы выполнения run

### 1. Запуск (wakeup)

**Кто инициирует:**

| Источник | Кто действует | Что происходит |
| --- | --- | --- |
| **Board** | Оператор или менеджер | Кнопка Run / Wakeup на агенте или в задаче |
| **REST** | Интеграция или скрипт | `POST /api/agents/:id/wakeup` (`wakeAgentSchema`: `source`, `payload`, `idempotencyKey`, …) |
| **Плагины** | Система по событию канала | Bitrix24 bridge и Телеграм создают или обновляют задачу и будят привязанного агента (не `POST /runs`) |

**Результат:** `heartbeatService` создаёт запись в `heartbeat_runs` (`queued` → `running` → `succeeded` / `failed`). Оператор видит статус в Board; руководитель может смотреть тот же run в «Офисе» или в списке агентов.

### 2. Подготовка контекста

**Система** собирает всё, что агенту разрешено видеть на этом шаге:

- конфиг агента: `adapterType`, `model`, env (`secret_ref`);
- для `gigachat_local` / `yandexgpt_local` — токены из `adapter_oauth_tokens` в PostgreSQL;
- описания tools только из **включённых** плагинов и политики агента;
- опционально память компании (`/api/companies/.../memory/*`).

**Польза:** агент не «угадывает» из чата — контекст задачи, политики и tools согласованы до вызова модели.

### 3. LLM через адаптер

| Тип адаптера | Runtime |
| --- | --- |
| `gigachat_local` | OpenCode CLI + OAuth Сбер (см. [GigaChat](../integrations/gigachat.md)) |
| `yandexgpt_local` | OpenCode + IAM Yandex Cloud ([YandexGPT](../integrations/yandexgpt.md)) |
| `opencode_local` | OpenCode, ключи провайдеров в env агента |

Ответ модели — текст и/или tool calls (JSONL OpenCode). Подробнее — [LLM-адаптеры](./llm-adapters.md).

### 4. Вызов tools (tool dispatch)

**Агент** (через модель) запрашивает tool; **сервер** выполняет его в worker-процессе плагина (`PluginWorkerManager`, `server/src/services/plugin-worker-manager.ts`):

| Класс | Пример имени | Примечание |
| --- | --- | --- |
| BrowserBridge | `datagent.browserbridge:browser_navigate`, `browser_screenshot` | Плагин `packages/plugins/plugin-browserbridge` + локальный bridge |
| Телеграм и прочие | `datagent.plugin-telegram:escalate_to_human`, … | Только tools из manifest установленных плагинов |
| Bitrix24 | — | **Нет** `bitrix24_*` в agent tool dispatcher; imbot REST только внутри worker |

Если tool рискованный (браузер, apply в Excel и т.д.), **оператор** может увидеть запрос в **входящих** согласований до продолжения run.

### 5. Завершение

**Система** пишет события и лог в PostgreSQL; Board опрашивает heartbeat-runs. **Клиент** в Bitrix24 может получить ответ через `imbot.v2.Chat.Message.send`; в Телеграм — исходящие сообщения worker после run (long poll на вход).

**Польза для оператора:** финальный ответ в **переписке по задаче** плюс журнал шагов; для руководителя — аудит без «бот сказал в CRM, а у нас тишина».

## Пример trace (упрощённо)

```json
{
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "succeeded",
  "steps": [
    {"type": "llm", "model": "gigachat/GigaChat-2-Pro", "tokens": 412},
    {"type": "tool", "name": "datagent.browserbridge:browser_screenshot", "durationMs": 890},
    {"type": "llm", "model": "gigachat/GigaChat-2-Pro", "tokens": 198},
    {"type": "finish", "output": "На странице виден заголовок …"}
  ]
}
```

Фактический формат — `GET /api/heartbeat-runs/:runId/events`.

## Надёжность

Рекомендуемые практики эксплуатации:

- передавать `idempotencyKey` в теле wakeup при повторных вызовах из интеграций;
- при зависании — `POST /api/agents/:id/pause` / `resume` или `POST /api/heartbeat-runs/:runId/cancel`;
- для BrowserBridge — изоляция browser-сессий (см. [Подключение браузера](../browser/setup)).

Не полагайтесь на «ещё одно сообщение в чат» вместо **Wakeup**: новая итерация — новый run с журналом.

## Частые вопросы

**Чем запуск агента отличается от обычного чата с нейросетью?**  
В Datagent у каждого запуска есть задача, журнал, лимиты кредитов и правила согласования. Агент работает в контексте компании, а не в изолированном диалоге.

**Кто запускает агента — человек или система?**  
И то, и другое: кнопка в панели, расписание heartbeat, webhook из **Битрикс24** или API. Механизм один — **пробуждение** (wakeup).

**Где смотреть, что агент сделал?**  
Карточка задачи, журнал запуска (run), при необходимости — [Входящие](./inbox.md) для согласований.

## Что дальше?

- [Создать первого агента](../cloud/first-agent) — пошагово в облаке
- [Агенты](./agents.md) · [Кредиты](./credits.md) · [Согласования](./approvals.md)
- [Регистрация в облаке](https://app.datagent.ru) — бесплатный тариф Free

## Связанные разделы

- [Архитектура](./agent-architecture.md)
- [LLM-адаптеры](./llm-adapters.md)
- [Обзор API](../api-reference/overview.md)
- [Bitrix24](../integrations/bitrix24.md) · [Телеграм](../integrations/telegram.md)
