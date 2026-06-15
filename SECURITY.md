# Политика безопасности

## Область действия

Этот репозиторий (**datagent-docs**) — статический сайт документации на Docusaurus. Он **не** содержит runtime Datagent и не хранит секреты пользователей.

Уязвимости в **самом продукте Datagent** (API, Board, плагины) сообщайте в репозиторий [Dmitriion/datagent](https://github.com/Dmitriion/datagent), если там опубликована политика безопасности.

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

Подробнее: [Старт в Cloud](https://docs.datagent.ru/docs/cloud/getting-started), [On-premise](https://docs.datagent.ru/docs/cloud/on-premise), [Обзор API](https://docs.datagent.ru/docs/api-reference/overview).

## Благодарности

Исследователям, сообщившим об уязвимостях ответственно, по возможности будет публичное упоминание после исправления (с согласия автора).
