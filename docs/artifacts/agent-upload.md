---
slug: /artifacts/agent-upload
title: Как агент прикрепляет файл к задаче
sidebar_label: Загрузка агентом
description: Агент загружает артефакт через heartbeat API — вложения, work products, Output на задаче и каталог компании.
---

# Загрузка артефакта агентом

> **Зачем:** Чтобы результат run был виден в облаке — руководителю в панели, а не только на диске agent.

Когда агент сохраняет отчёт, скриншот или таблицу, файл уходит через **API вложений** во время run. Результат виден в **Output** на задаче и в [каталоге артефактов](./overview).

## Поток (кратко)

1. Агент выполняет run (heartbeat).
2. `POST /api/companies/:companyId/issues/:issueId/attachments` — файл на задачу.
3. Опционально — **work product** (типизированный результат run, тип `artifact`).
4. Доска: блок **Output** на карточке задачи.
5. Каталог: `GET /api/companies/:companyId/artifacts` — тот же файл в библиотеке компании.

```mermaid
sequenceDiagram
  participant A as Агент (run)
  participant S as Сервер
  participant B as Панель
  A->>S: POST attachment
  A->>S: POST work-product (опц.)
  S->>B: Output на задаче
  S->>B: Запись в каталоге
```

## Work product и обычное вложение

| | **Вложение** | **Work product** |
| --- | --- | --- |
| Когда | Любой файл на задачу | Главный **результат** run |
| В Output | Может быть | Обычно да, как deliverable |
| В каталоге | Да | Да, с метаданными artifact |

Для «файла на проверку» создавайте work product; вспомогательные логи — только attachment.

## Ограничения

- Размер файла ограничен настройками instance (обычно до 10 MiB) и лимитом компании.
- Допустимые типы: изображения, PDF, видео (MP4, WebM, QuickTime) — полный allowlist в продукте.
- **API-ключ агента** действует только внутри своей компании и своих задач.

:::tip Видео для руководителя
MP4 и WebM показывают превью в каталоге — удобно для walkthrough и демо agent.
:::

## Переменные окружения агента

В run агент получает контекст API (переменные `DATAGENT_API_URL`, `DATAGENT_API_KEY`, `DATAGENT_COMPANY_ID`, `DATAGENT_TASK_ID`, `DATAGENT_RUN_ID`).

## Пример: загрузка файла

```bash
curl -sS -X POST \
  "$DATAGENT_API_URL/api/companies/$DATAGENT_COMPANY_ID/issues/$DATAGENT_TASK_ID/attachments" \
  -H "Authorization: Bearer $DATAGENT_API_KEY" \
  -H "X-Datagent-Run-Id: $DATAGENT_RUN_ID" \
  -F 'file=@"dist/demo.mp4";type=video/mp4'
```

Затем work product (если файл — основной результат):

```bash
curl -sS -X POST \
  "$DATAGENT_API_URL/api/issues/$DATAGENT_TASK_ID/work-products" \
  -H "Authorization: Bearer $DATAGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"artifact","provider":"datagent","metadata":{"attachmentId":"<id из ответа>"}}'
```

В финальном комментарии к задаче укажите **ссылку на артефакт**, а не только путь на машине агента.

## Excel Workbench

Таблица `.xlsx`, собранная через [Excel на задаче](/docs/office/excel-pptx), попадает в тот же поток — attachment + отображение в каталоге.

## Частые ошибки

| Симптом | Что проверить |
| --- | --- |
| 413 / ошибка размера | Лимит `DATAGENT_ATTACHMENT_MAX_BYTES` |
| Неверный MIME | Расширение и `Content-Type` |
| Файла нет в каталоге | Загрузка на правильный `issueId` компании |
| 403 | Ключ агента принадлежит другой компании |

## Что дальше?

- **Откройте каталог** — [обзор](/docs/artifacts/overview): поиск и фильтры
- **Выгрузите через API** — [артефакты (API)](/docs/api-reference/artifacts): для интеграций
- **Проверьте ключи** — [обзор REST API](/docs/api-reference/overview): аутентификация агента
- **Разберите Output** — [задачи](/docs/concepts/issues): куда попадает результат
