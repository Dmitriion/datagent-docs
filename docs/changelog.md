---
id: changelog
title: Changelog
sidebar_label: Changelog
description: История изменений Datagent в формате Keep a Changelog — релизы документации, BrowserBridge и первый GA.
sidebar_position: 2
---

Все заметные изменения Datagent документируются в этом файле. Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версионирование следует [Semantic Versioning](https://semver.org/lang/ru/).

## [1.2.0] — 2026-05-26

### Added

- Публичный слой документации на Docusaurus 3 (`docs.datagent.ru`).
- Разделы Getting Started, Concepts, Integrations, Tutorials, API Reference.
- CI-деплой на GitHub Pages с CNAME.

### Changed

- Board UI: ссылки «Справка» ведут на внешнюю документацию.

## [1.1.0] — 2026-05-15

### Added

- **BrowserBridge Phase 1** — локальный сервис Playwright + CDP на порту `9247`.
- Tools: `browser_navigate`, `browser_click`, `browser_snapshot`, `browser_fill`.
- Изоляция сессий браузера по `runId`.

### Fixed

- Таймаут CDP при перезапуске Chromium в headless-режиме на Linux.

## [1.0.0] — 2026-04-01

### Added

- Первый GA-релиз: Agent Runner, LLM-адаптеры GigaChat и YandexGPT.
- Интеграция Bitrix24 (входящий вебхук REST).
- Telegram-бот для уведомлений и апрувов.
- PostgreSQL 15 + pgvector для долговременной памяти агентов.
- Board UI для создания агентов и просмотра run.

[1.2.0]: https://github.com/Dmitriion/datagent-docs/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Dmitriion/datagent-docs/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Dmitriion/datagent-docs/releases/tag/v1.0.0
