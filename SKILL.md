---
name: justanimate-original-shorts
description: Produce original vertical animated shorts with Three.js, Blender, Remotion, original audio and frame QA.
---
# JustAnimate production skill

## Creative rules
- Create original scripts, characters, shots, compositions, audio and assets. References may inform general production principles only; never reproduce a creator's distinctive expression.
- Fact-check historical claims and place source links above the script. Separate confirmed facts from disputed estimates.
- Use original, public-domain, CC0 or properly licensed assets; record provenance and licences.
- Default: 9:16, 30 fps, English narration, no captions, logos, intro/outro or CTA unless requested.
- Clearly distinguish a storyboard preview from a verified Three.js/Blender final render.

## Pipeline
1. Research a visual true story and record sources.
2. Write an original hook → setting → escalation → mechanism → payoff script. For 30 seconds target about 95–115 words, then time the actual narration.
3. Build a JSON shot plan with frame ranges, camera moves, light changes and planned effects.
4. Generate/record narration and hand-check names, numbers and word timings.
5. Build reusable metre-scaled modular assets in Blender; apply transforms and export GLB.
6. Stage a Three.js world with original characters, readable props, grounded shadows, selective depth of field and motivated camera movement.
7. Create original music/SFX, ducking the score under speech.
8. Render diagnostic stills, inspect composition, continuity, scale, lighting and frame-edge clipping.
9. Render exact runtime at 30 fps; default 1080x1920, optional 1440x2560.
10. Run frame/audio QA: black/white/frozen/pop frames, exact duration, fps, resolution, audio sample rate, loudness and contact sheets.
11. Fix failures, render again and document exactly what was verified.

## Character and world rules
- Characters are owned designs with consistent facial proportions, costumes and colours.
- Use original silhouettes and face details. Character cards should be lit by the scene and have believable contact shadows.
- Reuse named GLB assets; provide procedural fallbacks.
- Every hold needs subtle camera or environmental motion. Use motivated continuous camera travel and short dissolves only for actual location changes.
- Keep props recognisable and away from accidental frame-edge crops.

## Sound
- Voice leads; target about -14 LUFS integrated and true peak below -1 dBTP, then measure the actual export.
- Lock picture timing before final sound design. Re-time/re-mix if any shot duration changes.
