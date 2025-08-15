#!/usr/bin/env node
// @ts-ignore
import path from 'node:path';
import fs from 'node:fs/promises';
import minimist from 'minimist';
import prompts from 'prompts';
import { green, cyan, yellow, dim, red } from 'kolorist';
import { scaffold } from './scaffold.js';

async function main() {
  const argv = minimist(process.argv.slice(2), {
    string: ['template', 'pm'],
    boolean: ['git', 'install'],
    default: { git: true, install: true },
  });

  let target = argv._[0] as string | undefined;
  if (!target) {
    const res = await prompts({
      type: 'text',
      name: 'name',
      message: 'Project name:',
      initial: 'my-asciitorium-app',
    });
    target = res.name;
  }
  if (!target) {
    console.log(red('✖') + ' No project name provided. Aborting.');
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), target);
  try {
    await fs.mkdir(projectDir, { recursive: false });
  } catch {
    console.log(red(`✖ Directory "${target}" already exists.`));
    process.exit(1);
  }

  const pm =
    argv.pm ?? process.env.npm_config_user_agent?.split('/')[0] ?? 'pnpm';
  const template = argv.template ?? 'base';
  const useGit = Boolean(argv.git);
  const doInstall = Boolean(argv.install);

  console.log(
    `${green('✔')} Creating ${cyan(target)} with template ${yellow(template)}…`
  );

  await scaffold({ projectDir, template });

  if (useGit) {
    try {
      const { execa } = await import('execa');
      await execa('git', ['init'], { cwd: projectDir });
      await execa('git', ['add', '-A'], { cwd: projectDir });
      await execa('git', ['commit', '-m', 'chore: init asciitorium app'], {
        cwd: projectDir,
      });
      console.log(green('✔ ') + 'Initialized git repository.');
    } catch {
      console.log(dim('…skipping git init (git not found)'));
    }
  }

  if (doInstall) {
    try {
      const { execa } = await import('execa');
      const installCmd = pm === 'yarn' ? 'install' : 'i';
      await execa(pm, [installCmd], { cwd: projectDir, stdio: 'inherit' });
    } catch {
      console.log(dim(`…skipping install (unable to run ${pm})`));
    }
  }

  const runDev = pm === 'npm' ? 'npm run web' : `${pm} web`;
  console.log(`\n${green('Done!')} Next steps:\n`);
  console.log(`  cd ${target}`);
  console.log(`  ${runDev}\n`);
  console.log(
    dim(
      'Web dev server on http://localhost:5173 , CLI: `node dist/main.cjs` after build.'
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
