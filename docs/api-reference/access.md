---
id: access-api
slug: /api-reference/access
title: REST API — доступ и приглашения
sidebar_label: Доступ (API)
description: REST API приглашений, участников компании и ролей в Datagent.
---

# REST API — доступ и приглашения

> **Зачем:** Автоматизировать онбординг коллег, интеграции с HR или скрипты администратора — с теми же правилами, что кнопка «Пригласить» в панели.

Концепции для оператора — [команда и доступ](/docs/concepts/collaboration). Аутентификация board — [обзор API](./overview). База: `https://app.datagent.ru/api`.

## Публичные маршруты invite (без входа)

Перед принятием приглашения коллега открывает ссылку `/invite/{token}` в браузере. API для лендинга:

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/invites/:token` | Метаданные: компания, роль, срок |
| `GET` | `/invites/:token/logo` | Логотип компании |
| `GET` | `/invites/:token/onboarding` | Текст онбординга (JSON) |
| `GET` | `/invites/:token/onboarding.txt` | Тот же текст plain |
| `GET` | `/invites/:token/skills/index` | Навыки для онбординга агента |
| `GET` | `/invites/:token/skills/:skillName` | Один навык |
| `POST` | `/invites/:token/accept` | Принять (после auth) |

:::tip Не путать с `/invite/` в UI
В браузере путь **`/invite/…`** (страница). В API — **`/api/invites/…`** (множественное число).
:::

## Управление приглашениями (board)

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/invites` |
| `POST` | `/companies/:companyId/invites` |
| `POST` | `/invites/:inviteId/revoke` |
| `GET` | `/companies/:companyId/join-requests` |
| `POST` | `/companies/:companyId/join-requests/:requestId/approve` |
| `POST` | `/companies/:companyId/join-requests/:requestId/reject` |

Создание invite: тип (human/agent), роль, `expiresAt`, опционально onboarding-текст.

## Участники компании

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/members` |
| `GET` | `/companies/:companyId/user-directory` |
| `PATCH` | `/companies/:companyId/members/:membershipId` |
| `DELETE` | `/companies/:companyId/members/:membershipId` |

Роли: `owner`, `admin`, `operator`, `viewer` — см. [collaboration](/docs/concepts/collaboration).

## Компании (контекст доступа)

| Метод | Путь |
| --- | --- |
| `GET` | `/companies` | Список компаний текущего пользователя |
| `GET` | `/companies/:companyId` | Профиль компании |
| `PATCH` | `/companies/:companyId` | Название, настройки |
| `PATCH` | `/companies/:companyId/branding` | Брендинг invite |

Подробнее о полях в панели — [настройки компании](/docs/concepts/company-settings).

## Board claim (редко)

| Метод | Путь |
| --- | --- |
| `GET` | `/board-claim/:token` |
| `POST` | `/board-claim/:token/claim` |

Сценарий передачи прав на board instance — в основном **self-hosted**; в облаке `app.datagent.ru` обычно не нужен.

## CLI auth (не cloud onboarding)

Маршруты `/cli-auth/*` — для авторизации CLI Datagent на машине разработчика, не для приглашения операторов CRM.

## Пример: список участников

```bash
curl -s "https://app.datagent.ru/api/companies/${COMPANY_ID}/members" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" | jq .
```

## Ошибки

| Код | Когда |
| --- | --- |
| **403** | Недостаточно прав (`users:invite`, смена роли) |
| **404** | Токен invite истёк или отозван |
| **409** | Уже участник компании |

## Что дальше?

- [Настройки компании](/docs/concepts/company-settings)
- [Аккаунт в облаке](/docs/cloud/account)
- [Агенты (API)](/docs/api-reference/agents) — ключи агентов vs люди
- [Секреты](/docs/concepts/secrets) — кто может читать bindings
