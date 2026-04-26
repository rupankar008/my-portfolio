"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

function RealisticGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = useMemo(() => textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"), []);
  const specularMap = useMemo(() => textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"), []);
  const normalMap = useMemo(() => textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* The Actual Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshPhongMaterial 
          map={earthTexture}
          specularMap={specularMap}
          normalMap={normalMap}
          specular={new THREE.Color(0x333333)}
          shininess={5}
        />
        
        {/* Marker for India (Burdwan) */}
        <mesh position={[1.5, 0.9, 1.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ec4899" />
          <Html position={[0, 0.2, 0]} center>
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-pink-500 relative z-10 shadow-[0_0_10px_#ec4899]" />
              <div className="mt-2 px-2 py-1 bg-black/80 border border-pink-500/50 rounded text-[9px] text-pink-400 font-mono whitespace-nowrap backdrop-blur-md">
                BURDWAN, IN
              </div>
            </div>
          </Html>
        </mesh>
      </mesh>

      {/* Atmospheric Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.25, 64, 64]} />
        <meshBasicMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.15} 
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function GlobeTracker() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto h-[400px] border border-white/5 rounded-3xl bg-white/[0.02] overflow-hidden flex flex-col group">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-mono mb-1">LOCAL TIME</h3>
        <p className="text-xl font-bold text-white tracking-wider font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {time}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-right">
        <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-mono mb-1">STATUS</h3>
        <p className="text-sm font-bold text-green-400 tracking-wider font-mono flex items-center gap-2 justify-end">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          ONLINE
        </p>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-0" />

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="cursor-crosshair">
        <ambientLight intensity={1} />
        <RealisticGlobe />
      </Canvas>
    </div>
  );
}
