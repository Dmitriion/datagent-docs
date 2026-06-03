/**
 * Seeds Board demo state for guide screenshots (local_trusted API).
 */
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

  let issueActive = null;
  let issueWaiting = null;

  const activePayload = {
    title: 'Сводка по клиенту «Север» — май',
    description: 'Демо-задача для учебника: длинный диалог и журнал run.',
    status: 'in_progress',
    priority: 'high',
    assigneeAgentId: analyst?.id ?? null,
  };
  const activeRes = await request.post(url(`/api/companies/${companyId}/issues`), {
    data: activePayload,
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

  const issuesRes = await request.get(url(`/api/companies/${companyId}/issues`));
  const issues = issuesRes.ok() ? await issuesRes.json() : [];
  if (!issueActive) issueActive = issues.find((i) => i.status === 'in_progress') ?? issues[0];
  if (!issueWaiting) issueWaiting = issues.find((i) => i.identifier !== issueActive?.identifier) ?? issues[1];

  let approvalPending = null;
  let approvalResolved = null;

  if (issueActive?.id) {
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
  }

  const approvalsRes = await request.get(url(`/api/companies/${companyId}/approvals`));
  const approvals = approvalsRes.ok() ? await approvalsRes.json() : [];
  if (!approvalPending) approvalPending = approvals.find((a) => a.status === 'pending');
  if (!approvalResolved) approvalResolved = approvals.find((a) => a.status === 'approved');

  return {
    log,
    agents: { analyst, pendingHire, all: agents },
    issues: { active: issueActive, waiting: issueWaiting, all: issues },
    approvals: { pending: approvalPending, resolved: approvalResolved, all: approvals },
  };
}
