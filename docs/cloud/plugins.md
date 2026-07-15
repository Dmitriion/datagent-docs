---
id: cloud-plugins
slug: /cloud/plugins
title: Плагины Datagent — подключения и действия агента
sidebar_label: Плагины
description: "Плагины Datagent: Битрикс24, amoCRM / Ozon / Wildberries / ВКонтакте / VK Реклама / Авиасейлс / Селектел (preview), Телеграм, браузер, 1С и внешние инструменты (MCP)."
---

# Плагины Datagent — подключения и действия агента

**Плагин** даёт агенту **новые действия**: читать чат в CRM, присылать уведомления в Телеграм, открывать сайт в браузере, работать с таблицами. Модель (**GigaChat**, **YandexGPT**) подключаете [отдельно](../integrations/gigachat) — плагин не заменяет нейросеть.

Если «из коробки» не хватает Битрикс24 или браузера — администратор ставит плагин в панели за несколько минут, без ожидания новой версии Datagent.

**Начните так:** [app.datagent.ru](https://app.datagent.ru) → **Менеджер плагинов** → выберите нужный плагин → **Установить** → заполните ключи на странице настроек.

![Менеджер плагинов в настройках компании](/img/guides/stories/06-excel-office-04-plugins.webp)

## Плагины — два типа

### Коннекторы

Подключают агента к внешним сервисам: [Битрикс24](../integrations/bitrix24), [amoCRM](../integrations/amocrm), [Ozon Seller](../integrations/ozon), [Wildberries](../integrations/wildberries), [ВКонтакте](../integrations/vk), [VK Реклама](../integrations/vk-ads), [Селектел](../integrations/selectel), [Телеграм](../integrations/telegram), [1С](../integrations/1c-connector). Агент получает данные и действует от вашего имени — в рамках выданных прав и политик.

### Автоматизации

Готовые сценарии из [каталога навыков](./skills): «проверить таблицу перед отчётом», «разобрать входящее», «подготовить ответ по шаблону». Это инструкции для агента, а не отдельная программа.

## Как установить (без кода)

1. **Менеджер плагинов** → выберите плагин → **Установить**.
2. Откройте страницу настроек плагина (вебхук, ключ бота, адрес 1С — что требует связка).
3. Включите нужные **действия** у агентов по инструкции плагина.
4. Проверьте на тестовой задаче.

Типичный путь без программиста — **Битрикс24** и **Телеграм**.

## Что есть из коробки

| Плагин | Зачем вам |
| --- | --- |
| [Битрикс24](../integrations/bitrix24) | Чаты CRM → задачи и ответы агента (**Studio+**) |
| [amoCRM (preview)](../integrations/amocrm) | Чтение воронки / сделок / контактов через tools (**preview**, без write) |
| [Ozon Seller (preview)](../integrations/ozon) | Каталог / FBO/FBS / аналитика / финансы — **105** tools (**preview**, без write) |
| [Wildberries (preview)](../integrations/wildberries) | Seller API — **165** tools (**preview**, без write / ZIP) |
| [ВКонтакте (preview)](../integrations/vk) | Сообщества / стена / медиа / маркет — **93** tools (**preview**, без write) |
| [VK Реклама (preview)](../integrations/vk-ads) | Кабинеты Ads / статистика — **69** tools (**preview**, без write) |
| [Яндекс 360 (preview)](../integrations/yandex360) | Directory / Admin Mail / Security — **36** tools (**preview**, без write) |
| [Яндекс Трекер (preview)](../integrations/yandex-tracker) | Issues / очереди / scroll search — **76** tools (**preview**, без write) |
| [Селектел (preview)](../integrations/selectel) | Облачный инвентарь Selectel — **139** tools (**preview**, без write/lifecycle) |
| [Авиасейлс (preview)](../integrations/aviasales) | Travelpayouts цены / Flight Search — **32** tools (**preview**, без mass harvest / write) |
| [Телеграм](../integrations/telegram) | Уведомления и согласования в мессенджере (все тарифы) |
| [BrowserBridge](../integrations/browserbridge) | Сайты и формы на вашем ПК (**Studio+**) |
| [Внешние инструменты (MCP)](../integrations/mcp) | Корпоративные сервисы и данные для Cursor-агентов (**Studio+**) |
| [1С Коннектор](../integrations/1c-connector) | Данные учёта из 1С (**Business+**) |
| Excel / Office | Таблицы и слайды на задаче — [документы](../office/excel-pptx) |

Список в панели может отличаться — смотрите **Менеджер плагинов** в своём аккаунте.

## Навыки и плагины

| | **Плагин** | **Навык** |
| --- | --- | --- |
| Что это | Связь с сервисом | Готовый сценарий для агента |
| Кто включает | Администратор | Менеджер в каталоге навыков |
| Пример | Мост в Битрикс24 | «Проверка таблицы перед отчётом» |

Подробнее: [Навыки](./skills) · [Первый агент](../cloud/first-agent#каталог-навыков).

## Тарифы и плагины

| Возможность | Free, Solo | Studio, Business |
| --- | --- | --- |
| Телеграм, базовые плагины | ✅ | ✅ |
| Битрикс24, BrowserBridge, внешний MCP | — | ✅ |
| 1С | — | только **Business** |

[Тарифы →](./pricing)

## Частые вопросы

**Нужен ли программист для Битрикс24?**  
Часто достаточно админа CRM и ответственного за Datagent.

**Плагин = GigaChat?**  
**Нет.** Плагин — **действия**; адаптер — **модель**.

**Можно ли на бесплатном тарифе?**  
Телеграм и базовые плагины — да. **Битрикс24** и **браузер** — с **Studio**.

## Что дальше

→ [Каталог навыков](./skills)

<details>
<summary>Для разработчиков своих плагинов</summary>

Scaffold:

```bash
npx @datagent/create-datagent-plugin @my-org/datagent-demo-greeter \
  --template connector \
  --display-name "Учебный плагин-приветствие"
```

Архитектура: `PluginWorkerManager`, JSON-RPC stdio, `POST /api/plugins/tools/execute`. Пошагово: [Создание плагина](../tutorials/build-plugin).

Публичный маркетплейс для сторонних авторов — **в разработке**. Вопросы — **[sales@datagent.ru](mailto:sales@datagent.ru?subject=Плагин%20для%20Datagent)**.

</details>
