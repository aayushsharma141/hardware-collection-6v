# `src/components/audio/`

Ambient audio architecture for Hardware Collection showroom experience.

## Components & Modules

- **`BackgroundAudio.tsx`**: Invisible ambient sound engine mounted in the root layout shell. Handles browser autoplay restrictions (begins playback with smooth fade-in upon first user interaction), cross-route continuous playback without cuts, visibility-change backgrounding, and visitor mute preferences in `localStorage`.
- **`AudioMuteButton.tsx`**: Discreet circular tactile mute/unmute icon button integrated into the top Navbar.
- **`audioStore.ts`**: Lightweight Zustand store synchronizing mute/play state and toggle triggers between the audio engine and the Navbar button.
