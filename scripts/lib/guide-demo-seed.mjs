/**
 * Seeds Board demo state for guide screenshots (local_trusted API).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_PDF = path.join(__dirname, '..', 'fixtures', 'demo-plan.pdf');

const DEMO = {
  agentAnalyst: {
    name: 'Демо-аналитик',
    role: 'general',
    title: 'Аналитик переписки',
    adapterType: 'codex_local',
    instructionsBundle: {
      entryFile: 'AGENTS.md',
      files: {
        'AGENTS.md': '# Демо-аналитик\n\nОтвечай кратко списком. Без выдуманных цифр.\n',
      },
    },
    runtimeConfig: { heartbeat: { enabled: false } },
  },
  agentFormatterHire: {
    name: 'Демо-оформитель',
    role: 'general',
    title: 'Оформитель таблиц',
    adapterType: 'codex_local',
    instructionsBundle: {
      entryFile: 'AGENTS.md',
      files: {
        'AGENTS.md': '# Демо-оформитель\n\nРаботай только с таблицами.\n',
      },
    },
    runtimeConfig: { heartbeat: { enabled: false } },
  },
};

const THREAD_LINES = [
  'Оператор: нужна сводка по клиенту «Север» за май — только факты из вложения.',
  'Агент: Принял. Сначала перечислю темы из переписки, затем статусы.',
  'Оператор: Добавь колонку «Следующий шаг» и не больше 7 строк.',
  'Агент: 1) Запрос КП — ждём ответ склада. 2) Счёт №104 — оплачен. 3) Претензия — в работе.',
  'Оператор: Убери вступление, оставь таблицу.',
  'Агент: Готово. Ниже таблица из 5 строк без вводного абзаца.',
  'Оператор: Отметь строку 3 как «нужен звонок».',
  'Агент: Обновил строку 3: следующий шаг — звонок менеджеру в среду.',
  'Оператор: Сохрани версию для руководителя.',
  'Агент: Черновик зафиксирован в задаче. Могу сократить до 3 буллетов по запросу.',
  'Оператор: Да, сократи до трёх буллетов для письма.',
  'Агент: • КП — ждём склад • Счёт 104 — оплачен • Претензия — звонок в ср.',
];

async function uploadDemoAttachment(request, boardUrl, companyId, issueId) {
  if (!fs.existsSync(DEMO_PDF)) {
    return { ok: false, reason: 'fixture missing' };
  }
  const listRes = await request.get(`${boardUrl}/api/issues/${issueId}/attachments`);
  if (listRes.ok()) {
    const existing = await listRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return { ok: true, reused: true, attachment: existing[0] };
    }
  }
  const res = await request.post(`${boardUrl}/api/companies/${companyId}/issues/${issueId}/attachments`, {
    multipart: {
      file: {
        name: 'demo-plan.pdf',
        mimeType: 'application/pdf',
        buffer: fs.readFileSync(DEMO_PDF),
      },
    },
  });
  if (!res.ok()) {
    return { ok: false, reason: await res.text() };
  }
  return { ok: true, attachment: await res.json() };
}

export async function seedGuideDemo(request, boardUrl, companyId) {
  const log = [];
  const url = (path) => `${boardUrl}${path}`;

  const expRes = await request.patch(url('/api/instance/settings/experimental'), {
    data: {
      enableOffice: true,
      enableOfficeSimulation: true,
      enableOfficeChatAgents: true,
    },
  });
  log.push({ step: 'experimental', ok: expRes.ok(), status: expRes.status() });

  let analyst = null;
  let pendingHire = null;

  const createAgentRes = await request.post(url(`/api/companies/${companyId}/agents`), {
    data: DEMO.agentAnalyst,
  });
  if (createAgentRes.ok()) {
    analyst = await createAgentRes.json();
    log.push({ step: 'agent-analyst', id: analyst.id });
    await request.patch(url(`/api/agents/${analyst.id}`), { data: { status: 'running' } });
  } else {
    log.push({ step: 'agent-analyst', error: await createAgentRes.text() });
  }

  const hireRes = await request.post(url(`/api/companies/${companyId}/agent-hires`), {
    data: DEMO.agentFormatterHire,
  });
  if (hireRes.ok()) {
    const hire = await hireRes.json();
    pendingHire = hire.agent ?? hire;
    log.push({ step: 'agent-hire-pending', id: pendingHire?.id, approvalId: hire.approvalId });
  } else {
    log.push({ step: 'agent-hire-pending', error: await hireRes.text() });
  }

  const agentsRes = await request.get(url(`/api/companies/${companyId}/agents`));
  const agents = agentsRes.ok() ? await agentsRes.json() : [];
  if (!analyst && agents[0]) analyst = agents.find((a) => a.status === 'running') ?? agents[0];
  if (!pendingHire) pendingHire = agents.find((a) => a.status === 'pending_approval');

  const patchAgentStatus = async (agentId, status) => {
    const res = await request.patch(url(`/api/agents/${agentId}`), { data: { status } });
    return res.ok();
  };

  if (analyst?.id) {
    await patchAgentStatus(analyst.id, 'running');
    analyst.status = 'running';
  } else {
    const existingAnalyst = agents.find((a) => a.name === DEMO.agentAnalyst.name);
    if (existingAnalyst?.id) {
      await patchAgentStatus(existingAnalyst.id, 'running');
      existingAnalyst.status = 'running';
      analyst = existingAnalyst;
      log.push({ step: 'agent-analyst-running', id: analyst.id, reused: true });
    }
  }

  let pendingAgent = agents.find((a) => a.status === 'pending_approval');
  if (!pendingAgent) {
    const hireTarget = pendingHire
      ?? agents.find((a) => a.name.includes('оформитель') && a.status === 'idle')
      ?? agents.find((a) => a.status === 'idle' && a.id !== analyst?.id);
    if (hireTarget?.id) {
      await patchAgentStatus(hireTarget.id, 'pending_approval');
      pendingAgent = { ...hireTarget, status: 'pending_approval' };
      log.push({ step: 'agent-pending-approval', id: pendingAgent.id, patched: true });
    }
  }
  if (pendingAgent) pendingHire = pendingAgent;

  const issuesRes = await request.get(url(`/api/companies/${companyId}/issues`));
  let issues = issuesRes.ok() ? await issuesRes.json() : [];

  const findIssueByTitle = (title) => issues.find((i) => i.title === title);

  let issueActive = findIssueByTitle('Сводка по клиенту «Север» — май');
  let issueWaiting = findIssueByTitle('Ждёт ответа: уточнение по договору');

  if (!issueActive) {
    const activeRes = await request.post(url(`/api/companies/${companyId}/issues`), {
      data: {
        title: 'Сводка по клиенту «Север» — май',
        description: 'Демо-задача для учебника: длинный диалог и журнал run.',
        status: 'in_progress',
        priority: 'high',
        assigneeAgentId: analyst?.id ?? null,
      },
    });
    if (activeRes.ok()) {
      issueActive = await activeRes.json();
      log.push({ step: 'issue-active', id: issueActive.id, identifier: issueActive.identifier });
      for (let i = 0; i < THREAD_LINES.length; i++) {
        const isAgent = i % 2 === 1;
        await request.post(url(`/api/issues/${issueActive.id}/comments`), {
          data: {
            body: THREAD_LINES[i],
            authorType: isAgent ? 'agent' : 'user',
          },
        });
      }
    } else {
      log.push({ step: 'issue-active', error: await activeRes.text() });
    }
  } else {
    log.push({ step: 'issue-active', reused: true, id: issueActive.id, identifier: issueActive.identifier });
  }

  if (!issueWaiting) {
    const waitRes = await request.post(url(`/api/companies/${companyId}/issues`), {
      data: {
        title: 'Ждёт ответа: уточнение по договору',
        description: 'Вторая демо-задача — статус todo, без assignee.',
        status: 'todo',
        priority: 'medium',
      },
    });
    if (waitRes.ok()) {
      issueWaiting = await waitRes.json();
      log.push({ step: 'issue-waiting', id: issueWaiting.id, identifier: issueWaiting.identifier });
    }
  } else {
    log.push({ step: 'issue-waiting', reused: true, id: issueWaiting.id, identifier: issueWaiting.identifier });
  }

  const issuesRefresh = await request.get(url(`/api/companies/${companyId}/issues`));
  issues = issuesRefresh.ok() ? await issuesRefresh.json() : issues;
  if (!issueActive) issueActive = issues.find((i) => i.status === 'in_progress') ?? issues[0];
  if (!issueWaiting) issueWaiting = issues.find((i) => i.identifier !== issueActive?.identifier) ?? issues[1];

  let approvalPending = null;
  let approvalResolved = null;
  let approvalRejected = null;
  let agentError = null;

  if (issueActive?.id) {
    const attachResult = await uploadDemoAttachment(request, boardUrl, companyId, issueActive.id);
    log.push({ step: 'issue-attachment', ...attachResult });
    const pendRes = await request.post(url(`/api/companies/${companyId}/approvals`), {
      data: {
        type: 'request_board_approval',
        payload: {
          title: 'Изменение книги Excel — демо',
          summary: 'План: добавить столбец «Факт май» на листе Summary.',
          tool: 'datagent.excel-workbench:plan_workbook_changes',
        },
        issueIds: [issueActive.id],
        requestedByAgentId: analyst?.id ?? null,
      },
    });
    if (pendRes.ok()) {
      approvalPending = await pendRes.json();
      log.push({ step: 'approval-pending', id: approvalPending.id });
    }

    const resolvedRes = await request.post(url(`/api/companies/${companyId}/approvals`), {
      data: {
        type: 'request_board_approval',
        payload: {
          title: 'Проверка черновика ответа — демо',
          summary: 'Уже согласовано для скриншота resolved.',
        },
        issueIds: [issueActive.id],
      },
    });
    if (resolvedRes.ok()) {
      approvalResolved = await resolvedRes.json();
      const approveRes = await request.post(url(`/api/approvals/${approvalResolved.id}/approve`), {
        data: { decisionNote: 'Одобрено для учебника Datagent.' },
      });
      log.push({ step: 'approval-resolved', id: approvalResolved.id, approved: approveRes.ok() });
      if (approveRes.ok()) approvalResolved = await approveRes.json();
    }

    const rejectSeedRes = await request.post(url(`/api/companies/${companyId}/approvals`), {
      data: {
        type: 'request_board_approval',
        payload: {
          title: 'Черновик ответа — отклонён для демо',
          summary: 'Пример rejected approval в учебнике.',
        },
        issueIds: [issueActive.id],
      },
    });
    if (rejectSeedRes.ok()) {
      approvalRejected = await rejectSeedRes.json();
      const rejectRes = await request.post(url(`/api/approvals/${approvalRejected.id}/reject`), {
        data: { decisionNote: 'Нужен другой план — демо для учебника.' },
      });
      log.push({ step: 'approval-rejected', id: approvalRejected.id, rejected: rejectRes.ok() });
      if (rejectRes.ok()) approvalRejected = await rejectRes.json();
    }
  }

  if (analyst?.id) {
    const agentsRefresh = await request.get(url(`/api/companies/${companyId}/agents`));
    const agentsList = agentsRefresh.ok() ? await agentsRefresh.json() : agents;
    agentError = agentsList.find((a) => a.name === 'Демо-агент (ошибка)');
    if (!agentError) {
      const errAgentRes = await request.post(url(`/api/companies/${companyId}/agents`), {
        data: {
          name: 'Демо-агент (ошибка)',
          title: 'Пример failed run',
          adapterType: 'codex_local',
          instructionsBundle: {
            entryFile: 'AGENTS.md',
            files: { 'AGENTS.md': '# Demo error agent\n' },
          },
          runtimeConfig: { heartbeat: { enabled: false } },
        },
      });
      if (errAgentRes.ok()) {
        agentError = await errAgentRes.json();
        await request.patch(url(`/api/agents/${agentError.id}`), { data: { status: 'error' } });
        log.push({ step: 'agent-error', id: agentError.id });
      }
    } else {
      log.push({ step: 'agent-error', reused: true, id: agentError.id });
    }
  }

  const approvalsRes = await request.get(url(`/api/companies/${companyId}/approvals`));
  const approvals = approvalsRes.ok() ? await approvalsRes.json() : [];
  if (!approvalPending) approvalPending = approvals.find((a) => a.status === 'pending');
  if (!approvalResolved) approvalResolved = approvals.find((a) => a.status === 'approved');
  if (!approvalRejected) approvalRejected = approvals.find((a) => a.status === 'rejected');

  await request.post(url(`/api/companies/${companyId}/memory/ensure-defaults`)).catch(() => null);
  const memoryNotes = [
    'Клиентов в письмах называем по юрлицу; тон — деловой, без канцелярита.',
    'Сводки по продажам оформляем в Excel: лист Summary, столбцы План / Факт / Δ.',
    'Перед отправкой КП проверяем остатки на складе «Север».',
  ];
  for (const [index, text] of memoryNotes.entries()) {
    const capRes = await request.post(url(`/api/companies/${companyId}/memory/capture`), {
      data: {
        bindingKey: 'default',
        text,
        memoryType: 'user',
        idempotencyKey: `guide-demo-memory-${index}`,
      },
    });
    log.push({ step: 'memory-capture', index, ok: capRes.ok(), status: capRes.status() });
  }

  const catalogRes = await request.get(url('/api/skills/catalog'));
  const catalogSkills = catalogRes.ok() ? (await catalogRes.json()) : [];
  const skillIdsToInstall = [
    'datagent:bundled:datagent-operations:issue-triage',
    'datagent:bundled:datagent-operations:task-planning',
    'datagent:community:excel:xlsx',
  ];
  const installedSkills = [];
  for (const catalogSkillId of skillIdsToInstall) {
    const found = Array.isArray(catalogSkills)
      ? catalogSkills.find((s) => s.id === catalogSkillId)
      : null;
    if (!found) {
      log.push({ step: 'skill-install', catalogSkillId, skipped: true });
      continue;
    }
    const installRes = await request.post(url(`/api/companies/${companyId}/skills/install-catalog`), {
      data: { catalogSkillId, slug: found.slug ?? null, force: true },
    });
    if (installRes.ok()) {
      installedSkills.push(await installRes.json());
      log.push({ step: 'skill-install', catalogSkillId, ok: true });
    } else {
      log.push({ step: 'skill-install', catalogSkillId, ok: false, error: await installRes.text() });
    }
  }

  const demoWorkProducts = [
    {
      title: 'Сводка «Север» — май.xlsx',
      metadata: { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    },
    {
      title: 'Ответ клиенту — черновик.pdf',
      metadata: { contentType: 'application/pdf' },
    },
    {
      title: 'КП на партию B.csv',
      metadata: { contentType: 'text/csv' },
    },
  ];
  if (issueActive?.id) {
    for (const [index, product] of demoWorkProducts.entries()) {
      const wpRes = await request.post(url(`/api/issues/${issueActive.id}/work-products`), {
        data: {
          type: 'artifact',
          provider: 'datagent',
          title: product.title,
          metadata: product.metadata,
        },
      });
      log.push({
        step: 'artifact-work-product',
        title: product.title,
        ok: wpRes.ok(),
        status: wpRes.status(),
      });
    }
  }

  return {
    log,
    agents: { analyst, pendingHire, pending: pendingHire, error: agentError, all: agents },
    issues: { active: issueActive, waiting: issueWaiting, all: issues },
    approvals: { pending: approvalPending, resolved: approvalResolved, rejected: approvalRejected, all: approvals },
    skills: { installed: installedSkills },
  };
}
