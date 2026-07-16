---
id: guides-ux-seo-geo-audit
title: Guides — UX / SEO / GEO аудит
sidebar_label: Аудит Guides
unlisted: true
---

# Guides — UX / SEO / GEO аудит

Дата: 2026-07-16  
Объект: `docs/guides/*`, связанные SVG в `static/img/guides/workflows/`, ссылки из Concepts/Cloud/Tutorials  
Источник правды: UI board, Cloud onboarding, integrations overview

## Исследование

### Lazyweb
MCP/skill **недоступен**. Паттерны: Stripe/Linear/Notion help centers, enterprise user guides, step-by-step with diagrams.

### Modern Web Guidance
`figure`/`figcaption`, focus-visible, reduced-motion, accessible details/summary, responsive media (`max-width: 100%`).

---

## 1. Карта Guides

| Страница | Роль | Задача | Уровень | SVG/схемы | Следующий шаг | Проблемы |
| --- | --- | --- | --- | --- | --- | --- |
| index | Все | Выбрать главу | Начальный | mermaid + webp | 01-first-day | «Учебник» vs задача; обещания времени |
| 01-first-day | Оператор | Первый агент и задача | Начальный | webp | 02-your-team | «5 минут» как гарантия |
| 02-your-team | Менеджер | Команда агентов | Рабочий | webp + mermaid | 03-one-task | Длинно, много скринов подряд |
| 03-one-task | Оператор | Одна задача до результата | Рабочий | webp + mermaid | 04-trust | Слабый checkpoint |
| 04-trust-and-approval | Руководитель / оператор | Согласования | Рабочий | webp + mermaid | 05 / channels | Ок, усилить шаблон |
| 05-office-field | Руководитель | Обзор «Офис» | Рабочий | webp + mermaid | timeline | Experimental — пометить |
| 06-channels | Оператор | Каналы → задачи | Рабочий | webp + mermaid | bitrix/telegram | Studio для Bitrix |
| 07-documents | Оператор | Excel/PPT | Рабочий | ? | artifacts | Проверить факты OfficeCLI |
| 08-1c-bridge | Аналитик / ИТ | 1С | Админ / ИТ | webp | 1c-connector | Business+ |
| playbook-index | Все | Ситуация → ссылка | Все | нет | chapters | Хороший хаб, вынести выше |

## 2. Инвентарь SVG

| SVG | Где используется | Что объясняет | Alt/подпись | Действие |
| --- | --- | --- | --- | --- |
| `static/img/guides/workflows/pipelines-board.svg` | `docs/workflows/pipelines.md` | Доска конвейера | Есть alt | Сохранить; DiagramContext + Caption + GuideDiagram |
| `pipelines-review.svg` | pipelines.md | Очередь проверки | Есть alt | Сохранить; контейнер + подпись |
| `pipelines-mobile.svg` | pipelines.md | Мобильный вид | Есть alt | Сохранить; адаптивный фрейм |
| `timeline-7d.svg` | `docs/workflows/timeline.md` | Таймлайн 7 дней | Есть alt | Сохранить; контекст + caption |

**Важно:** в главах `docs/guides/01–08` SVG **нет** — там webp-скрины. SVG физически лежат в `img/guides/workflows/` и относятся к Workflows. Удалять/заменять **запрещено**. Webp тоже сохраняем; улучшаем подписи и фреймы.

Другие `.svg` бренда (favicon, mark-header, og) — вне scope Guides, не трогаем.

## 3. UX-проблемы

- Вход — «учебник-рассказ», слабый выбор по роли/задаче (P0).
- Нет единого шаблона: предусловия / checkpoint / troubleshooting (P0).
- Гарантии времени («5 минут», «15–20 минут») без подтверждения (P0).
- SVG workflows без обучающего контекста «как читать схему» (P1).
- Office experimental не всегда явно отделён от обязательного пути (P1).
- Дубли с Cloud getting-started / first-agent (P1).

## 4. Текст

- Сторителлинг с именами (Мария/Алексей) vs прямой instructional tone.
- «За пять минут», «за один вечер».
- Смешение ролей без GuideMeta.

## 5. SEO/GEO

- index description слабый под «как пользоваться Datagent».
- Нет FAQ на главной guides.
- llms.txt почти не ссылается на guides.
- Главы с хорошими long-tail, но неравномерные title.

## 6. План

### P0
1. Новая главная Guides: роли + задачи + маршруты.
2. Компоненты GuideMeta, Prerequisites, Diagram*, Checkpoint, Troubleshooting.
3. Шаблон для 01–08 + playbook.
4. SVG workflows: контекст/подпись/фрейм, файлы не трогать.
5. Убрать гарантированные тайминги.

### P1
6. Sidebars «Руководства» по смыслу.
7. FAQ + GEO факты + llms.txt.
8. Связки с Cloud / Integrations / Tutorials.

### P2
9. Смягчить сторителлинг; единые названия UI.

---

## Статус реализации (2026-07-16)

- [x] Аудит и инвентарь SVG созданы.
- [x] SVG workflows сохранены; добавлены DiagramContext / GuideDiagram / DiagramCaption.
- [x] Главная Guides: маршруты, роли, задачи, FAQ, GEO.
- [x] Главы 01–08 и шпаргалка переведены на единый шаблон.
- [x] sidebars: «Руководства» с ключами категорий; navbar/footer обновлены.
- [x] `static/llms.txt` дополнен разделом Guides.
- [x] `npm run typecheck` + `npm run build` — успешно.

Ограничения: Lazyweb MCP недоступен; отдельный browser preview 390/1440 в этой сессии не запускался — вёрстка схем через `max-width: 100%` и `scrollHint`.
