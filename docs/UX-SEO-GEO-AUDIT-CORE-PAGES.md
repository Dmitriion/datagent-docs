---
id: ux-seo-geo-audit-core-pages
title: UX / SEO / GEO аудит — Concepts, Cloud, Tutorials
sidebar_label: Аудит core-страниц
unlisted: true
---

# UX / SEO / GEO аудит ключевых разделов

Дата: 2026-07-16  
Объект: `docs/concepts/`, `docs/cloud/`, `docs/tutorials/`, связанные `intro`, guides  
Источник правды: `doc/PRODUCT.md`, `DATAGENT_MONETIZATION.md`, `DEPLOYMENT-MODES.md`, UI onboarding

## Исследование

### Lazyweb
MCP/skill Lazyweb в Cursor **недоступен**. Паттерны взяты из публичных onboarding/docs Stripe, Linear, Notion, Vercel и Modern Web Guidance.

### Паттерны
| Паттерн | Применение |
| --- | --- |
| Результат в первом экране, не определение | ProductHero |
| Выбор Cloud vs Self-hosted как решение, не таблица ради таблицы | CompareOptions |
| Stepper onboarding без фальшивых минут | ProcessSteps |
| Tutorial cards → следующий сценарий | TutorialCards |
| Trust: права, согласования, только чтение интеграций | блоки в Cloud / What is |
| Единый CTA signup | CtaBanner |

### Modern Web Guidance
Семантика, focus-visible, reduced-motion, container queries для карточек, native details для FAQ, без лишнего JS.

---

## 1. Карта страниц

| Раздел | Страница | Роль в пути | Аудитория | Проблема | Решение |
| --- | --- | --- | --- | --- | --- |
| Concepts | what-is-datagent | Понять продукт | Руководитель | Узкий фокус Битрикс/Телеграм; слабая отстройка от чата | Витрина: агент, задачи, контроль, интеграции |
| Concepts | how-it-works | Понять цикл | Руководитель / оператор | Технический тон, CRM-центричность | Процесс задача→данные→результат |
| Concepts | agents, issues, … | Углубление | Оператор | Слабая связь с воронкой старта | Лид + next step |
| Concepts | agent-architecture | ИТ | ИТ | Ок как deep dive | Пометить «для ИТ» |
| Cloud | index | Выбрать Cloud | Все | GigaChat/Битрикс как единственный нарратив | Cloud = быстрый старт в браузере |
| Cloud | getting-started | Первый результат | Новичок | «5 минут» как гарантия | Шаги без жёсткого тайминга |
| Cloud | first-agent | Углубить агента | Новичок | Дублирует getting-started | Чёткая роль после старта |
| Cloud | pricing | Выбрать тариф | Покупатель | Таблица ок, hero слабый | Усилить выбор за 30 с |
| Cloud | on-premise | Self-hosted | ИТ / Enterprise | Мало ясности «когда нужен» | Сравнение + заявка |
| Tutorials | index | Практика | Оператор | Только CRM + плагин | Путь к первому результату + интеграции |
| Tutorials | automate-crm | Сценарий | Оператор Битрикс | Узкий | Оставить + связать с воронкой |
| Tutorials | build-plugin | Dev | Разработчик | Не для первого дня | Пометить «для разработчиков» |
| Intro | intro | Карта docs | Все | Устаревший акцент на Битрикс | Выровнять с what-is + integrations |

---

## 2. UX-проблемы (P0–P1)

- Ценность за 15 с размыта: «цифровые сотрудники» без связи с данными компании.
- Слабое отличие от чат-бота (есть, но зарыто).
- Cloud vs Self-hosted есть, но решение «что выбрать мне» слабо.
- Tutorials не ведут к универсальному первому результату (агент + задача + интеграция).
- Навигация: Concepts свёрнуты в технический каталог; what-is не в «Начало работы».
- Дубли: intro / cloud / getting-started / first-agent пересекаются.
- Мобильные таблицы тарифов — уже есть, но cloud index перегружен ссылками.

## 3. Текст

- Канцелярит и AI-тон в части concepts.
- «За пять минут» без доказательств.
- Англицизмы (MCP, heartbeat) без пояснения на входных страницах.
- Устаревший упор на Битрикс24 как главный сценарий при наличии Russia connectors.

## 4. SEO / GEO

- what-is description узкий (Битрикс/Телеграм).
- cloud title ок, но лид устарел.
- tutorials description — «плагины» впереди бизнес-сценариев.
- Нужны FAQPage + прямые факты на hub-страницах.
- llms.txt — обновить core URLs.

## 5. План

### P0
1. Переписать what-is, how-it-works, cloud index, getting-started, tutorials index.
2. ProductHero / ProcessSteps / CompareOptions / TutorialCards.
3. Sidebars: what-is и how-it-works в «Начало работы».
4. Убрать гарантированные тайминги.

### P1
5. first-agent, on-premise, intro, pricing hero.
6. Новые tutorial-карточки пути (связка с integrations overview).
7. FAQ + llms.txt + CTA signup.

### P2
8. Лёгкий refresh лидов agents/issues/approvals/memory/secrets.
9. Пометить build-plugin как для разработчиков.
