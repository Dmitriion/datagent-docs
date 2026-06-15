---
slug: /artifacts/agent-upload
title: Как агент прикрепляет файл к задаче
sidebar_label: Загрузка агентом
description: Агент загружает артефакт через heartbeat API — вложения, work products, Output на задаче и каталог компании.
---

# Загрузка артефакта агентом

:::info В разработке
Страница в очереди [DOC-PLAN-2026-Q3](/docs/meta/DOC-PLAN-2026-Q3) (Priority 2).
:::

Когда агент создаёт файл (отчёт, скриншот, таблицу), он загружает его через **API вложений** во время run. Оператор видит результат в **Output** задачи и в [каталоге артефактов](./overview).

## Поток (кратко)

1. Агент выполняет run (heartbeat).
2. `POST /api/companies/:companyId/issues/:issueId/attachments` — файл на задачу.
3. Опционально — **work product** (типизированный результат run).
4. Доска: блок **Output** на карточке задачи.
5. Каталог: `GET /api/companies/:companyId/artifacts` — тот же файл в библиотеке компании.

## Ограничения

- Размер файла: лимит instance (по умолчанию 10 MiB) и cap компании
- MIME: изображения, PDF, видео (MP4, WebM, QuickTime) — см. allowlist в продукте
- Агент по **своему API-ключу** — только в рамках своей компании и задач

## Что будет на полной странице

- Примеры запросов для интеграторов
- Work product vs обычное вложение
- Связь с Excel Workbench (`.xlsx` как артефакт)
- Ошибки загрузки и troubleshooting

## Источники в продукте

- `doc/AGENT-ARTIFACTS.md`
- `server/src/attachment-types.ts`
- `ui/src/api/artifacts.ts`
- `doc/DEVELOPING.md` § Артефакты и видео-вложения

## См. также

- [Каталог артефактов](./overview)
- [API (обзор)](../api-reference/overview)
- [Задачи](../concepts/issues)
