---
id: seo-geo-master-audit
title: SEO / GEO Master Audit — docs.datagent.ru
sidebar_label: SEO GEO Audit
unlisted: true
---

# SEO / GEO Master Audit — docs.datagent.ru

Дата: 2026-07-16  
Область: публичная документация (после Final Polish / RC / Mobile UX).  
Принцип: высокоинтентные запросы (роль + задача + источник данных + способ запуска), без ранжирования по общим «что такое ИИ».

Служебный документ: `exclude` в `docusaurus.config.ts`, не в sidebar / sitemap / `llms.txt`.

---

## 1. Индексационная карта (сводка)

| URL / файл | Тип | Индексировать | Причина | Главный intent | Canonical | Robots | Sitemap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Pillar / hub | Да | Вход в docs | Документация Datagent / ИИ-агенты для бизнеса | `https://docs.datagent.ru/` | index | Да |
| `/docs/intro` | Pillar map | Да | Карта разделов | С чего начать в docs | docs canonical | index | Да |
| `/docs/concepts/what-is-datagent` | Pillar | Да | Определение продукта | Что такое Datagent / ИИ-агенты для бизнеса | docs | index | Да |
| `/docs/concepts/how-it-works` | Cluster | Да | Механика цикла | Как работает агент / задача → результат | docs | index | Да |
| `/docs/cloud` | Pillar | Да | Cloud product | Datagent Cloud | docs | index | Да |
| `/docs/cloud/getting-started` | How-to | Да | Онбординг | Как начать / регистрация | docs | index | Да |
| `/docs/cloud/first-agent` | How-to | Да | Первый агент | Создать агента | docs | index | Да |
| `/docs/cloud/on-premise` | Product | Да | Enterprise | Self-hosted / свой контур | docs | index | Да |
| `/docs/cloud/pricing` | Product | Да | Тарифы | Цены Datagent | docs | index | Да |
| `/docs/guides` | Pillar | Да | Ежедневная работа | Как пользоваться панелью | docs | index | Да |
| `/docs/guides/0*` | How-to | Да | Операционные how-to | Конкретные действия | docs | index | Да |
| `/docs/tutorials` | Pillar (сценарии) | Да | Практические пути | Сценарии CRM / плагины | docs | index | Да |
| `/docs/integrations/overview` | Pillar | Да | Каталог | Интеграции / ИИ для сервисов РФ | docs | index | Да |
| `/docs/integrations/{service}` | Integration | Да | Long-tail по сервису | ИИ для X / анализ X | docs | index | Да |
| `/docs/integrations/mcp` | Technical | Да | MCP intent | MCP для агентов | docs | index | Да |
| `/docs/integrations/vs-*` | Cluster | Да | Сравнение | vs Zapier / Make | docs | index | Да |
| `/docs/workflows/*` | How-to | Да | Процессы | Конвейеры / таймлайн | docs | index | Да |
| `/docs/browser/*` | How-to | Да | BrowserBridge | Браузер для агента | docs | index | Да |
| `/docs/api-reference/*` | API reference | Да | Developers | Datagent API | docs | index | Да |
| `/docs/billing/*` | Product | Да | Оплата | Биллинг / лимиты | docs | index | Да |
| `/docs/office/*`, `/docs/artifacts/*` | Product | Да | Поверхности панели | Office / артефакты | docs | index | Да |
| `/docs/changelog` | Changelog | Да (низкий приоритет) | Релизы | Что нового | docs | index | Да |
| `/docs/troubleshooting` | Utility | Да | Support | Сбои Cloud | docs | index | Да |
| `*AUDIT*`, `*REPORT*`, `*POLISH*`, `_meta/*`, `BRAND.md`, `getting-started/**` | Internal | **Нет** | Служебное / redirect sources | — | exclude | n/a | Нет |
| Redirect-only (`/docs/integrations`, `/docs/getting-started`) | Utility | Нет как документ | client-redirects | → canonical targets | redirect | — | Не как отдельный doc |

Полный перечень публичных MD/MDX (~87 файлов): уникальные `title` / `description` на момент аудита (скрипт инвентаризации). Дублей title/description среди публичных страниц **не найдено**.

---

## 2. SEO-качество ключевых страниц

| URL | H1 (видимый) | Title | Description | Intent | Главный запрос | Дубли | Проблемы | Приоритет |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Поручите рутину ИИ-исполнителям | узкий / «исполнители» | Битрикс24+1С в фокусе | Hub | документация Datagent | vs intro | Слабый охват интеграций РФ; site-wide meta устарела | P1 |
| what-is | ProductHero | сильный | сильный | Pillar product | ИИ-агенты для бизнеса | vs how-it-works (разведены) | OK; Schema Offer price 0 | P1 schema |
| how-it-works | ProductHero | сильный | сильный | Механика | как работает Datagent | — | OK | — |
| cloud | ProductHero | сильный | сильный | Cloud | Datagent Cloud | vs on-premise | OK | — |
| getting-started | ProductHero | хороший | сильный | How-to start | начать работу Datagent | vs first-agent | Усилить action title | P1 |
| guides | ProductHero | сильный | сильный | Daily ops | руководства Datagent | vs tutorials | sidebar «руководства» у обоих | P1 |
| tutorials | ProductHero | «Практические руководства» | сценарии | Scenarios | сценарии Datagent | vs guides | Каннибализация названия | P1 |
| integrations/overview | H1 в MDX | сильный | сильный | Integrations | интеграции Datagent | — | OK | — |
| amocrm / wb / ozon / … | IntegrationHero | сильные | сильные | Integration LT | ИИ для X | — | OK; мелкие опечатки | P2 |
| mcp | H1 | слабее intent | OK | MCP | MCP ИИ-агент | vs plugins | Title без «MCP» в SEO-форме | P1 |
| api-reference/overview | H1 | «Обзор REST API» | OK | API | Datagent API | — | Слабый title | P1 |
| channels / issues / memory | H1 из title | слишком короткие | OK | Concepts | — | — | Titles без контекста бренда/действия | P2 |
| bitrix24 / gigachat / yandexgpt | — | «AI-агентам» | — | LLM/CRM | — | — | EN «AI» вместо «ИИ» | P2 |

---

## 3. GEO-качество

| URL | Прямой ответ | Факты | FAQ | Пример | Schema | AI-цитируемость | Проблемы |
| --- | --- | --- | --- | --- | --- | --- | --- |
| what-is | Да (lead) | Да | FaqSchema | Роли/таблица | SoftwareApp + FAQ | Высокая | Offer price=0 |
| cloud | Да | Тарифы/сравнение | FaqSchema | Путь старта | FAQ | Высокая | — |
| integrations/overview | Да | 16 / read-only | FaqSchema | TaskPicker | ItemList + FAQ | Высокая | — |
| integration MDX | Да (hero+lead) | ToolCount / DataScope | FaqSchema | ScenarioCards | SoftwareApp + FAQ | Высокая | price=0 |
| guides / tutorials | Да | Частично | FaqSchema | Карточки | FAQ | Средняя+ | — |
| mcp / api | Да | Технические | Нет FAQ на api | Примеры curl | Нет FAQ | Средняя | API без FAQ (норм) |
| `/` | Частично | Free badge | Нет | Preview | Нет WebSite | Средняя | Нет Site schema; узкий subline |

`llms.txt`: факты в целом точные; **порядок** — интеграции раньше pillars (плохо для AI discovery). Changelog не включён (ОК).

---

## 4. Технический SEO-аудит

| Проверка | Статус | Комментарий |
| --- | --- | --- |
| `siteUrl` | OK | `https://docs.datagent.ru` |
| `baseUrl` | OK | `/` |
| locale / `lang` | OK | `i18n.defaultLocale: ru` |
| Canonical | OK | Docusaurus absolute canonical |
| Trailing slash | OK | политика Docusaurus (без `.md` в URL) |
| Redirects | OK | getting-started → cloud; integrations → overview; BB; 1c |
| Exclude reports | OK + расширить | Нужны SEO-GEO-MASTER-AUDIT, SEO-CONTENT-BACKLOG |
| robots.txt | OK с оговоркой | Allow search bots; Disallow GPTBot/ClaudeBot (training). OAI-SearchBot / Perplexity* Allowed |
| Sitemap | OK | `sitemap.xml`; ignore `/tags/**`; усилить ignorePatterns |
| OG | Частично | `themeConfig.image` SVG; `og:locale` ru_RU; site-wide description устарела |
| Favicon | OK | light/dark sync в Root |
| Duplicate title/desc | OK | 0 дублей среди публичных |
| SearchAction | Не добавлять | Локальный search без crawlable `?q=` URL |
| SoftwareApplication offers | **Риск** | `price: 0` при Studio+ — исправить |
| BreadcrumbList JSON-LD | Нет | HTML breadcrumbs есть; JSON-LD — backlog P3 |
| HowTo JSON-LD | Нет | Не внедрять массово без 1:1 с шагами |
| CWV | Низкий риск | WebP guides; нет тяжёлых deps; Metrika third-party |
| Mobile | После Mobile UX | Не ломать custom.css |

---

## 5. Карта контентных кластеров

```text
Документация Datagent (/)
  ├── Что такое Datagent (pillar)
  │     ├── Как это работает
  │     ├── Cloud → getting-started → first-agent
  │     └── Signup (conversion)
  ├── Integrations (pillar)
  │     ├── amoCRM / WB / Ozon / МойСклад / …
  │     ├── company connections (в текстах страниц)
  │     └── tutorials CRM / guides channels
  ├── Guides (pillar ops)
  │     └── 01–08 + playbook
  ├── Tutorials (pillar scenarios)
  │     └── automate-crm, build-plugin
  ├── MCP / BrowserBridge / API (tech)
  └── Cloud vs on-premise (decision)
```

---

## 6. Каннибализация

| Конфликт | Решение |
| --- | --- |
| what-is vs how-it-works | Развести: определение vs цикл задачи (уже сделано) |
| guides vs tutorials | **Переименовать tutorials** в «сценарии»; guides — ежедневная панель |
| intro vs homepage | Hub (карточки) vs карта пути (таблица) — усилить titles |
| cloud vs on-premise | Сравнение на обеих + разные intents |
| integrations overview vs service pages | Overview = каталог; service = long-tail |
| mcp vs Russia connectors | Таблица «четыре MCP» уже разводит |
| bitrix24 tutorial vs guides/06-channels | Перелинковка, не merge |

---

## 7. Семантическое ядро (практическое)

| Кластер | Основной запрос | Secondary / long-tail | Страница | Воронка | Следующий шаг |
| --- | --- | --- | --- | --- | --- |
| ИИ-агенты для бизнеса | ИИ-агенты для бизнеса | платформа ИИ-агентов, управление агентами | what-is-datagent | Awareness | Cloud start / signup |
| Автоматизация отчётов | автоматизация отчётов с ИИ | регулярные отчёты, поручить задачу агенту | guides/03, routines, tutorials | Consideration | Integrations |
| Интеграции | ИИ для CRM / маркетплейсов | подключить данные к агенту | integrations/overview | Consideration | Service page |
| CRM продажи | ИИ для amoCRM | анализ воронки, просроченные сделки | amocrm (+ bitrix24) | Intent | Connect + first question |
| E-commerce | ИИ для Wildberries / Ozon | остатки, продажи WB | wildberries, ozon, moysklad | Intent | Connect |
| Маркетинг | ИИ для VK Рекламы | стоимость лида, кампании | vk-ads, vk | Intent | Connect |
| Контрагенты / платежи | проверить контрагента по ИНН | ЕГРЮЛ, ЮKassa | fns-egrul, yookassa | Intent | Connect |
| Данные / infra | ИИ для PostgreSQL | вопрос к БД без SQL, Selectel | postgresql, selectel, cloud-ru | Intent | Connect |
| Cloud / SH | Datagent Cloud | Cloud или self-hosted | cloud, on-premise | Decision | Signup / sales |
| MCP / API | MCP для ИИ-агентов | BrowserBridge, Datagent API | mcp, browser, api-reference | Tech | Setup |

Не создавать отдельную страницу под каждый ключ.

---

## 8. План реализации (этот проход)

| P | Действие |
| --- | --- |
| P0 | exclude audit/backlog; site-wide meta; SoftwareApp Offer без фальшивой цены 0; sitemap ignore |
| P1 | homepage title/desc/chips/cards; tutorials vs guides naming; mcp/api/getting-started titles; llms.txt порядок |
| P2 | слабые concept titles; AI→ИИ в LLM titles; Site WebSite JSON-LD; HomePaths copy; amocrm typo; внутренние акценты |
| P3 | BreadcrumbList JSON-LD; HowTo; новые страницы → `SEO-CONTENT-BACKLOG.md` |

---

## 9. Исследования / ограничения

- **Modern Web Guidance:** учтены semantic HTML, visible FAQ = schema, no SearchAction without crawlable URL, honest Offer, no hidden SEO.
- **Lazyweb MCP:** в среде недоступен (как в Mobile UX pass); опора на структуру продукта и существующие GEO-блоки.
- **Яндекс.Вебмастер / частотности:** нет доступа на момент аудита — семантика экспертная, не Wordstat. Google Search Console не используем (операционная политика РФ).

---

## 10. Итог внедрения (2026-07-16)

| P | Сделано |
| --- | --- |
| P0 | Exclude SEO audit/backlog; site-wide meta; SoftwareApp Offer без `price:0`; robots commentary; sitemap ignorePatterns |
| P1 | Homepage title/H1/desc/chips/cards + SiteJsonLd; guides vs tutorials naming; mcp/api/getting-started titles; llms.txt pillars-first |
| P2 | Слабые concept titles; AI→ИИ; HomePaths; footer links; intro path; amocrm typo; what-is Offer text |
| P3 | Content backlog 8 тем; BreadcrumbList/HowTo отложены |

Проверки: `npm run typecheck`, `npm run build` — см. финальный отчёт в чате.
