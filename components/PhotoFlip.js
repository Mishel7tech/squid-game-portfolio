"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// One poster card that follows the whole page:
//  hero    -> drops in spinning, shows the Player 456 poster
//  travel  -> small spinning token directly below the runner, in one line (teal "456" / black "FRONT MAN", no photo)
//  final   -> only once the Final Round section arrives it grows big and flips to the Front Man poster
const K = [0, 0.1, 0.2, 0.78, 1];
const CFG = {
  desk: { l: [81, 81, 91, 91, 91], t: [50, 50, 35, 83, 83], s: [1, 1, 0.3, 0.3, 0.3], end: { l: 76, t: 50, s: 1.4 } },
  mob:  { l: [24, 24, 90, 90, 90], t: [87, 87, 31, 79, 79], s: [0.7, 0.7, 0.3, 0.3, 0.3], end: { l: 50, t: 76, s: 1.5 } },
};
const SPIN = [0, 0, 360, 1440, 1440];
const mix = (a, b, f) => a + (b - a) * f;

export default function PhotoFlip() {
  const { scrollY, scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const [m, setM] = useState(false);
  const geo = useRef({ top: 1e9, vh: 800 });
  useEffect(() => {
    const q = window.matchMedia("(max-width:700px)");
    const f = () => setM(q.matches);
    f(); q.addEventListener("change", f);
    const measure = () => {
      const el = document.getElementById("contact");
      geo.current = { top: el ? el.getBoundingClientRect().top + window.scrollY : 1e9, vh: window.innerHeight };
    };
    measure();
    const id = setInterval(measure, 800); // layout settles after fonts/animations
    window.addEventListener("resize", measure);
    return () => { q.removeEventListener("change", f); clearInterval(id); window.removeEventListener("resize", measure); };
  }, []);
  const c = m ? CFG.mob : CFG.desk;

  // 0 -> 1 only while the Final Round section scrolls into view
  const fin0 = useTransform(scrollY, (v) => {
    const { top, vh } = geo.current;
    return Math.min(1, Math.max(0, (v - (top - vh * 0.95)) / (vh * 0.6)));
  });
  const fin = useSpring(fin0, { stiffness: 70, damping: 20 });

  const lT = useTransform(p, K, c.l), tT = useTransform(p, K, c.t), sT = useTransform(p, K, c.s), rT = useTransform(p, K, SPIN);
  const left = useTransform([lT, fin], ([a, f]) => mix(a, c.end.l, f) + "vw");
  const top = useTransform([tT, fin], ([a, f]) => mix(a, c.end.t, f) + "vh");
  const scale = useTransform([sT, fin], ([a, f]) => mix(a, c.end.s, f));
  const rotateY = useTransform([rT, fin], ([a, f]) => a + f * 180); // lands on the back face (Front Man)
  const tokIn = useTransform(p, [0.05, 0.14], [0, 1]);
  const tok = useTransform([tokIn, fin], ([a, f]) => a * (1 - Math.min(1, f * 1.6)));

  return (
    <motion.div className="flip" aria-hidden="true" style={{ left, top, x: "-50%", y: "-50%", scale, rotateY, transformPerspective: 1400 }}>
      <motion.div className="flip-in"
        initial={{ y: -900, rotateY: 720, rotate: -28, scale: 0.55, opacity: 0 }}
        animate={{ y: 0, rotateY: 0, rotate: -3, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 38, damping: 11, mass: 1.1, delay: 3.6 }}>
        <div className="float">
          <div className="face">
            <img src="/player-456.jpg" alt="" draggable={false} />
            <motion.div className="tok t456" style={{ opacity: tok }}><small>○ △ □</small><b>456</b><small>PLAYER</small></motion.div>
          </div>
          <div className="face back">
            <img src="/front-man.jpg" alt="" draggable={false} />
            <motion.div className="tok tfm" style={{ opacity: tok }}><small>○ △ □</small><b>FRONT<br />MAN</b></motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
