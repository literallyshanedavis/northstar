import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Tube, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FiberOpticCable({ position, color, intensity }) {
  const tubeRef = useRef();

  // Animation state for light pulses
  const [lightOffset, setLightOffset] = useState(0);

  useEffect(() => {
    // Start animation loop
    let animationId;
    const animate = () => {
      setLightOffset((prevOffset) => (prevOffset + 0.01) % 1);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <Tube
      ref={tubeRef}
      args={[
        // Path for the cable (customize as needed)
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(...position),
          new THREE.Vector3(position[0] + 2, position[1] + 1, position[2]),
          new THREE.Vector3(position[0] + 5, position[1] - 1, position[2] + 1),
          // new THREE.Vector3(...position) // Back to the starting point
      ]),
        100, // Number of segments along the path
        0.1 , // Radius of the tube
      ]}
    >
      <meshBasicMaterial color={color} />
      {/* Add glow material at the end */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity * (1 - lightOffset)} // Dynamic intensity
      />
    </Tube>
  );
}

function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} />
      <group>
        <FiberOpticCable position={[-2, 0, 0]} color="blue" intensity={1.5} />
        {/* <FiberOpticCable position={[0, 1, 0]} color="green" intensity={1} /> */}
        {/* <FiberOpticCable position={[2, 0, 0]} color="red" intensity={0.8} /> */}
      </group>
    </Canvas>
  );
}

export default Scene

