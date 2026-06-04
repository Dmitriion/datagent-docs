---
title: 1С в контуре компании — мост для разработки, не кнопка в Board
sidebar_label: '8. 1С'
description: "1С-коннектор и MCP proxy для Cursor — без agent tools в heartbeat и без «агент проводит документы»."
sidebar_position: 9
---

**Алексей** слышал: «Подключите 1С к агентам». **Дмитрий**, инженер, не хочет отдавать учётную запись «чату» в Board. Здесь — **контролируемый HTTP MCP** к опубликованной базе 1С и установка расширения: разработка в IDE, health-check в Board. Без обещания, что «агент в задаче проводит документы» — таких tools в heartbeat нет.

![Страница 1С-коннектор в Board](/img/guides/1c/connector-page.webp)

*Рис. 1 — upstream URL, test-connection и cursor-config для IDE.*

## Было и стало

| Было | Стало |
| --- | --- |
| Ручной экспорт в Excel для сверки | MCP tools из **1С** в Cursor (и других IDE) |
| Ожидание «агент в Datagent лезет в 1С» | **Нет** `datagent.1c-connector:*` в heartbeat на задаче |
| Непонятная настройка «на словах» | Страница плагина: статус, test, готовый `mcp.json` |

## Как подключить за два дня

**Шаг 1. Установите плагин.** Дмитрий ставит `datagent.1c-connector` ([1С Коннектор](../integrations/1c-connector)) через Plugin Manager.  
*Результат:* в Board появляется страница коннектора и proxy worker.

**Шаг 2. Опубликуйте MCP в 1С.** В базе — расширение `MCP_Server.cfe`, HTTP MCP (`/hs/...`) с Basic auth по политике безопасности.  
*Результат:* upstream доступен для proxy, а не «дыра» в интернет.

**Шаг 3. Настройте upstream в Board.** Поля `upstreamMcpUrl`, proxy на `:8010` (по умолчанию), кнопка **test-connection**.  
*Результат:* зелёный статус — контур жив; красный — разбор с админом 1С и IIS.

![Настройки компании — вкладка плагинов](/img/guides/board/05-settings.webp)

*Рис. 2 — установка `datagent.1c-connector` через Plugin Manager.*

**Шаг 4. Подключите Cursor.** Скопируйте **cursor-config** в MCP Cursor. Разработчик вызывает tools с upstream 1С **из IDE**; журнал — в привычном workflow разработки.  
*Результат:* 1С остаётся за контролируемым MCP, не за произвольным чатом.

**Шаг 5. Оператор работает в Board как раньше.** Мария ведёт **задачи** с агентами по тексту и файлам. Сверка с учётом — через deliverables людей и отчёты 1С, **не** через tool в run на задаче.  
*Результат:* честное разделение: Datagent — процесс и диалог; 1С — учёт через отдельный контур.

```mermaid
flowchart LR
  subgraph Board [Board :3100]
    UI[Страница 1C Connector]
  end
  subgraph Worker [plugin worker]
    Proxy[MCP proxy]
  end
  subgraph External [Вне Board]
    Cursor[Cursor MCP]
    OneC[1С HTTP MCP]
  end
  UI --> Proxy
  Cursor --> Proxy --> OneC
```

## Как сказать IT на встрече

«У нас **не** чат с полным доступом к 1С. У нас MCP с Basic auth, журнал в IDE, Datagent поднимает proxy и health-check. Это **мост для разработки**, не замена 1С и не кнопка „провести документ“ в задаче.»

## Что нельзя обещать

- **Операторам:** «агент в задаче выгрузит регистр» — в manifest нет agent tools для 1С в heartbeat.
- **Смешивать с [Office Plugin](./07-documents)** — другой плагин, другие tools (Excel/PPTX).
- **Забыть IIS redirect на POST** для MCP — без этого test-connection и Cursor будут падать; детали в [техдоке коннектора](../integrations/1c-connector).

## Быстрая победа за 5 минут

Страница 1C Connector → **test-connection** → зелёный upstream. Этого достаточно, чтобы на статусе сказать: «контур жив, можно подключать IDE».

## Что дальше

- [1С Коннектор — техдок](../integrations/1c-connector)
- [Шпаргалка](./playbook-index)
- [Создание плагина](../tutorials/build-plugin) — свой bridge по тому же принципу
