#!/usr/bin/env bash
# scripts/test-create-asciitorium.sh
set -euo pipefail

# ---- Config (override via env if desired) ----
CLI_DIR_DEFAULT="packages/create-asciitorium"
LIB_DIR_DEFAULT="packages/asciitorium"
APP_NAME_DEFAULT="asciitorium-sample"
OUT_DIR_DEFAULT="./tmp"
USE_LOCAL_LIB_DEFAULT="${USE_LOCAL_LIB:-0}"   # set USE_LOCAL_LIB=1 to inject local asciitorium tgz

CLI_DIR="${CLI_DIR:-$CLI_DIR_DEFAULT}"
LIB_DIR="${LIB_DIR:-$LIB_DIR_DEFAULT}"
APP_NAME="${APP_NAME:-$APP_NAME_DEFAULT}"
OUT_DIR="${OUT_DIR:-$OUT_DIR_DEFAULT}"
USE_LOCAL_LIB="${USE_LOCAL_LIB:-$USE_LOCAL_LIB_DEFAULT}"

# ---- Resolve repo root relative to this script ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "Repo root: $REPO_ROOT"
echo "Building CLI at: $CLI_DIR"
npm run build --prefix="$CLI_DIR"

# Scratch dir to hold the generated app
SCRATCH_PARENT="$(mktemp -d ./tmp/create-asciitorium-XXXXXX)"
APP_DIR="$SCRATCH_PARENT/$APP_NAME"

echo "Scaffolding into: $APP_DIR"
# Try with positional arg first; if your CLI supports flags, add them here.
# If your CLI prompts, it should still work interactively; otherwise adjust args.
node "$CLI_DIR/dist/index.js" "$APP_DIR"

if [[ ! -d "$APP_DIR" ]]; then
  echo "ERROR: scaffold failed; expected directory not found: $APP_DIR"
  exit 1
fi

echo "Installing dependencies in scaffolded app..."
cd "$APP_DIR"
npm install

# Optionally replace asciitorium with local tgz built from the monorepo
if [[ "$USE_LOCAL_LIB" == "1" ]]; then
  echo "Packing local asciitorium and installing into scaffold..."
  OUT_ABS="$REPO_ROOT/$OUT_DIR"
  rm -rf "$OUT_ABS"
  mkdir -p "$OUT_ABS"
  npm pack --pack-destination="$OUT_ABS" --prefix="$LIB_DIR"

  TARBALL_PATH="$(ls -t "$OUT_ABS"/asciitorium-*.tgz | head -n 1)"
  if [[ ! -f "$TARBALL_PATH" ]]; then
    echo "ERROR: local asciitorium tarball not found in $OUT_ABS"
    exit 1
  fi

  npm install "$TARBALL_PATH"
fi

echo "Running a production build of the scaffolded app (vite build)..."
# Prefer the project's build script; fall back to vite build if needed
if npm run build --silent >/dev/null 2>&1; then
  npm run build
else
  npx vite build
fi

echo
echo "✅ create-asciitorium smoke test passed."
echo "   App directory: $APP_DIR"