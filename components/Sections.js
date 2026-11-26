"use client";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { profile, skills, jobs, projects } from "../lib/data";

const vp = { once: true, margin: "-80px" };
const PAL = ["#f5a3c7", "#9fe0c3", "#f7e07a", "#8ec5ff", "#ffb48a"];
const SYM = ["○", "△", "□", "◇"];
// Cards are "dealt" onto the table from off-screen
const deal = (i) => ({ initial: { opacity: 0, x: -420, y: -260, rotate: -35, scale: 0.7 }, whileInView: { opacity: 1, x: 0, y: 0, rotate: i % 2 ? 1.5 : -1.5, scale: 1 }, viewport: vp, transition: { type: "spring", stiffness: 70, damping: 14, delay: (i % 4) * 0.12 } });
// Stairs: each job climbs up into place
const climb = { initial: { opacity: 0, y: 140, scaleY: 0.6 }, whileInView: { opacity: 1, y: 0, scaleY: 1 }, viewport: vp, transition: { type: "spring", stiffness: 120, damping: 16 } };

export function Progress() {
  const { scrollYProgress } = useScroll();
  const [ch, setCh] = useState(0);
  const names = ["Welcome", "Game 1 · Skills", "Game 2 · Experience", "Game 3 · Projects", "Final Round"];
  useMotionValueEvent(scrollYProgress, "change", (v) => setCh(Math.min(4, Math.floor(v * 5))));
  return (
    <>
      <div className="steps">{PAL.map((c, i) => <motion.b key={i} style={{ background: i === ch ? "#ed1b76" : c, marginLeft: i * 7 }} animate={{ y: i === ch ? -6 : 0, scaleX: i === ch ? 1.4 : 1 }} />)}</div>
      <div className="label">{names[ch]}</div>
    </>
  );
}


export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -120]);
  const o = useTransform(scrollY, [0, 450], [1, 0]);
  return (
    <section className="hero">
      <motion.div style={{ y, opacity: o }} className="hero-text">
        <p className="kicker">○ △ □ &nbsp;Welcome, player</p>
        <h1>{profile.name.split(" ").map((w, i) => <span key={i} className={`word w${i}`} style={{ animationDelay: `${3.2 + i * 0.35}s` }}>{w}</span>)}</h1>
        <h2>{profile.role}</h2>
        <p className="lead">{profile.intro}</p>
        <a className="btn" href="#projects">Play the games</a>
        <a className="btn alt" href="#contact">Join the final round</a>
        <p className="hint">Scroll to climb the staircase</p>
      </motion.div>
    </section>
  );
}

function Tilt({ children, n, sym }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 18 });
  return (
    <motion.div className="tag" style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - b.left) / b.width - 0.5); y.set((e.clientY - b.top) / b.height - 0.5); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      <div className="strip"><span>No. {String(n).padStart(3, "0")}</span><span>{sym}</span></div>
      <div className="body">{children}</div>
    </motion.div>
  );
}

// Heading is wiped in from the left like a pink banner being pulled across
function Title({ sym, children }) {
  return <motion.h2 className="title" initial={{ clipPath: "inset(0 100% 0 0)" }} whileInView={{ clipPath: "inset(0 0% 0 0)" }} viewport={vp} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}><i>{sym}</i>{children}</motion.h2>;
}

export function Skills() {
  return (
    <section id="skills" className="sec">
      <Title sym="○">Game 1 · Skills</Title>
      <div className="grid4">
        {skills.map(([t, d], i) => <motion.div key={t} {...deal(i)}><Tilt n={i + 1} sym={SYM[i]}><h3>{t}</h3><p>{d}</p></Tilt></motion.div>)}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="sec">
      <Title sym="△">Game 2 · Experience</Title>
      <div className="stairs">
        {jobs.map(([role, org, when, text], i) => (
          <motion.div key={role} className="job" style={{ "--i": i }} {...climb}>
            <Tilt n={100 + i} sym={SYM[i % 4]}><small>{when}</small><h3>{role}</h3><b>{org}</b><p>{text}</p></Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const SHAPES = ["M0 -40 A40 40 0 1 1 -0.1 -40", "M0 -42 L42 32 L-42 32 Z", "M-36 -36 L36 -36 L36 36 L-36 36 Z", "M0 -44 L12 -14 L44 -14 L18 6 L28 38 L0 18 L-28 38 L-18 6 L-44 -14 L-12 -14 Z", "M0 -44 L38 0 L0 44 L-38 0 Z", "M0 -42 L36 -21 L36 21 L0 42 L-36 21 L-36 -21 Z"];
// Honeycomb-candy shape: outline traces itself, fills with honey, then "cracks" with a wobble
function Candy({ i }) {
  return (
    <motion.svg viewBox="-50 -50 100 100" className="candy" initial={{ rotate: 0 }} whileInView={{ rotate: [0, -8, 8, -4, 0] }} viewport={{ once: true }} transition={{ delay: 1.7, duration: 0.6 }}>
      <motion.path d={SHAPES[i % 6]} stroke="#151018" strokeWidth="5" strokeLinejoin="round" fill="#e9b44c" initial={{ pathLength: 0, fillOpacity: 0 }} whileInView={{ pathLength: 1, fillOpacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, fillOpacity: { delay: 1.3, duration: 0.4 } }} />
      <circle r="4" fill="#151018" />
    </motion.svg>
  );
}

export function Projects() {
  return (
    <section id="projects" className="sec">
      <Title sym="□">Game 3 · Projects</Title>
      <div className="grid3">
        {projects.map(([t, sub, d, tech], i) => (
          <motion.div key={t} {...deal(i + 1)}><Tilt n={200 + i} sym={SYM[i % 4]}><Candy i={i} /><h3>{t}</h3><b>{sub}</b><p>{d}</p><small>{tech}</small></Tilt></motion.div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="sec contact">
      <Title sym="◇">Final Round</Title>
      <motion.div {...deal(0)}>
        <Tilt n={456} sym="◇">
          <p className="lead dk">{profile.location}. Ready for the next game.</p>
          <a className="btn" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="btn alt" href={`tel:${profile.phone.replace(/ /g, "")}`}>{profile.phone}</a>
          <a className="btn alt" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn alt" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </Tilt>
      </motion.div>
    </section>
  );
}
