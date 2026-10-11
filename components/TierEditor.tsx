"use client";

import { motion } from "framer-motion";

export interface Tier {
  tier: "basic" | "advanced";
  name: string;
  startingPrice: number;
  features: string[];
  eligibleServices: string[];
}

interface Props {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
}

export default function TierEditor({ tiers, onChange }: Props) {
  const update = (i: number, patch: Partial<Tier>) => {
    const next = [...tiers];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const addTier = () =>
    onChange([
      ...tiers,
      {
        tier: "basic",
        name: "New Tier",
        startingPrice: 0,
        features: [],
        eligibleServices: [],
      },
    ]);

  const remove = (i: number) =>
    onChange(tiers.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {tiers.map((t, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <select
              value={t.tier}
              onChange={(e) =>
                update(i, { tier: e.target.value as "basic" | "advanced" })
              }
              className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </select>
            <input
              value={t.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Tier name"
              className="flex-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
            />
            <input
              type="number"
              value={t.startingPrice}
              onChange={(e) =>
                update(i, { startingPrice: Number(e.target.value) })
              }
              placeholder="Price"
              className="w-24 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
            />
            <button
              onClick={() => remove(i)}
              className="px-2 py-1 rounded-md text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              ✕
            </button>
          </div>

          <label className="block text-[10px] uppercase text-neutral-500 mb-1">
            Features (one per line)
          </label>
          <textarea
            value={t.features.join("\n")}
            onChange={(e) =>
              update(i, { features: e.target.value.split("\n") })
            }
            rows={4}
            className="w-full px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono mb-2"
          />

          <label className="block text-[10px] uppercase text-neutral-500 mb-1">
            Eligible services (comma separated)
          </label>
          <input
            value={t.eligibleServices.join(", ")}
            onChange={(e) =>
              update(i, {
                eligibleServices: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="w-full px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
          />
        </div>
      ))}

      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={addTier}
        className="w-full py-3 rounded-xl border border-dashed border-purple-500/40 text-purple-400 text-xs font-semibold hover:bg-purple-500/10"
      >
        + Add Tier
      </motion.button>
    </div>
  );
}