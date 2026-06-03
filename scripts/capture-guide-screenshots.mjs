/**
 * One-off capture of Board UI for docs/guides.
 * Run from repo root (uses Playwright from ../Datagent/node_modules):
 *
 *   node scripts/capture-guide-screenshots.mjs
 *
 * Env: BOARD_URL (default http://localhost:3100), COMPANY_PREFIX (auto from API)
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const DATAGENT_ROOT = path.resolve(DOCS_ROOT, '..', 'Datagent');

const require = createRequire(path.join(DATAGENT_ROOT, 'package.json'));
const { chromium } = require('playwright');
const sharp = require('sharp');

const BOARD_URL = (process.env.BOARD_URL ?? 'http://localhost:3100').replace(/\/$/, '');
const OUT_ROOT = path.join(DOCS_ROOT, 'static', 'img', 'guides');

/** @type {Array<{id: string, file: string, chapter: string, path: string, name: string, mobile?: boolean, fullPage?: boolean}>} */
const SHOTS = [
  {
    id: 'B1',
    file: 'first-day/sidebar-overview.webp',
    chapter: '01-first-day',
    path: '/dashboard',
    name: 'sidebar-overview',
  },
  {
    id: 'B2',
    file: 'first-day/sidebar-mobile.webp',
    chapter: '01-first-day',
    path: '/issues',
    name: 'sidebar-mobile',
    mobile: true,
  },
  {
    id: 'B3',
    file: 'first-day/issues-list.webp',
    chapter: '01-first-day',
    path: '/issues',
    name: 'issues-list',
  },
  {
    id: 'B4',
    file: 'first-day/issue-run.webp',
    chapter: '01-first-day,03-one-task',
    path: '/issues/__ISSUE__',
    name: 'issue-run',
    fullPage: false,
  },
  {
    id: 'B5',
    file: 'team/agents-list.webp',
    chapter: '02-your-team',
    path: '/agents/all',
    name: 'agents-list',
  },
  {
    id: 'B6',
    file: 'task/issue-detail.webp',
    chapter: '03-one-task',
    path: '/issues/__ISSUE__',
    name: 'issue-detail',
  },
  {
    id: 'B7',
    file: 'approval/approvals-pending.webp',
    chapter: '04-trust-and-approval',
    path: '/approvals/pending',
    name: 'approvals-pending',
  },
  {
    id: 'O1',
    file: 'office/operator-view.webp',
    chapter: '05-office-field',
    path: '/office',
    name: 'office-view',
    fullPage: true,
  },
  {
    id: 'B8',
    file: 'channels/issues-inbox.webp',
    chapter: '06-channels',
    path: '/inbox',
    name: 'inbox',
  },
  {
    id: 'B9',
    file: 'documents/issue-empty.webp',
    chapter: '07-documents',
    path: '/issues/__ISSUE__',
    name: 'issue-documents',
  },
  {
    id: 'B10',
    file: '1c/connector-page.webp',
    chapter: '08-1c-bridge',
    path: '/plugins/1c-connector',
    name: '1c-connector',
    fullPage: true,
  },
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function resolvePrefix() {
  if (process.env.COMPANY_PREFIX?.trim()) {
    return process.env.COMPANY_PREFIX.trim().toUpperCase();
  }
  const companies = await fetchJson(`${BOARD_URL}/api/companies`);
  const list = Array.isArray(companies) ? companies : [companies];
  const prefix = list[0]?.issuePrefix?.toUpperCase();
  if (!prefix) throw new Error('No company found on Board API');
  return prefix;
}

async function resolveCompanyId(prefix) {
  const companies = await fetchJson(`${BOARD_URL}/api/companies`);
  const list = Array.isArray(companies) ? companies : [companies];
  const company = list.find((c) => c.issuePrefix?.toUpperCase() === prefix);
  if (!company?.id) throw new Error(`Company ${prefix} not found`);
  return company.id;
}

function maskPii(page) {
  return page.addStyleTag({
    content: `
      [data-user-email], .user-email, input[type="email"] {
        filter: blur(6px) !important;
      }
    `,
  });
}

async function waitStable(page) {
  await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
  await page.locator('[data-slot="skeleton"]').first().waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(400);
}

async function ensureDemoIssue(request, companyId) {
  const listRes = await request.get(`${BOARD_URL}/api/companies/${companyId}/issues?limit=5`);
  if (!listRes.ok()) return null;
  const issues = await listRes.json();
  if (Array.isArray(issues) && issues.length > 0) {
    return issues[0].identifier ?? issues[0].id;
  }
  const createRes = await request.post(`${BOARD_URL}/api/companies/${companyId}/issues`, {
    data: {
      title: 'Демо: сводка для учебника Datagent',
      description: 'Тестовая задача для скриншотов документации. Без PII.',
    },
  });
  if (!createRes.ok()) {
    console.warn('Could not create demo issue:', createRes.status(), await createRes.text());
    return null;
  }
  const issue = await createRes.json();
  return issue.identifier ?? issue.id;
}

async function authenticate(page, prefix) {
  await page.goto(`${BOARD_URL}/${prefix}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  if (page.url().includes('/auth')) {
    const email = process.env.TEST_EMAIL ?? 'admin@test.com';
    const password = process.env.TEST_PASSWORD ?? 'password';
    await page.getByLabel(/email|почта/i).or(page.locator('#email')).fill(email);
    await page.getByLabel(/password|пароль/i).or(page.locator('#password')).fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.includes('/auth'), { timeout: 20_000 });
    await page.goto(`${BOARD_URL}/${prefix}/dashboard`, { waitUntil: 'domcontentloaded' });
  }
  await page.waitForTimeout(500);
}

async function setLightTheme(page) {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  });
}

async function saveWebp(bufferOrPath, outPath) {
  const input = Buffer.isBuffer(bufferOrPath) ? bufferOrPath : fs.readFileSync(bufferOrPath);
  await sharp(input).webp({ quality: 85 }).toFile(outPath);
}

async function captureShot(page, prefix, shot, issueRef) {
  const routePath = shot.path.replace('__ISSUE__', issueRef ?? 'demo');
  const url = `${BOARD_URL}/${prefix}${routePath}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await waitStable(page);
  await maskPii(page);

  const outPath = path.join(OUT_ROOT, shot.file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  if (shot.name === 'sidebar-overview') {
    const aside = page.locator('aside').first();
    await aside.waitFor({ state: 'visible', timeout: 10_000 });
    const buf = await aside.screenshot({ type: 'png' });
    await saveWebp(buf, outPath);
    return;
  }

  const buf = await page.screenshot({
    type: 'png',
    fullPage: shot.fullPage ?? false,
  });
  await saveWebp(buf, outPath);
}

async function main() {
  const health = await fetchJson(`${BOARD_URL}/api/health`);
  console.log('Board health:', health.status, health.deploymentMode);

  const prefix = await resolvePrefix();
  const companyId = await resolveCompanyId(prefix);
  console.log('Company prefix:', prefix, 'id:', companyId);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  const desktop = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'ru-RU',
    colorScheme: 'light',
  });
  const desktopPage = await desktop.newPage();
  await authenticate(desktopPage, prefix);
  await setLightTheme(desktopPage);
  const issueRef = await ensureDemoIssue(desktopPage.request, companyId);
  console.log('Demo issue:', issueRef ?? '(none)');

  for (const shot of SHOTS.filter((s) => !s.mobile)) {
    try {
      if (shot.path.includes('__ISSUE__') && !issueRef) {
        results.push({ ...shot, status: 'skipped', reason: 'no issue in company' });
        continue;
      }
      await captureShot(desktopPage, prefix, shot, issueRef);
      results.push({ ...shot, status: 'ok' });
      console.log('OK', shot.id, shot.file);
    } catch (err) {
      results.push({ ...shot, status: 'failed', reason: String(err) });
      console.error('FAIL', shot.id, err);
    }
  }

  const mobileShot = SHOTS.find((s) => s.mobile);
  if (mobileShot) {
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: 'ru-RU',
      colorScheme: 'light',
      isMobile: true,
    });
    const mobilePage = await mobile.newPage();
    await authenticate(mobilePage, prefix);
    await setLightTheme(mobilePage);
    try {
      await mobilePage.goto(`${BOARD_URL}/${prefix}/issues`, { waitUntil: 'domcontentloaded' });
      await waitStable(mobilePage);
      const sidebarBtn = mobilePage.getByRole('button', { name: /Открыть боковую панель|Open sidebar/i });
      if (await sidebarBtn.isVisible().catch(() => false)) {
        await sidebarBtn.click();
        await mobilePage.waitForTimeout(600);
      }
      const outPath = path.join(OUT_ROOT, mobileShot.file);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const buf = await mobilePage.screenshot({ type: 'png' });
      await saveWebp(buf, outPath);
      results.push({ ...mobileShot, status: 'ok' });
      console.log('OK', mobileShot.id, mobileShot.file);
    } catch (err) {
      results.push({ ...mobileShot, status: 'failed', reason: String(err) });
      console.error('FAIL B2', err);
    }
    await mobile.close();
  }

  await desktop.close();
  await browser.close();

  const reportPath = path.join(DOCS_ROOT, 'scripts', 'capture-guide-screenshots-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ prefix, issueRef, results }, null, 2));
  console.log('Report:', reportPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
