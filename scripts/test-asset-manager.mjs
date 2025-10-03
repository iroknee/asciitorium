#!/usr/bin/env node

import { AssetManager } from '../packages/asciitorium/dist/asciitorium.es.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change to the asciitorium package directory so loadArt can find public/art
process.chdir(path.join(__dirname, '../packages/asciitorium'));

const artDir = './public/art';

async function findAllAssets() {
  const assets = { maps: [], materials: [], sprites: [] };

  try {
    // Find maps (directories with map.txt)
    const mapsDir = path.join(artDir, 'maps');
    try {
      const mapDirs = await fs.readdir(mapsDir);
      for (const dir of mapDirs) {
        const mapFile = path.join(mapsDir, dir, 'map.txt');
        try {
          await fs.access(mapFile);
          assets.maps.push(dir);
        } catch (e) {
          // Skip if map.txt doesn't exist
        }
      }
    } catch (e) {
      console.log('No maps directory found');
    }

    // Find materials
    const materialsDir = path.join(artDir, 'materials');
    try {
      const materialFiles = await fs.readdir(materialsDir);
      for (const file of materialFiles) {
        if (file.endsWith('.txt')) {
          assets.materials.push(file.replace('.txt', ''));
        }
      }
    } catch (e) {
      console.log('No materials directory found');
    }

    // Find sprites
    const spritesDir = path.join(artDir, 'sprites');
    try {
      const spriteFiles = await fs.readdir(spritesDir);
      for (const file of spriteFiles) {
        if (file.endsWith('.txt')) {
          assets.sprites.push(file.replace('.txt', ''));
        }
      }
    } catch (e) {
      console.log('No sprites directory found');
    }

    // Also check scenes directory as it might be materials or sprites
    const scenesDir = path.join(artDir, 'scenes');
    try {
      const sceneFiles = await fs.readdir(scenesDir);
      for (const file of sceneFiles) {
        if (file.endsWith('.txt')) {
          const sceneName = file.replace('.txt', '');
          // Only add if not already in materials (avoid duplicates)
          if (!assets.materials.includes(sceneName)) {
            assets.materials.push(sceneName);
          }
        }
      }
    } catch (e) {
      console.log('No scenes directory found');
    }

  } catch (error) {
    console.error('Error scanning art directory:', error);
  }

  return assets;
}

async function showRawFile(name, assetKind) {
  console.log(`  Raw file content preview:`);

  const possiblePaths = [
    `./public/art/maps/${name}/map.txt`,
    `./public/art/materials/${name}.txt`,
    `./public/art/scenes/${name}.txt`,
    `./public/art/sprites/${name}.txt`
  ];

  for (const filePath of possiblePaths) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      console.log(`    From: ${filePath}`);

      // Show first 10 lines of raw content
      const lines = content.split('\n');
      lines.slice(0, 10).forEach((line, i) => {
        console.log(`    ${i.toString().padStart(2, '0')}: "${line}"`);
      });

      if (lines.length > 10) {
        console.log(`    ... (${lines.length - 10} more lines)`);
      }

      console.log(`    Total file size: ${content.length} characters`);

      // Show parsing hints
      console.log(`    Parsing hints:`);
      if (content.includes('§')) {
        const sectionCount = content.split('§').length - 1;
        console.log(`      § separators found: ${sectionCount}`);
      }
      if (content.includes('¶')) {
        const paraCount = content.split('¶').length - 1;
        console.log(`      ¶ separators found: ${paraCount}`);
      }
      if (content.includes('---')) {
        const frameCount = content.split('---').length - 1;
        console.log(`      --- frame separators found: ${frameCount}`);
      }

      break;
    } catch (e) {
      // Continue to next path
    }
  }
}

async function testAsset(name, expectedType) {
  console.log(`\n=== Testing Asset: ${name} (expected: ${expectedType}) ===`);

  try {
    const asset = await AssetManager.getAsset(name);

    console.log(`✓ Success: Found ${asset.kind} asset`);
    console.log(`  Width: ${asset.width}`);
    console.log(`  Height: ${asset.height}`);

    if (asset.kind !== expectedType) {
      console.log(`  ⚠️  Expected ${expectedType} but got ${asset.kind}`);
    }

    // Show raw file content first
    await showRawFile(name, asset.kind);

    // Show detailed data info
    switch (asset.kind) {
      case 'map':
        const mapData = asset.data;
        console.log(`  Map data: ${mapData.mapData.length} lines`);
        console.log(`  First few lines preview:`);
        mapData.mapData.slice(0, 3).forEach((line, i) => {
          console.log(`    ${i}: "${line}"`);
        });
        console.log(`  Legend entries: ${Object.keys(mapData.legend).length}`);
        console.log(`  Legend details:`);
        Object.entries(mapData.legend).forEach(([key, entry]) => {
          console.log(`    "${key}": ${entry.kind} "${entry.name}" (solid: ${entry.solid}) -> ${entry.asset}`);
        });
        break;

      case 'material':
        const materialData = asset.data;
        console.log(`  Usage: ${materialData.usage}`);
        console.log(`  Layers: ${materialData.layers.length}`);
        console.log(`  Layer details:`);
        materialData.layers.forEach((layer, i) => {
          console.log(`    Layer ${i}: ${layer.layer} ${layer.position} (x: ${layer.x || 0})`);
          console.log(`      Lines: ${layer.lines.length}`);
          console.log(`      Content preview:`);
          layer.lines.slice(0, 3).forEach((line, j) => {
            console.log(`        ${j}: "${line}"`);
          });
          if (layer.lines.length > 3) {
            console.log(`        ... (${layer.lines.length - 3} more lines)`);
          }
        });
        break;

      case 'sprite':
        const spriteData = asset.data;
        console.log(`  Frames: ${spriteData.frames.length}`);
        console.log(`  Loop: ${spriteData.defaults.loop || false}`);
        console.log(`  Default duration: ${spriteData.defaults.duration || 'none'}`);
        console.log(`  Frame details:`);
        spriteData.frames.forEach((frame, i) => {
          console.log(`    Frame ${i}: ${frame.lines.length} lines`);
          console.log(`      Meta: duration=${frame.meta.duration || 'default'}, sound=${frame.meta.sound || 'none'}`);
          console.log(`      Content preview (first 3 lines):`);
          frame.lines.slice(0, 3).forEach((line, j) => {
            const lineStr = line.join('');
            console.log(`        ${j}: "${lineStr}"`);
          });
          if (frame.lines.length > 3) {
            console.log(`        ... (${frame.lines.length - 3} more lines)`);
          }
          // Show frame dimensions
          const frameWidth = Math.max(...frame.lines.map(line => line.length));
          const frameHeight = frame.lines.length;
          console.log(`      Frame dimensions: ${frameWidth}×${frameHeight}`);
        });
        break;
    }

    return true;
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('AssetManager Test Suite');
  console.log('======================');

  const assets = await findAllAssets();

  console.log('\nFound assets:');
  console.log(`Maps: ${assets.maps.join(', ') || 'none'}`);
  console.log(`Materials: ${assets.materials.join(', ') || 'none'}`);
  console.log(`Sprites: ${assets.sprites.join(', ') || 'none'}`);

  let successes = 0;
  let total = 0;

  // Test all maps
  for (const map of assets.maps) {
    total++;
    if (await testAsset(map, 'map')) successes++;
  }

  // Test all materials
  for (const material of assets.materials) {
    total++;
    if (await testAsset(material, 'material')) successes++;
  }

  // Test all sprites
  for (const sprite of assets.sprites) {
    total++;
    if (await testAsset(sprite, 'sprite')) successes++;
  }

  // Test some edge cases
  console.log('\n=== Edge Case Tests ===');

  total++;
  console.log('\n--- Testing non-existent asset (should fail) ---');
  const result = await testAsset('nonexistent', 'unknown');
  if (!result) {
    console.log('✓ Correctly failed to find non-existent asset');
    successes++; // This is expected to fail, so count it as success
  }

  console.log(`\n=== Summary ===`);
  console.log(`${successes}/${total} tests passed`);

  if (successes === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

main().catch(console.error);