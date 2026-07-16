---
id: final-docs-polish-report
title: Final Docs Polish — отчёт
sidebar_label: Final Polish
unlisted: true
---

# Final Docs Polish — редакторский отчёт

Дата: 2026-07-16  
Область: публичная документация docs.datagent.ru

| Приоритет | Файл / URL | Тип проблемы | Что исправлено | Статус |
| --- | --- | --- | --- | --- |
| P0 | `cloud/first-agent.md` и др. | Внутренние ссылки с суффиксом `.md` | Убраны `.md` — стабильные doc routes | ✅ |
| P0 | `docusaurus.config.ts` | Audit/report MD публикуются как docs | Exclude служебных `*AUDIT*`, `*POLISH*`, `FINAL-*` | ✅ |
| P1 | `src/pages/index.tsx` | Обещание «5 минут» / «за пять минут» | Убраны гарантии тайминга | ✅ |
| P1 | `static/llms.txt` | «read-only» в пользовательском описании | «только чтение»; уточнён дубль how-it-works | ✅ |
| P1 | `integrations/*`, `tutorials/build-plugin.md`, `concepts/agent-architecture.md` | Те же `.md`-ссылки | Нормализованы routes | ✅ |
| P2 | `changelog.md` | «Начать за 5 минут» | → «Начать в Cloud» | ✅ |
| P1 | `integrations/mcp.md` | «Read-only» и «Вы хотите» | «только чтение»; нейтральная формулировка | ✅ |
| P2 | Homepage emoji-карточки | Декор в навигации | Оставить; backlog | ⏸ P3 |
| P3 | Полный browser QA 390/1440 | Не в этом проходе | Ручная проверка при релизе | ⏸ |

## Карта маршрутов (кратко)

Публичные префиксы: `/docs/concepts/*`, `/docs/cloud/*`, `/docs/guides/*`, `/docs/integrations/*`, `/docs/tutorials/*`, `/docs/workflows/*`, `/docs/browser/*`, `/docs/office/*`, `/docs/artifacts/*`, `/docs/api-reference/*`.  
Служебные отчёты после exclude не входят в docs plugin.

## SVG

Workflow SVG (`pipelines-*.svg`, `timeline-7d.svg`) — пути и контейнеры без изменений; файлы сохранены.

## Проверки

| Команда | Результат |
| --- | --- |
| `npm run typecheck` | OK |
| `npm run build` | OK |
| `npm run lint` | Скрипта нет в package.json |

Дополнительно: внутренние ссылки с `.md` в публичных страницах нормализованы; служебные audit/report исключены из docs plugin.
