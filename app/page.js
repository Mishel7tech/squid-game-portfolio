"use client";
import dynamic from "next/dynamic";
import Intro from "../components/Intro";
import Runners from "../components/Runners";
import PhotoFlip from "../components/PhotoFlip";
import { Progress, Hero, Skills, Experience, Projects, Contact } from "../components/Sections";
const Scene = dynamic(() => import("../components/Scene"), { ssr: false });
export default function Home() {
  return (<main><Intro /><Progress /><Scene /><Runners /><PhotoFlip /><Hero /><Skills /><Experience /><Projects /><Contact /></main>);
}
