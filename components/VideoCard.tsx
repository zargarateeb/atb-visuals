"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

interface VideoCardProps {
  vimeoUrl: string;
  shape: "vertical" | "horizontal";
}

const getVimeoId = (url: string) => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : "";
};

export default function VideoCard({ vimeoUrl, shape }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const videoId = getVimeoId(vimeoUrl);
  const isVertical = shape === "vertical";

  useEffect(() => {
    if (!containerRef.current || !videoId) return;

    const player = new Player(containerRef.current, {
      id: Number(videoId),
      background: true,
      autopause: false,
      muted: true,
      loop: true,
      controls: false,
      responsive: true,
      dnt: true,
    });

    playerRef.current = player;

    player.on("play", () => setIsPlaying(true));
    player.on("pause", () => setIsPlaying(false));

    return () => {
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    if (hovered) {
      player.play().catch(() => {});
    } else {
      player.pause().catch(() => {});
      // Auto-mute when leaving, so next hover doesn't blast audio
      player.setMuted(true).catch(() => {});
      setIsMuted(true);
    }
  }, [hovered]);

  const toggleMute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    const newMuted = !isMuted;
    await playerRef.current.setMuted(newMuted);
    setIsMuted(newMuted);

    // If unmuting, also make sure video is playing
    if (!newMuted) {
      await playerRef.current.play().catch(() => {});
    }
  };

  const togglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) {
      await playerRef.current.pause();
    } else {
      await playerRef.current.play();
    }
  };

  const seekBack = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    const current = (await playerRef.current.getCurrentTime()) as number;
    await playerRef.current.setCurrentTime(Math.max(0, current - 5));
  };

  const seekForward = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    const current = (await playerRef.current.getCurrentTime()) as number;
    await playerRef.current.setCurrentTime(current + 5);
  };

  const handleTouch = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause().catch(() => {});
    } else {
      playerRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouch}
      className="relative rounded-[28px] overflow-hidden flex-shrink-0 group"
      style={{
        width: isVertical ? "clamp(180px, 22vw, 300px)" : "100%",
          aspectRatio: isVertical ? "9 / 16" : "16 / 9",
          maxHeight: isVertical ? "none" : "auto",
        background: "#000",
        border: "2px solid #E6A23C",
        boxShadow:
          "0 20px 50px rgba(0,0,0,0.3), 0 0 40px rgba(230, 162, 60, 0.2)",
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none transition-opacity"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Controls */}
      <div
        className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-center gap-2 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none" }}
      >
        <ControlBtn onClick={seekBack} label="Back 5s">
          ⏪
        </ControlBtn>
        <ControlBtn onClick={togglePlay} label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </ControlBtn>
        <ControlBtn onClick={seekForward} label="Forward 5s">
          ⏩
        </ControlBtn>

        {/* Mute — highlighted when muted so user knows to click it */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            background: isMuted ? "rgba(230, 162, 60, 0.9)" : "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            border: isMuted
              ? "1px solid rgba(255, 255, 255, 0.6)"
              : "1px solid rgba(255,255,255,0.2)",
            color: "white",
            boxShadow: isMuted
              ? "0 0 15px rgba(230, 162, 60, 0.6)"
              : "none",
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}

function ControlBtn({
  onClick,
  label,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-110 active:scale-95 cursor-pointer"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {children}
    </button>
  );
}