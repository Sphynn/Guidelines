#!/usr/bin/env bash
# Usage: render.sh <Vertical|Landscape|Square> <out.mp4> [props.json]
# Renders the RedFynn announcement template to an MP4. Works in the cloud sandbox (no network
# access to remotion.media) by using the pre-installed Chromium headless shell.
set -euo pipefail
COMP=${1:?composition: Vertical|Landscape|Square}; OUT=$(realpath -m "${2:?output .mp4}"); PROPS=${3:+$(realpath "$3")}
HERE=$(cd "$(dirname "$0")" && pwd)
WORK=${WORK_DIR:-/tmp/redfynn-video-work}

rm -rf "$WORK" && mkdir -p "$WORK" && cp -r "$HERE/template/." "$WORK/"
# Refresh the logo from the brand skill so there is one source of truth.
LOGO=$(ls /root/.claude/skills/synced/*/redfynn-brand/assets/logos/RedFynn-Logo-Primary-BlackRed.png "$HERE"/../redfynn-brand/assets/logos/RedFynn-Logo-Primary-BlackRed.png 2>/dev/null | head -1 || true)
[ -n "$LOGO" ] && cp "$LOGO" "$WORK/public/logo.png"

cd "$WORK"
[ -d node_modules ] || npm ci --no-audit --no-fund >/dev/null 2>&1 || npm install --no-audit --no-fund >/dev/null

BROWSER=$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)
ARGS=(); [ -n "$BROWSER" ] && ARGS+=(--browser-executable="$BROWSER")
[ -n "$PROPS" ] && ARGS+=(--props="$PROPS")

mkdir -p "$(dirname "$OUT")"
npx remotion render src/index.ts "$COMP" "$OUT" --crf=24 "${ARGS[@]}"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration -of csv=p=0 "$OUT"
