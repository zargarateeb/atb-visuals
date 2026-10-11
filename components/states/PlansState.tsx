"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADDONS } from "@/lib/config/addons";

interface PlanTier {
  tier: "basic" | "advanced";
  name: string;
  startingPrice: number;
  features: string[];
  eligibleServices: string[];
}

interface PlanCategory {
  _id: string;
  slug: string;
  name: string;
  icon: string;
  subtitle: string;
  order: number;
  tiers: PlanTier[];
  isCustom?: boolean;
}

interface SelectedAddon {
  name: string;
  price: number;
}

interface PlansStateProps {
  onOrder: (payload: {
    categoryName: string;
    tierName: string;
    startingPrice: number;
    selectedAddons: SelectedAddon[];
    estimatedTotal: number;
  }) => void;
}

/* ---------------- Tier Card ---------------- */

function TierCard({
  tier,
  categoryName,
  onOrder,
}: {
  tier: PlanTier;
  categoryName: string;
  onOrder: PlansStateProps["onOrder"];
}) {
  const isAdvanced = tier.tier === "advanced";
  const [addonsOpen, setAddonsOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAddon = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedAddons: SelectedAddon[] = ADDONS.filter((a) =>
    selected.has(a.id)
  ).map((a) => ({ name: a.name, price: a.price }));

  const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const estimatedTotal = tier.startingPrice + addonsTotal;

  return (
    <div
      className="relative flex flex-col rounded-2xl p-5"
      style={{
        background: isAdvanced
          ? "linear-gradient(180deg, #10001F 0%, #1D003D 100%)"
          : "#FFFFFF",
        border: isAdvanced ? "1.5px solid #A000FF" : "1.5px solid #E5E5E3",
        boxShadow: isAdvanced
          ? "0 12px 40px rgba(160, 0, 255, 0.35)"
          : "0 4px 16px rgba(0, 0, 0, 0.04)",
      }}
    >
      {isAdvanced && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #C000FF, #8B5CF6)",
            color: "#FFFFFF",
          }}
        >
          Most Popular
        </div>
      )}

      <h4
        className="font-display text-lg font-bold mb-1"
        style={{ color: isAdvanced ? "#FFFFFF" : "#0A0A0A" }}
      >
        {tier.name}
      </h4>
      <p
        className="text-[11px] mb-4"
        style={{ color: isAdvanced ? "#A78BFA" : "#6B7280" }}
      >
        {tier.eligibleServices.join(" · ")}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span
          className="text-[10px] font-medium"
          style={{ color: isAdvanced ? "#A78BFA" : "#6B7280" }}
        >
          from
        </span>
        <span
          className="font-display font-black text-3xl"
          style={{
            color: isAdvanced ? "#FFFFFF" : "#0A0A0A",
            textShadow: isAdvanced
              ? "0 0 24px rgba(160, 0, 255, 0.5)"
              : "none",
          }}
        >
          ₹{tier.startingPrice}
        </span>
      </div>

      {/* Features */}
      <ul className="flex-1 flex flex-col gap-2 mb-4">
        {tier.features.map((f, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-[13px]"
            style={{ color: isAdvanced ? "#D4D4D8" : "#4B5563" }}
          >
            <span
              className="flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center mt-0.5"
              style={{
                background: isAdvanced
                  ? "rgba(160, 0, 255, 0.25)"
                  : "rgba(160, 0, 255, 0.12)",
                color: "#A000FF",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-2 h-2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Add-ons toggle */}
      <button
        onClick={() => setAddonsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold mb-3 cursor-pointer transition-all"
        style={{
          background: isAdvanced ? "rgba(160,0,255,0.15)" : "#F4F6FF",
          color: isAdvanced ? "#D4D4D8" : "#4B5563",
          border: isAdvanced
            ? "1px solid rgba(160,0,255,0.3)"
            : "1px solid #E5E5E3",
        }}
      >
        <span>
          {selected.size > 0
            ? `＋ ${selected.size} add-on${selected.size > 1 ? "s" : ""}`
            : "＋ Add-ons (optional)"}
        </span>
        <motion.span
          animate={{ rotate: addonsOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px]"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {addonsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-3"
          >
            <div className="flex flex-col gap-1.5">
              {ADDONS.map((a) => {
                const on = selected.has(a.id);
                return (
                  <label
                    key={a.id}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-all"
                    style={{
                      background: on
                        ? isAdvanced
                          ? "rgba(160,0,255,0.2)"
                          : "rgba(160,0,255,0.08)"
                        : isAdvanced
                        ? "rgba(255,255,255,0.03)"
                        : "#FAFAF9",
                      border: on
                        ? "1px solid #A000FF"
                        : isAdvanced
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid #E5E5E3",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleAddon(a.id)}
                        className="w-3.5 h-3.5 cursor-pointer"
                        style={{ accentColor: "#A000FF" }}
                      />
                      <span
                        style={{
                          color: isAdvanced ? "#E4E4E7" : "#374151",
                        }}
                      >
                        {a.name}
                      </span>
                    </div>
                    <span
                      className="font-semibold"
                      style={{ color: isAdvanced ? "#A78BFA" : "#6B7280" }}
                    >
                      +₹{a.price}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estimated total if addons picked */}
      {selected.size > 0 && (
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl mb-3 text-xs font-semibold"
          style={{
            background: isAdvanced ? "rgba(160,0,255,0.15)" : "#F4F6FF",
            color: isAdvanced ? "#FFFFFF" : "#0A0A0A",
            border: "1px solid #A000FF",
          }}
        >
          <span>Estimated total</span>
          <span className="font-display text-base font-black">
            ₹{estimatedTotal.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() =>
          onOrder({
            categoryName,
            tierName: tier.name,
            startingPrice: tier.startingPrice,
            selectedAddons,
            estimatedTotal,
          })
        }
        className="w-full py-3 rounded-full font-bold text-sm transition-all hover:scale-[1.02] cursor-pointer"
        style={{
          background: isAdvanced
            ? "linear-gradient(180deg, #C000FF, #8A00E0)"
            : "linear-gradient(180deg, #B000FF, #8A00E0)",
          color: "#FFFFFF",
          boxShadow: isAdvanced
            ? "0 8px 24px rgba(160, 0, 255, 0.5)"
            : "0 8px 24px rgba(160, 0, 255, 0.3)",
        }}
      >
        Get {tier.name} →
      </button>
    </div>
  );
}

/* ---------------- PlansState ---------------- */

export default function PlansState({ onOrder }: PlansStateProps) {
  const [categories, setCategories] = useState<PlanCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/plan-categories", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
          const firstReal = data.categories.find(
            (c: PlanCategory) => !c.isCustom
          );
          if (firstReal) setOpenSlug(firstReal.slug);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggle = (slug: string) =>
    setOpenSlug((prev) => (prev === slug ? null : slug));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#DDE5FC" }}
    >
      <div className="relative z-10 h-full w-full overflow-y-auto px-6 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 md:mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-3"
              style={{ color: "#A000FF" }}
            >
              Pricing & Plans
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.05]"
            >
              Choose your edit style.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-neutral-600 text-sm md:text-base mt-4 max-w-xl mx-auto"
            >
              Starting prices — final quote depends on footage, duration, and
              complexity. Expand a category, add optional upgrades, or build
              your own.
            </motion.p>
          </div>

          {loading && (
            <div className="text-center py-20 text-neutral-500">
              Loading plans...
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="flex flex-col gap-4">
              {categories.map((cat, i) => {
                const isOpen = openSlug === cat.slug;
                const isCustom = !!cat.isCustom;

                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-3xl overflow-hidden transition-shadow"
                    style={{
                      background: isOpen ? "#FFFFFF" : "#F4F6FF",
                      border: isOpen
                        ? "1.5px solid #A000FF"
                        : "1.5px solid #E5E5E3",
                      boxShadow: isOpen
                        ? "0 20px 60px rgba(160, 0, 255, 0.15)"
                        : "0 4px 16px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <button
                      onClick={() => toggle(cat.slug)}
                      className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                          style={{
                            background: isOpen
                              ? "linear-gradient(135deg, #C000FF, #8B5CF6)"
                              : "rgba(160, 0, 255, 0.10)",
                          }}
                        >
                          {cat.icon}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-display text-lg md:text-xl font-bold text-neutral-900 truncate">
                            {cat.name}
                          </h3>
                          <p className="text-xs md:text-sm text-neutral-500 truncate">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: isOpen
                            ? "#A000FF"
                            : "rgba(160, 0, 255, 0.10)",
                          color: isOpen ? "#FFFFFF" : "#A000FF",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="w-4 h-4"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-7 pb-6 pt-1">
                            {isCustom ? (
                              <div className="text-center py-6">
                                <p className="text-sm text-neutral-600 mb-4 max-w-md mx-auto">
                                  Build a package from scratch — pick your
                                  service, tier, length, and add-ons. Live
                                  price estimate.
                                </p>
                                <button
                                  onClick={() => setCalcOpen(true)}
                                  className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-[1.02] cursor-pointer"
                                  style={{
                                    background:
                                      "linear-gradient(180deg, #C000FF, #8A00E0)",
                                    color: "#FFFFFF",
                                    boxShadow:
                                      "0 8px 24px rgba(160, 0, 255, 0.4)",
                                  }}
                                >
                                  Open Calculator →
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`grid gap-4 ${
                                  cat.tiers.length === 1
                                    ? "grid-cols-1 max-w-md mx-auto"
                                    : "grid-cols-1 md:grid-cols-2"
                                }`}
                              >
                                {cat.tiers.map((t) => (
                                  <TierCard
                                    key={t.name}
                                    tier={t}
                                    categoryName={cat.name}
                                    onOrder={onOrder}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center text-xs md:text-sm mt-10 max-w-2xl mx-auto"
            style={{ color: "#6B7280" }}
          >
            Bulk packs and monthly plans available on request. All prices in
            INR. Custom quotes for SaaS, 3D, or complex projects.
          </motion.p>
        </div>
      </div>

      {/* Calculator modal — uses existing CustomQuoteModal, now fed from config */}
      {calcOpen && (
        <CalculatorModalWrapper
          onClose={() => setCalcOpen(false)}
          onSendQuote={(summary, price) => {
            setCalcOpen(false);
            onOrder({
              categoryName: "Custom / Build Your Own",
              tierName: "Custom Quote",
              startingPrice: price,
              selectedAddons: [],
              estimatedTotal: price,
            });
            // summary is discarded here — the parent's InquiryModal handles it
            // (kept for API-compat with CustomQuoteModal)
            void summary;
          }}
        />
      )}
    </motion.div>
  );
}

/* ---------------- Calculator wrapper ---------------- */

import CustomQuoteModal from "@/components/CustomQuoteModal";
import { CALC_SERVICES } from "@/lib/config/calculator";

function CalculatorModalWrapper({
  onClose,
  onSendQuote,
}: {
  onClose: () => void;
  onSendQuote: (summary: string, price: number) => void;
}) {
  return (
    <CustomQuoteModal
      isOpen={true}
      onClose={onClose}
      services={CALC_SERVICES.map((s) => ({
        name: s.name,
        basePrice: s.basePrice,
      }))}
      addons={ADDONS.map((a) => ({ name: a.name, price: a.price }))}
      onSendQuote={onSendQuote}
    />
  );
}