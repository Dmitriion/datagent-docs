import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TodoListCard,
  UsageBar,
  useHostTheme,
} from "cursor/canvas";

type Phase = {
  id: string;
  order: number;
  title: string;
  priority: "P0" | "P1" | "P2" | "P3";
  effort: number;
  status: "done" | "partial" | "todo";
  goal: string;
  canon: string[];
  gaps?: readonly string[];
  sections: readonly {
    path: string;
    action: string;
    drift?: string;
  }[];
  exit: string;
};

const CANON = [
  { doc: "DATAGENT_MONETIZATION.md", role: "Тарифы, матрица фич §4, gate по планам" },
  { doc: "STRATEGY.md §5", role: "Зеркало pricing, дистрибуция, ICP" },
  { doc: "PRODUCT.md", role: "Ментальная модель, G0 onboarding, границы продукта" },
  { doc: "docs-sync-runbook", role: "Порядок PR: monorepo → docs → landing" },
] as const;

const VOCAB = [
  ["Устаревшее", "Канон"],
  ["PRO (990 ₽)", "Solo — 990 ₽, unlimited agents, 1 000 runs"],
  ["Business (3 900 ₽)", "Studio — 3 900 ₽; Business — 12 900 ₽"],
  ["10 агентов / 2 000 runs", "Free: 3/100; Solo: ∞/1 000"],
  ["BrowserBridge PRO+", "BrowserBridge Studio+"],
  ["Bitrix24 PRO", "Bitrix24 Studio+"],
  ["1С на Studio", "1С Business+"],
  ["Кредиты = валюта (сейчас)", "Runs по подписке; wallet — planned (модель B)"],
] as const;

/** Снимок gap-audit 2026-06-15 — операторская аудитория */
const CONTENT_HEALTH = {
  totalPages: 64,
  fullPages: 58,
  thinPages: 3,
  stubs: 1,
  missingRequired: 0,
} as const;

const PHASES: readonly Phase[] = [
  {
    id: "p0",
    order: 0,
    title: "Словарь и канон",
    priority: "P0",
    effort: 1,
    status: "done",
    goal: "Зафиксировать единую терминологию до массовых правок — иначе drift вернётся через cross-links.",
    canon: ["DATAGENT_MONETIZATION §2.1", "STRATEGY §5", "docs-sync-runbook"],
    sections: [
      { path: "meta/DOC-PLAN-2026-Q3.md", action: "UPDATE счётчики + строка «Pricing drift P0»" },
      { path: "meta/audit-snapshot-*.json", action: "NEW снимок после фазы 1" },
    ],
    exit: "Таблица замен согласована; grep PRO/2000/10 агент — baseline зафиксирован.",
  },
  {
    id: "p1",
    order: 1,
    title: "Тарифы и монетизация",
    priority: "P0",
    effort: 5,
    status: "done",
    goal: "Все упоминания цен и лимитов совпадают с 5-плановой сеткой; disclaimer billing planned везде.",
    canon: ["DATAGENT_MONETIZATION §2.1", "§4.5.2", "§1.1 overage"],
    sections: [
      { path: "cloud/pricing.md", action: "VERIFY — эталон", drift: "Уже 5 тарифов" },
      { path: "concepts/credits.md", action: "REWRITE", drift: "PRO 10/2000, кошелёк как факт" },
      { path: "concepts/what-is-datagent.md", action: "REWRITE", drift: "PRO/Business 3900" },
      { path: "concepts/agents.md", action: "REWRITE", drift: "PRO limits, BrowserBridge PRO+" },
      { path: "concepts/budgets.md", action: "UPDATE", drift: "Free/PRO/Business; vs plan quota" },
      { path: "concepts/company-settings.md", action: "UPDATE", drift: "Проверить tier names" },
      { path: "intro.mdx", action: "UPDATE", drift: "Старые тарифы в hero" },
      { path: "cloud/index.md", action: "VERIFY cross-links" },
      { path: "cloud/account.md", action: "VERIFY план/seats copy" },
    ],
    exit: "grep PRO|2 000|10 агент → 0 в user-facing prose (кроме FAQ «было PRO»).",
  },
  {
    id: "p2",
    order: 2,
    title: "Вход в облако",
    priority: "P1",
    effort: 3,
    status: "done",
    goal: "Путь founder/ops: signup → onboarding → первый run за 5 минут — по PRODUCT § Получение Datagent.",
    canon: ["PRODUCT.md G0", "2026-06-16-g0-production-rollout"],
    sections: [
      { path: "intro.mdx", action: "UPDATE journey + CTA app.datagent.ru" },
      { path: "cloud/getting-started.md", action: "VERIFY 5-min flow" },
      { path: "cloud/first-agent.md", action: "UPDATE skills allowlist Solo 6/14" },
      { path: "cloud/account.md", action: "UPDATE seats, invites, billing planned" },
      { path: "cloud/on-premise.md", action: "ALIGN Enterprise vs Business 12 900" },
      { path: "changelog.md", action: "SYNC product releases, не docs-only" },
    ],
    exit: "Нет localhost/docker в основном потоке; CTA только app.datagent.ru.",
  },
  {
    id: "p3",
    order: 3,
    title: "Ядро: как работают агенты",
    priority: "P1",
    effort: 6,
    status: "done",
    goal: "Концепции объясняют control plane оператору; plan gates из §4 без выдуманных фич.",
    canon: ["PRODUCT.md", "SPEC-implementation.md §22 memory"],
    sections: [
      { path: "concepts/how-it-works.md", action: "VERIFY heartbeat + approvals flow" },
      { path: "concepts/agents.md", action: "После p1 — capabilities по тарифам" },
      { path: "concepts/issues.md", action: "ADD plan decompose Studio+" },
      { path: "concepts/routines.md", action: "VERIFY cron UX в панели" },
      { path: "concepts/heartbeat.md", action: "UPDATE runs = plan quota" },
      { path: "concepts/approvals.md", action: "VERIFY browser_action, hire" },
      { path: "concepts/inbox.md", action: "VERIFY" },
      { path: "concepts/channels.md", action: "VERIFY Bitrix/Telegram gates" },
      { path: "concepts/memory.md", action: "UPDATE Gardener Studio+, operator tabs" },
      { path: "concepts/projects.md", action: "VERIFY" },
      { path: "concepts/workspaces.md", action: "ADD sandbox BYOC Studio+" },
      { path: "concepts/goals.md", action: "VERIFY OKR operator story" },
      { path: "concepts/collaboration.md", action: "ADD invites, org chart" },
      { path: "concepts/secrets.md", action: "VERIFY operator UI" },
      { path: "concepts/llm-adapters.md", action: "VERIFY RU adapters без paywall" },
      { path: "concepts/agent-architecture.md", action: "KEEP dev-audience; link cloud" },
    ],
    exit: "Каждая concepts/* заканчивается «Что дальше»; нет migration names.",
  },
  {
    id: "p4",
    order: 4,
    title: "Интеграции и браузер",
    priority: "P1",
    effort: 4,
    status: "done",
    goal: "Интеграции = задачи агента в облаке; BrowserBridge Studio+; 1С Business+.",
    canon: ["DATAGENT_MONETIZATION §4.4.2", "§4.9"],
    sections: [
      { path: "integrations/bitrix24.md", action: "FIX plan gate Studio+", drift: "«только PRO?»" },
      { path: "integrations/browserbridge.md", action: "FIX Studio+", drift: "PRO в admonition" },
      { path: "browser/overview.md", action: "FIX Studio+ badge" },
      { path: "browser/setup.md", action: "FIX tariff mention" },
      { path: "integrations/1c-connector.md", action: "CLARIFY Business+ + IDE/MCP" },
      { path: "integrations/gigachat.md", action: "VERIFY BYO keys" },
      { path: "integrations/yandexgpt.md", action: "VERIFY" },
      { path: "integrations/telegram.md", action: "CLARIFY no plan gate (as-built)" },
      { path: "cloud/plugins.md", action: "UPDATE connector vs automation layers" },
      { path: "cloud/skills.md", action: "EXPAND Solo allowlist 6, Studio 14 PRO" },
    ],
    exit: "Plan columns в интеграциях совпадают с pricing.md таблицей.",
  },
  {
    id: "p5",
    order: 5,
    title: "Артефакты и Office",
    priority: "P2",
    effort: 3,
    status: "done",
    goal: "v609 artifacts Solo+; Office experimental; doc annotations Studio+.",
    canon: ["DATAGENT_MONETIZATION §4.5", "AGENTS.md artifacts invariants"],
    sections: [
      { path: "artifacts/overview.md", action: "VERIFY Solo+ gate, mobile/static header" },
      { path: "artifacts/agent-upload.md", action: "VERIFY agent API path" },
      { path: "office/overview.md", action: "CLARIFY experimental, Office Chat Solo+" },
      { path: "office/excel-pptx.md", action: "CROSS-LINK artifacts + skills" },
      { path: "guides/05-office-field.mdx", action: "SYNC operator view" },
    ],
    exit: "Артефакты не в mobile nav — зафиксировано; annotations = Studio+.",
  },
  {
    id: "p6",
    order: 6,
    title: "API Reference",
    priority: "P2",
    effort: 4,
    status: "done",
    goal: "API docs для интеграторов; billing endpoints marked planned.",
    canon: ["server routes", "api-reference overview"],
    sections: [
      { path: "api-reference/overview.md", action: "UPDATE TOC + planned billing" },
      { path: "api-reference/agents.md", action: "VERIFY keys, wakeup" },
      { path: "api-reference/issues.md", action: "ADD decompose endpoint Studio+" },
      { path: "api-reference/memory.md", action: "EXPAND operator vs agent scope" },
      { path: "api-reference/artifacts.md", action: "VERIFY" },
      { path: "api-reference/plugins.md", action: "VERIFY tools/execute" },
      { path: "api-reference/access.md", action: "VERIFY invites" },
    ],
    exit: "Нет обещаний shipped billing без planned badge.",
  },
  {
    id: "p7",
    order: 7,
    title: "Учебник и сценарии",
    priority: "P2",
    effort: 3,
    status: "partial",
    goal: "8 глав playbook ведут оператора; тарифы и gates согласованы с p1–p4.",
    canon: ["guides/playbook-index", "PRODUCT user scenario"],
    gaps: [
      "guides/01–08 — навигация «Следующая глава», не единый заголовок «Что дальше» (backlog)",
    ],
    sections: [
      { path: "guides/index.mdx", action: "VERIFY hub" },
      { path: "guides/01-first-day.mdx", action: "SYNC onboarding" },
      { path: "guides/02-your-team.md", action: "VERIFY BrowserBridge path" },
      { path: "guides/03-one-task.md", action: "VERIFY issue flow" },
      { path: "guides/04-trust-and-approval.md", action: "VERIFY" },
      { path: "guides/06-channels.md", action: "VERIFY Bitrix Studio+" },
      { path: "guides/07-documents.md", action: "ADD annotations Studio+" },
      { path: "guides/08-1c-bridge.md", action: "CLARIFY Business+" },
      { path: "tutorials/index.md", action: "VERIFY hub" },
      { path: "tutorials/automate-crm.md", action: "VERIFY" },
      { path: "tutorials/build-plugin.md", action: "KEEP dev; details block" },
      { path: "troubleshooting.md", action: "EXPAND memory/plugin errors" },
    ],
    exit: "Учебник не противоречит cloud/pricing ни в одной главе.",
  },
  {
    id: "p8",
    order: 8,
    title: "Навигация и внешние поверхности",
    priority: "P2",
    effort: 2,
    status: "done",
    goal: "docs.datagent.ru ↔ datagent.ru ↔ app — одни цифры и CTA.",
    canon: ["landing-docs-sync checklist", "saas-docs-drift-audit"],
    sections: [
      { path: "sidebars.ts", action: "VERIFY IA после всех страниц" },
      { path: "src/pages/index.tsx", action: "VERIFY cards + Артефакты" },
      { path: "llms.txt", action: "UPDATE после IA change" },
      { path: "datagent-landing (external)", action: "SYNC pricing #pricing" },
      { path: "navbar/footer", action: "VERIFY Приложение → app.datagent.ru" },
    ],
    exit: "Drift-audit row landing/docs pricing → resolved.",
  },
  {
    id: "p9",
    order: 9,
    title: "QA и публикация",
    priority: "P0",
    effort: 2,
    status: "done",
    goal: "Каждая фаза заканчивается зелёным build и осмысленным commit.",
    canon: ["docs-sync-runbook checklist", "onBrokenLinks: throw"],
    sections: [
      { path: "npm run build", action: "После каждой фазы" },
      { path: "grep drift", action: "PRO, localhost, Paperclip" },
      { path: "check:ui-locale-parity", action: "Только если трогали UI strings в продукте" },
      { path: "git commit", action: "docs(sync): phase N — краткое why" },
      { path: "push main", action: "После review" },
    ],
    exit: "docs.datagent.ru отражает канон v1.4 monetization.",
  },
];

const PRIORITY_TONE: Record<Phase["priority"], "warning" | "info" | "neutral"> = {
  P0: "warning",
  P1: "warning",
  P2: "info",
  P3: "neutral",
};

const STATUS_LABEL: Record<Phase["status"], string> = {
  done: "Готово",
  partial: "Частично",
  todo: "В очереди",
};

const todos = PHASES.flatMap((phase) =>
  phase.sections.map((section, index) => ({
    id: `${phase.id}-${index}`,
    content: `[${phase.order}] ${section.path} — ${section.action}`,
    status:
      phase.status === "done"
        ? ("completed" as const)
        : phase.status === "partial" && index === 0
          ? ("in_progress" as const)
          : ("pending" as const),
  })),
);

function phaseEffortSegments() {
  const totals = PHASES.reduce((sum, p) => sum + p.effort, 0);
  return {
    total: totals,
    segments: PHASES.map((p) => ({
      id: p.id,
      value: p.effort,
      color:
        p.priority === "P0"
          ? ("pink" as const)
          : p.priority === "P1"
            ? ("orange" as const)
            : ("blue" as const),
    })),
  };
}

export default function DatagentDocsSyncRoadmap() {
  const { tokens: t } = useHostTheme();
  const effort = phaseEffortSegments();
  const partialCount = PHASES.filter((p) => p.status === "partial").length;
  const todoCount = PHASES.filter((p) => p.status === "todo").length;
  const pageCount = PHASES.reduce((n, p) => n + p.sections.length, 0);
  const driftCount = PHASES.reduce(
    (n, p) => n + p.sections.filter((s) => s.drift).length,
    0,
  );

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 1080, color: t.text.primary }}>
      <Stack gap={6}>
        <H1>Datagent-docs — план актуализации</H1>
        <Text tone="secondary">
          Последовательность разделов для синхронизации с каноном монорепо (STRATEGY, PRODUCT,
          DATAGENT_MONETIZATION v1.4). Аудитория: операторы app.datagent.ru.
        </Text>
        <Text tone="tertiary" size="small">
          Источник: doc/DATAGENT_MONETIZATION.md, DOC-PLAN-2026-Q3 — синхронизация Q3 закрыта 15.06.2026
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat label="Фаз" value={String(PHASES.length)} tone="info" />
        <Stat label="Страниц в плане" value={String(pageCount)} />
        <Stat label="Фаз partial/todo" value={`${partialCount} / ${todoCount}`} tone={partialCount > 0 ? "warning" : "success"} />
        <Stat label="Полных страниц" value={String(CONTENT_HEALTH.fullPages)} tone="success" />
      </Grid>

      <Callout tone="success" title="Gap-audit 15.06.2026 — операторская аудитория">
        {CONTENT_HEALTH.totalPages} страниц: 0 публичных заглушек, 0 отсутствующих обязательных разделов.
        Примеры дописаны в channels, collaboration, projects, workspaces. Отчёт: gap-report-2026-06-15.md
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat label="Всего страниц" value={String(CONTENT_HEALTH.totalPages)} />
        <Stat label="Полных (≥300 сл)" value={String(CONTENT_HEALTH.fullPages)} tone="success" />
        <Stat label="Заглушек" value={String(CONTENT_HEALTH.stubs)} />
        <Stat label="Отсутствующих" value={String(CONTENT_HEALTH.missingRequired)} tone="success" />
      </Grid>

      <Callout tone="info" title="Синхронизация Q3 2026">
        Drift PRO/localhost = 0. Plan gates = pricing.md. Backlog: issues-post-qa.md, p7 навигация учебника.
      </Callout>

      <Card>
        <CardHeader trailing={<Pill tone="info">effort units</Pill>}>
          Распределение усилий по фазам
        </CardHeader>
        <CardBody>
          <UsageBar
            total={effort.total}
            topLeftLabel="10 фаз синхронизации"
            topRightLabel={`Σ ${effort.total} условных SP`}
            segments={effort.segments}
          />
          <Text tone="tertiary" size="small" style={{ marginTop: 8 }}>
            P0 (красный) — блокеры публикации; P1 (оранжевый) — ядро продукта; P2+ (синий) — глубина и API.
          </Text>
        </CardBody>
      </Card>

      <H2>Канон монорепо (читать перед правками)</H2>
      <Table
        striped
        headers={["Документ", "Роль в синхронизации"]}
        rows={CANON.map((row) => [row.doc, row.role])}
      />

      <H2>Словарь замен (фаза 0)</H2>
      <Table
        striped
        headers={["В docs сейчас", "Писать в docs"]}
        rows={VOCAB.map((row) => [row[0], row[1]])}
        rowTone={VOCAB.map(() => "warning" as const)}
      />

      <Divider />

      <H2>Фазы 0–9 — порядок работ</H2>
      <Text tone="secondary">
        Выполнять строго по номеру: фаза 1 разблокирует cross-links во всех последующих. После
        каждой фазы — npm run build и commit.
      </Text>

      <Stack gap={4}>
        {PHASES.map((phase) => (
          <CollapsibleSection
            title={`Фаза ${phase.order}. ${phase.title}`}
            count={phase.sections.length}
            defaultOpen={phase.order <= 1}
            leading={
              <Swatch
                color={
                  phase.priority === "P0"
                    ? "pink"
                    : phase.priority === "P1"
                      ? "orange"
                      : "blue"
                }
              />
            }
            trailing={
              <Row gap={6}>
                <Pill tone={PRIORITY_TONE[phase.priority]} size="sm">
                  {phase.priority}
                </Pill>
                <Text size="small" tone="tertiary">
                  {STATUS_LABEL[phase.status]}
                </Text>
              </Row>
            }
          >
            <Stack gap={10} style={{ paddingTop: 8, paddingLeft: 4 }}>
              <Text>{phase.goal}</Text>
              {phase.gaps && phase.gaps.length > 0 ? (
                <Callout tone="warning" title="Найденные gaps">
                  {phase.gaps.join(" · ")}
                </Callout>
              ) : null}
              <Row gap={8} wrap>
                {phase.canon.map((c, i) => (
                  <Pill tone="neutral" size="sm">
                    {c}
                  </Pill>
                ))}
              </Row>
              <Table
                striped
                stickyHeader
                headers={["Путь", "Действие", "Drift"]}
                rows={phase.sections.map((s) => [
                  s.path,
                  s.action,
                  s.drift ?? "—",
                ])}
                rowTone={phase.sections.map((s) => (s.drift ? "danger" : "neutral"))}
              />
              <Callout tone="info" title="Критерий выхода">
                {phase.exit}
              </Callout>
            </Stack>
          </CollapsibleSection>
        ))}
      </Stack>

      <Divider />

      <H2>Матрица plan gate (из DATAGENT_MONETIZATION §4)</H2>
      <Text tone="secondary" size="small">
        Использовать при правке integrations/*, concepts/*, cloud/*. Не выдумывать gate — только эта таблица.
      </Text>
      <Table
        striped
        headers={["Возможность", "Минимальный план"]}
        rows={[
          ["Artifacts, Office Chat agent broker, export/import", "Solo"],
          ["6 PRO skills (allowlist)", "Solo"],
          ["14 PRO skills, plan decompose, doc annotations", "Studio"],
          ["Bitrix24, BrowserBridge, budget policies, sandbox BYOC", "Studio"],
          ["1С connector, RBAC, custom skills import", "Business"],
          ["Self-hosted, SLA 99.9%, Enterprise", "Enterprise / on-premise"],
          ["Telegram connector", "Free+ (as-built, opt-in)"],
          ["GigaChat / YandexGPT adapters", "Все планы (BYO keys)"],
        ]}
      />

      <H3>Очередь задач (сквозная)</H3>
      <TodoListCard todos={todos} defaultExpanded />
    </Stack>
  );
}
