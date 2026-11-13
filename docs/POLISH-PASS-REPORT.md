---
id: polish-pass-report
title: Polish Pass — отчёт
sidebar_label: Polish Pass
unlisted: true
---

# Polish Pass — повторный проход документации

Дата: 2026-07-16  
Область: integrations, concepts (ядро), cloud, tutorials, guides, sidebars, llms.txt, общие компоненты

| Приоритет | Страница / компонент | Проблема | Исправление | Статус |
| --- | --- | --- | --- | --- |
| P0 | `tutorials/automate-crm.md` | Ссылки с суффиксом `.md` на bitrix24/telegram | Убрать `.md` из путей | ✅ |
| P1 | `HomePaths` | Обещание «около 5 минут»; «AI-агентов» | Убрать тайминг; «ИИ-агенты» | ✅ |
| P1 | ProductHero / CtaBanner / IntegrationHero | CTA «Начать работу» на signup размыт; Cloud уже «Зарегистрироваться» | Единый дефолт «Зарегистрироваться» / «Создать аккаунт» | ✅ |
| P1 | `integrations/1c-connector.md` | Анкор «учебник» после ребренда Guides | «руководство по подключению 1С» | ✅ |
| P1 | `integrations/vs-zapier.mdx` | Запрещённое «экосистема» | Переформулировать | ✅ |
| P1 | `CtaBanner` | Hover-transform без `prefers-reduced-motion` | Отключить анимацию при reduce | ✅ |
| P1 | `guides/05-office-field` Checkpoint | Формальное «Вы открываете…» | Нейтральная формулировка без «Вы» | ✅ |
| P1 | `tutorials/automate-crm.md` | Маркетинг «0 минут в день» | Смягчить до проверяемого | ✅ |
| P2 | `integrations/overview.mdx` | Две соседние ссылки на один how-it-works | Объединить пункт | ✅ |
| P2 | ProductHero CSS | Разная плотность padding vs IntegrationHero | Выровнять padding | ✅ |
| P2 | Key pages CTA overrides | Явный `buttonText="Начать работу"` | Синхронизировать с дефолтом | ✅ |
| P3 | `changelog.md` | «Учебник», «за 5 минут» | Исторический changelog — не трогать | ⏸ backlog |
| P3 | `agents.md` ProcessSteps titles с «Вы» | Стилистика | Опционально позже | ⏸ |
| P3 | Browser visual QA 390/1440 | Не прогнан в IDE browser | Ручная проверка при публикации | ⏸ |
| P3 | Lazyweb | Недоступен | Опора на MWG + существующие паттерны | ⏸ |
| P3 | Guides webp density | Много скринов подряд в 02 | Ок для instructional; не резать без запроса | ⏸ |

## SVG (Guides / Workflows)

| SVG | Проверка | Действие |
| --- | --- | --- |
| `pipelines-board.svg` | путь, alt, DiagramContext, GuideDiagram, scrollHint | Без изменений файла |
| `pipelines-review.svg` | то же | Без изменений файла |
| `pipelines-mobile.svg` | то же | Без изменений файла |
| `timeline-7d.svg` | то же | Без изменений файла |

## Факты

- ЮKassa 12 / Cloud.ru 2 / read-only — без изменений, согласовано с прошлым аудитом.
- Self-hosted описан как «свой контур» / Enterprise — корректно; промышленный self-serve install не обещается.

## Проверки

| Команда | Результат |
| --- | --- |
| `npm run typecheck` | OK |
| `npm run build` | OK (broken links не найдены) |
| `npm run lint` | Нет скрипта lint в package.json |

Browser preview 390/1440 в IDE не запускался — CSS/схемы проверены по коду (`GuideDiagram`, focus-visible, reduced-motion).

## ЮKassa (факт)

`TOOL_NAMES` в `plugin-yookassa` — **12** инструментов, версия **0.1.0** — совпадает с docs.
