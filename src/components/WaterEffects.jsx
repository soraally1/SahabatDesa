import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';

/* eslint-disable react/no-unknown-property */

export function WaterEffects({ position, intensity = 1 }) {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  const time = useRef(0);

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array.from({ length: 20 }).map(() => ({
      position: new THREE.Vector3(
        position.x + (Math.random() - 0.5) * 2,
        position.y,
        position.z + (Math.random() - 0.5) * 2
      ),
      scale: 0.1 + Math.random() * 0.3,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 4,
        (Math.random() - 0.5) * 2
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      lifetime: 0
    }));
  }, [position]);

  useFrame((state, delta) => {
    time.current += delta;

    particlesRef.current.forEach(particle => {
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.velocity.y -= 9.8 * delta;
      particle.lifetime += delta;
      
      // Add some wobble
      particle.position.x += Math.sin(time.current * 2 + particle.lifetime) * 0.1;
      particle.position.z += Math.cos(time.current * 2 + particle.lifetime) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {particlesRef.current.map((particle, i) => (
        <mesh
          key={i}
          position={[
            particle.position.x,
            particle.position.y,
            particle.position.z
          ]}
          rotation={[
            particle.rotation.x,
            particle.rotation.y,
            particle.rotation.z
          ]}
          scale={particle.scale * intensity}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={Math.max(0, 1 - particle.lifetime)}
            emissive="#4fc3dc"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

WaterEffects.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired
  }).isRequired,
  intensity: PropTypes.number
}; 