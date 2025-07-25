const figlet = require('figlet');
const fs = require('fs-extra');
const path = require('path');

// ─── Parse CLI Arguments ──────────────────────────────────────────
const [font, ...phraseParts] = process.argv.slice(2);
const phrase = phraseParts.join(' ');

if (!font || !phrase) {
  console.error('Usage: node scripts/generate-art.js <font> <phrase>');
  process.exit(1);
}

// ─── Generate ASCII Art ───────────────────────────────────────────
figlet.text(phrase, { font }, (err, data) => {
  if (err || !data) {
    console.error('❌ Failed to generate ASCII art:', err || 'Unknown error');
    process.exit(1);
  }

  const safeFilename = phrase.replace(/[^a-z0-9_-]+/gi, '_');
  const outputPath = path.join(__dirname, '../art', `${safeFilename}.txt`);

  fs.ensureDirSync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, data);

  console.log(`✅ Generated: art/${safeFilename}.txt`);
});