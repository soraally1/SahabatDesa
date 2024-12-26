import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import seaTexture from '/textures/Sea.jpg';

/* eslint-disable react/no-unknown-property */

export function Sea({ position = [0, -40, 0], rotation = [-Math.PI / 2, 0, 0] }) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, seaTexture);
  
  // Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8); // Adjust the repeat values to control the texture tiling
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Animate texture movement for wave effect
    const time = clock.getElapsedTime() * 0.3;
    texture.offset.x = time * 0.1;
    texture.offset.y = time * 0.1;
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={rotation}
      receiveShadow
    >
      <circleGeometry args={[3000, 128]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.9}
        color="#006994"
        metalness={0.1}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

Sea.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number)
};

export default Sea;
