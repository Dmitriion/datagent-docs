---
id: troubleshooting
title: Решение проблем
sidebar_label: Решение проблем
description: Типичные проблемы Board :3100, heartbeat run, пространство «Офис» и поиск в документации Datagent.
---

Краткий справочник, когда что-то «не так» в dev или на стенде. Для установки и переменных окружения начните с [Установки](./getting-started/installation) и [Быстрого старта](./getting-started/quickstart).

## Board и порт :3100

| Симптом | Что проверить |
| --- | --- |
| Страница не открывается | Сервер запущен (`pnpm dev` или `datagent run`); `curl -s http://127.0.0.1:3100/health` |
| `EADDRINUSE` | Другой процесс на `:3100`; смените `PORT` или остановите лишний instance |
| Пустой UI / нет HMR | Board на **том же порту**, что API; отдельного `:3200` нет |
| 401 / нет входа | Режим `authenticated` — пройдите bootstrap; в dev часто `local_trusted` |

## Run и heartbeat

| Симптом | Что проверить |
| --- | --- |
| Run не стартует | **Wakeup** с карточки агента или из **задачи (issue)**; публичного `POST /api/runs` нет |
| Агент «молчит» | Журнал run в UI; ключи LLM в secrets/Board, не в минимальном `.env` |
| Ошибка адаптера | Фильтр «Ошибка» в ростере; [GigaChat](./integrations/gigachat), [YandexGPT](./integrations/yandexgpt) |

## Пространство «Офис»

| Симптом | Что проверить |
| --- | --- |
| Нет пункта «Офис» в меню | Админ включил `experimentalSettings.enableOffice` на instance |
| Пустое или чёрное поле | Обновите страницу после включения флага; см. [главу 5 учебника](./guides/05-office-field) и [обзор «Офис»](./office/overview) |

## Поиск в документации

Используйте **поиск в шапке** сайта (горячая клавиша подсказана в поле поиска). Индекс строится локально при сборке; после крупных обновлений docs может понадобиться пересборка.

## Диагностика instance

```bash
pnpm datagent doctor
```

Подробнее по симптомам dev — таблица «Типичные проблемы» в [Быстром старте](./getting-started/quickstart).

## Нужна глубина

- [Как это работает](./concepts/how-it-works) — heartbeat и плагины
- [Обзор API](./api-reference/overview) — wakeup и issues
- [Учебник](./guides) — сценарии оператора
