import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import seaTexture from '/textures/Sea.jpg';

/* eslint-disable react/no-unknown-property */

export function Sea({ position = [0, -60, 0], rotation = [-Math.PI / 2, 0, 0] }) {
  const meshRef = useRef();
  
  // Load texture
  const baseTexture = useLoader(THREE.TextureLoader, seaTexture);
  
  // Memoize texture configuration
  const texture = useMemo(() => {
    const tex = baseTexture.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false; // Disable mipmaps for better performance
    return tex;
  }, [baseTexture]);

  // Memoize geometry
  const geometry = useMemo(() => new THREE.CircleGeometry(3000, 64), []); // Reduced segments

  // Memoize material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    color: "#006994",
    metalness: 0.1,
    roughness: 0.3,
    side: THREE.DoubleSide,
    envMapIntensity: 0.5,
    // Disable features we don't need
    flatShading: true,
    wireframe: false,
    fog: true
  }), [texture]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Optimize animation by using modulo to prevent large numbers
    const time = (clock.getElapsedTime() * 0.3) % 1000;
    texture.offset.x = time * 0.1;
    texture.offset.y = time * 0.1;
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={rotation}
      receiveShadow
      geometry={geometry}
      material={material}
      frustumCulled={true}
    />
  );
}

Sea.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number)
};

export default Sea;
