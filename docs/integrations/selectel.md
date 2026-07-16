---
id: selectel
title: Селектел — облачный инвентарь для агентов (preview)
sidebar_label: Селектел (preview)
description: "Preview read-only коннектор Selectel: проекты, серверы, MKS, DBaaS, биллинг и сеть через tools агента. Без provision/delete и без kubeconfig."
---

# Селектел (preview)

:::info[Preview — только чтение]
Плагин **Селектел** доступен как **preview**: агент может **читать** инвентарь облака (проекты, квоты, серверы, сети, MKS, DBaaS, биллинг, DNS/CDN, метаданные хранилища и др.). **Создание, изменение и удаление** ресурсов, выдача kubeconfig, тело объектов Object Storage — **ещё не в продукте**. Не GA: не включайте в критичный продакшен-процесс до подтверждённого live pilot.
:::

Коннектор даёт агенту **управляемые инструменты** к **Official Selectel / OpenStack API** — не сторонний Terraform-провайдер «как write-MCP» и не [реестр внешних MCP](./mcp). Вызовы идут через виртуальный MCP **`datagent-plugins`**.

**Не путать с:** Cloud.ru (отдельный Russia connector, IAM packs — см. канон в монорепо), [1С Коннектор](./1c-connector) (учёт), [внешние MCP](./mcp).

**Первый шаг:** [app.datagent.ru](https://app.datagent.ru) → **Интеграции** → **Селектел** → секрет токена или Keystone username/password → задать **projectId** / **region** в настройках компании плагина.

## Что умеет агент (as-built preview)

**139** инструментов чтения (`PLUGIN_VERSION` **1.10.0**, Waves **SE0–SE12** + resilience **SE-R…SE-R3**), в том числе:

- Resell: проекты, квоты, пользователи, traffic/capabilities
- OpenStack: серверы, тома, сети, образы, floating IP (list/get)
- Octavia: балансировщики, listeners, pools
- MKS и DBaaS: кластеры, nodegroups, datastores (без паролей и kubeconfig)
- Биллинг и audit logs (окно до 7 суток, project-scoped)
- DNS / CDN / CRaaS / S3 bucket meta (без тела объектов)
- Dedicated, Global Router, backup plans, secrets/certs meta, tickets (при static token)

**Надёжность (без смены архитектуры):**

- Проверка связи (probe): fail-closed **проекты + квоты**
- Таймауты: лёгкие запросы **15 с**, тяжёлые **45 с**
- После **трёх** подряд HTTP 429 — пауза `max(5с, Retry-After ≤ 60с)`
- Keystone: кэш по `expires_at`, сброс при 401, без stampede на параллельных запросах

**Не умеет (явно NO-GO):** provision/delete/lifecycle; kubeconfig; тело объектов Object Storage; значения секретов и private keys; создание CRaaS/Prometheus токенов; произвольный `raw_request`; смена project/region из параметров tool (только из настроек компании).

## Как подключить (кратко)

1. Установите плагин **Селектел** в менеджере плагинов компании.
2. Укажите **static token** (`tokenSecretRef`) **или** Keystone username/password через секреты компании.
3. Задайте **projectId** и **region** в config плагина (агент не может переопределить их в вызове tool).
4. Для OpenStack при static token укажите `openstackEndpoints` и/или `openstackBaseUrl`. Tickets / IPAM / reports требуют **static** `tokenSecretRef`.
5. В карточке агента → **Подключения** включите Selectel и при необходимости subset (`selectel_*`; или Skills readiness).
6. Проверьте на тестовой задаче: «Покажи проекты и квоты» / «Список серверов» — агент должен только читать.

Технический канон и maturity gates: в монорепо [`doc/mcp-russia-connectors.md`](https://github.com/Dmitriion/datagent/blob/master/doc/mcp-russia-connectors.md) §15 · Waves **SE-R3**.

## Ограничения

- Статус каталога: **`preview`** — не считать GA и не обещать write / Terraform-parity клиентам.
- Live pilot и GA — только после harness evidence (`selectel-pilot.json`), не «вручную passed».
- Данные биллинга, тикетов и IAM могут содержать чувствительную информацию — выдавайте tools только нужным агентам.
- **SE-R4** (жёсткий RPS SlidingWindow, durable Keystone в plugin.state) — backlog: только после live-метрик `rateLimited` / подтверждённого multi-worker stampede.

## Что дальше

→ [МойСклад (preview)](./moysklad) — склад / учёт Remap  

→ [Авиасейлс (preview)](./aviasales) — цены / Flight Search  

→ [ВКонтакте (preview)](./vk) — сообщества Social  

→ [VK Реклама (preview)](./vk-ads) — кабинеты Ads  

→ [amoCRM (preview)](./amocrm) — чтение CRM  

→ [Яндекс 360 (preview)](./yandex360) — Directory / Mail / Security  

→ [Внешние инструменты (MCP)](./mcp) — реестр HTTP MCP для Cursor  

→ [Плагины](../cloud/plugins)
