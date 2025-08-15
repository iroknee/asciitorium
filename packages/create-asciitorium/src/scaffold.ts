// packages/create-asciitorium/src/scaffold.ts
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ScaffoldOptions {
  projectDir: string;
  template: string; // e.g. "base"
  install?: boolean; // default: true
  initGit?: boolean; // default: true
  packageManager?: 'pnpm' | 'npm' | 'yarn'; // default: "pnpm" (install step uses this)
}

/**
 * High-level scaffold:
 * 1) Copy template into projectDir
 * 2) Move _gitignore -> .gitignore
 * 3) Pin latest published asciitorium version in package.json
 * 4) Optionally run install
 * 5) Optionally init git
 */
export async function scaffold(opts: ScaffoldOptions) {
  const {
    projectDir,
    template,
    install = true,
    initGit = true,
    packageManager = 'pnpm',
  } = opts;

  const templateDir = path.join(__dirname, 'templates', template);

  // 1) Copy all template files
  await copyDir(templateDir, projectDir);

  // 2) Rename _gitignore if present
  await renameGitignore(projectDir);

  // 3) Pin latest asciitorium into the generated package.json
  await pinLatestAsciitorium(projectDir);

  // 4) Install dependencies (default: pnpm)
  if (install) {
    await runInstall(projectDir, packageManager);
  }

  // 5) Initialize git (if not already inside a repo)
  if (initGit) {
    await initGitRepo(projectDir);
  }
}

/* ----------------- Helpers ----------------- */

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(s, d);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

async function renameGitignore(projectDir: string) {
  const from = path.join(projectDir, '_gitignore');
  const to = path.join(projectDir, '.gitignore');
  try {
    await fs.rename(from, to);
  } catch {
    // ignore if not present
  }
}

async function getLatestVersion(pkg: string): Promise<string> {
  // Try pnpm first
  try {
    const { stdout } = await execa('pnpm', ['view', pkg, 'version']);
    return stdout.trim();
  } catch {
    // Fallback to npm
    const { stdout } = await execa('npm', ['view', pkg, 'version']);
    return stdout.trim();
  }
}

export async function pinLatestAsciitorium(appDir: string) {
  const pkgPath = path.join(appDir, 'package.json');
  const raw = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);

  const latest = await getLatestVersion('asciitorium');

  pkg.dependencies ??= {};
  pkg.dependencies.asciitorium = `^${latest}`;

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

async function runInstall(appDir: string, pm: 'pnpm' | 'npm' | 'yarn') {
  const cmd =
    pm === 'pnpm' ? ['install'] : pm === 'npm' ? ['install'] : ['install']; // yarn

  try {
    await execa(pm, cmd, { cwd: appDir, stdio: 'inherit' });
  } catch (err) {
    throw new Error(
      `Dependency install failed with ${pm}. You can retry manually in ${appDir}.`
    );
  }
}

async function initGitRepo(appDir: string) {
  // Quick check: if .git exists, skip
  try {
    await fs.stat(path.join(appDir, '.git'));
    return;
  } catch {
    // not a git repo yet
  }

  try {
    await execa('git', ['init'], { cwd: appDir, stdio: 'ignore' });
    await execa('git', ['add', '-A'], { cwd: appDir, stdio: 'ignore' });
    await execa(
      'git',
      ['commit', '-m', 'chore: scaffold project with create-asciitorium'],
      { cwd: appDir, stdio: 'ignore' }
    );
  } catch {
    // If git isn't available or commit fails, it's non-fatal — just continue
  }
}
