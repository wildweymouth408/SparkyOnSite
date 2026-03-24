# Sparky Video Production (Remotion)

This directory contains Remotion components for generating promotional videos for Sparky calculators.

## Structure

- `src/Root.tsx` – Registers video compositions.
- `src/WireSizingVideo.tsx` – 30‑second wire sizing calculator explainer.
- `public/` – Audio assets (music, narration).
- `remotion.config.ts` – Rendering configuration.

## Scripts

From the **project root**:

```bash
# Preview the video in the browser
npm run video:preview

# Render the video to MP4
npm run video
```

The output will be at `video/out/wire-sizing-video.mp4`.

## Audio Assets

Currently using **silent placeholder audio**. Replace with real assets:

1. **Background music** – upbeat instrumental (30 seconds)
   - Replace `public/music/upbeat-instrumental.mp3`
2. **Narration** – five clips matching the script:
   - `hook.mp3` (0‑5s): "Tired of wire‑size guesswork?"
   - `problem.mp3` (5‑12s): "Manual calculations waste time and risk NEC violations."
   - `solution.mp3` (12‑20s): "Sparky gives you the right answer every time."
   - `result.mp3` (20‑28s): "Twenty‑amp circuit… That’s #12 AWG."
   - `cta.mp3` (28‑30s): "Try Sparky free — link in bio."

Use ElevenLabs or similar TTS for narration.

## Adding a New Calculator Video

1. Duplicate `WireSizingVideo.tsx` and adjust scenes.
2. Add a new composition in `Root.tsx`.
3. Update `package.json` scripts if needed.
4. Create narration audio.

## Character Avatars

To add AI‑generated electrician avatars:

1. Generate images with Midjourney/Claude.
2. Save to `public/avatars/`
3. Import in component: `import avatar from '../public/avatars/electrician.png'`
4. Use Remotion's `<Img>` component.

## Brand Guidelines

- **Background:** `#09090b`
- **Surface:** `#18181b`
- **Border:** `#27272a`
- **Accent:** `#f97316`
- **Text primary:** `#fafafa`
- **Text secondary:** `#a1a1aa`
- **Fonts:** Inter (UI), JetBrains Mono (code)

## Next Steps

1. Replace placeholder audio with real narration/music.
2. Add AI avatar images.
3. Create videos for other calculators (conduit bending, voltage drop, etc.).
4. Automate via GitHub Actions (Spark agent).