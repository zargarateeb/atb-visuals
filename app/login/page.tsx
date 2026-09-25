"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, #1a0033 0%, #10001F 60%, #0a0014 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "linear-gradient(180deg, #1a0033 0%, #10001F 100%)",
          border: "1px solid rgba(192, 0, 255, 0.3)",
          boxShadow:
            "0 0 60px rgba(160, 0, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-neutral-400 text-sm mb-8 text-center">
          ATB Visuals — Protected Area
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-neutral-400 mb-1.5 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs text-neutral-400 mb-1.5 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none transition-colors text-sm"
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs text-center py-2">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="mt-2 px-6 py-3 rounded-full text-white font-semibold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            style={{
              background: "linear-gradient(180deg, #C000FF, #8A00E0)",
              boxShadow:
                "0 0 25px rgba(192, 0, 255, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {loading ? "Logging in..." : "Log In →"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}