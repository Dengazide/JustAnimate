# Pipeline architecture
1. Research facts and source links.
2. Write original narration and time the actual voice.
3. Plan shot intervals and camera/light/effect cues in JSON.
4. Generate reusable metre-scaled Blender assets and export GLB.
5. Stage the Three.js world, character cards and camera choreography.
6. Generate original voice/music/SFX, duck music under speech.
7. Review diagnostic stills for silhouette, scale, lighting, continuity and cropping.
8. Render exact runtime at 30 fps, 1080x1920 (or 1440x2560).
9. Run frame/audio QA and inspect contact sheets.
10. Fix issues, render again and record actual verification status.

Blender authors editable modular assets; Three.js renders and animates the scene; Remotion supplies the exact frame clock and encoding.
