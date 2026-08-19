"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, PresentationControls, Float } from "@react-three/drei";
import * as THREE from "three";

function SceneContent() {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  return (
    <group 
      ref={group} 
      position={[0, 0, 0]}
      onPointerMove={() => invalidate()}
    >
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.15}>
        {/* Main Handle Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 32]} />
          <meshStandardMaterial 
            color="#d4af37" 
            metalness={0.9} 
            roughness={0.15} 
            envMapIntensity={1.2}
          />
        </mesh>
        
        {/* End Caps */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 32]} />
          <meshStandardMaterial color="#c5a017" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.9, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 32]} />
          <meshStandardMaterial color="#c5a017" metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Connectors */}
        <mesh position={[0, 0.6, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.6, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
        </mesh>
        
        {/* Backplates */}
        <mesh position={[0, 0.6, -0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, -0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.7} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeDScene() {
  return (
    <Canvas 
      shadows 
      frameloop="demand"
      dpr={[1, 1.5]} 
      camera={{ position: [0, 0, 4], fov: 45 }}
      className="w-full h-full"
    >
      <color attach="background" args={["#09090b"]} />
      <ambientLight intensity={0.6} />
      <spotLight position={[8, 8, 8]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
      <spotLight position={[-8, -8, -8]} angle={0.2} penumbra={1} intensity={0.4} />
      
      <PresentationControls 
        global={false} 
        cursor={true} 
        snap={true} 
        speed={1.2} 
        zoom={1} 
        rotation={[0, 0, 0]} 
        polar={[-Math.PI / 6, Math.PI / 6]} 
        azimuth={[-Math.PI / 3, Math.PI / 3]}
      >
        <SceneContent />
      </PresentationControls>
      
      <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={8} blur={2} far={3} />
      <Environment preset="studio" />
    </Canvas>
  );
}
