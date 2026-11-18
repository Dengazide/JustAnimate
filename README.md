# JustAnimate — original animated-short production pipeline

A reusable short-form animation system built around **Three.js + Remotion**, with **Blender** as a procedural asset-authoring and GLB export stage. Includes an original 30-second UK historical short, a modular prop/character library, a repeatable shot/timing schema, generated British-English narration/audio, and a frame-by-frame QA script.

> **Originality:** This repository uses general production principles from an open skill/tutorial—measured timing, 3D staging, camera movement, original sound, still-frame review and automated QA. It does not copy another channel's scripts, characters, exact shots, voice, or distinctive artwork.

## Contents
- `SKILL.md` — reusable JustAnimate production workflow.
- `src/` — Remotion composition and Three.js scene.
- `blender/build_asset_library.py` — procedural Blender asset generator (editable `.blend` plus GLB).
- `scripts/build_asset_fallback.py` — named GLB generator when Blender is unavailable.
- `assets/` — asset manifest and character/prop notes.
- `story/beer-flood/` — original script, sources and timed shot plan.
- `scripts/make_audio.py` — British-English narration and original procedural music/SFX.
- `scripts/qa_video.py` — exact-duration, audio, frame and contact-sheet QA.
- `docs/` — pipeline, quality gates and reference-research boundaries.

## Requirements
Node.js 20+, Python 3.10+, FFmpeg/ffprobe, and Blender 4.2+ for the editable canonical build. If Blender is unavailable, install Python dependencies and build a named GLB with the included trimesh fallback.

```bash
npm install
python -m pip install -r requirements.txt
python scripts/build_asset_fallback.py
python scripts/make_audio.py --out-dir public/audio --script story/beer-flood/script.md
npx remotion render src/index.ts BeerFloodShort out/beer-flood.mp4 --codec h264 --crf 17
python scripts/qa_video.py out/beer-flood.mp4 --out-dir out/qa --shots story/beer-flood/shots.json
```

For the canonical editable Blender asset build:
```bash
blender -b -t 8 --python blender/build_asset_library.py
```

## Sample episode
**The London Beer Flood of 1814** — an original 30-second history short set in Georgian London. The local deliverable includes a 720×1280, 15-fps storyboard-quality preview with generated narration/audio; the intended Remotion/Three.js render is 1080×1920 at 30 fps. See the README and QA report in the local delivery bundle for the exact verification status.

## Important status
The Three.js/Remotion source and Blender generator are included, but the connected execution environment did not have Blender or the npm dependencies installed. Do not describe the 2.5D preview as a completed Blender/Three.js final render. Generate the assets and run the commands above on a configured workstation before claiming a full-resolution final.

## Research & attribution
The project is informed by the public workflow in [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts), MIT licensed. See `UPSTREAM.md` for scope and limitations. The public skill says the channel and full reference videos are private study material; this repo does not rehost those videos or reference frames and does not claim to have downloaded ten uploads from an unidentified channel.
