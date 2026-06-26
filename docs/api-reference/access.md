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

**Аутентификация:** `Authorization: Bearer <your-api-key>` (панель) или сессия.

## Сводка endpoints

| Метод | Endpoint | Статус | Описание |
| --- | --- | --- | --- |
| `POST` | `/companies/:companyId/invites` | ✅ | Создать приглашение — онбординг из HR или скрипта |
| `GET` | `/companies/:companyId/invites` | ✅ | Список приглашений — аудит открытых ссылок |
| `GET` | `/companies/:companyId/members` | ✅ | Участники — синхронизация с корпоративным каталогом |
| `PATCH` | `/companies/:companyId/members/:memberId` | ✅ | Сменить роль или статус участника |
| `DELETE` | `/companies/:companyId/members/:memberId` | ✅ | Удалить участника при offboarding |
| `POST` | `/invites/:token/accept` | ✅ | Принять приглашение после входа |
| `PATCH` | `/companies/:companyId/members/:memberId/role-and-grants` | ✅ | Тонкая настройка прав (grants) |

## Публичные маршруты invite (без входа)

Страница в браузере: `/invite/{token}`. API: `/api/invites/…` (с «s»).

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/invites/:token` | Данные для страницы приглашения — компания, роль, срок |
| `GET` | `/invites/:token/onboarding` | Текст онбординга для кастомной welcome-страницы |
| `POST` | `/invites/:token/accept` | Завершить приглашение после аутентификации пользователя |

## Управление приглашениями (панель)

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/invites` | Все активные и истёкшие приглашения |
| `POST` | `/companies/:companyId/invites` | Выпустить ссылку для нового коллеги |
| `POST` | `/invites/:inviteId/revoke` | Отозвать скомпрометированную ссылку |
| `GET` | `/companies/:companyId/join-requests` | Заявки на вступление в компанию |
| `POST` | `/companies/:companyId/join-requests/:requestId/approve` | Одобрить заявку |
| `POST` | `/companies/:companyId/join-requests/:requestId/reject` | Отклонить заявку |

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

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies/:companyId/members` | Список людей и агентов-участников |
| `GET` | `/companies/:companyId/user-directory` | Справочник пользователей для назначений |
| `PATCH` | `/companies/:companyId/members/:memberId` | Сменить `membershipRole` или статус |
| `DELETE` | `/companies/:companyId/members/:memberId` | Исключить из компании |
| `PATCH` | `/companies/:companyId/members/:memberId/role-and-grants` | Расширенные grants поверх роли |

`PATCH …/members/:memberId` требует `users:manage_permissions`.

## Компании (контекст доступа)

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/companies` | Компании текущего пользователя — выбор tenant |
| `GET` | `/companies/:companyId` | Профиль организации |
| `PATCH` | `/companies/:companyId` | Обновить название и настройки |
| `PATCH` | `/companies/:companyId/branding` | Логотип и стиль страницы приглашения |

## Биллинг через API (в разработке)

> **В разработке.** Публичный REST для самообслуживания биллинга и смены тарифа недоступен в текущей версии. Следите за [changelog](/docs/changelog). См. [обзор API — биллинг](./overview#биллинг-в-разработке).

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
