"use client";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const INK = "#151018";
const PAL = ["#f5a3c7", "#9fe0c3", "#f7e07a", "#8ec5ff", "#ffb48a"];
const O = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" };

// Side-view cartoon character facing left. `shoot` = pink-suit guard with a rifle, otherwise green-tracksuit player.
function Char({ shoot }) {
  const suit = shoot ? "#ed1b76" : "#0f7a63";
  const dark = shoot ? "#b8124f" : "#0a5a49";
  const skin = "#f1c7a0";
  const leg = (cls, ox) => (
    <g className={`limb ${cls}`} style={{ transformOrigin: "32px 62px" }}>
      <rect x="28" y="60" width="9" height="28" rx="4" fill={dark} {...O} />
      <rect x="25" y="85" width="16" height="9" rx="4" fill={shoot ? INK : "#fff"} {...O} />
    </g>
  );
  return (
    <svg viewBox="0 0 78 104" className="chr" aria-hidden="true" style={{ overflow: "visible" }}>
      <g transform="translate(14 0)">
        <g className="bob">
          {leg("lb")}
          <g className="limb ab" style={{ transformOrigin: "32px 40px" }}>
            <rect x="28" y="37" width="8" height="25" rx="4" fill={dark} {...O} />
            <circle cx="32" cy="64" r="4" fill={skin} {...O} />
          </g>
          <rect x="21" y="34" width="22" height="32" rx="7" fill={suit} {...O} />
          {!shoot && <text x="32" y="55" textAnchor="middle" fontSize="8" fill="#fff" style={{ fontFamily: '"Black Han Sans",sans-serif' }}>456</text>}
          {shoot && <rect x="21" y="58" width="22" height="5" fill={INK} />}
          {/* head */}
          {shoot ? (
            <>
              <circle cx="32" cy="21" r="11.5" fill={INK} {...O} />
              <path d="M24 14 L30 24 L18 24 Z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <circle cx="32" cy="21" r="11" fill={skin} {...O} />
              <path d="M21 21 Q20 8 32 8.5 Q44 9 43 19 Q38 14 30 15.5 Q24 16.5 21 21Z" fill={INK} />
              <circle cx="26" cy="22" r="1.7" fill={INK} />
            </>
          )}
          {leg("lf")}
          {shoot ? (
            <g className="gun" style={{ transformOrigin: "32px 40px", transform: "rotate(70deg)" }}>
              <rect x="28" y="37" width="8" height="22" rx="4" fill={dark} {...O} />
              <rect x="29" y="52" width="6" height="32" rx="1.5" fill="#3a3340" {...O} />
              <rect x="26.5" y="58" width="5" height="9" rx="1.5" fill={INK} />
              <polygon className="flash" points="32,84 38,92 32,90 26,92" fill="#ffd500" stroke="#ed1b76" strokeWidth="1.5" />
            </g>
          ) : (
            <g className="limb af" style={{ transformOrigin: "32px 40px" }}>
              <rect x="28" y="37" width="8" height="25" rx="4" fill={suit} {...O} />
              <circle cx="32" cy="64" r="4" fill={skin} {...O} />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}

// Scroll-scene keyframes (progress 0 -> 1). Positions are the character's centre in vw / vh.
//  0-0.1  big, standing in the open area of the scene
//  0.1-0.2 shrink and start running into the distance (right lane)
//  0.2-0.78 small, running down the page
//  0.78-0.88 both runners fade out; the Front Man card takes the final round
const K = [0, 0.1, 0.2, 0.78, 0.88, 1];
const CFG = {
  desk: {
    pl: [67, 67, 91, 91, 91, 91], pt: [62, 62, 22, 70, 70, 70],
    sl: [56, 56, 91, 91, 91, 91], st: [28, 28, 8, 48, 48, 48],
  },
  mob: {
    pl: [74, 74, 91, 91, 91, 91], pt: [74, 74, 22, 70, 70, 70],
    sl: [70, 70, 91, 91, 91, 91], st: [38, 38, 8, 48, 48, 48],
  },
};
const vw = (a) => a.map((n) => n + "vw");
const vh = (a) => a.map((n) => n + "vh");

export default function Runners() {
  const { scrollY, scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width:700px)");
    const f = () => setM(q.matches);
    f(); q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  const c = m ? CFG.mob : CFG.desk;
  const small = m ? 0.36 : 0.34;
  const pLeft = useTransform(p, K, vw(c.pl));
  const pTop = useTransform(p, K, vh(c.pt));
  const pScale = useTransform(p, K, [1, 1, small, small, 0, 0]);
  const pOpacity = useTransform(p, K, [1, 1, 1, 1, 0, 0]);
  const sLeft = useTransform(p, K, vw(c.sl));
  const sTop = useTransform(p, K, vh(c.st));
  const sScale = useTransform(p, K, [1, 1, small, small, 0, 0]);
  const sOpacity = useTransform(p, K, [1, 1, 1, 1, 0, 0]);
  const [run, setRun] = useState(false);
  const t = useRef(null);
  useMotionValueEvent(scrollY, "change", () => {
    setRun(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setRun(false), 160);
  });
  useEffect(() => () => clearTimeout(t.current), []);
  const cls = `rn${run ? " run" : ""}`;
  return (
    <div className="runners" aria-hidden="true">
      <motion.div className={`${cls} shooter`} style={{ left: sLeft, top: sTop, x: "-50%", y: "-50%", scale: sScale, opacity: sOpacity }}>
        <div className="dn"><Char shoot /></div>
        <i className="bullet" /><i className="bullet b2" />
      </motion.div>
      <motion.div className={`${cls} player`} style={{ left: pLeft, top: pTop, x: "-50%", y: "-50%", scale: pScale, opacity: pOpacity }}>
        <div className="dn"><Char /></div>
      </motion.div>
    </div>
  );
}
