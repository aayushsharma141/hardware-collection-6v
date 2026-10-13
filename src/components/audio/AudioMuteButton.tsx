"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioStore } from "./audioStore";

interface AudioMuteButtonProps {
  className?: string;
}

export function AudioMuteButton({ className = "" }: AudioMuteButtonProps) {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const toggle = useAudioStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Mute background audio" : "Play background audio"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Mute background ambience" : "Play background ambience"}
      className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8b1a42] select-none shrink-0 ${
        isPlaying
          ? "bg-white/40 hover:bg-white/65 text-[#8b1a42] border border-white/60 shadow-[0_2px_6px_rgba(26,16,23,0.02),inset_0_1px_0_rgba(255,255,255,0.7)]"
          : "bg-white/20 hover:bg-white/40 text-[#7a6872] hover:text-[#1a1017] border border-white/40"
      } ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:scale-105" />
      ) : (
        <VolumeX className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:scale-105 opacity-75 group-hover:opacity-100" />
      )}
    </button>
  );
}
