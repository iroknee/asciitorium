#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const packageJsonPaths = [
  'package.json',
  'packages/asciitorium/package.json',
  'packages/create-asciitorium/package.json'
];

function incrementPatchVersion(version) {
  const parts = version.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: ${version}`);
  }
  
  const major = parseInt(parts[0]);
  const minor = parseInt(parts[1]);
  const patch = parseInt(parts[2]) + 1;
  
  return `${major}.${minor}.${patch}`;
}

async function getCurrentVersion() {
  try {
    const content = await fs.readFile('package.json', 'utf8');
    const packageJson = JSON.parse(content);
    return packageJson.version;
  } catch (error) {
    console.error('Failed to read current version from package.json:', error.message);
    process.exit(1);
  }
}

function runGitCommand(command, description) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ Failed to ${description.toLowerCase()}:`, error.message);
    process.exit(1);
  }
}

async function updateVersion() {
  const currentVersion = await getCurrentVersion();
  const newVersion = incrementPatchVersion(currentVersion);
  
  console.log(`Updating version from ${currentVersion} to ${newVersion}...`);

  // Update all package.json files
  for (const packagePath of packageJsonPaths) {
    try {
      const fullPath = path.resolve(packagePath);
      const content = await fs.readFile(fullPath, 'utf8');
      const packageJson = JSON.parse(content);
      
      packageJson.version = newVersion;
      
      await fs.writeFile(fullPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✓ ${packagePath}: ${currentVersion} → ${newVersion}`);
    } catch (error) {
      console.error(`✗ Failed to update ${packagePath}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\nAll package.json files updated successfully!');

  // Git operations
  console.log('\nCommitting changes and creating tag...');
  
  runGitCommand('git add .', 'Stage changes');
  runGitCommand(`git commit -m "Bump version to ${newVersion}"`, 'Commit changes');
  runGitCommand(`git tag v${newVersion}`, 'Create git tag');

  console.log(`\n🎉 Version successfully bumped to ${newVersion}!`);
  console.log('\nNext steps:');
  console.log('1. Push changes: git push && git push --tags');
  console.log('2. Run release: npm run release');
}

updateVersion();