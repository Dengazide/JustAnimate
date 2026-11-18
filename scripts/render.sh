#!/usr/bin/env bash
set -euo pipefail
mkdir -p out public/audio public/assets/generated
if command -v blender >/dev/null 2>&1; then
  [[ -s public/assets/generated/justanimate-library.glb ]] || blender -b -t 8 --python blender/build_asset_library.py
elif [[ ! -s public/assets/generated/justanimate-library.glb ]]; then
  python scripts/build_asset_fallback.py
fi
python scripts/make_audio.py --out-dir public/audio --script story/beer-flood/script.md
npx remotion render src/index.ts BeerFloodShort out/beer-flood.mp4 --codec h264 --crf 17
python scripts/qa_video.py out/beer-flood.mp4 --out-dir out/qa --shots story/beer-flood/shots.json
