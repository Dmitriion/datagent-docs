---
id: access-api
slug: /api-reference/access
title: REST API — доступ и приглашения
sidebar_label: Доступ (API)
description: REST API приглашений, участников компании и ролей в Datagent.
---

# REST API — доступ и приглашения

> **Зачем:** Подключать коллег и автоматизировать онбординг — скриптами, HR-системой или вручную, с теми же правилами, что кнопка «Пригласить» в панели.

Для оператора — [команда и доступ](/docs/concepts/collaboration). Аутентификация — [обзор REST API](./overview). База: `https://app.datagent.ru/api`.

## Публичные маршруты invite (без входа)

Коллега открывает ссылку `/invite/{token}` в браузере. Эти маршруты отдают данные для страницы приглашения:

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/invites/:token` | Метаданные: компания, роль, срок |
| `GET` | `/invites/:token/logo` | Логотип компании |
| `GET` | `/invites/:token/onboarding` | Текст онбординга (JSON) |
| `GET` | `/invites/:token/onboarding.txt` | Тот же текст plain |
| `GET` | `/invites/:token/skills/index` | Навыки для онбординга агента |
| `GET` | `/invites/:token/skills/:skillName` | Один навык |
| `POST` | `/invites/:token/accept` | Принять (после auth) |

:::tip Не путайте адрес в браузере и в API
Страница: **`/invite/…`**. Запросы: **`/api/invites/…`** (с «s»).
:::

## Управление приглашениями (board)

Доступны с сессией администратора панели:

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/invites` |
| `POST` | `/companies/:companyId/invites` |
| `POST` | `/invites/:inviteId/revoke` |
| `GET` | `/companies/:companyId/join-requests` |
| `POST` | `/companies/:companyId/join-requests/:requestId/approve` |
| `POST` | `/companies/:companyId/join-requests/:requestId/reject` |

При создании укажите тип (человек или agent), роль, срок `expiresAt` и при желании текст онбординга.

## Участники компании

Список людей в организации и управление ролями:

| Метод | Путь |
| --- | --- |
| `GET` | `/companies/:companyId/members` |
| `GET` | `/companies/:companyId/user-directory` |
| `PATCH` | `/companies/:companyId/members/:membershipId` |
| `DELETE` | `/companies/:companyId/members/:membershipId` |

Роли: `owner`, `admin`, `operator`, `viewer` — подробнее в [справке про команду и доступ](/docs/concepts/collaboration).

## Компании (контекст доступа)

Профиль организации и список компаний, к которым у Вас есть доступ:

| Метод | Путь |
| --- | --- |
| `GET` | `/companies` | Список компаний текущего пользователя |
| `GET` | `/companies/:companyId` | Профиль компании |
| `PATCH` | `/companies/:companyId` | Название, настройки |
| `PATCH` | `/companies/:companyId/branding` | Брендинг invite |

Поля в панели — в [настройках компании](/docs/concepts/company-settings).

## Board claim (редко)

Передача прав на board instance — в основном для **своего сервера**, не для облака:

| Метод | Путь |
| --- | --- |
| `GET` | `/board-claim/:token` |
| `POST` | `/board-claim/:token/claim` |

В облаке [app.datagent.ru](https://app.datagent.ru) этот сценарий обычно не нужен.

## CLI auth (не cloud onboarding)

Маршруты `/cli-auth/*` — вход CLI Datagent на машине разработчика, не приглашение операторов.

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

- **Настройте компанию** — [настройки](/docs/concepts/company-settings): что подготовить до приглашений
- **Разберитесь с аккаунтом** — [облако](/docs/cloud/account): несколько компаний на одну почту
- **Сравните ключи** — [агенты (API)](/docs/api-reference/agents): ключ агента vs доступ людей
- **Ограничьте секреты** — [секреты](/docs/concepts/secrets): кто видит значения ключей
