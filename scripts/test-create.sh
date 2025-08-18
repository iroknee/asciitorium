#!/usr/bin/env bash
# scripts/test-create-asciitorium.sh
set -euo pipefail

# ---- Config (override via env if desired) ----
CLI_DIR_DEFAULT="packages/create-asciitorium"
LIB_DIR_DEFAULT="packages/asciitorium"
APP_NAME_DEFAULT="example"
OUT_DIR_DEFAULT="./tmp"
USE_LOCAL_LIB_DEFAULT="${USE_LOCAL_LIB:-1}"   # set USE_LOCAL_LIB=0 to use npm registry version

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
echo "CLI_DIR: $CLI_DIR"
echo "LIB_DIR: $LIB_DIR"
echo "APP_NAME: $APP_NAME"
echo "OUT_DIR: $OUT_DIR"
echo "USE_LOCAL_LIB: $USE_LOCAL_LIB"
echo "Building CLI at: $CLI_DIR"
npm run build --prefix="$CLI_DIR"

# Scratch dir to hold the generated app
SCRATCH_PARENT="tmp/asciitorium"
APP_DIR="$REPO_ROOT/$SCRATCH_PARENT/$APP_NAME"
echo "SCRATCH_PARENT: $SCRATCH_PARENT"
echo "APP_DIR: $APP_DIR"

# Clean up previous test directory if it exists
if [[ -d "$SCRATCH_PARENT" ]]; then
  echo "Cleaning up previous test directory: $SCRATCH_PARENT"
  rm -rf "$SCRATCH_PARENT"
fi
mkdir -p "$SCRATCH_PARENT"
echo "Created test directory: $SCRATCH_PARENT"

echo "Scaffolding into: $APP_DIR"
echo "Running: node $CLI_DIR/dist/index.js $APP_DIR"
# Try with positional arg first; if your CLI supports flags, add them here.
# If your CLI prompts, it should still work interactively; otherwise adjust args.
node "$CLI_DIR/dist/index.js" "$APP_DIR"

echo "Checking if scaffolded directory exists..."
ls -la "$REPO_ROOT/tmp/" || echo "No tmp directory"
if [[ -d "$SCRATCH_PARENT" ]]; then
  echo "Contents of $SCRATCH_PARENT:"
  ls -la "$SCRATCH_PARENT"
fi
if [[ ! -d "$APP_DIR" ]]; then
  echo "ERROR: scaffold failed; expected directory not found: $APP_DIR"
  exit 1
fi

echo "Installing dependencies in scaffolded app..."
cd "$APP_DIR"
npm install

# Optionally replace asciitorium with local tgz built from the monorepo
if [[ "$USE_LOCAL_LIB" == "1" ]]; then
  echo "Packing local asciitorium using test-pack.sh..."
  cd "$REPO_ROOT"
  echo "Running: $REPO_ROOT/scripts/test-pack.sh"
  # Use a different output directory to avoid conflicts
  OUT_DIR="./tmp/pack" "$REPO_ROOT/scripts/test-pack.sh"

  PACK_DIR="$REPO_ROOT/tmp/pack"
  echo "Looking for tarball in: $PACK_DIR"
  ls -la "$PACK_DIR/" || echo "Directory $PACK_DIR does not exist"
  TARBALL_PATH="$(ls -t "$PACK_DIR"/asciitorium-*.tgz | head -n 1)"
  echo "Found tarball: $TARBALL_PATH"
  if [[ ! -f "$TARBALL_PATH" ]]; then
    echo "ERROR: local asciitorium tarball not found in $PACK_DIR"
    exit 1
  fi

  # Go to app directory for installing
  echo "Installing tarball $TARBALL_PATH into $APP_DIR"
  cd "$APP_DIR"
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