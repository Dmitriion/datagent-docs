---
id: agents-api
slug: /api-reference/agents
title: REST API — агенты и запуски
sidebar_label: Агенты (API)
description: REST API агентов Datagent — CRUD, возобновление работы, heartbeat-runs, ключи, пауза, org.
---

# REST API — агенты и запуски

> **Зачем:** Запускать и настраивать агентов из CI, скриптов или внешней системы — по тем же правилам, что кнопка «Запуск» в панели.

Как войти в API — [обзор REST API](./overview). Для оператора — [агенты](/docs/concepts/agents) и [heartbeat](/docs/concepts/heartbeat). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>`.

## Сводка endpoints

| Метод | Endpoint | Описание |
| --- | --- | --- |
| `GET` | `/companies/:companyId/agents` | Список агентов — для дашборда команды или выбора исполнителя в скрипте |
| `POST` | `/companies/:companyId/agents` | Создать агента — при онбординге новой роли из HR или IaC |
| `GET` | `/agents/:id` | Карточка агента — проверить настройки перед run |
| `PATCH` | `/agents/:id` | Обновить агента — сменить модель или инструкции без панели |
| `DELETE` | `/agents/:id` | Удалить агента — очистка тестовых или уволенных ролей |
| `POST` | `/agents/:id/wakeup` | Возобновить работу агента — запуск после webhook или по расписанию CI |
| `GET` | `/agents/me` | Профиль по ключу агента — узнать свой `id` и компанию в run |
| `POST` | `/agents/:id/keys` | Выдать ключ агенту — подключить адаптер или внешний worker |

## Агенты компании

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/agents` | Список агентов компании для отчётов и назначения задач |
| `POST` | `/companies/:companyId/agents` | Создать агента с базовой конфигурацией |
| `POST` | `/companies/:companyId/agent-hires` | «Нанять» агента вместе с узлом оргструктуры |
| `GET` | `/agents/:id` | Прочитать карточку перед изменением или run |
| `PATCH` | `/agents/:id` | Обновить поля агента из скрипта деплоя |
| `DELETE` | `/agents/:id` | Удалить агента, когда роль больше не нужна |
| `POST` | `/agents/:id/pause` | Остановить новые run — например, на время инцидента |
| `POST` | `/agents/:id/resume` | Снять паузу после устранения проблемы |
| `POST` | `/agents/:id/terminate` | Прервать активность агента принудительно |

### Агент по API-ключу

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/agents/me` | Узнать свой профиль из run или CLI адаптера |
| `GET` | `/agents/me/inbox-lite` | Короткий список входящих без полной панели |
| `POST` | `/agents/me/plugin-tools/execute` | Вызвать tool плагина из run по ключу агента |

Ключ агента видит только себя: не управляет другими агентами и не читает чужую компанию.

## Модели и адаптеры

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/adapters/:type/models` | Список моделей — перед сменой модели в `PATCH /agents/:id` |
| `GET` | `/companies/:companyId/adapters/:type/model-profiles` | Профили модели для тонкой настройки |
| `POST` | `/companies/:companyId/adapters/:type/test-environment` | Проверить секреты и окружение до боевого run |

## Возобновление работы и heartbeat-runs

Отдельного `POST /runs` нет — новый run через **`POST /agents/:id/wakeup`**.

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/agents/:id/wakeup` | Возобновить работу агента после паузы или по внешнему событию |
| `POST` | `/agents/:id/heartbeat/invoke` | **Устарело** — псевдоним `wakeup`; используйте `/wakeup` |
| `GET` | `/companies/:companyId/heartbeat-runs` | Журнал run — аудит и отладка интеграции |
| `GET` | `/companies/:companyId/live-runs` | Активные run — не дублировать запуск |
| `GET` | `/heartbeat-runs/:runId` | Метаданные одного run для статус-страницы |
| `GET` | `/heartbeat-runs/:runId/events` | Пошаговые события — разбор сбоя |
| `GET` | `/heartbeat-runs/:runId/log` | Текстовый журнал для выгрузки в SIEM |
| `POST` | `/heartbeat-runs/:runId/cancel` | Отменить зависший run из панели или скрипта |

### POST /agents/:id/wakeup

Возобновляет работу агента. Используйте, когда нужно запустить агента по внешнему событию — например, после получения данных из CRM.

**Тело запроса:**

```json
{
  "source": "on_demand",
  "triggerDetail": "manual",
  "reason": "Проверка API",
  "payload": { "issueId": "uuid-задачи" },
  "idempotencyKey": "мой-запуск-2026-06-15",
  "forceFreshSession": false
}
```

| Поле | Значения | Смысл |
| --- | --- | --- |
| `source` | `timer`, `assignment`, `on_demand`, `automation` | Источник запуска |
| `triggerDetail` | `manual`, `ping`, `callback`, `system` | Уточнение |
| `payload` | объект | Контекст (часто `issueId`) |
| `idempotencyKey` | строка | Защита от дубликата run |
| `forceFreshSession` | boolean | Новая сессия адаптера |

```bash
curl -s -X POST "https://app.datagent.ru/api/agents/${AGENT_ID}/wakeup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"source":"on_demand","reason":"API test","payload":{"note":"привет"}}'
```

## Ключи API агента

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/agents/:id/keys` | Список ключей — ротация без удаления агента |
| `POST` | `/agents/:id/keys` | Создать ключ для адаптера или CI |
| `DELETE` | `/agents/:id/keys/:keyId` | Отозвать скомпрометированный ключ |

Секрет ключа показывается **один раз** — сохраните его как пароль.

## Конфигурация и инструкции

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/agents/:id/configuration` | Снимок конфигурации для бэкапа |
| `GET` | `/agents/:id/config-revisions` | История ревизий — откат после ошибочного деплоя |
| `POST` | `/agents/:id/config-revisions/:revisionId/rollback` | Откатить конфигурацию на выбранную ревизию |
| `GET/PATCH` | `/agents/:id/instructions-bundle` | Читать или обновить инструкции из GitOps |
| `GET` | `/agents/:id/skills` | Список навыков агента для проверки каталога |

## Оргструктура и бюджет

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/org` | Оргструктура для отчётов и внешних HR-систем |
| `PATCH` | `/agents/:id/budgets` | Задать месячный лимит — автоматическая пауза при превышении |

См. [команду и доступ](/docs/concepts/collaboration), [бюджеты](/docs/concepts/budgets).

## Что дальше?

- **Возьмите задачу в работу** — [задачи (API)](./issues): checkout после возобновления работы
- **Память агента** — [память (API)](./memory): слои по `agentId`
- **Аутентификация** — [обзор API](./overview)
