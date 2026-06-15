---
title: Подключите браузер к агенту за 5 минут
sidebar_label: Подключение
description: Пошаговое подключение BrowserBridge в app.datagent.ru — плагин, мастер «Облако + ПК», скрипты на рабочем компьютере.
---

# Подключите браузер к агенту за 5 минут

Агент сможет работать с реальными сайтами на вашем компьютере — формы, личные кабинеты, CRM без API. Всё настраивается в [app.datagent.ru](https://app.datagent.ru): свой сервер и терминал на сервере не нужны.

⏱ Займёт: **5–10 минут** · Нужны: тариф **PRO**, ПК с **Node.js 20+** и Chrome / Яндекс Браузер / Edge.

## Как подключить

### 1. Включите плагин

1. Войдите в [app.datagent.ru](https://app.datagent.ru).
2. Откройте **Менеджер плагинов**.
3. Установите и **включите** плагин **BrowserBridge** (`datagent.browserbridge`) для вашей компании.

### 2. Откройте мастер BrowserBridge

1. Перейдите в **Настройки** → **Компания** → вкладка **BrowserBridge** (или **Datagent Bridge**).
2. В блоке «Где работает браузер?» выберите **Облако + ПК**.
3. Укажите **ОС рабочего ПК** (Windows, macOS или Linux).

### 3. Установите связь на рабочем ПК

1. Нажмите **Скачать скрипт** в шаге **setup** — сохраните файл на компьютер, где будет браузер.
2. Откройте **PowerShell** (Windows) или **Терминал** (macOS/Linux) и запустите скачанный скрипт. Он скачает bridge-kit с облака и подготовит локальную службу.
3. По подсказкам скрипта **загрузите расширение** в браузер: страница расширений → режим разработчика → «Загрузить распакованное».

### 4. Сопряжите ПК с облаком

1. В мастере нажмите **Далее** до шага **Сопряжение с облаком** — система сгенерирует **код сопряжения** (действует ~10 минут).
2. Скачайте скрипт **pair** и запустите его **на том же ПК**, где выполняли setup.
3. Вернитесь в панель и дождитесь статуса **«В сети»** / **«Подключение к ПК в сети»**.

### 5. Задайте политику и проверьте агента

1. На шаге **Политика** укажите, на какие сайты агент может заходить (например, пресет **CRM** для `*.bitrix24.ru`).
2. Нажмите **Завершить настройку**.
3. В карточке агента включите инструменты `browser_*` и создайте тестовую задачу с простым URL из allowlist.

:::tip Проверка
В шапке панели появится индикатор BrowserBridge. Зелёный **«В сети»** — агент может вызывать браузер.
:::

## Что умеет браузер-агент

- Перейти по ссылке из задачи и дождаться загрузки страницы.
- Сделать скриншот или извлечь текст — результат попадёт в журнал run.
- Заполнить поля формы; **отправка** и опасные клики — через [согласования](/docs/concepts/approvals).
- Работать в уже авторизованной сессии CRM — войдите в сайт вручную один раз в том же профиле браузера.

:::warning Не подходит для
Сайтов с жёсткой защитой от автоматизации (банки, часть корпоративных порталов). Соблюдайте правила сайта и политику компании.
:::

## Типичные проблемы

| Симптом | Что сделать |
| --- | --- |
| Статус «Офлайн» | Повторите pair-скрипт; проверьте, что setup завершился без ошибок |
| Код сопряжения истёк | В мастере нажмите **Новый код** и снова запустите pair-скрипт |
| «Переход заблокирован» | Добавьте домен в политику URL на вкладке BrowserBridge |
| Агент не видит browser_* | Включите плагин и tools в карточке агента |
| Нет Node.js на ПК | Установите Node.js 20+ с [nodejs.org](https://nodejs.org) |

## Частые вопросы

**Нужно ли ставить Datagent на ПК?**  
Нет. Только Node.js и два скрипта из мастера — клон репозитория не нужен.

**Можно ли несколько агентов на одном ПК?**  
Да. Одна связь с ПК обслуживает всех агентов компании по вашей политике.

**Работает без PRO?**  
Нет — нужен тариф **PRO** или выше. [Тарифы →](/docs/cloud/pricing)

## Что дальше

- [Поручите задачу с браузером →](/docs/guides/03-one-task)
- [Настройте согласования →](/docs/concepts/approvals)
- [Автозапуск по расписанию →](/docs/concepts/routines)
- [Обзор BrowserBridge →](/docs/integrations/browserbridge)

<details>
<summary>⚙️ Настройка для self-hosted (разворачивается)</summary>

Инструкции для инженеров: локальный instance Datagent, CLI `datagent-bridge`, переменные окружения и HTTP API Local Service. Пользователям [app.datagent.ru](https://app.datagent.ru) этот блок не нужен.

### Установка из monorepo (разработка)

```bash
pnpm install
pnpm --filter @datagent/browserbridge-local build
pnpm run datagent-bridge install
```

Плагин для instance:

```bash
pnpm --filter @datagent/plugin-browserbridge build
pnpm datagent plugin install ./packages/plugins/plugin-browserbridge
```

`pnpm dev` поднимает **только server + UI** на `PORT=3100`; BrowserBridge **не** стартует автоматически в dev-runner. По умолчанию плагин может **встроенно** поднять Local Service в plugin worker (`autoStartLocalService: true`).

### Запуск Local Service

**Вариант A — вручную (отдельный процесс):**

```bash
pnpm run datagent-bridge start
# или после build:
pnpm --filter @datagent/browserbridge-local run start
```

**Вариант B — автозапуск в plugin worker** (по умолчанию): отдельный `datagent-bridge start` не нужен, если на `127.0.0.1:9247` ещё никто не слушает.

Подключение к уже запущенному браузеру с CDP:

```bash
pnpm run datagent-bridge connect
# или connect-chrome / connect-yandex / connect-comet
```

Проверка статуса:

```bash
pnpm run datagent-bridge status
```

### Переменные окружения (Local Service / CLI)

В корневом `.env.example` Datagent **нет** `BROWSERBRIDGE_*` — настройка через `~/.datagent/` и config плагина на компанию.

| Переменная | Где | Default | Описание |
| --- | --- | --- | --- |
| `DATAGENT_BRIDGE_PORT` | процесс `browserbridge-local` | `9247` | Порт HTTP Local Service |
| `DATAGENT_BRIDGE_HOME` | CLI / config | `~/.datagent` | Корень данных bridge |
| `DATAGENT_BRIDGE_KIT_DIR` | CLI | — | Путь к kit для cloud setup |
| `DATAGENT_BROWSER` | CLI launch/connect | auto-detect | `chrome` \| `yandex` \| `comet` |
| `DATAGENT_BROWSER_EXECUTABLE` | browser-discovery | — | Явный путь к binary |
| `DATAGENT_BROWSER_NATIVE_MESSAGING` | native host | — | Браузер для Native Messaging |
| `DATAGENT_BROWSER_HEADLESS` | executor fallback | `0` | `1` или `CI=true` → headless |
| `DATAGENT_BROWSER_PATCHRIGHT` / `USE_PATCHRIGHT` | `browser.ts` | off | patchright вместо playwright |
| `BROWSERBRIDGE_FULL_RELAY_E2E` | server tests only | — | Полный E2E relay-тест |

Порт **9247** задан в `server.ts`, `DEFAULT_CONFIG.localServicePort` плагина и `DATAGENT_BRIDGE_PORT`. Переопределение — env или `localServicePort` в настройках компании.

Токен: файл `~/.datagent/bridge.token`, заголовок **`X-Datagent-Bridge-Token`** на всех запросах к Local Service.

### Подключение server и агентов к bridge

1. **Plugin worker** → HTTP `http://{localServiceHost}:{localServicePort}/execute` (defaults `127.0.0.1:9247`) с токеном из `~/.datagent/bridge.token` или `bridgeTokenSecretRef`.
2. **Облако / отдельная машина:** `tunnelMode: true` → WebSocket-туннель на сервер, сопряжение через панель.
3. **Политика URL** для `browser_navigate` — в панели, не через env allowlist.

### HTTP API Local Service

| Method | Path | Назначение |
| --- | --- | --- |
| `GET` | `/health` | `ok`, `browserConnected`, `cdpHost`, `cdpPort`, `port` |
| `GET` | `/sessions` | Список сессий CDP |
| `POST` | `/connect` | Подключиться к CDP `{ cdpPort?, cdpHost? }` (default `9222`, `127.0.0.1`) |
| `POST` | `/execute` | Выполнить action + params |
| `GET` | `/screenshot/:id` | Бинарный скриншот по id |
| WebSocket | `/ws` | Расширение браузера (approval overlay) |

### Проверка (curl)

```bash
TOKEN=$(cat ~/.datagent/bridge.token)
curl -s "http://127.0.0.1:9247/health" \
  -H "X-Datagent-Bridge-Token: $TOKEN"
```

Навигация через `/execute`:

```bash
curl -s -X POST "http://127.0.0.1:9247/execute" \
  -H "Content-Type: application/json" \
  -H "X-Datagent-Bridge-Token: $TOKEN" \
  -d '{"action":"navigate","params":{"url":"https://example.com","waitUntil":"load"},"runId":"test-run-001"}'
```

Статус из панели:

```bash
curl -s "http://127.0.0.1:3100/api/companies/<companyId>/browserbridge/status" \
  -H "Cookie: ..."
```

### Настройка в UI (маршруты)

- **Company → Settings → BrowserBridge**: `/company/settings/browserbridge`
- Мастер onboarding (local / cloud), tunnel, коды сопряжения, **browser policy**
- Workstation kit: `GET /api/browserbridge/workstation-kit` (tar.gz)

### Типичные проблемы (self-hosted)

| Симптом | Причина | Что сделать |
| --- | --- | --- |
| Playwright / browser failed to launch | Нет Chromium для Playwright | `playwright install chromium` |
| `ECONNREFUSED` на `:9247` | Local Service не запущен | `datagent-bridge start` или `autoStartLocalService` |
| `Invalid token` / 401 | Неверный заголовок | `X-Datagent-Bridge-Token` = `bridge.token` |
| `browserConnected: false` | CDP не поднят | `launch-chrome` / `connect` |
| Порт занят | Два экземпляра bridge | Один процесс на `localServicePort` |
| Headless на Linux без дисплея | `DATAGENT_BROWSER_HEADLESS=1` | Xvfb или удалённый CDP через `POST /connect` |
| Инструмент «мост недоступен» | Туннель offline | Панель → статус туннеля; `tunnelMode` + сопряжение |
| Navigate blocked | Company policy | allowlist на `/company/settings/browserbridge` |

Подробнее: [интеграция BrowserBridge](../integrations/browserbridge), as-built `doc/guides/browserbridge-setup-ru.md` в монорепо.

</details>
