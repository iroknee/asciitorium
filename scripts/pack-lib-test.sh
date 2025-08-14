#!/usr/bin/env bash
# scripts/pack-lib-test.sh
set -euo pipefail

# --- Config (can be overridden via env) ---
PKG_DIR_DEFAULT="packages/asciitorium"
OUT_DIR_DEFAULT="tmp"
PKG_NAME_DEFAULT="asciitorium"

PKG_DIR="${PKG_DIR:-$PKG_DIR_DEFAULT}"
OUT_DIR="${OUT_DIR:-$OUT_DIR_DEFAULT}"
PKG_NAME="${PKG_NAME:-$PKG_NAME_DEFAULT}"

# --- Resolve repo root relative to this script ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

OUT_ABS="$REPO_ROOT/$OUT_DIR"

echo "Repo root: $REPO_ROOT"
echo "Packing package: $PKG_NAME (dir: $PKG_DIR) → $OUT_ABS"

# Clean previous output
rm -rf "$OUT_ABS"
mkdir -p "$OUT_ABS"

# Pack the package to a tarball in OUT_ABS (absolute path!)
pnpm --dir "$PKG_DIR" pack --pack-destination "$OUT_ABS"

# Find newest tarball (handles version changes)
TARBALL_PATH="$(ls -t "$OUT_ABS"/"$PKG_NAME"-*.tgz | head -n 1)"
if [[ ! -f "$TARBALL_PATH" ]]; then
  echo "ERROR: tarball not found in $OUT_ABS"
  exit 1
fi
echo "Tarball: $TARBALL_PATH"

# Make a scratch app
SCRATCH_DIR="$(mktemp -d /tmp/${PKG_NAME}-test-XXXXXX)"
echo "Scratch dir: $SCRATCH_DIR"
cd "$SCRATCH_DIR"

# Init and install tarball (npm to avoid SIGPIPE)
npm init -y >/dev/null
pnpm add "$TARBALL_PATH"

# Smoke test: import the package and list exported keys
node -e "import('$PKG_NAME').then(m => console.log('Exports:', Object.keys(m)))"

echo
echo "✅ Packed & installed $PKG_NAME successfully."
echo "   Scratch project left at: $SCRATCH_DIR"