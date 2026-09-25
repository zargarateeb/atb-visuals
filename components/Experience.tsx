"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import TestimonialsState from "./states/TestimonialsState";
import NavArrows from "./NavArrows";
import InquiryModal from "./InquiryModal";
import CircleWipe from "./CircleWipe";
import SocialBar from "./SocialBar";

import OpeningState from "./states/OpeningState";
import HeroState from "./states/HeroState";
import AboutState from "./states/AboutState";
import PortfolioState from "./states/PortfolioState";
import FinalCTAState from "./states/FinalCTAState";

export type ExperienceState =
  | "opening"
  | "hero"
  | "about"
  | "portfolio"
  | "testimonials"
  | "final";

const ORDER: ExperienceState[] = [
  "opening",
  "hero",
  "about",
  "portfolio",
  "testimonials",
  "final",
];

const WIPE_COLORS: Record<ExperienceState, string> = {
  opening: "#10001F",
  hero: "#DDE5FC",
  about: "#0a0005",
  portfolio: "#DDE5FC",
  testimonials: "#DDE5FC",
  final: "#10001F",
};
export default function Experience() {
  const [state, setState] = useState<ExperienceState>("opening");
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wipeActive, setWipeActive] = useState(false);
  const [wipeColor, setWipeColor] = useState("#DDE5FC");
  const [wipeOrigin, setWipeOrigin] = useState({ x: 0, y: 0 });

  const currentIndex = ORDER.indexOf(state);

  // transitionTo now accepts optional click coordinates
  const transitionTo = useCallback(
    (
      nextState: ExperienceState,
      nextPortfolioIndex = 0,
      clickPoint?: { x: number; y: number }
    ) => {
      if (nextState === state && nextPortfolioIndex === portfolioIndex) return;

      // If a click point is provided, start there. Otherwise, center of screen.
      const origin =
        clickPoint ??
        (typeof window !== "undefined"
          ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
          : { x: 0, y: 0 });

      setWipeOrigin(origin);
      setWipeColor(WIPE_COLORS[nextState]);
      setWipeActive(true);

      setTimeout(() => {
        setState(nextState);
        setPortfolioIndex(nextPortfolioIndex);
      }, 550);

      setTimeout(() => {
        setWipeActive(false);
      }, 1150);
    },
    [state, portfolioIndex]
  );

  const goNext = () => {
    if (state === "portfolio") {
      if (portfolioIndex < 3) {
        setPortfolioIndex((i) => i + 1);
        return;
      }
    }
    if (currentIndex < ORDER.length - 1) {
      transitionTo(ORDER[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (state === "portfolio") {
      if (portfolioIndex > 0) {
        setPortfolioIndex((i) => i - 1);
        return;
      }
    }
    if (currentIndex > 0) {
      transitionTo(ORDER[currentIndex - 1]);
    }
  };

  const canPrev = state === "portfolio" ? portfolioIndex > 0 : currentIndex > 0;
  const canNext =
    state === "portfolio"
      ? portfolioIndex < 3
      : currentIndex < ORDER.length - 1;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {state === "opening" && (
          <OpeningState
            key="opening"
            onYes={(e) =>
              transitionTo("hero", 0, { x: e.clientX, y: e.clientY })
            }
          />
        )}
        {state === "hero" && (
          <HeroState
            key="hero"
            onPortfolio={(e) =>
              transitionTo("portfolio", 0, { x: e.clientX, y: e.clientY })
            }
            onAbout={(e) =>
              transitionTo("about", 0, { x: e.clientX, y: e.clientY })
            }
          />
        )}
        {state === "about" && <AboutState key="about" />}
        {state === "portfolio" && (
  <PortfolioState
    key="portfolio"
    index={portfolioIndex}
    onOrder={(e) =>
      transitionTo("final", 0, { x: e.clientX, y: e.clientY })
    }
    onTestimonials={(e) =>
      transitionTo("testimonials", 0, { x: e.clientX, y: e.clientY })
    }
  />
)}
{state === "testimonials" && (
  <TestimonialsState key="testimonials" />
)}
        {state === "final" && (
          <FinalCTAState
            key="final"
            onOrder={() => setIsModalOpen(true)}
            onRestart={(e) =>
              transitionTo("opening", 0, { x: e.clientX, y: e.clientY })
            }
          />
        )}
      </AnimatePresence>

      {state !== "portfolio" && (
        <NavArrows
          onPrev={goPrev}
          onNext={goNext}
          canPrev={canPrev}
          canNext={canNext}
        />
      )}

      <SocialBar hidden={state === "portfolio"} />

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <CircleWipe
        isActive={wipeActive}
        color={wipeColor}
        originX={wipeOrigin.x}
        originY={wipeOrigin.y}
      />
    </div>
  );
}