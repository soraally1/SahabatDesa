import React, { Suspense, useCallback, useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Float, Text, AdaptiveDpr, AdaptiveEvents, BakeShadows } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sea from './sea';
import Desa1 from '../../public/models/Desa1.glb';
import Desa2 from '../../public/models/Desa2.glb';
import Desa3 from '../../public/models/Desa3.glb';
import Desa4 from '../../public/models/Desa4.glb';
import Marketplace from '../../public/models/Marketplace.glb';  

/* eslint-disable react/no-unknown-property */

// Add ResizeObserver hook
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);
  
  return size;
};

// Island component with hover text
const Island = React.memo(({ position, rotation, scale, modelPath, onClick, name }) => {
  const { scene } = useGLTF(modelPath);
  const [hovered, setHovered] = useState(false);
  const { width } = useResizeObserver();
  const isMobile = width < 768;
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default';
    setHovered(false);
  }, []);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    onClick();
  }, [onClick]);

  const textConfig = useMemo(() => ({
    fontSize: isMobile ? 20 : 30,
    maxWidth: isMobile ? 150 : 200,
    color: "white",
    anchorX: "center",
    anchorY: "middle",
    font: "/fonts/JosefinSans-VariableFont_wght.ttf",
    letterSpacing: 0.1,
    fontWeight: 700
  }), [isMobile]);

  const floatPosition = useMemo(() => [
    position[0],
    position[1] + (isMobile ? 50 : 100),
    position[2]
  ], [position, isMobile]);

  return (
    <group>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      {hovered && (
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.8}
          position={floatPosition}
        >
          <Text {...textConfig}>
            {name}
            <meshBasicMaterial 
              attach="material" 
              color="white"
              toneMapped={false}
            />
          </Text>
          <pointLight
            intensity={2}
            distance={isMobile ? 30 : 50}
            color="white"
            position={[0, 0, 20]}
          />
        </Float>
      )}
    </group>
  );
});

Island.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  modelPath: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

Island.displayName = 'Island';

// Camera animation component
const CameraController = ({ target, isZooming, onZoomComplete }) => {
  const { camera } = useThree();
  const initialPosition = useRef(camera.position.clone());
  const targetPosition = useRef(null);

  useFrame(() => {
    if (isZooming && target) {
      if (!targetPosition.current) {
        // Calculate front position of the island
        // Move camera to be in front of the island (negative z relative to island position)
        targetPosition.current = new THREE.Vector3(
          target.x,
          target.y + 80,
          target.z + 200
        );
      }

      camera.position.lerp(targetPosition.current, 0.025);
      
      // Make camera look at the island
      const lookAtPosition = new THREE.Vector3(target.x, target.y, target.z);
      camera.lookAt(lookAtPosition);

      // Check if we're close enough to target
      if (camera.position.distanceTo(targetPosition.current) < 1) {
        onZoomComplete();
      }
    } else {
      targetPosition.current = null;
      camera.position.lerp(initialPosition.current, 0.015);
      const defaultLookAt = new THREE.Vector3(0, -50, 0);
      camera.lookAt(defaultLookAt);
    }
  });

  return null;
};

CameraController.propTypes = {
  target: PropTypes.object,
  isZooming: PropTypes.bool.isRequired,
  onZoomComplete: PropTypes.func.isRequired,
};

// CartoonCloud component
const CartoonCloud = React.memo(({ position, scale = 1, speed = 0.3 }) => {
  const [state, setState] = useState({ hovered: false, clicked: false, bounceEffect: false });
  
  const cloudShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-3, 0, -3, 4, 0, 4);
    shape.bezierCurveTo(1.5, 4, 2, 3, 3, 3);
    shape.bezierCurveTo(6, 3, 6, 0, 3, 0);
    shape.bezierCurveTo(2, 0, 1.5, 0, 0, 0);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.8,
    bevelSize: 0.8,
    bevelOffset: 0,
    bevelSegments: 5
  }), []);

  const geometry = useMemo(() => 
    new THREE.ExtrudeGeometry(cloudShape, extrudeSettings),
  [cloudShape, extrudeSettings]);

  useEffect(() => {
    if (state.clicked) {
      setState(prev => ({ ...prev, bounceEffect: true }));
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, bounceEffect: false })),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [state.clicked]);

  const handlePointerOver = useCallback(() => 
    setState(prev => ({ ...prev, hovered: true })),
  []);

  const handlePointerOut = useCallback(() => 
    setState(prev => ({ ...prev, hovered: false })),
  []);

  const handleClick = useCallback(() => 
    setState(prev => ({ ...prev, clicked: !prev.clicked })),
  []);

  const currentScale = state.bounceEffect ? scale * 1.3 : state.hovered ? scale * 1.2 : scale;

  return (
    <Float
      speed={speed}
      rotationIntensity={state.hovered ? 0.3 : 0.1}
      floatIntensity={state.hovered ? 0.4 : 0.2}
    >
      <mesh 
        geometry={geometry} 
        position={position}
        scale={currentScale}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshPhongMaterial 
          color={state.clicked ? "#e6e6e6" : "#ffffff"}
          emissive="#ffffff"
          emissiveIntensity={state.hovered ? 0.2 : 0.1}
          shininess={100}
          specular="#ffffff"
        />
      </mesh>
    </Float>
  );
});

CartoonCloud.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
  speed: PropTypes.number
};

CartoonCloud.displayName = 'CartoonCloud';

// CloudsGroup component
const CloudsGroup = React.memo(() => {
  const cloudPositions = useMemo(() => [
    // Background clouds
    { position: [-600, 200, -500], scale: 2.0, speed: 0.4 },
    { position: [600, 250, -800], scale: 2.5, speed: 0.3 },
    { position: [-300, 300, -600], scale: 1.8, speed: 0.5 },
    // ... other cloud positions
  ], []);

  return (
    <group>
      {cloudPositions.map((cloud, index) => (
        <CartoonCloud
          key={index}
          position={cloud.position}
          scale={cloud.scale}
          speed={cloud.speed}
        />
      ))}
    </group>
  );
});

CloudsGroup.displayName = 'CloudsGroup';

// Add InitialCameraAnimation component
const InitialCameraAnimation = () => {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(true);
  const startPosition = useRef(new THREE.Vector3(0, 1200, 1800));
  const targetPosition = useRef(new THREE.Vector3(0, 400, 1200));

  useEffect(() => {
    camera.position.copy(startPosition.current);
  }, [camera]);

  useFrame(() => {
    if (isAnimating) {
      camera.position.lerp(targetPosition.current, 0.02);
      if (camera.position.distanceTo(targetPosition.current) < 1) {
        setIsAnimating(false);
      }
    }
  });

  return null;
};

// Main scene component
const IslandScene = () => {
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [currentIslandIndex, setCurrentIslandIndex] = useState(0);
  const navigate = useNavigate();
  const controlsRef = useRef();
  const { width } = useResizeObserver();
  const isMobile = width < 768;

  useEffect(() => {
    // Disable controls during entrance animation
    if (controlsRef.current) {
      controlsRef.current.enabled = !isEntering;
    }
    // Enable controls after entrance animation
    const timer = setTimeout(() => {
      setIsEntering(false);
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isEntering]);

  // Optimize islands data with useMemo
  const islands = useMemo(() => [
    {
      position: [0, -45, 0],
      rotation: [0, 0, 0],
      scale: [60, 60, 60],
      modelPath: Marketplace,
      route: '/islands/desa4',
      name: 'Desa Riung',
      description: 'Pusat kegiatan ekonomi dengan hasil laut segar, kerajinan lokal, dan kuliner khas Riung.'
    },
    {
      position: [-200, -35, 200],
      rotation: [0, Math.PI / 4, 0],
      scale: [50, 50, 50],
      modelPath: Desa1,
      route: '/islands/desa1',
      name: 'Desa Pagaitan',
      description: 'Desa Pagaitan adalah salah satu desa yang terletak di Kecamatan Bolangitang Barat, Kabupaten Bolaang Mongondow Utara, Provinsi Sulawesi Utara. Desa ini memiliki potensi ekonomi, budaya, dan keunikan lokal yang mencerminkan kearifan tradisional masyarakat setempat.'
    },
    {
      position: [200, -40, 200],
      rotation: [0, -Math.PI / 4, 0],
      scale: [30, 30, 30],
      modelPath: Desa2,
      route: '/islands/desa2',
      name: 'Desa Cikoneng',
      description: 'Desa tradisional di Jawa Barat dengan kekayaan hutan. Dengan potensi pariwisata yang menarik.'
    },
    {
      position: [450, -50, 50],
      rotation: [0, -Math.PI / 4, 0],
      scale: [50, 50, 50],
      modelPath: Desa3,
      route: '/islands/desa3',
      name: 'Desa Pusat Damai',
      description: 'Desa Pusat Damai adalah salah satu desa yang terletak di Provinsi Kalimantan Barat, Indonesia. Desa ini dikenal sebagai desa yang memiliki potensi pertanian dan kehutanan yang cukup besar, serta masyarakat yang ramah dan terikat erat dengan budaya lokal. Pusat Damai berada di kawasan yang kaya akan sumber daya alam dan memiliki akses menuju ke berbagai daerah di Kalimantan Barat.'
    },
    {
      position: [-450, -50, 50],
      rotation: [0, -50, 0],
      scale: [10, 10, 10],
      modelPath: Desa4,
      route: '/islands/desa5',
      name: 'Desa Long Bawan',
      description: 'Tanah Long Bawan terkenal subur, warga pun mengelolah ladang mereka dengan sistem organik sehingga menghasilkan produk berkualitas seperti beras Adan Krayan. Beras ini merupakan kegemaran Sultan Hasanah Bolkiah, dan lebih banyak dijual ke negara tetangga seperti Malaysia dan Brunei Darussalam.Penghasil Garam Gunung Terbaik di Indonesia '
    }
  ], []);

  // Optimize camera settings
  const cameraSettings = useMemo(() => ({
    position: isMobile ? [0, 50, 300] : [0, 300, 1000],
    fov: isMobile ? 75 : 45,
    near: 0.1,
    far: 2000
  }), [isMobile]);

  // Add mobile navigation controls
  const handlePrevIsland = () => {
    setCurrentIslandIndex((prev) => (prev === 0 ? islands.length - 1 : prev - 1));
    setSelectedIsland(islands[(currentIslandIndex === 0 ? islands.length - 1 : currentIslandIndex - 1)]);
    setIsZooming(true);
  };

  const handleNextIsland = () => {
    setCurrentIslandIndex((prev) => (prev === islands.length - 1 ? 0 : prev + 1));
    setSelectedIsland(islands[(currentIslandIndex === islands.length - 1 ? 0 : currentIslandIndex + 1)]);
    setIsZooming(true);
  };

  // Optimize touch handling
  const touchState = useRef({ startX: null, startY: null, startTime: null });
  
  const handleTouchStart = useCallback((e) => {
    touchState.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchState.current.startX) return;
    
    const deltaX = e.changedTouches[0].clientX - touchState.current.startX;
    const deltaY = e.changedTouches[0].clientY - touchState.current.startY;
    const deltaTime = Date.now() - touchState.current.startTime;
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && 
        Math.abs(deltaX) > 50 && 
        deltaTime < 300) {
      if (deltaX > 0) {
        handlePrevIsland();
      } else {
        handleNextIsland();
      }
    }
    
    touchState.current = { startX: null, startY: null, startTime: null };
  }, [handlePrevIsland, handleNextIsland]);

  useEffect(() => {
    if (isMobile) {
      setSelectedIsland(islands[currentIslandIndex]);
      setIsZooming(true);
    }
  }, [currentIslandIndex, isMobile]);

  const handleIslandClick = useCallback((island) => {
    if (selectedIsland === island) {
      navigate(island.route);
      return;
    }
    
    setSelectedIsland(island);
    setIsZooming(true);
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, [selectedIsland, navigate]);

  const handleZoomComplete = () => {
    setShowInfo(true);
  };

  const handleEnterVillage = useCallback(() => {
    if (selectedIsland) {
      navigate(selectedIsland.route);
    }
  }, [selectedIsland, navigate]);

  const handleBackClick = () => {
    setShowInfo(false);
    setIsZooming(false);
    setSelectedIsland(null);
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{ width: '100vw', height: '100vh' }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {/* Mobile UI Elements */}
      {isMobile && (
        <>
          {/* Island Name Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-0 right-0 z-10 flex justify-center items-center"
          >
            <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full">
              <h2 className="text-2xl font-bold text-white text-center">
                {selectedIsland?.name || islands[currentIslandIndex].name}
              </h2>
            </div>
          </motion.div>

          {/* Island Navigation Dots */}
          <div className="fixed top-20 left-0 right-0 z-10 flex justify-center items-center gap-2">
            {islands.map((island, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIslandIndex(index);
                  setSelectedIsland(islands[index]);
                  setIsZooming(true);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIslandIndex === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to ${island.name}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="fixed bottom-8 left-0 right-0 z-10 px-6">
            <div className="flex justify-between items-center max-w-md mx-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevIsland}
                className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all
                  shadow-lg border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEnterVillage()}
                className="px-8 py-4 bg-green-500/90 backdrop-blur-lg rounded-2xl
                  hover:bg-green-500 transition-all shadow-lg border border-white/20"
              >
                <span className="text-white font-semibold text-lg">Masuk Desa</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextIsland}
                className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl hover:bg-white/20 transition-all
                  shadow-lg border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Island Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-32 left-4 right-4 z-10"
          >
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl 
              shadow-lg border border-white/20 max-w-md mx-auto overflow-hidden">
              {/* Card Header */}
              <div className="bg-white/10 px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Informasi Desa</h3>
                  <p className="text-sm text-white/70">Klik untuk detail lebih lanjut</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Description */}
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-white/10 rounded-lg mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white/90 leading-relaxed text-sm">
                      {selectedIsland?.description || islands[currentIslandIndex].description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Komunitas Aktif</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                      <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Potensi Tinggi</span>
                    </div>
                  </div>

                  {/* Visit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEnterVillage()}
                    className="w-full mt-2 bg-gradient-to-r from-green-500 to-green-600 
                      text-white py-3 rounded-xl font-medium shadow-lg
                      border border-green-400/30 hover:from-green-600 hover:to-green-700
                      transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Kunjungi Sekarang</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Desktop Info Panel */}
      {!isMobile && showInfo && selectedIsland && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-10 flex items-center justify-center p-8 bg-black/20"
        >
          <motion.div 
            className="w-[900px] max-w-[90vw] max-h-[80vh] overflow-auto
              bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl 
              shadow-2xl border border-white/50"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 px-8 py-5 border-b border-green-500/20 
              sticky top-0 backdrop-blur-xl z-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-800">{selectedIsland.name}</h2>
                  <p className="text-green-600/80 mt-1">Informasi dan Detail Desa</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackClick}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Column - Description */}
                <div className="col-span-7">
                  <div className="flex gap-4 items-start mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Tentang Desa</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedIsland.description}</p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800">Komunitas Aktif</h4>
                      </div>
                      <p className="text-sm text-gray-600">Masyarakat yang aktif berpartisipasi dalam kegiatan desa</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800">Potensi Tinggi</h4>
                      </div>
                      <p className="text-sm text-gray-600">Memiliki potensi pengembangan ekonomi yang menjanjikan</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats & Action */}
                <div className="col-span-5 flex flex-col justify-between">
                  {/* Stats */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-4">Statistik Desa</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Penduduk</span>
                        <span className="font-semibold text-gray-800">3,200+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">UMKM Aktif</span>
                        <span className="font-semibold text-gray-800">45+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Produk Unggulan</span>
                        <span className="font-semibold text-gray-800">15+</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnterVillage}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 
                      text-white py-4 rounded-xl font-semibold text-lg shadow-lg
                      hover:from-green-600 hover:to-green-700 transition-all duration-300
                      border border-green-400/30 flex items-center justify-center gap-2"
                  >
                    <span>Kunjungi Desa</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Canvas
        camera={cameraSettings}
        shadows
        dpr={[1, 2]} // Limit DPR for better performance
        performance={{ min: 0.5 }} // Allow frame rate to drop for better performance
        gl={{
          powerPreference: "high-performance",
          antialias: false, // Disable antialias for better performance
          stencil: false,
          depth: true,
          alpha: false
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />

        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#87CEEB', 400, 1000]} />
        
        {/* Optimized Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 100, 50]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024} // Reduced shadow map size
          shadow-mapSize-height={1024}
          shadow-camera-far={1000}
          shadow-camera-near={1}
          shadow-camera-left={-300}
          shadow-camera-right={300}
          shadow-camera-top={300}
          shadow-camera-bottom={-300}
          shadow-bias={-0.001}
        />
        
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <OrbitControls
            ref={controlsRef}
            enablePan={!isMobile}
            minDistance={isMobile ? 100 : 200}
            maxDistance={isMobile ? 400 : 800}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
            enabled={!isEntering && !isMobile}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            touchRotateSpeed={0.3}
            target={new THREE.Vector3(0, 0, 0)}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
          
          {isEntering && <InitialCameraAnimation />}
          
          <CameraController
            target={selectedIsland ? new THREE.Vector3(...selectedIsland.position) : null}
            isZooming={isZooming}
            onZoomComplete={handleZoomComplete}
          />
          
          <CloudsGroup />
          <Sea position={[0, -40, 0]} rotation={[-Math.PI / 2, 0, 0]} />
          
          {islands.map((island, index) => (
            <Island
              key={index}
              {...island}
              onClick={() => handleIslandClick(island)}
            />
          ))}
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

IslandScene.propTypes = {
  // ... existing prop types ...
};

IslandScene.displayName = 'IslandScene';

export default IslandScene; 