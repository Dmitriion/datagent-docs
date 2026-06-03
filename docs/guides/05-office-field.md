---
title: Поле для руководителя — когда списка задач уже не хватает
sidebar_label: '5. Пространство «Офис»'
description: "Operator View «Офис» — KPI, поле агентов и одобрения за один взгляд; история Алексея при enableOffice."
sidebar_position: 6
---

**Алексей** не хочет каждый час открывать десять вкладок с задачами. Ему нужна **картина команды**: кто в работе, кто ждёт решения, где горит. Списки Board остаются; **Офис** даёт open-space за секунды.

![Виртуальный офис — поле и toolbar](/img/guides/office/01-virtual-office-full.webp)

*Рис. 1 — Operator View: поле 1800×1100, KPI и вкладки по краям.*

## Было и стало

| Было | Стало |
| --- | --- |
| Обход списков агентов | **Поле** + KPI-чипы |
| «Кто ждёт hire?» неочевидно | **Shield + N**, amber на столе |
| Разрыв «руководитель / оператор» | Тот же control plane, другой слой UI |

## Как пройти утро понедельника

**Шаг 1.** Админ включил **enableOffice** в экспериментальных настройках instance.

**Шаг 2.** Sidebar → **«Офис»** → `/{префикс}/office`.

**Шаг 3.** В toolbar — огонёк связи, **Standup**, **KPI**, **Shield** с числом внимания.

![Toolbar офиса: KPI и индикаторы](/img/guides/office/04-legend.webp)

*Рис. 2 — чипы KPI, связь с control plane, счётчик внимания.*

**Шаг 4.** На поле: пульс у агента в **running**, amber у **pending_approval**.

![Агент в статусе running на поле](/img/guides/office/02-agent-running.webp)

*Рис. 3 — активный агент (пульс / статус running).*

![Агент ждёт согласования на поле](/img/guides/office/03-agent-awaiting-approval.webp)

*Рис. 4 — `pending_approval` на столе — нужно решение в Board.*

**Шаг 5.** Вкладка **АГЕНТЫ** — roster, в том числе «ждёт одобрения».

**Шаг 6.** Клик по столу — карточка: одобрить hire, открыть задачу, запустить run.

![Боковая панель после клика по агенту](/img/guides/office/05-agent-sidepanel.webp)

*Рис. 5 — drilldown с поля: задача, run, hire.*

**Шаг 7.** **Проекты** — комнаты = проекты; агент в комнате при `in_progress` + assignee + `projectId` (не drag-and-drop портфеля).

**Шаг 8.** **ЧАТ** — общение оператора с коллегами и агентами; часть сценариев может быть в preview (смотрите баннер в UI).

![Панель чата офиса](/img/guides/office/06-office-chat-full.webp)

*Рис. 6 — лента office chat (может быть preview/mock — см. баннер в UI).*

![Composer чата офиса](/img/guides/office/07-office-chat-compose.webp)

*Рис. 7 — поле ввода сообщения в канал.*

![Вкладка «Агенты» на поле](/img/guides/office/09-drilldown-link.webp)

*Рис. 8 — roster с поля без ухода в отдельные списки.*

![Офис в тёмной теме (опционально)](/img/guides/office/01-virtual-office-full-dark.webp)

*Рис. 9 — тот же экран в dark theme.*

```mermaid
graph TB
  subgraph Office [Офис Operator View]
    Floor[Поле и Проекты]
    KPI[Toolbar KPI]
    Panels[Активность · Агенты · Канбан · Чат]
  end
  subgraph CP [Control plane]
    API[agents · issues · activity · live-runs]
  end
  Floor --> API
  Panels --> API
```

## Где экономится время руководителя

За **5 секунд** ответ: «Двое в работе, один ждёт нас, ночью из Bitrix ушла задача». Это Operator View из продуктовой документации — без замены Engineer View (задачи, журнал run).

## Сквозная история: руководитель в Офисе

![Поле](/img/guides/stories/05-office-supervisor-01-floor.webp)
*Шаг 1 — обзор поля.*

![Pending на поле](/img/guides/stories/05-office-supervisor-02-pending.webp)
*Шаг 2 — кто ждёт согласования.*

![Чат](/img/guides/stories/05-office-supervisor-03-chat.webp)
*Шаг 3 — office chat.*

![Вкладка агентов](/img/guides/stories/05-office-supervisor-04-agents-tab.webp)
*Шаг 4 — roster.*

![Inbox одобрений Board](/img/guides/stories/05-office-supervisor-05-approval.webp)
*Шаг 5 — очередь одобрений (переход из Офиса в Board).*

:::info Эксперимент
`enableOffice` — флаг instance. Без него пункта «Офис» в меню нет. Техника: [Пространство «Офис»](../office/overview).
:::

## Чего ждать не стоит

:::warning
- Полноценный CRM из Офиса — это визуализация и быстрые действия, не замена Bitrix.
- Игровые Lv/mood как KPI HR — presentational слой.
- Living sim в проде без договорённости — sim по умолчанию **выкл.** в браузере.
:::

## Быстрая победа за 5 минут

:::tip
Офис → агент в idle → клик → его последняя задача. Связь «поле ↔ задача» запомнится.
:::

## Что дальше

**Следующая глава:** [Пульт в мессенджерах](./06-channels)

- [Одобрения](./04-trust-and-approval)
- [Обзор «Офис»](../office/overview)
