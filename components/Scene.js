"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const PINK = "#ed1b76", PAL = ["#f5a3c7", "#9fe0c3", "#f7e07a", "#8ec5ff", "#ffb48a"];
const SKY = ["#f9d6e5", "#bfeee0", "#190912"].map((c) => new THREE.Color(c));
const N = 96;
const prog = () => (typeof window === "undefined" ? 0 : Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight)));

// Floating spiral staircase in pastel colours: the camera climbs it as you scroll
function Stairs() {
  return Array.from({ length: N }, (_, i) => {
    const a = i * 0.21;
    return (
      <mesh key={i} position={[Math.cos(a) * 5.5, -4 + i * 0.42, Math.sin(a) * 5.5]} rotation={[0, -a, 0]}>
        <boxGeometry args={[3.2, 0.3, 1.4]} /><meshStandardMaterial color={PAL[i % 5]} roughness={0.7} />
      </mesh>
    );
  });
}

// Circle, triangle and square rings orbiting the tower
function Symbols() {
  const g = useRef();
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.12; });
  return (
    <group ref={g}>
      {Array.from({ length: 18 }, (_, i) => {
        const a = i * 1.3, r = 9 + (i % 3) * 0.8, k = i % 3;
        return (
          <group key={i} position={[Math.cos(a) * r, -2 + i * 2.1, Math.sin(a) * r]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh rotation={[0, 0, k === 1 ? Math.PI / 2 : k === 2 ? Math.PI / 4 : 0]}>
              <torusGeometry args={[k === 1 ? 1.6 : 1.2, 0.17, 10, k === 0 ? 64 : k === 1 ? 3 : 4]} />
              <meshStandardMaterial color={PINK} emissive={PINK} emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Marbles() {
  return Array.from({ length: 40 }, (_, i) => {
    const a = i * 2.4, r = 3 + ((i * 7) % 9);
    return (
      <Float key={i} speed={1.5 + (i % 4) * 0.4} floatIntensity={2.5} position={[Math.cos(a) * r, -3 + ((i * 1.07) % 1) * 40, Math.sin(a) * r]}>
        <mesh><sphereGeometry args={[0.3, 20, 20]} /><meshStandardMaterial color={PAL[i % 5]} roughness={0.15} metalness={0.2} /></mesh>
      </Float>
    );
  });
}

// Slow searchlight sweeping around the tower
function Beam() {
  const g = useRef();
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.5; });
  return (
    <group ref={g} position={[0, 28, 0]}>
      <mesh rotation={[0, 0, 0.32]} position={[4, 0, 0]}><coneGeometry args={[6, 44, 32, 1, true]} /><meshBasicMaterial color="#fff6c8" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    </group>
  );
}

function Rig() {
  const sm = useRef(0), col = useRef(new THREE.Color()), pl = useRef();
  useFrame(({ camera, pointer, scene }, dt) => {
    const t = prog(), vel = Math.abs(t - sm.current);
    sm.current += (t - sm.current) * Math.min(1, dt * 3);
    const p = sm.current, a = p * Math.PI * 6 + 0.6, r = 14 + pointer.x * 0.8;
    camera.position.set(Math.cos(a) * r, -2.5 + p * 38 + pointer.y * 0.5, Math.sin(a) * r);
    camera.lookAt(0, camera.position.y + 2, 0);
    camera.rotation.z += Math.sin(p * Math.PI * 6) * 0.03;
    camera.fov = 55 + Math.min(vel * 900, 25); camera.updateProjectionMatrix();
    const k = p * 2, i = Math.min(1, Math.floor(k));
    col.current.copy(SKY[i]).lerp(SKY[i + 1], k - i);
    scene.background = col.current; scene.fog.color.copy(col.current);
    pl.current.position.set(0, camera.position.y, 0);
  });
  return <pointLight ref={pl} color={PINK} intensity={150} distance={40} />;
}

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas camera={{ position: [0, -2.5, 14], fov: 55 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#f9d6e5", 22, 75]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[8, 20, 10]} intensity={1.5} />
        <Rig /><Stairs /><Symbols /><Marbles /><Beam />
        <mesh position={[0, 24, 0]}><cylinderGeometry args={[1.2, 1.2, 64, 24]} /><meshStandardMaterial color="#ffe7f0" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.4, 0]}><circleGeometry args={[45, 64]} /><meshStandardMaterial color="#f4b6d0" /></mesh>
      </Canvas>
    </div>
  );
}
