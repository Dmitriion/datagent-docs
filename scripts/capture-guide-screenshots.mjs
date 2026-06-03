/**
 * Extended Board screenshot capture for docs/guides.
 *
 * Run from datagent-docs root:
 *   node scripts/capture-guide-screenshots.mjs
 *
 * Env:
 *   BOARD_URL          — default http://localhost:3100
 *   COMPANY_PREFIX     — e.g. CMP (auto-detect CMP/TES if unset)
 *   STORAGE_STATE_PATH — Playwright storageState (default %TEMP%/datagent-board-auth.json)
 *   SKIP_SEED=1        — skip API seed; reuse existing demo data
 *   ONLY_IDS=I07,P05   — capture only listed shot ids (comma-separated)
 *   SKIP_IDS=G01a,X03  — skip listed ids even when otherwise runnable
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { seedGuideDemo } from './lib/guide-demo-seed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const DATAGENT_ROOT = path.resolve(DOCS_ROOT, '..', 'Datagent');
const OUT_ROOT = path.join(DOCS_ROOT, 'static', 'img', 'guides');
const AUTH_STATE = process.env.STORAGE_STATE_PATH?.trim()
  || path.join(os.tmpdir(), 'datagent-board-auth.json');
const REPORT_PATH = path.join(DOCS_ROOT, 'scripts', 'capture-guide-screenshots-report.json');

const require = createRequire(path.join(DATAGENT_ROOT, 'package.json'));
const { chromium } = require('playwright');
const sharp = require('sharp');

const BOARD_URL = (process.env.BOARD_URL ?? 'http://localhost:3100').replace(/\/$/, '');
const VIEWPORT_MAIN = { width: 1440, height: 900 };
const VIEWPORT_NARROW = { width: 1280, height: 800 };
const VIEWPORT_MOBILE = { width: 390, height: 844 };
const WEBP_QUALITY = 90;
const ONLY_IDS = process.env.ONLY_IDS?.split(',').map((s) => s.trim()).filter(Boolean);
const SKIP_IDS = new Set(
  process.env.SKIP_IDS?.split(',').map((s) => s.trim()).filter(Boolean) ?? [],
);

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function saveWebp(buffer, outPath, quality = WEBP_QUALITY) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(buffer).webp({ quality }).toFile(outPath);
}

async function png(pageOrLocator, opts = {}) {
  if ('screenshot' in pageOrLocator && typeof pageOrLocator.screenshot === 'function') {
    const el = pageOrLocator;
    return el.screenshot({ type: 'png', ...opts });
  }
  return pageOrLocator.screenshot({ type: 'png', ...opts });
}

async function waitStable(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 25_000 }).catch(() => {});
  await page.locator('[data-slot="skeleton"]').first().waitFor({ state: 'hidden', timeout: 6_000 }).catch(() => {});
  await page.waitForTimeout(350);
}

async function hideCursor(page) {
  await page.mouse.move(0, 0);
}

async function setTheme(page, mode) {
  await page.evaluate((theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* cross-origin or pre-navigation */
    }
  }, mode);
}

async function maskPii(page) {
  await page.addStyleTag({
    content: `
      [data-user-email], .user-email { filter: blur(8px) !important; }
      input[type="email"] { filter: blur(8px) !important; }
    `,
  });
}

function companyUrl(prefix, route = '') {
  const p = route.startsWith('/') ? route : `/${route}`;
  return `${BOARD_URL}/${prefix}${p}`;
}

async function resolvePrefix() {
  if (process.env.COMPANY_PREFIX?.trim()) {
    return process.env.COMPANY_PREFIX.trim().toUpperCase();
  }
  const companies = await fetchJson(`${BOARD_URL}/api/companies`);
  const list = Array.isArray(companies) ? companies : [companies];
  const preferred = list.find((c) => c.issuePrefix?.toUpperCase() === 'TES')
    ?? list.find((c) => c.issuePrefix?.toUpperCase() === 'CMP')
    ?? list[0];
  const prefix = preferred?.issuePrefix?.toUpperCase();
  if (!prefix) throw new Error('No company on Board');
  return { prefix, companyId: preferred.id, name: preferred.name };
}

async function authenticate(page, prefix, saveState = false) {
  await page.goto(companyUrl(prefix, '/dashboard'), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  if (page.url().includes('/onboarding')) {
    return { onboarding: true };
  }
  if (page.url().includes('/auth')) {
    throw new Error('Auth form shown — set storageState or use local_trusted');
  }
  await page.waitForTimeout(400);
  if (saveState) {
    await page.context().storageState({ path: AUTH_STATE });
  }
  return { onboarding: false };
}

async function gotoCompany(page, prefix, route) {
  await page.goto(companyUrl(prefix, route), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await waitStable(page);
  await hideCursor(page);
  await maskPii(page);
}

async function captureMain(page, relPath, { fullPage = false, locator = null, clip = undefined } = {}) {
  const out = path.join(OUT_ROOT, relPath);
  let buf;
  if (locator) {
    await locator.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    buf = await png(locator);
  } else {
    const shotOpts = { fullPage };
    if (clip) shotOpts.clip = clip;
    buf = await png(page, shotOpts);
  }
  await saveWebp(buf, out);
  return relPath;
}

/** @type {import('./lib/guide-screenshot-types.mjs').ShotResult[]} */
const results = [];

function record(entry) {
  results.push(entry);
  const mark = entry.status === 'OK' ? 'OK' : entry.status;
  console.log(mark, entry.id, entry.file ?? '', entry.reason ?? '');
}

function shouldRun(id) {
  if (SKIP_IDS.has(id)) return false;
  return !ONLY_IDS?.length || ONLY_IDS.includes(id);
}

async function runShot(ctx, spec) {
  if (!shouldRun(spec.id)) return;
  const { page, prefix, demo } = ctx;
  try {
    if (spec.skip?.(demo, ctx)) {
      record({ ...spec, status: 'SKIP', reason: spec.skipReason ?? 'skip' });
      return;
    }
    if (spec.setup) await spec.setup(page, ctx);
    const file = await spec.capture(page, ctx);
    record({ ...spec, file, status: 'OK', type: spec.type ?? 'B' });
  } catch (err) {
    record({ ...spec, status: 'FAIL', reason: String(err) });
  } finally {
    if (spec.teardown) {
      try {
        await spec.teardown(page, ctx);
      } catch (teardownErr) {
        console.warn('teardown', spec.id, teardownErr);
      }
    }
  }
}

function issueRoute(demo) {
  const ref = demo.issues.active?.identifier ?? demo.issues.active?.id;
  return ref ? `/issues/${ref}` : '/issues';
}

function agentRoute(demo) {
  const id = demo.agents.analyst?.id ?? demo.agents.all?.[0]?.id;
  return id ? `/agents/${id}` : '/agents/all';
}

const SHOTS = [
  // --- G00 board ---
  {
    id: 'G00',
    file: 'board/00-company-picker.webp',
    chapter: 'index',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/companies');
      if (!page.url().includes('/companies')) {
        await page.goto(`${BOARD_URL}/companies`, { waitUntil: 'domcontentloaded' });
        await waitStable(page);
      }
      return captureMain(page, 'board/00-company-picker.webp', { fullPage: true });
    },
  },
  {
    id: 'G01a',
    file: 'board/01-onboarding-step.webp',
    chapter: 'index',
    type: 'A',
    skip: () => true,
    skipReason: 'onboarding already completed on instance',
    capture: async () => '',
  },
  {
    id: 'G02',
    file: 'board/02-nav-overview-full.webp',
    chapter: '01-first-day',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/dashboard');
      return captureMain(page, 'board/02-nav-overview-full.webp', { fullPage: true });
    },
  },
  {
    id: 'G02-dark',
    file: 'board/02-nav-overview-full-dark.webp',
    chapter: '01-first-day',
    type: 'A',
    theme: 'dark',
    capture: async (page, ctx) => {
      await setTheme(page, 'dark');
      await gotoCompany(page, ctx.prefix, '/dashboard');
      return captureMain(page, 'board/02-nav-overview-full-dark.webp', { fullPage: true });
    },
  },
  {
    id: 'G02-narrow',
    file: 'board/02-nav-overview-focus.webp',
    chapter: '01-first-day',
    type: 'B',
    viewport: 'narrow',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/issues');
      const aside = page.locator('aside').first();
      return captureMain(page, 'board/02-nav-overview-focus.webp', { locator: aside });
    },
  },
  {
    id: 'G03',
    file: 'board/03-breadcrumbs.webp',
    chapter: '01-first-day',
    type: 'C',
    capture: async (page, { prefix, demo }) => {
      await gotoCompany(page, prefix, issueRoute(demo));
      const bar = page.locator('nav[aria-label="breadcrumb"], [data-slot="breadcrumb"]').first();
      if (await bar.isVisible().catch(() => false)) {
        return captureMain(page, 'board/03-breadcrumbs.webp', { locator: bar });
      }
      return captureMain(page, 'board/03-breadcrumbs.webp');
    },
  },
  // --- Agents ---
  {
    id: 'A01-full',
    file: 'agents/01-list-full.webp',
    chapter: '02-your-team',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/agents/all');
      return captureMain(page, 'agents/01-list-full.webp', { fullPage: true });
    },
  },
  {
    id: 'A01-focus',
    file: 'agents/01-list-focus.webp',
    chapter: '02-your-team',
    type: 'B',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/agents/all');
      const main = page.locator('main').first();
      return captureMain(page, 'agents/01-list-focus.webp', { locator: main });
    },
  },
  {
    id: 'A02',
    file: 'agents/02-filters.webp',
    chapter: '02-your-team',
    type: 'C',
    skip: () => true,
    skipReason: 'agents list has no dedicated search field in current UI',
    capture: async () => '',
  },
  {
    id: 'A03',
    file: 'agents/03-card-overview.webp',
    chapter: '02-your-team',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, agentRoute(ctx.demo));
      const main = page.locator('main').first();
      return captureMain(page, 'agents/03-card-overview.webp', { locator: main });
    },
  },
  {
    id: 'A04',
    file: 'agents/04-system-prompt.webp',
    chapter: '02-your-team',
    type: 'C',
    capture: async (page, ctx) => {
      const id = ctx.demo.agents.analyst?.id ?? ctx.demo.agents.all?.[0]?.id;
      await gotoCompany(page, ctx.prefix, `/agents/${id}/instructions`);
      const editor = page.locator('textarea, [contenteditable="true"]').first();
      const target = (await editor.isVisible().catch(() => false)) ? editor : page.locator('main').first();
      return captureMain(page, 'agents/04-system-prompt.webp', { locator: target });
    },
  },
  {
    id: 'A05',
    file: 'agents/05-tools-list.webp',
    chapter: '02-your-team',
    type: 'C',
    capture: async (page, ctx) => {
      const id = ctx.demo.agents.analyst?.id ?? ctx.demo.agents.all?.[0]?.id;
      await gotoCompany(page, ctx.prefix, `/agents/${id}/configuration`);
      return captureMain(page, 'agents/05-tools-list.webp', { fullPage: false });
    },
  },
  {
    id: 'A06',
    file: 'agents/06-wakeup-button.webp',
    chapter: '02-your-team',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, agentRoute(ctx.demo));
      const btn = page.getByRole('button', { name: /Запустить heartbeat|Run heartbeat/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.hover();
        await page.waitForTimeout(200);
        return captureMain(page, 'agents/06-wakeup-button.webp', { locator: btn });
      }
      return captureMain(page, 'agents/06-wakeup-button.webp');
    },
  },
  {
    id: 'A07',
    file: 'agents/07-runs-log.webp',
    chapter: '02-your-team',
    type: 'B',
    capture: async (page, ctx) => {
      const id = ctx.demo.agents.analyst?.id ?? ctx.demo.agents.all?.[0]?.id;
      await gotoCompany(page, ctx.prefix, `/agents/${id}/runs`);
      return captureMain(page, 'agents/07-runs-log.webp');
    },
  },
  {
    id: 'A08',
    file: 'agents/08-run-error.webp',
    chapter: '02-your-team',
    type: 'C',
    skip: (demo) => !demo.agents.error?.id,
    skipReason: 'error demo agent not seeded',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, '/agents/error');
      const row = page.getByRole('link', { name: /Демо-агент \(ошибка\)|failed run/i }).first();
      if (await row.isVisible().catch(() => false)) {
        return captureMain(page, 'agents/08-run-error.webp', { locator: row });
      }
      const main = page.locator('main').first();
      return captureMain(page, 'agents/08-run-error.webp', { locator: main });
    },
  },
  {
    id: 'A09',
    file: 'agents/09-edit-form.webp',
    chapter: '02-your-team',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/agents/new');
      return captureMain(page, 'agents/09-edit-form.webp');
    },
  },
  {
    id: 'A10',
    file: 'agents/10-list-mobile.webp',
    chapter: '02-your-team',
    type: 'B',
    viewport: 'mobile',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/agents/all');
      return captureMain(page, 'agents/10-list-mobile.webp');
    },
  },
  // --- Issues ---
  {
    id: 'I01',
    file: 'issues/01-list-full.webp',
    chapter: '03-one-task',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/issues');
      return captureMain(page, 'issues/01-list-full.webp', { fullPage: true });
    },
  },
  {
    id: 'I02',
    file: 'issues/02-create.webp',
    chapter: '03-one-task',
    type: 'C',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/issues');
      const create = page.getByRole('button', { name: /Создать задачу|Новая задача/i }).first();
      if (await create.isVisible().catch(() => false)) {
        await create.click();
        await page.waitForTimeout(600);
      }
      return captureMain(page, 'issues/02-create.webp');
    },
  },
  {
    id: 'I03',
    file: 'issues/03-issue-header.webp',
    chapter: '03-one-task',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      const header = page.locator('main header, main h1').first();
      return captureMain(page, 'issues/03-issue-header.webp', {
        locator: (await header.isVisible().catch(() => false)) ? header : page.locator('main').first(),
      });
    },
  },
  {
    id: 'I04',
    file: 'issues/04-thread-middle.webp',
    chapter: '03-one-task',
    type: 'B',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      const thread = page.locator('[data-testid="issue-chat-thread"], .issue-chat, main').first();
      await thread.evaluate((el) => { el.scrollTop = Math.floor(el.scrollHeight / 3); }).catch(() => {});
      await page.waitForTimeout(300);
      return captureMain(page, 'issues/04-thread-middle.webp', { locator: page.locator('main').first() });
    },
  },
  {
    id: 'I05',
    file: 'issues/05-compose.webp',
    chapter: '03-one-task',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      const compose = page.locator('textarea').last();
      return captureMain(page, 'issues/05-compose.webp', {
        locator: (await compose.isVisible().catch(() => false)) ? compose : page.locator('main').first(),
      });
    },
  },
  {
    id: 'I06',
    file: 'issues/06-wakeup-from-issue.webp',
    chapter: '03-one-task',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      const btn = page.getByRole('button', { name: /Запустить|Wakeup|heartbeat|Продолжить/i }).first();
      if (await btn.isVisible().catch(() => false)) {
        return captureMain(page, 'issues/06-wakeup-from-issue.webp', { locator: btn });
      }
      return captureMain(page, 'issues/06-wakeup-from-issue.webp');
    },
  },
  {
    id: 'I07',
    file: 'issues/07-attachments.webp',
    chapter: '07-documents',
    type: 'C',
    skip: (demo) => !demo.issues.active?.id,
    skipReason: 'no active demo issue',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      const section = page.locator('h3').filter({ hasText: /вложен|attachment/i }).first();
      const block = section.locator('xpath=ancestor::div[contains(@class,"border")]').first();
      if (await block.isVisible().catch(() => false)) {
        return captureMain(page, 'issues/07-attachments.webp', { locator: block });
      }
      const link = page.getByRole('link', { name: /demo-plan\.pdf|\.pdf/i }).first();
      if (await link.isVisible().catch(() => false)) {
        return captureMain(page, 'issues/07-attachments.webp', { locator: link.locator('xpath=ancestor::div[1]') });
      }
      return captureMain(page, 'issues/07-attachments.webp');
    },
  },
  {
    id: 'I08',
    file: 'issues/08-office-plugin.webp',
    chapter: '07-documents',
    type: 'C',
    skip: () => true,
    skipReason: 'office plugin UI not visible without attachment/work product',
    capture: async () => '',
  },
  {
    id: 'I09',
    file: 'issues/09-channel-inbound.webp',
    chapter: '06-channels',
    type: 'C',
    skip: () => true,
    skipReason: 'no Bitrix/Telegram inbound badge on demo issue',
    capture: async () => '',
  },
  {
    id: 'I10',
    file: 'issues/10-thread-mobile.webp',
    chapter: '03-one-task',
    type: 'B',
    viewport: 'mobile',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, issueRoute(ctx.demo));
      return captureMain(page, 'issues/10-thread-mobile.webp');
    },
  },
  // --- Approvals ---
  {
    id: 'P01',
    file: 'approvals/01-inbox.webp',
    chapter: '04-trust-and-approval',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/approvals/pending');
      return captureMain(page, 'approvals/01-inbox.webp', { fullPage: true });
    },
  },
  {
    id: 'P02',
    file: 'approvals/02-detail.webp',
    chapter: '04-trust-and-approval',
    type: 'B',
    capture: async (page, ctx) => {
      const id = ctx.demo.approvals.pending?.id;
      if (!id) throw new Error('no pending approval');
      await gotoCompany(page, ctx.prefix, `/approvals/${id}`);
      return captureMain(page, 'approvals/02-detail.webp');
    },
  },
  {
    id: 'P03',
    file: 'approvals/03-actions.webp',
    chapter: '04-trust-and-approval',
    type: 'C',
    capture: async (page, ctx) => {
      const id = ctx.demo.approvals.pending?.id;
      if (!id) throw new Error('no pending approval');
      await gotoCompany(page, ctx.prefix, `/approvals/${id}`);
      const footer = page.locator('footer, [data-slot="card-footer"]').last();
      if (await footer.isVisible().catch(() => false)) {
        return captureMain(page, 'approvals/03-actions.webp', { locator: footer });
      }
      return captureMain(page, 'approvals/03-actions.webp');
    },
  },
  {
    id: 'P04',
    file: 'approvals/04-approved.webp',
    chapter: '04-trust-and-approval',
    type: 'B',
    capture: async (page, ctx) => {
      const id = ctx.demo.approvals.resolved?.id;
      if (!id) throw new Error('no resolved approval');
      await gotoCompany(page, ctx.prefix, `/approvals/${id}`);
      return captureMain(page, 'approvals/04-approved.webp');
    },
  },
  {
    id: 'P05',
    file: 'approvals/05-rejected.webp',
    chapter: '04-trust-and-approval',
    type: 'B',
    skip: (demo) => !demo.approvals.rejected?.id,
    skipReason: 'rejected approval not seeded',
    capture: async (page, ctx) => {
      const id = ctx.demo.approvals.rejected.id;
      await gotoCompany(page, ctx.prefix, `/approvals/${id}`);
      return captureMain(page, 'approvals/05-rejected.webp');
    },
  },
  {
    id: 'P06',
    file: 'approvals/06-linked-issue.webp',
    chapter: '04-trust-and-approval',
    type: 'C',
    capture: async (page, ctx) => {
      const id = ctx.demo.approvals.pending?.id;
      if (!id) throw new Error('no pending approval');
      await gotoCompany(page, ctx.prefix, `/approvals/${id}`);
      const link = page.getByRole('link', { name: /CMP-|TES-|задач|issue/i }).first();
      if (await link.isVisible().catch(() => false)) {
        return captureMain(page, 'approvals/06-linked-issue.webp', { locator: link });
      }
      return captureMain(page, 'approvals/06-linked-issue.webp');
    },
  },
  {
    id: 'P01-mobile',
    file: 'approvals/01-inbox-mobile.webp',
    chapter: '04-trust-and-approval',
    type: 'B',
    viewport: 'mobile',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/approvals/pending');
      return captureMain(page, 'approvals/01-inbox-mobile.webp');
    },
  },
  // --- Office ---
  {
    id: 'O01',
    file: 'office/01-virtual-office-full.webp',
    chapter: '05-office-field',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      await page.locator('[data-testid="office-viewport"], .office-page').first()
        .waitFor({ state: 'visible', timeout: 20_000 }).catch(() => {});
      return captureMain(page, 'office/01-virtual-office-full.webp', { fullPage: true });
    },
  },
  {
    id: 'O01-dark',
    file: 'office/01-virtual-office-full-dark.webp',
    chapter: '05-office-field',
    type: 'A',
    theme: 'dark',
    capture: async (page, ctx) => {
      await setTheme(page, 'dark');
      await gotoCompany(page, ctx.prefix, '/office');
      return captureMain(page, 'office/01-virtual-office-full-dark.webp', { fullPage: true });
    },
  },
  {
    id: 'O02',
    file: 'office/02-agent-running.webp',
    chapter: '05-office-field',
    type: 'C',
    capture: async (page, ctx) => {
      await gotoCompany(page, ctx.prefix, '/office');
      await page.waitForTimeout(800);
      const running = page.locator('[data-agent-status="running"]').first();
      if (await running.isVisible().catch(() => false)) {
        return captureMain(page, 'office/02-agent-running.webp', { locator: running });
      }
      return captureMain(page, 'office/02-agent-running.webp');
    },
  },
  {
    id: 'O03',
    file: 'office/03-agent-awaiting-approval.webp',
    chapter: '05-office-field',
    type: 'C',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      await page.waitForTimeout(800);
      const pending = page.locator('[data-agent-status="pending_approval"]').first();
      if (await pending.isVisible().catch(() => false)) {
        return captureMain(page, 'office/03-agent-awaiting-approval.webp', { locator: pending });
      }
      return captureMain(page, 'office/03-agent-awaiting-approval.webp');
    },
  },
  {
    id: 'O04',
    file: 'office/04-legend.webp',
    chapter: 'office/overview',
    type: 'C',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      const toolbar = page.locator('[data-testid="office-kpi-bar"], [data-testid="office-connection-status"]').first();
      if (await toolbar.isVisible().catch(() => false)) {
        return captureMain(page, 'office/04-legend.webp', { locator: page.locator('.office-toolbar, header').first() });
      }
      return captureMain(page, 'office/04-legend.webp');
    },
  },
  {
    id: 'O05',
    file: 'office/05-agent-sidepanel.webp',
    chapter: 'office/overview',
    type: 'C',
    setup: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      const desk = page.locator('.agent-desk-hit, .agent-desk-root').first();
      if (await desk.isVisible().catch(() => false)) await desk.click({ timeout: 5000 });
      await page.waitForTimeout(500);
    },
    capture: async (page) => captureMain(page, 'office/05-agent-sidepanel.webp'),
  },
  {
    id: 'O06',
    file: 'office/06-office-chat-full.webp',
    chapter: '05-office-field',
    type: 'B',
    setup: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      const tab = page.locator('[data-testid="office-edge-tab-chat"]');
      if (await tab.isVisible().catch(() => false)) await tab.click();
      await page.waitForTimeout(600);
    },
    capture: async (page) => {
      const panel = page.locator('[data-testid="office-chat-panel"]');
      await panel.waitFor({ state: 'visible', timeout: 12_000 }).catch(() => {});
      if (await panel.isVisible().catch(() => false)) {
        return captureMain(page, 'office/06-office-chat-full.webp', { locator: panel });
      }
      return captureMain(page, 'office/06-office-chat-full.webp');
    },
  },
  {
    id: 'O07',
    file: 'office/07-office-chat-compose.webp',
    chapter: '05-office-field',
    type: 'C',
    setup: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      await page.locator('[data-testid="office-edge-tab-chat"]').click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(500);
    },
    capture: async (page) => {
      const composer = page.locator('[data-testid="office-chat-composer"]');
      await composer.waitFor({ state: 'visible', timeout: 12_000 }).catch(() => {});
      if (await composer.isVisible().catch(() => false)) {
        return captureMain(page, 'office/07-office-chat-compose.webp', { locator: composer });
      }
      return captureMain(page, 'office/07-office-chat-compose.webp');
    },
  },
  {
    id: 'O08',
    file: 'office/08-office-chat-system.webp',
    chapter: '05-office-field',
    type: 'C',
    skip: () => true,
    skipReason: 'no seeded system message in office chat',
    capture: async () => '',
  },
  {
    id: 'O09',
    file: 'office/09-drilldown-link.webp',
    chapter: 'office/overview',
    type: 'C',
    setup: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/office');
      await page.locator('[data-testid="office-edge-tab-agents"]').click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(400);
    },
    capture: async (page) => captureMain(page, 'office/09-drilldown-link.webp'),
  },
  {
    id: 'O10',
    file: 'office/10-disabled-state.webp',
    chapter: 'office/overview',
    type: 'A',
    capture: async (page) => {
      await page.goto(`${BOARD_URL}/instance/settings/experimental`, {
        waitUntil: 'domcontentloaded',
        timeout: 45_000,
      });
      await waitStable(page);
      await hideCursor(page);
      const block = page.locator('h2').filter({ hasText: /офис|office/i }).first();
      const section = block.locator('xpath=ancestor::div[contains(@class,"border") or contains(@class,"rounded")]').first();
      if (await section.isVisible().catch(() => false)) {
        return captureMain(page, 'office/10-disabled-state.webp', { locator: section });
      }
      return captureMain(page, 'office/10-disabled-state.webp');
    },
  },
  // --- Misc ---
  {
    id: 'X01',
    file: 'board/04-search.webp',
    chapter: 'index',
    type: 'B',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/search');
      return captureMain(page, 'board/04-search.webp');
    },
  },
  {
    id: 'X02',
    file: 'board/05-settings.webp',
    chapter: '08-1c-bridge',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/settings?tab=plugins');
      return captureMain(page, 'board/05-settings.webp', { fullPage: true });
    },
  },
  {
    id: 'X03',
    file: 'board/06-toast.webp',
    chapter: 'index',
    type: 'C',
    skip: () => true,
    skipReason: 'toast timing flaky',
    capture: async () => '',
  },
  {
    id: 'X04',
    file: 'board/07-empty-states.webp',
    chapter: 'index',
    type: 'B',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/agents/paused');
      await page.waitForTimeout(300);
      const empty = page.locator('[data-slot="empty-state"], .empty-state').first();
      if (await empty.isVisible().catch(() => false)) {
        return captureMain(page, 'board/07-empty-states.webp', { locator: empty });
      }
      const main = page.locator('main').first();
      return captureMain(page, 'board/07-empty-states.webp', { locator: main });
    },
  },
  {
    id: 'B10',
    file: '1c/connector-page.webp',
    chapter: '08-1c-bridge',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/plugins/1c-connector');
      return captureMain(page, '1c/connector-page.webp', { fullPage: true });
    },
  },
  {
    id: 'B8',
    file: 'channels/issues-inbox.webp',
    chapter: '06-channels',
    type: 'A',
    capture: async (page, { prefix }) => {
      await gotoCompany(page, prefix, '/inbox/mine');
      return captureMain(page, 'channels/issues-inbox.webp', { fullPage: true });
    },
  },
];

async function captureStories(ctx) {
  const { page, prefix, demo } = ctx;
  const storySteps = [
    { id: 'S1-01', file: 'stories/01-first-day-01-dashboard.webp', route: '/dashboard' },
    { id: 'S1-02', file: 'stories/01-first-day-02-approvals.webp', route: '/approvals/pending' },
    { id: 'S1-03', file: 'stories/01-first-day-03-issues.webp', route: '/issues' },
    { id: 'S1-04', file: 'stories/01-first-day-04-issue.webp', route: issueRoute(demo) },
    { id: 'S1-05', file: 'stories/01-first-day-05-wakeup.webp', route: issueRoute(demo) },
    { id: 'S2-01', file: 'stories/02-manager-run-01-agents.webp', route: '/agents/all' },
    { id: 'S2-02', file: 'stories/02-manager-run-02-card.webp', route: agentRoute(demo) },
    { id: 'S2-03', file: 'stories/02-manager-run-03-wakeup.webp', route: agentRoute(demo) },
    { id: 'S2-04', file: 'stories/02-manager-run-04-runs.webp', route: `${agentRoute(demo)}/runs` },
    { id: 'S3-01', file: 'stories/03-approval-flow-01-issue.webp', route: issueRoute(demo) },
    { id: 'S3-02', file: 'stories/03-approval-flow-02-inbox.webp', route: '/approvals/pending' },
    { id: 'S3-03', file: 'stories/03-approval-flow-03-detail.webp', route: `/approvals/${demo.approvals.pending?.id ?? ''}` },
    { id: 'S3-04', file: 'stories/03-approval-flow-04-approved.webp', route: `/approvals/${demo.approvals.resolved?.id ?? ''}` },
    { id: 'S3-05', file: 'stories/03-approval-flow-05-issue.webp', route: issueRoute(demo) },
    { id: 'S4-01', file: 'stories/04-channel-issue-01-inbox.webp', route: '/inbox/mine' },
    { id: 'S4-02', file: 'stories/04-channel-issue-02-list.webp', route: '/issues' },
    { id: 'S4-03', file: 'stories/04-channel-issue-03-thread.webp', route: issueRoute(demo) },
    { id: 'S4-04', file: 'stories/04-channel-issue-04-status.webp', route: issueRoute(demo) },
    { id: 'S5-01', file: 'stories/05-office-supervisor-01-floor.webp', route: '/office' },
    { id: 'S5-02', file: 'stories/05-office-supervisor-02-pending.webp', route: '/office' },
    { id: 'S5-03', file: 'stories/05-office-supervisor-03-chat.webp', route: '/office', setup: async (p) => {
      await p.locator('[data-testid="office-edge-tab-chat"]').click().catch(() => {});
    } },
    { id: 'S5-04', file: 'stories/05-office-supervisor-04-agents-tab.webp', route: '/office', setup: async (p) => {
      await p.locator('[data-testid="office-edge-tab-agents"]').click().catch(() => {});
    } },
    { id: 'S5-05', file: 'stories/05-office-supervisor-05-approval.webp', route: `/approvals/${demo.approvals.pending?.id ?? ''}` },
    { id: 'S6-01', file: 'stories/06-excel-office-01-issue.webp', route: issueRoute(demo) },
    { id: 'S6-02', file: 'stories/06-excel-office-02-approval.webp', route: `/approvals/${demo.approvals.pending?.id ?? ''}` },
    { id: 'S6-03', file: 'stories/06-excel-office-03-inbox.webp', route: '/approvals/pending' },
    { id: 'S6-04', file: 'stories/06-excel-office-04-plugins.webp', route: '/settings?tab=plugins' },
  ];

  for (const step of storySteps) {
    if (!shouldRun(step.id)) continue;
    try {
      if (!step.route || step.route.includes('undefined')) {
        record({ id: step.id, file: step.file, chapter: 'stories', status: 'SKIP', reason: 'missing route data' });
        continue;
      }
      await gotoCompany(page, prefix, step.route);
      if (step.setup) await step.setup(page);
      await captureMain(page, step.file);
      record({ id: step.id, file: step.file, chapter: 'stories', type: 'A', status: 'OK' });
    } catch (err) {
      record({ id: step.id, file: step.file, chapter: 'stories', status: 'FAIL', reason: String(err) });
    }
  }
}

async function main() {
  const health = await fetchJson(`${BOARD_URL}/api/health`);
  console.log('Board:', health.status, health.deploymentMode);

  const { prefix, companyId, name } = await resolvePrefix();
  console.log('Company:', prefix, name, companyId);

  const browser = await chromium.launch({ headless: true });

  const authContext = await browser.newContext({
    viewport: VIEWPORT_MAIN,
    locale: 'ru-RU',
    colorScheme: 'light',
    storageState: fs.existsSync(AUTH_STATE) ? AUTH_STATE : undefined,
  });
  const authPage = await authContext.newPage();
  const authInfo = await authenticate(authPage, prefix, true);
  await setTheme(authPage, 'light');
  if (authInfo.onboarding) {
    console.warn('Onboarding active — complete manually once; storageState saved after.');
  }
  await authContext.close();

  const desktop = await browser.newContext({
    viewport: VIEWPORT_MAIN,
    locale: 'ru-RU',
    colorScheme: 'light',
    storageState: AUTH_STATE,
  });
  const page = await desktop.newPage();
  await authenticate(page, prefix);
  await setTheme(page, 'light');

  let demo = { agents: {}, issues: {}, approvals: {}, log: [] };
  if (process.env.SKIP_SEED !== '1') {
    demo = await seedGuideDemo(page.request, BOARD_URL, companyId);
    console.log('Seed log:', JSON.stringify(demo.log, null, 2));
  } else {
    const agents = await fetchJson(`${BOARD_URL}/api/companies/${companyId}/agents`);
    const issues = await fetchJson(`${BOARD_URL}/api/companies/${companyId}/issues`);
    const approvals = await fetchJson(`${BOARD_URL}/api/companies/${companyId}/approvals`);
    demo = {
      agents: {
        analyst: agents.find((a) => a.status === 'running') ?? agents[0],
        error: agents.find((a) => a.status === 'error' || a.name?.includes('ошибка')),
        all: agents,
      },
      issues: { active: issues[0], waiting: issues[1], all: issues },
      approvals: {
        pending: approvals.find((a) => a.status === 'pending'),
        resolved: approvals.find((a) => a.status === 'approved'),
        rejected: approvals.find((a) => a.status === 'rejected'),
        all: approvals,
      },
      log: [],
    };
  }

  const ctx = { page, prefix, companyId, demo, browser };

  for (const spec of SHOTS) {
    if (spec.theme === 'dark') continue;
    if (spec.viewport === 'mobile') continue;
    if (spec.viewport === 'narrow') continue;
    await runShot(ctx, spec);
  }

  const narrowPage = await (await browser.newContext({
    viewport: VIEWPORT_NARROW,
    locale: 'ru-RU',
    storageState: AUTH_STATE,
  })).newPage();
  await setTheme(narrowPage, 'light');
  for (const spec of SHOTS.filter((s) => s.viewport === 'narrow')) {
    await runShot({ ...ctx, page: narrowPage }, spec);
  }
  await narrowPage.context().close();

  const mobileCtx = await browser.newContext({
    viewport: VIEWPORT_MOBILE,
    locale: 'ru-RU',
    isMobile: true,
    storageState: AUTH_STATE,
  });
  const mobilePage = await mobileCtx.newPage();
  await setTheme(mobilePage, 'light');
  for (const spec of SHOTS.filter((s) => s.viewport === 'mobile')) {
    await runShot({ ...ctx, page: mobilePage }, spec);
  }
  await mobileCtx.close();

  const darkPage = await (await browser.newContext({
    viewport: VIEWPORT_MAIN,
    locale: 'ru-RU',
    colorScheme: 'dark',
    storageState: AUTH_STATE,
  })).newPage();
  for (const spec of SHOTS.filter((s) => s.theme === 'dark')) {
    await runShot({ ...ctx, page: darkPage }, spec);
  }
  await darkPage.context().close();

  await captureStories(ctx);

  await desktop.close();
  await browser.close();

  const ok = results.filter((r) => r.status === 'OK').length;
  const skip = results.filter((r) => r.status === 'SKIP').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;

  const report = {
    boardUrl: BOARD_URL,
    companyPrefix: prefix,
    companyId,
    companyName: name,
    authStatePath: AUTH_STATE,
    viewportMain: VIEWPORT_MAIN,
    seedLog: demo.log,
    counts: { ok, skip, fail, total: results.length },
    results,
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log('\nReport:', REPORT_PATH);
  console.log(`Done: OK=${ok} SKIP=${skip} FAIL=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
