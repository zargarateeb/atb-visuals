"use client";

interface NavArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function NavArrows({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: NavArrowsProps) {
  return (
    <div
      className="fixed bottom-5 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm select-none"
      style={{ boxShadow: "0 0 20px rgba(160, 0, 255, 0.15)" }}
    >
      <button
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous"
        className="text-white/90 hover:text-purple-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm"
      >
        ◀
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next"
        className="text-white/90 hover:text-purple-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm"
      >
        ▶
      </button>
    </div>
  );
}