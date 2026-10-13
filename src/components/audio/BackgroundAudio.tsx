"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useAudioStore } from "./audioStore";

interface BackgroundAudioProps {
  /** Path to audio file. Defaults to /audio/showroom-ambient.mp3 */
  src?: string;
  /** Ambient volume target between 0 and 1. Defaults to 0.25 (tasteful background level) */
  targetVolume?: number;
}

const STORAGE_KEY = "hc_bg_audio_enabled";

export function BackgroundAudio({
  src = "/audio/showroom-ambient.mp3",
  targetVolume = 0.25,
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeAnimationRef = useRef<number | null>(null);
  const wasPlayingBeforeHidden = useRef<boolean>(false);

  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);
  const registerToggle = useAudioStore((s) => s.registerToggle);

  /**
   * Smoothly fade volume using requestAnimationFrame to prevent abrupt audio pops.
   */
  const fadeVolume = useCallback(
    (toVolume: number, durationMs: number = 1000, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }

      const startVolume = audio.volume;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const current = startVolume + (toVolume - startVolume) * easeProgress;

        audio.volume = Math.max(0, Math.min(1, current));

        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(step);
        } else {
          audio.volume = toVolume;
          fadeAnimationRef.current = null;
          if (onComplete) onComplete();
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(step);
    },
    []
  );

  /**
   * Start playback with fade-in.
   */
  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeVolume(targetVolume, 1500);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [fadeVolume, setIsPlaying, targetVolume]);

  /**
   * Pause playback with brief fade-out.
   */
  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    fadeVolume(0, 350, () => {
      audio.pause();
      setIsPlaying(false);
    });
  }, [fadeVolume, setIsPlaying]);

  /**
   * Toggle audio explicitly when user clicks the mute control.
   */
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    const isCurrentlyPlaying = audio ? !audio.paused : false;
    const nextState = !isCurrentlyPlaying;

    try {
      localStorage.setItem(STORAGE_KEY, nextState ? "true" : "false");
    } catch {
      // Storage unavailable in private mode quota
    }

    if (nextState) {
      playAudio();
    } else {
      pauseAudio();
    }
  }, [playAudio, pauseAudio]);

  // Connect toggleAudio with the global audio store
  useEffect(() => {
    const unregister = registerToggle(toggleAudio);
    return unregister;
  }, [registerToggle, toggleAudio]);

  // Initial setup: check preference and register first-interaction listeners
  useEffect(() => {
    let savedPref: string | null = null;
    try {
      savedPref = localStorage.getItem(STORAGE_KEY);
    } catch {
      savedPref = null;
    }

    // If user previously explicitly muted, do not attempt auto-play
    if (savedPref === "false") {
      return;
    }

    // Try auto-play on first user interaction (click, scroll, tap, keydown)
    let triggered = false;
    const handleFirstInteraction = () => {
      if (triggered) return;
      triggered = true;

      cleanupListeners();

      let currentPref = "true";
      try {
        currentPref = localStorage.getItem(STORAGE_KEY) ?? "true";
      } catch {
        currentPref = "true";
      }

      if (currentPref !== "false") {
        playAudio();
      }
    };

    const interactionEvents = ["pointerdown", "touchstart", "keydown", "scroll"];
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    const cleanupListeners = () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction);
      });
    };

    return () => {
      cleanupListeners();
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, [playAudio]);

  // Handle document visibility change (mute when user tabs away)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingBeforeHidden.current = true;
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        if (wasPlayingBeforeHidden.current) {
          wasPlayingBeforeHidden.current = false;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setIsPlaying]);

  return (
    <audio
      ref={audioRef}
      src={src}
      loop
      preload="auto"
      className="hidden"
    />
  );
}
