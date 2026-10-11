"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import NavArrows from "./NavArrows";
import InquiryModal from "./InquiryModal";
import CircleWipe from "./CircleWipe";
import SocialBar from "./SocialBar";

import OpeningState from "./states/OpeningState";
import HeroState from "./states/HeroState";
import AboutState from "./states/AboutState";
import PortfolioState from "./states/PortfolioState";
import TestimonialsState from "./states/TestimonialsState";
import PlansState from "./states/PlansState";
import FinalCTAState from "./states/FinalCTAState";

export type ExperienceState =
  | "opening"
  | "hero"
  | "about"
  | "portfolio"
  | "testimonials"
  | "plans"
  | "final";

const ORDER: ExperienceState[] = [
  "opening",
  "hero",
  "about",
  "portfolio",
  "testimonials",
  "plans",
  "final",
];

// Wipe color for each destination state
const WIPE_COLORS: Record<ExperienceState, string> = {
  opening: "#10001F",
  hero: "#DDE5FC",
  about: "#0a0005",
  portfolio: "#DDE5FC",
  testimonials: "#DDE5FC",
  plans: "#DDE5FC",
  final: "#10001F",
};

export default function Experience() {
  const [state, setState] = useState<ExperienceState>("opening");
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wipeActive, setWipeActive] = useState(false);
  const [wipeColor, setWipeColor] = useState("#DDE5FC");
  const [wipeOrigin, setWipeOrigin] = useState({ x: 0, y: 0 });
  const [inquiryPrefill, setInquiryPrefill] = useState<
    | {
        projectType?: string;
        budget?: string;
        message?: string;
      }
    | undefined
  >(undefined);

  const currentIndex = ORDER.indexOf(state);

  const transitionTo = useCallback(
    (
      nextState: ExperienceState,
      nextPortfolioIndex = 0,
      clickPoint?: { x: number; y: number }
    ) => {
      if (nextState === state && nextPortfolioIndex === portfolioIndex) return;

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

  const closeModal = () => {
    setIsModalOpen(false);
    setInquiryPrefill(undefined);
  };

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
            onPlans={(e) =>
              transitionTo("plans", 0, { x: e.clientX, y: e.clientY })
            }
          />
        )}
        {state === "testimonials" && (
          <TestimonialsState key="testimonials" />
        )}
        {state === "plans" && (
          <PlansState
            key="plans"
            onOrder={({
              categoryName,
              tierName,
              startingPrice,
              selectedAddons,
              estimatedTotal,
            }) => {
              const total = estimatedTotal;
              const budget =
                total < 500
                  ? "Under ₹500"
                  : total < 1000
                  ? "₹500 – ₹1000"
                  : total < 1500
                  ? "₹1000 – ₹1500"
                  : total < 3000
                  ? "₹1500 – ₹3,000"
                  : "₹3,000+";

              const addonLines = selectedAddons.length
                ? `\n\nAdd-ons:\n${selectedAddons
                    .map((a) => `• ${a.name} — ₹${a.price}`)
                    .join("\n")}`
                : "";

              setInquiryPrefill({
                projectType: "",
                budget,
                message:
                  `[From Plans — ${categoryName}]\n\n` +
                  `Interested in: ${tierName}\n` +
                  `Starting price: ₹${startingPrice}` +
                  addonLines +
                  `\n\nEstimated total: ₹${total.toLocaleString("en-IN")}` +
                  `\n\nPlease share more details.`,
              });
              setIsModalOpen(true);
            }}
          />
        )}
        {state === "final" && (
          <FinalCTAState
            key="final"
            onOrder={() => {
              setInquiryPrefill(undefined);
              setIsModalOpen(true);
            }}
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
        onClose={closeModal}
        prefill={inquiryPrefill}
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