"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Text, Line, Html } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  "React", "Next.js", "Three.js", "Framer Motion", 
  "TypeScript", "Tailwind", "Cryptography", "Trading",
  "Node.js", "Web3", "Solidity", "Figma"
];

function Network() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create fixed node positions
  const { positions, nodes } = useMemo(() => {
    const pos = new Float32Array(SKILLS.length * 3);
    const n = [];
    
    for (let i = 0; i < SKILLS.length; i++) {
      // Create a spherical distribution
      const phi = Math.acos(-1 + (2 * i) / SKILLS.length);
      const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;
      
      const r = 4;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      n.push({ position: [x, y, z] as [number, number, number], name: SKILLS[i], id: i });
    }
    return { positions: pos, nodes: n };
  }, []);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={pointsRef as any}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#3b82f6" size={0.15} sizeAttenuation={true} depthWrite={false} />
      </Points>
      
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <mesh 
            onPointerOver={() => setHoveredNode(i)} 
            onPointerOut={() => setHoveredNode(null)}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={hoveredNode === i ? "#ec4899" : "#ffffff"} transparent opacity={0} />
          </mesh>
          <Text
            position={[0, 0.4, 0]}
            fontSize={hoveredNode === i ? 0.4 : 0.2}
            color={hoveredNode === i ? "#ec4899" : "#60a5fa"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {node.name}
          </Text>
        </group>
      ))}

      {/* Draw lines between nodes to form a network */}
      {nodes.map((node, i) => {
        if (i === nodes.length - 1) return null;
        // Connect each node to the next 2 nodes
        const connections = [];
        for (let j = 1; j <= 2; j++) {
          const target = nodes[(i + j) % nodes.length];
          connections.push(
            <Line
              key={`${i}-${j}`}
              points={[node.position, target.position]}
              color={hoveredNode === i || hoveredNode === target.id ? "#ec4899" : "#1e3a8a"}
              lineWidth={hoveredNode === i || hoveredNode === target.id ? 2 : 0.5}
              transparent
              opacity={0.3}
            />
          );
        }
        return connections;
      })}
    </group>
  );
}

export default function SkillGraph() {
  return (
    <section className="relative w-full h-[600px] bg-[#050505] flex flex-col items-center justify-center overflow-hidden border-y border-white/5 py-20">
      <div className="absolute top-10 text-center z-10 pointer-events-none">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-blue-400 font-bold mb-4">Neural Architecture</h2>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic text-white/20 uppercase">Skill Matrix</h2>
      </div>
      
      <div className="w-full h-full cursor-crosshair">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <Network />
        </Canvas>
      </div>
    </section>
  );
}
