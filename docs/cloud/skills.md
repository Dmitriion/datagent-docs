---
id: cloud-skills
slug: /cloud/skills
title: Навыки компании — каталог сценариев для агентов
sidebar_label: Навыки
description: Каталог навыков (skills) в Datagent — готовые сценарии для агентов, связь с плагинами, установка в облаке.
---

# Навыки компании

:::info В разработке
Страница в очереди [DOC-PLAN-2026-Q3](/docs/meta/DOC-PLAN-2026-Q3) (Priority 1).
:::

**Навык (skill)** — упакованный сценарий для агента: инструкции, чеклисты, иногда зависимость от **плагина** (Excel, Bitrix24). Каталог поставляется с продуктом (`@datagent/skills-catalog`) и настраивается на уровне **компании**.

## Что будет на этой странице

- Раздел **Навыки** в панели: просмотр, включение для компании
- Отличие **навыка** от **плагина** и от **памяти**
- Community skills vs shipped catalog
- Подсказки «включите плагин X» при активации навыка
- Тарифы и лимиты на кастомные навыки

## Источники в продукте

- `server/src/services/company-skills.ts`, `server/src/services/skills-catalog.ts`
- `packages/skills-catalog/`
- `doc/plans/2026-05-30-upstream-v529-integration.md` (skills catalog)

## См. также

- [Плагины](./plugins) — менеджер плагинов
- [Первый агент — каталог навыков](./first-agent#каталог-навыков-необязательно)
- [Создание плагина](../tutorials/build-plugin)
