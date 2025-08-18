#!/usr/bin/env bash
# scripts/pack-lib-test.sh
set -euo pipefail

# --- Config (can be overridden via env) ---
PKG_DIR_DEFAULT="packages/asciitorium"
OUT_DIR_DEFAULT="./tmp"
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
cd "$PKG_DIR"
npm pack --pack-destination="$OUT_ABS"
cd "$REPO_ROOT"

# Find newest tarball (handles version changes)
TARBALL_PATH="$(ls -t "$OUT_ABS"/"$PKG_NAME"-*.tgz | head -n 1)"
if [[ ! -f "$TARBALL_PATH" ]]; then
  echo "ERROR: tarball not found in $OUT_ABS"
  exit 1
fi
echo "Tarball: $TARBALL_PATH"

# Make a scratch app with consistent directory name
SCRATCH_DIR="./tmp/${PKG_NAME}-test"
echo "Scratch dir: $SCRATCH_DIR"

# Remove existing scratch directory if it exists
if [[ -d "$SCRATCH_DIR" ]]; then
  echo "Removing existing scratch directory: $SCRATCH_DIR"
  rm -rf "$SCRATCH_DIR"
fi

# Create fresh scratch directory
mkdir -p "$SCRATCH_DIR"
cd "$SCRATCH_DIR"

# Init and install tarball (npm to avoid SIGPIPE)
npm init -y >/dev/null
npm install "$TARBALL_PATH"

# Smoke test: import the package and list exported keys
node -e "import('$PKG_NAME').then(m => console.log('Exports:', Object.keys(m)))"

echo
echo "✅ Packed & installed $PKG_NAME successfully."
echo "   Scratch project left at: $SCRATCH_DIR"