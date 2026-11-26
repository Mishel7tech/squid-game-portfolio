"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
const SH = ["M50 14 A36 36 0 1 1 49.9 14", "M150 12 L188 84 L112 84 Z", "M222 16 L286 16 L286 84 L222 84 Z"];
// The three shapes draw themselves, then 10 venetian-blind slats flip open to reveal the page.
export default function Intro() {
  const [done, setDone] = useState(false);
  useEffect(() => { const d = setTimeout(() => setDone(true), 3700); return () => clearTimeout(d); }, []);
  if (done) return null;
  return (
    <div className="intro">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div key={i} className="slat" style={{ top: `${i * 10}%`, background: i % 2 ? "#0f7a63" : "#ed1b76", transformPerspective: 800 }}
          initial={{ rotateX: 0 }} animate={{ rotateX: 90 }} transition={{ delay: 2.6 + i * 0.07, duration: 0.6, ease: "easeIn" }} />
      ))}
      <motion.div className="intro-c" animate={{ opacity: [1, 1, 0], scale: [1, 1, 1.4] }} transition={{ duration: 2.6, times: [0, 0.85, 1] }}>
        <svg viewBox="0 0 300 100" width="min(480px,80vw)">
          {SH.map((d, i) => <motion.path key={i} d={d} fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.5, duration: 0.7 }} />)}
        </svg>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Round 1 is about to begin</motion.p>
      </motion.div>
    </div>
  );
}
