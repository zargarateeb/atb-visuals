"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialBarProps {
  hidden?: boolean;
}

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/atb_visuals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@atb.visuals",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/918494043654",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6 0a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5a.5.5 0 0 0 0-.5c0-.2-.7-1.7-.9-2.3s-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.5 3.5 0 0 0-1.1 2.6A6.1 6.1 0 0 0 6.8 12a13.9 13.9 0 0 0 5.3 4.7 18 18 0 0 0 1.8.6 4.3 4.3 0 0 0 2 .1 3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.7-.4zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:visuals.atb@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 6 10-6" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ateeb-zargar-890022386",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.3 18.3v-8.6H5.7v8.6h2.6zM7 8.6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.7v-4.7c0-2.5-1.3-3.7-3.1-3.7a2.7 2.7 0 0 0-2.5 1.4v-1.2h-2.6v8.6h2.6v-4.5c0-1.2.2-2.3 1.7-2.3 1.4 0 1.4 1.3 1.4 2.4v4.4h2.5z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X (Twitter)",
    url: "https://x.com/ZargarAteeb_",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.2 3h3.3l-7.2 8.2L22.8 21h-6.6l-5.2-6.8L5.1 21H1.8l7.7-8.8L1.5 3h6.8l4.7 6.2L18.2 3zm-1.2 16.2h1.8L7.1 4.7H5.2l11.8 14.5z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/zargarateeb",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
];

export default function SocialBar({ hidden = false }: SocialBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Click-outside backdrop when open */}
      <AnimatePresence>
        {open && !hidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: "transparent" }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hidden ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        {/* Social icons — expand upward */}
        <AnimatePresence>
          {open &&
            SOCIALS.map((s, i) => (
              <motion.a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                transition={{
                  duration: 0.25,
                  delay: open ? i * 0.04 : (SOCIALS.length - i) * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-purple-300"
                style={{
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {s.icon}
              </motion.a>
            ))}
        </AnimatePresence>

        {/* Main toggle button */}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close social links" : "Open social links"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #C000FF, #8A00E0)",
            boxShadow:
              "0 0 20px rgba(192, 0, 255, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Plus icon that becomes X when rotated 45° */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </motion.button>
      </motion.div>
    </>
  );
}