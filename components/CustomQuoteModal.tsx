"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  name: string;
  basePrice: number;
}

interface Addon {
  name: string;
  price: number;
}

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  addons: Addon[];
  onSendQuote: (summary: string, finalPrice: number) => void;
}

const LENGTHS = [
  { label: "Up to 30 sec", multiplier: 1 },
  { label: "30–60 sec", multiplier: 1.3 },
  { label: "60–120 sec", multiplier: 1.6 },
  { label: "120+ sec", multiplier: 2 },
];

const TIERS = [
  { label: "Basic", multiplier: 1 },
  { label: "Advanced", multiplier: 1.8 },
];

export default function CustomQuoteModal({
  isOpen,
  onClose,
  services,
  addons,
  onSendQuote,
}: CustomQuoteModalProps) {
  const [serviceIdx, setServiceIdx] = useState(0);
  const [tierIdx, setTierIdx] = useState(0);
  const [lengthIdx, setLengthIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());
  const [rush, setRush] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setServiceIdx(0);
      setTierIdx(0);
      setLengthIdx(0);
      setSelectedAddons(new Set());
      setRush(false);
    }
  }, [isOpen]);

  // Live price calculation
  const breakdown = useMemo(() => {
    const service = services[serviceIdx];
    if (!service) return { base: 0, tiered: 0, lengthed: 0, addonsTotal: 0, rushTotal: 0, total: 0 };

    const base = service.basePrice;
    const tiered = base * TIERS[tierIdx].multiplier;
    const lengthed = tiered * LENGTHS[lengthIdx].multiplier;
    const addonsTotal = Array.from(selectedAddons).reduce(
      (sum, i) => sum + (addons[i]?.price || 0),
      0
    );
    const subtotal = lengthed + addonsTotal;
    const rushTotal = rush ? subtotal * 0.3 : 0;
    const total = Math.round(subtotal + rushTotal);

    return { base, tiered, lengthed, addonsTotal, rushTotal, total };
  }, [serviceIdx, tierIdx, lengthIdx, selectedAddons, rush, services, addons]);

  const toggleAddon = (i: number) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleSend = () => {
    const service = services[serviceIdx];
    const tier = TIERS[tierIdx];
    const length = LENGTHS[lengthIdx];
    const addonNames = Array.from(selectedAddons)
      .map((i) => addons[i]?.name)
      .filter(Boolean);

    const summary = [
      `Service: ${service?.name}`,
      `Tier: ${tier.label}`,
      `Length: ${length.label}`,
      addonNames.length > 0 ? `Add-ons: ${addonNames.join(", ")}` : null,
      rush ? `Rush delivery: Yes (+30%)` : null,
    ]
      .filter(Boolean)
      .join("\n");

    onSendQuote(summary, breakdown.total);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl rounded-3xl pointer-events-auto max-h-[92vh] overflow-y-auto flex flex-col md:flex-row"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E5E5E3",
                boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all z-10"
              >
                ✕
              </button>

              {/* LEFT: Configurator */}
              <div className="flex-1 p-6 md:p-7">
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#A000FF" }}
                >
                  Custom Quote
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                  Build your edit
                </h2>

                {/* Service */}
                <div className="mb-5">
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500">
                    Service
                  </label>
                  <select
                    value={serviceIdx}
                    onChange={(e) => setServiceIdx(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer"
                    style={{
                      borderColor: "#E5E5E3",
                      background: "#FAFAF9",
                      color: "#0A0A0A",
                    }}
                  >
                    {services.map((s, i) => (
                      <option key={i} value={i}>
                        {s.name} — ₹{s.basePrice}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier */}
                <div className="mb-5">
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500">
                    Quality Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIERS.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setTierIdx(i)}
                        className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: tierIdx === i ? "#A000FF" : "#FAFAF9",
                          color: tierIdx === i ? "#FFFFFF" : "#0A0A0A",
                          border:
                            tierIdx === i
                              ? "1.5px solid #A000FF"
                              : "1.5px solid #E5E5E3",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div className="mb-5">
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500">
                    Video Length
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LENGTHS.map((l, i) => (
                      <button
                        key={i}
                        onClick={() => setLengthIdx(i)}
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: lengthIdx === i ? "#A000FF" : "#FAFAF9",
                          color: lengthIdx === i ? "#FFFFFF" : "#0A0A0A",
                          border:
                            lengthIdx === i
                              ? "1.5px solid #A000FF"
                              : "1.5px solid #E5E5E3",
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div className="mb-5">
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500">
                    Add-ons
                  </label>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {addons.map((a, i) => (
                      <label
                        key={i}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: selectedAddons.has(i)
                            ? "rgba(160, 0, 255, 0.08)"
                            : "#FAFAF9",
                          border: selectedAddons.has(i)
                            ? "1.5px solid #A000FF"
                            : "1.5px solid #E5E5E3",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedAddons.has(i)}
                            onChange={() => toggleAddon(i)}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: "#A000FF" }}
                          />
                          <span className="text-sm font-medium text-neutral-800">
                            {a.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-neutral-500">
                          +₹{a.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rush */}
                <label className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer mb-4"
                  style={{
                    background: rush ? "rgba(160, 0, 255, 0.08)" : "#FAFAF9",
                    border: rush ? "1.5px solid #A000FF" : "1.5px solid #E5E5E3",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rush}
                    onChange={(e) => setRush(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: "#A000FF" }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-800">
                      Rush delivery (24h)
                    </p>
                    <p className="text-xs text-neutral-500">
                      Skip the queue — priority turnaround
                    </p>
                  </div>
                  <span className="text-sm font-bold text-neutral-500">
                    +30%
                  </span>
                </label>
              </div>

              {/* RIGHT: Price breakdown */}
              <div
                className="md:w-72 p-6 md:p-7 flex flex-col"
                style={{
                  background: "#10001F",
                  borderRadius: "0 24px 24px 0",
                }}
              >
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
                  style={{ color: "#A78BFA" }}
                >
                  Price Estimate
                </p>

                <div className="flex flex-col gap-3 mb-5 text-xs">
                  <Row label="Base" value={`₹${breakdown.base}`} />
                  <Row label="Tier x" value={`₹${Math.round(breakdown.tiered)}`} />
                  <Row label="Length x" value={`₹${Math.round(breakdown.lengthed)}`} />
                  <Row
                    label="Add-ons"
                    value={`+₹${breakdown.addonsTotal}`}
                  />
                  {rush && (
                    <Row
                      label="Rush +30%"
                      value={`+₹${Math.round(breakdown.rushTotal)}`}
                    />
                  )}
                </div>

                <div
                  className="pt-4 mt-auto"
                  style={{ borderTop: "1px solid rgba(185, 139, 255, 0.2)" }}
                >
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
                    style={{ color: "#A78BFA" }}
                  >
                    Estimated Total
                  </p>
                  <p
                    className="font-display font-black text-4xl mb-5"
                    style={{
                      color: "#FFFFFF",
                      textShadow: "0 0 30px rgba(160, 0, 255, 0.6)",
                    }}
                  >
                    ₹{breakdown.total.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-neutral-400 mb-4 leading-relaxed">
                    This is an estimate. Final quote may vary based on actual
                    footage and complexity.
                  </p>

                  <button
                    onClick={handleSend}
                    className="w-full py-3 rounded-full font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(180deg, #C000FF, #8A00E0)",
                      color: "#FFFFFF",
                      boxShadow:
                        "0 8px 24px rgba(160, 0, 255, 0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    Send Quote Request →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "#A78BFA" }}>{label}</span>
      <span className="font-semibold" style={{ color: "#FFFFFF" }}>
        {value}
      </span>
    </div>
  );
}