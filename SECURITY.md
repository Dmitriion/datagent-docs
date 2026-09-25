# Политика безопасности

## Область действия

Этот репозиторий (**datagent-docs**) — статический сайт документации на Docusaurus. Он **не** содержит runtime Datagent и не хранит секреты пользователей.

Уязвимости в **самом продукте Datagent** (API, Board, плагины) сообщайте через контакт на [datagent.ru](https://datagent.ru) или [sales@datagent.ru](mailto:sales@datagent.ru) — не публикуйте детали эксплуатируемых уязвимостей в открытых issues.

## Что сообщать сюда

- Утечки секретов, токенов или персональных данных в коммитах или артефактах docs
- Уязвимости в CI/CD (GitHub Actions) этого репозитория
- Проблемы в npm-зависимостях, влияющие на сборку или публикацию сайта

## Как сообщить

1. **Не** создавайте публичный issue с описанием эксплуатируемой уязвимости до исправления.
2. Откройте [Security Advisory](https://github.com/Dmitriion/datagent-docs/security/advisories/new) (Private vulnerability report) или напишите maintainers через контакт на [datagent.ru](https://datagent.ru).
3. Укажите: описание, шаги воспроизведения, влияние, предложение по исправлению (если есть).

## Рекомендации для пользователей Datagent (из документации)

При развёртывании **production**-инстанса Datagent (не этого docs-сайта):

| Риск | Мера |
| --- | --- |
| Открытый API без auth | Режим **`authenticated`**, не `local_trusted` |
| Слабый секрет сессий | `BETTER_AUTH_SECRET=$(openssl rand -hex 32)` |
| Доступ из интернета | Bind `loopback` или `tailnet`; не публиковать `:3100` без reverse proxy и TLS |
| Секреты в git / задачах | LLM-ключи и webhook — только через **secret_ref** в Board |
| BrowserBridge token | Файл `~/.datagent/bridge.token` с правами `600` или `bridgeTokenSecretRef` |
| Local Service `:9247` | Только `127.0.0.1` на машине разработчика / локальном bridge. Не публиковать в интернет. Публичный канал — `wss` через app/nginx |

Подробнее: [Старт в Cloud](https://docs.datagent.ru/docs/cloud/getting-started), [On-premise](https://docs.datagent.ru/docs/cloud/on-premise), [Обзор API](https://docs.datagent.ru/docs/api-reference/overview).

## Хостинг этого docs-сайта (GitHub Pages)

Сайт отдаётся с GitHub Pages (кастомный домен `docs.datagent.ru`). Pages **не умеет** выставлять произвольные HTTP-заголовки (HSTS, CSP, `X-Frame-Options`). В HTML есть best-effort meta: `Referrer-Policy` и baseline CSP (совместима с Docusaurus и Яндекс.Метрикой) — см. `docusaurus.config.ts` → `headTags`. Полноценные HSTS / CSP / XFO — только если перед Pages стоит Cloudflare или аналог; проект CDN **не** подключает сам.

**Enforce HTTPS** для кастомного домена включается вручную: GitHub → **Settings → Pages** → чекбокс **Enforce HTTPS**. Пока он выключен, `http://docs.datagent.ru/` отвечает 200 без редиректа. API-токен CI не может переключить `https_enforced` (нужны права владельца). Точные шаги — в [README](./README.md#enforce-https).

## Благодарности

Исследователям, сообщившим об уязвимостях ответственно, по возможности будет публичное упоминание после исправления (с согласия автора).
