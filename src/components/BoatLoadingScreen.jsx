import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, MeshDistortMaterial, Sparkles, Float } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Howl } from 'howler';
import { useNavigate } from 'react-router-dom';

/* eslint-disable react/no-unknown-property */

// Sound effects
const soundEffects = {
  waves: new Howl({ 
    src: ['/Sounds/sea.mp3'], 
    volume: 0.3,
    loop: true 
  }),
  seagull: new Howl({ 
    src: ['/Sounds/seagull.mp3'], 
    volume: 0.2,
    loop: true 
  })
};

// Loading UI Component (outside Canvas)
function LoadingUI({ progress = 0 }) {
  const [currentTip, setCurrentTip] = useState(0);
  const tips = [
    "Memuat model 3D pulau...",
    "Menyiapkan perjalanan virtual...",
    "Mengumpulkan informasi desa...",
    "Hampir selesai..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Progress Circle */}
        <motion.div 
          className="absolute top-10 right-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-20 h-20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white opacity-20"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <motion.circle
                className="text-white"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  transformOrigin: "50% 50%",
                  transform: "rotate(-90deg)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.span 
                className="text-white text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="text-5xl font-bold text-white flex flex-col items-center justify-center gap-2 mt-[400px]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.span 
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-gradient-to-r from-white via-blue-100 to-white 
              bg-clip-text text-transparent relative font-extrabold tracking-wider
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
              before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-shimmer 
              before:backdrop-blur-sm"
            animate={{ 
              scale: [1, 1.02, 1],
              filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Menuju Kepulauan Desa
          </motion.span>
          <motion.div 
            className="flex mt-2"
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-6xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        <motion.p
          key={currentTip}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-lg font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        >
          <motion.span 
            className="inline-block mr-2"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1.2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 4
            }}
          >
            💡
          </motion.span>
          {tips[currentTip]}
        </motion.p>
      </div>
    </div>
  );
}

LoadingUI.propTypes = {
  progress: PropTypes.number
};

// Scene Components
function Scene({ onLoadComplete }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const { scene } = useGLTF('/models/Boat.glb', undefined, undefined, () => {
    setModelLoaded(true);
    if (onLoadComplete) onLoadComplete();
  });

  useEffect(() => {
    // Play sounds
    soundEffects.waves.play();
    soundEffects.seagull.play();

    // Cleanup function to stop and unload sounds
    return () => {
      soundEffects.waves.stop();
      soundEffects.seagull.stop();
      soundEffects.waves.unload();
      soundEffects.seagull.unload();
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {modelLoaded && (
        <Float 
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Boat scene={scene} />
        </Float>
      )}
      <Ocean />
      <WaterParticles />
      <Sparkles 
        count={100}
        scale={8}
        size={3}
        speed={0.4}
        opacity={0.5}
        color="#ffffff"
      />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      <fog attach="fog" args={['#88c4ff', 5, 15]} />
    </>
  );
}

Scene.propTypes = {
  onLoadComplete: PropTypes.func
};

function Ocean() {
  const oceanRef = useRef();
  const [waterColor] = useState(new THREE.Color('#0066ff'));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    oceanRef.current.material.distort = 0.3 + Math.sin(time) * 0.1;
    oceanRef.current.material.speed = 0.5 + Math.sin(time * 0.5) * 0.2;
    waterColor.setHSL(0.55, 0.8, 0.4 + Math.sin(time * 0.2) * 0.1);
    oceanRef.current.material.color = waterColor;
  });

  return (
    <>
      {/* Surface water layer */}
      <mesh 
        ref={oceanRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
      >
        <planeGeometry args={[100, 100, 128, 128]} />
        <MeshDistortMaterial
          ref={oceanRef}
          color="#66b3ff"
          transparent
          opacity={0.5}
          distort={0.3}
          speed={0.8}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Foam layer */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.9, 0]}
      >
        <planeGeometry args={[100, 100, 64, 64]} />
        <MeshDistortMaterial
          color="#99ccff"
          transparent
          opacity={0.2}
          distort={0.2}
          speed={1.5}
          metalness={0.2}
          roughness={1}
        />
      </mesh>
    </>
  );
}

function Boat({ scene }) {
  const boatRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    boatRef.current.position.y = Math.sin(time) * 0.15;
    boatRef.current.rotation.z = Math.sin(time) * 0.08;
    boatRef.current.rotation.x = Math.sin(time * 0.5) * 0.03;
  });
  
  return (
    <primitive 
      ref={boatRef}
      object={scene} 
      scale={0.5}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
      castShadow
    />
  );
}

Boat.propTypes = {
  scene: PropTypes.object.isRequired
};

function WaterParticles() {
  const particlesRef = useRef();
  const count = 200;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  
  useEffect(() => {
    for(let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      speeds[i] = Math.random() * 0.02 + 0.02;
    }
    
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.array = positions;
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, []);

  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array;
    for(let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= speeds[i];
      if(positions[i * 3 + 1] < -1) {
        positions[i * 3 + 1] = 3;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Component
const BoatLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleLoadComplete = () => {
    setProgress(100);
    // Navigate after a short delay to show 100% completion
    setTimeout(() => {
      navigate('/islands');
    }, 500);
  };

  useEffect(() => {
    // Simulate progress until model loads
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + 10;
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600
        before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 1.2,
        ease: "easeInOut"
      }}
    >
      <LoadingUI progress={progress} />
      <Canvas 
        className="w-full h-full"
        camera={{ position: [0, 2, 5], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Scene onLoadComplete={handleLoadComplete} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default BoatLoadingScreen; 