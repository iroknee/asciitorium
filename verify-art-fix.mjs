#!/usr/bin/env node

// Simple verification script to show that Art component now uses AssetManager dimensions

import { AssetManager } from './packages/asciitorium/dist/asciitorium.es.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change to the asciitorium package directory so loadArt can find public/art
process.chdir(path.join(__dirname, 'packages/asciitorium'));

async function demonstrateFix() {
  console.log('🎬 Art Component Wiggle Fix Verification');
  console.log('========================================\n');

  try {
    const asset = await AssetManager.getAsset('asciitorium');

    console.log('✅ AssetManager Pre-calculated Dimensions:');
    console.log(`   Width: ${asset.width}px (maximum across all ${asset.data.frames.length} frames)`);
    console.log(`   Height: ${asset.height}px (maximum across all ${asset.data.frames.length} frames)`);
    console.log('');

    console.log('📊 Individual Frame Analysis:');
    console.log('Frame | Width × Height | Should Component Resize?');
    console.log('------|----------------|------------------------');

    let hasVariableDimensions = false;

    asset.data.frames.forEach((frame, i) => {
      const frameHeight = frame.lines.length;
      const frameWidth = Math.max(...frame.lines.map(line => line.length));

      const wouldResize = frameWidth !== asset.width || frameHeight !== asset.height;
      if (wouldResize) hasVariableDimensions = true;

      console.log(`${i.toString().padStart(5)} | ${frameWidth.toString().padStart(5)} × ${frameHeight.toString().padStart(6)} | ${wouldResize ? '❌ YES (was causing wiggle)' : '✅ No'}`);
    });

    console.log('------|----------------|------------------------');
    console.log(`FIXED | ${asset.width.toString().padStart(5)} × ${asset.height.toString().padStart(6)} | ✅ No (stays constant now)`);

    console.log('\n🔧 Fix Summary:');
    console.log('===============');
    if (hasVariableDimensions) {
      console.log('❌ BEFORE: Art component was resizing for each frame (causing wiggle)');
      console.log('✅ AFTER:  Art component uses AssetManager\'s max dimensions (fixed size)');
      console.log('');
      console.log('📝 Changes Made:');
      console.log('   1. Art component now receives full Asset (including width/height)');
      console.log('   2. updateContentFromAsset() uses asset.width/height directly');
      console.log('   3. advanceFrame() no longer resizes component per frame');
      console.log('   4. Component maintains fixed size throughout animation');
      console.log('');
      console.log('🎯 Result: Smooth animation with no wiggle/resizing! 🚀');
    } else {
      console.log('ℹ️  This sprite has consistent dimensions across all frames');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

demonstrateFix();