---
id: what-is-datagent
title: Что такое Datagent
sidebar_label: Что такое Datagent
description: Нейтральное определение Datagent — AI-оркестратор бизнес-процессов для МСБ в РФ, компоненты, сравнение с аналогами n8n и LangGraph.
---

**Datagent** — программная платформа класса *agent orchestration* для автоматизации повторяющихся бизнес-операций. Продукт ориентирован на организации в Российской Федерации, которым требуется использовать отечественные LLM и типовые корпоративные системы (CRM Bitrix24, учёт 1С, мессенджеры).

Платформа не является универсальной low-code IDE: фокус — на **долгоживущих агентах** с доступом к tools, памятью в PostgreSQL (pgvector) и управляемым браузером (BrowserBridge).

## Определения

| Термин | Значение в контексте Datagent |
| --- | --- |
| Agent | Конфигурация: system prompt, модель, набор tools, политики |
| Run | Одно выполнение агента по пользовательскому input |
| Tool | Атомарное действие (HTTP, CRM, browser_*) с JSON-schema |
| Plugin | Изолированный модуль tools в child-process |
| Board | Web UI для CRUD агентов и мониторинга run |

## Компоненты продукта

1. **API Server** (Node.js) — REST, аутентификация, постановка run в очередь.
2. **Agent Runner** — цикл plan → LLM → tool dispatch → observation.
3. **LLM Adapters** — GigaChat, YandexGPT; опционально OpenCode-совместимый шлюз.
4. **Integrations** — Bitrix24, Telegram, коннекторы 1С.
5. **BrowserBridge** — Playwright + CDP, порт по умолчанию `9247`.
6. **PostgreSQL + pgvector** — метаданные, логи, эмбеддинги памяти.

## Сравнение с аналогами

| Критерий | Datagent | n8n | LangGraph / LangChain |
| --- | --- | --- | --- |
| Парадигма | Агент + tools + LLM loop | Workflow nodes | Граф состояний в коде |
| Российские LLM | Нативные адаптеры | Через HTTP nodes | Через community integrations |
| Bitrix24 / 1С | Встроенные коннекторы | Marketplace nodes | Самописные tools |
| UI для бизнеса | Board | Editor | Обычно отсутствует |
| Browser automation | BrowserBridge (CDP) | Внешние сервисы | Playwright вручную |
| Развёртывание | On-prem / VPC | Cloud + self-host | Библиотека в приложении |

Datagent ближе к **операционной платформе агентов** для МСБ, чем к чистому SDK: инженер настраивает интеграции и политики, конечный пользователь запускает сценарии через Board или Telegram.

## Ограничения

- Не заменяет полноценный ETL; пакетные загрузки в DWH — вне scope.
- Требует эксплуатации PostgreSQL и секретов LLM на стороне заказчика.
- BrowserBridge не предназначен для обхода CAPTCHA и нарушения ToS сайтов.

## Связанные материалы

- [Как это работает](./how-it-works)
- [Архитектура агента](./agent-architecture)
