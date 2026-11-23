#!/usr/bin/env bash
set -euo pipefail

project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$project_root"
mkdir -p dist/server dist/.openai
node --input-type=module <<'JS'
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
const aidanPhoto = 'media/aidan-follestad.jpg';
const source = readFileSync('worker/index.js', 'utf8')
  .replace('__LOGO_BASE64__', readFileSync('media/logo.png').toString('base64'))
  .replace('__HERO_BASE64__', readFileSync('media/winter.jpg').toString('base64'))
  .replace('__AIDAN_BASE64__', existsSync(aidanPhoto) ? readFileSync(aidanPhoto).toString('base64') : '')
  .replace('__ANTHONY_BASE64__', readFileSync('media/anthony-cole.jpg').toString('base64'));
writeFileSync('dist/server/index.js', source);
JS
cp .openai/hosting.json dist/.openai/hosting.json
