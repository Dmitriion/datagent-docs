---
id: access-api
slug: /api-reference/access
title: REST API — доступ и приглашения
sidebar_label: Доступ (API)
description: REST API приглашений, участников компании и ролей в Datagent.
---

# REST API — доступ и приглашения

> **Зачем:** Подключать коллег и автоматизировать онбординг — с теми же правилами, что кнопка «Пригласить» в панели.

Для оператора — [команда и доступ](/docs/concepts/collaboration). Аутентификация — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

**Аутентификация:** `Authorization: Bearer <your-api-key>` (board) или сессия.

## Сводка endpoints

| Метод | Endpoint | Статус | Описание |
| --- | --- | --- | --- |
| `POST` | `/companies/:companyId/invites` | ✅ | Создать приглашение |
| `GET` | `/companies/:companyId/invites` | ✅ | Список приглашений |
| `GET` | `/companies/:companyId/members` | ✅ | Участники компании |
| `PATCH` | `/companies/:companyId/members/:memberId` | ✅ | Роль и статус участника |
| `DELETE` | `/companies/:companyId/members/:memberId` | ✅ | Удалить участника |
| `POST` | `/invites/:token/accept` | ✅ | Принять приглашение |
| `PATCH` | `/companies/:companyId/members/:memberId/role-and-grants` | ✅ | Расширенные права (grants) |

## Публичные маршруты invite (без входа)

Страница в браузере: `/invite/{token}`. API: `/api/invites/…` (с «s»).

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/invites/:token` | Метаданные: компания, роль, срок |
| `GET` | `/invites/:token/onboarding` | Текст онбординга |
| `POST` | `/invites/:token/accept` | Принять (после auth) |

## Управление приглашениями (board)

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/invites` |
| `POST` | `/companies/:companyId/invites` |
| `POST` | `/invites/:inviteId/revoke` |
| `GET` | `/companies/:companyId/join-requests` |
| `POST` | `/companies/:companyId/join-requests/:requestId/approve` |
| `POST` | `/companies/:companyId/join-requests/:requestId/reject` |

При создании укажите тип (человек или agent), роль, `expiresAt`, текст онбординга.

### Пример: создать приглашение

```bash
curl -s -X POST "https://app.datagent.ru/api/companies/${COMPANY_ID}/invites" \
  -H "Authorization: Bearer ${BOARD_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "principalType": "user",
    "membershipRole": "operator",
    "expiresAt": "2026-07-01T00:00:00.000Z"
  }'
```

## Участники компании

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/members` |
| `GET` | `/companies/:companyId/user-directory` |
| `PATCH` | `/companies/:companyId/members/:memberId` |
| `DELETE` | `/companies/:companyId/members/:memberId` |
| `PATCH` | `/companies/:companyId/members/:memberId/role-and-grants` |

`PATCH …/members/:memberId` — смена `membershipRole` (`owner`, `admin`, `operator`, `viewer`) и статуса. Требует `users:manage_permissions`.

## Компании (контекст доступа)

| Метод | Путь |
| --- | --- |
| `GET` | `/companies` |
| `GET` | `/companies/:companyId` |
| `PATCH` | `/companies/:companyId` |
| `PATCH` | `/companies/:companyId/branding` |

## Planned

> **Planned.** Публичный REST для **самообслуживания биллинга** и смены тарифа через API — в разработке. См. [обзор API — биллинг](./overview#биллинг-planned).

## Ошибки

| Код | Когда |
| --- | --- |
| **403** | Недостаточно прав (`users:invite`, смена роли) |
| **404** | Токен invite истёк или отозван |
| **409** | Уже участник компании |

## Что дальше?

- **Настройки компании** — [company-settings](/docs/concepts/company-settings)
- **Ключ агента vs люди** — [агенты (API)](./agents)
- **Секреты** — [секреты](/docs/concepts/secrets)
