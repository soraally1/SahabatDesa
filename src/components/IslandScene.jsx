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

// Add ResizeObserver hook with debounce
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useLayoutEffect(() => {
    let timeoutId;
    const observer = new ResizeObserver((entries) => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      }, 100);
    });
    
    observer.observe(document.body);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
  
  return size;
};

// Add performance optimization hooks
const useThrottledCallback = (callback, delay) => {
  const [isThrottled, setIsThrottled] = useState(false);
  
  return useCallback((...args) => {
    if (!isThrottled) {
      callback(...args);
      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), delay);
    }
  }, [callback, isThrottled, delay]);
};

// Add WebGL detection and fallback handling
const useWebGLAvailability = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isContextLost, setIsContextLost] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    setHasWebGL(!!gl);
  }, []);

  return { hasWebGL, isContextLost, setIsContextLost };
};

// Island component with hover text
const Island = React.memo(({ position, rotation, scale, modelPath, onClick, name }) => {
  const { scene } = useGLTF(modelPath, {
    draco: true,
    meshoptDecoder: true, // Enable Meshopt compression
    powerPreference: "high-performance"
  });
  const [hovered, setHovered] = useState(false);
  const { width } = useResizeObserver();
  const isMobile = width < 768;
  const modelRef = useRef();
  
  // Optimize model cloning
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    // Optimize geometries
    clone.traverse((object) => {
      if (object.isMesh) {
        // Merge geometries when possible
        object.geometry.setDrawRange(0, Infinity);
        object.geometry.computeBoundingSphere();
        // Optimize materials
        if (object.material) {
          object.material.precision = 'lowp'; // Use low precision on mobile
          object.material.dithering = false;
        }
      }
    });
    return clone;
  }, [scene]);

  // Memory cleanup
  useEffect(() => {
    return () => {
      clonedScene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              material.dispose();
              if (material.map) material.map.dispose();
              if (material.lightMap) material.lightMap.dispose();
              if (material.bumpMap) material.bumpMap.dispose();
              if (material.normalMap) material.normalMap.dispose();
              if (material.specularMap) material.specularMap.dispose();
              if (material.envMap) material.envMap.dispose();
            });
          } else {
            object.material.dispose();
            if (object.material.map) object.material.map.dispose();
            if (object.material.lightMap) object.material.lightMap.dispose();
            if (object.material.bumpMap) object.material.bumpMap.dispose();
            if (object.material.normalMap) object.material.normalMap.dispose();
            if (object.material.specularMap) object.material.specularMap.dispose();
            if (object.material.envMap) object.material.envMap.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  // Throttle hover events
  const handlePointerOver = useThrottledCallback((e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(true);
  }, 100);

  const handlePointerOut = useThrottledCallback(() => {
    document.body.style.cursor = 'default';
    setHovered(false);
  }, 100);

  // Throttle click events
  const handleClick = useThrottledCallback((event) => {
    event.stopPropagation();
    onClick();
  }, 300);

  // Optimize text config
  const textConfig = useMemo(() => ({
    fontSize: isMobile ? 15 : 25, // Reduced font size
    maxWidth: isMobile ? 120 : 180, // Reduced max width
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
      <group
        ref={modelRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={clonedScene} />
      </group>
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
            intensity={1}
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

// Optimize CartoonCloud with reduced geometry complexity
const CartoonCloud = React.memo(({ position, scale = 1, speed = 0.3 }) => {
  const [state, setState] = useState({ hovered: false, clicked: false, bounceEffect: false });
  
  const cloudShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    // Simplified cloud shape with fewer control points
    shape.bezierCurveTo(-2, 0, -2, 3, 0, 3);
    shape.bezierCurveTo(1, 3, 1.5, 2, 2, 2);
    shape.bezierCurveTo(4, 2, 4, 0, 2, 0);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelSegments: 3
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

// Optimize CloudsGroup with fewer clouds and simpler geometry
const CloudsGroup = React.memo(() => {
  const cloudPositions = useMemo(() => [
    { position: [-400, 150, -400], scale: 1.5, speed: 0.2 },
    { position: [400, 200, -500], scale: 2.0, speed: 0.15 }
  ], []); // Reduced number of clouds

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
  const { hasWebGL, isContextLost, setIsContextLost } = useWebGLAvailability();
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [currentIslandIndex, setCurrentIslandIndex] = useState(0);
  const [showMobileCard, setShowMobileCard] = useState(true);
  const [showCards, setShowCards] = useState(true);
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
    position: isMobile ? [0, 50, 250] : [0, 250, 900], // Reduced distance
    fov: isMobile ? 70 : 40, // Adjusted FOV
    near: 1,
    far: 1000, // Reduced far plane
    maxDistance: isMobile ? 300 : 600,
    minDistance: isMobile ? 80 : 150
  }), [isMobile]);

  // Optimize scene settings
  const sceneSettings = useMemo(() => ({
    fog: {
      color: '#87CEEB',
      near: 300,
      far: 800 // Reduced fog distance
    },
    gl: {
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: true,
      alpha: false,
      precision: isMobile ? 'lowp' : 'mediump' // Lower precision on mobile
    }
  }), [isMobile]);

  // Optimize light settings
  const lightSettings = useMemo(() => ({
    ambient: {
      intensity: 0.02 // Reduced intensity
    },
    directional: {
      position: [50, 50, 25], // Simplified position
      intensity: 0.3,
      shadow: {
        mapSize: { width: isMobile ? 256 : 512, height: isMobile ? 256 : 512 }, // Reduced shadow map size
        camera: {
          far: 300, // Reduced shadow distance
          near: 1,
          left: -200,
          right: 200,
          top: 200,
          bottom: -200
        },
        bias: -0.001
      }
    }
  }), [isMobile]);

  // Throttle navigation handlers
  const handlePrevIsland = useThrottledCallback(() => {
    setCurrentIslandIndex((prev) => (prev === 0 ? islands.length - 1 : prev - 1));
    setSelectedIsland(islands[(currentIslandIndex === 0 ? islands.length - 1 : currentIslandIndex - 1)]);
    setIsZooming(true);
  }, 300);

  const handleNextIsland = useThrottledCallback(() => {
    setCurrentIslandIndex((prev) => (prev === islands.length - 1 ? 0 : prev + 1));
    setSelectedIsland(islands[(currentIslandIndex === islands.length - 1 ? 0 : currentIslandIndex + 1)]);
    setIsZooming(true);
  }, 300);

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

  // Handle WebGL context loss
  const handleContextLost = useCallback(() => {
    console.warn('WebGL context lost');
    setIsContextLost(true);
  }, [setIsContextLost]);

  // Handle WebGL context restore
  const handleContextRestore = useCallback(() => {
    console.log('WebGL context restored');
    setIsContextLost(false);
  }, [setIsContextLost]);

  // Fallback UI when WebGL is not available or context is lost
  if (!hasWebGL || isContextLost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="bg-red-500/20 p-3 rounded-full w-fit mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">3D Scene Tidak Tersedia</h2>
            <p className="text-white/80 text-sm">
              Browser Anda tidak mendukung WebGL atau mengalami masalah rendering 3D.
              Silakan coba solusi berikut:
            </p>
            <ul className="text-white/70 text-sm space-y-2 text-left list-disc list-inside">
              <li>Aktifkan akselerasi hardware di browser Anda</li>
              <li>Perbarui driver kartu grafis</li>
              <li>Gunakan browser modern seperti Chrome atau Firefox versi terbaru</li>
              <li>Coba akses melalui perangkat lain</li>
            </ul>
            <div className="pt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: '100vw', height: '100vh' }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {/* Desktop UI Elements */}
      {!isMobile && (
        <>
          {/* Toggle Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => setShowCards(prev => !prev)}
            className="fixed left-8 bottom-4 z-20 p-3 bg-white/10 backdrop-blur-lg rounded-full
              hover:bg-white/20 transition-all shadow-lg border border-white/20"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 text-white transition-transform duration-300 ${showCards ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>

          {/* Cards Container */}
          <motion.div
            initial={{ x: -1000 }}
            animate={{ x: showCards ? 0 : -1000 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed left-8 bottom-20 z-10 flex gap-4"
          >
            {/* Achievement Card */}
            <div className="w-72 bg-gradient-to-br from-slate-800/80 to-blue-500 backdrop-blur-lg rounded-2xl  shadow-xl overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-300">
              {/* Header */}
              <div className="p-3 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-transparent border-b border-white/10">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">Pencapaian & Event</span>
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Featured Achievement */}
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-3 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">Desa Digital Terbaik 2024</h4>
                        <p className="text-white/70 text-xs">Penghargaan Nasional</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                        <span>5 Desa Terpilih</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-blue-400 text-xs 
                          hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 border border-blue-400/20"
                      >
                        Detail
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Achievement Progress */}
                <div className="space-y-3">
                  <h4 className="text-white/90 text-xs font-medium flex items-center gap-1.5">
                    <div className="p-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">Target Pencapaian</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-white/80">Digitalisasi UMKM</span>
                        <span className="text-green-400 font-medium">75%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-white/80">Pelatihan Warga</span>
                        <span className="text-green-400 font-medium">60%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Activity Card */}
            <div className="w-72 bg-gradient-to-br from-slate-800/80 to-green-500/50 backdrop-blur-lg rounded-2xl  shadow-xl overflow-hidden hover:shadow-2xl hover:border-white/20 transition-all duration-300">
              {/* Header */}
              <div className="p-3 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-transparent border-b border-white/10">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">Aktivitas Komunitas</span>
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Live Activities */}
                <div className="space-y-3">
                  <h4 className="text-white/90 text-xs font-medium flex items-center gap-1.5">
                    <div className="p-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-md">
                      <span className="block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">Aktivitas Terkini</span>
                  </h4>
                  <div className="space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-white/5 to-white/[0.02] p-3 rounded-xl border border-white/10 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-[10px] rounded-bl-lg border-l border-b border-green-400/20">
                        Sedang Berlangsung
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg mt-1 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-white text-xs font-medium group-hover:text-green-400 transition-colors">Pelatihan Digital Marketing</h5>
                          <p className="text-white/70 text-[10px] mt-0.5">Desa Pagaitan</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-white/60">
                            <span>15 Peserta</span>
                            <span>•</span>
                            <span>2 Jam</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-[10px]
                              hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 border border-green-400/20 hidden group-hover:inline-block"
                          >
                            Bergabung
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-white/5 to-white/[0.02] p-3 rounded-xl border border-white/10 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 text-[10px] rounded-bl-lg border-l border-b border-yellow-400/20">
                        Akan Datang
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg mt-1 group-hover:from-yellow-500/30 group-hover:to-amber-500/30 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="text-white text-xs font-medium group-hover:text-yellow-400 transition-colors">Workshop Kerajinan</h5>
                          <p className="text-white/70 text-[10px] mt-0.5">Desa Cikoneng</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-white/60">
                            <span>25 Pendaftar</span>
                            <span>•</span>
                            <span>2 Hari Lagi</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full text-yellow-400 text-[10px]
                              hover:from-yellow-500/30 hover:to-amber-500/30 transition-all duration-300 border border-yellow-400/20 hidden group-hover:inline-block"
                          >
                            Daftar
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

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

          {/* Toggle Card Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowMobileCard(prev => !prev)}
            className="fixed top-20 left-5 z-20 p-3 bg-white/10 backdrop-blur-lg rounded-full
              hover:bg-white/20 transition-all shadow-lg border border-white/20"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 text-white transition-transform duration-300 ${showMobileCard ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>

          {/* Mobile Island Description Card */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: showMobileCard ? 1 : 0,
              y: showMobileCard ? 0 : 100,
              display: showMobileCard ? 'block' : 'none'
            }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-32 left-4 right-4 z-10"
          >
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl 
              shadow-lg border border-white/20 max-w-md mx-auto overflow-hidden">
              {/* Enhanced Card Header */}
              <div className="bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent 
                px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-green-500/30 to-green-600/30 
                    rounded-xl shadow-lg border border-green-400/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">Informasi Desa</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30">
                        Desa Digital
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mt-1">Klik untuk detail lebih lanjut</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Card Content */}
              <div className="p-6">
                <div className="flex flex-col gap-5">
                  {/* Description */}
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-white/10 rounded-lg mt-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Tentang Desa</h4>
                        <p className="text-white/80 leading-relaxed text-sm">
                          {selectedIsland?.description || islands[currentIslandIndex].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-lg font-semibold text-white">3,200+</span>
                        <span className="text-xs text-white/60 mt-1">Penduduk</span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-lg font-semibold text-white">45+</span>
                        <span className="text-xs text-white/60 mt-1">UMKM</span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex flex-col items-center text-center">
                        <span className="text-lg font-semibold text-white">15+</span>
                        <span className="text-xs text-white/60 mt-1">Produk</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 border border-white/10
                      flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Komunitas Aktif</span>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 border border-white/10
                      flex items-center gap-2">
                      <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Potensi Tinggi</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEnterVillage()}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 
                        text-white py-3 rounded-xl font-medium shadow-lg
                        border border-green-400/30 hover:from-green-600 hover:to-green-700
                        transition-all duration-300 flex items-center justify-center gap-2
                        relative overflow-hidden group"
                    >
                      <span className="relative z-10">Kunjungi Sekarang</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-white/10 rounded-xl text-white font-medium text-sm
                          hover:bg-white/20 transition-all duration-300 border border-white/10
                          flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        Hubungi
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-white/10 rounded-xl text-white font-medium text-sm
                          hover:bg-white/20 transition-all duration-300 border border-white/10
                          flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V4z" />
                        </svg>
                        Simpan
                      </motion.button>
                    </div>
                  </div>
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
          className="fixed inset-0 z-10 flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm"
        >
          <motion.div 
            className="w-[600px] max-w-[90vw] max-h-[85vh] overflow-hidden
              bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl 
              shadow-2xl border border-white/50"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent 
              px-6 py-4 border-b border-green-500/20 sticky top-0 backdrop-blur-xl z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/30 to-green-600/30 
                    rounded-2xl shadow-lg border border-green-400/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-green-800">{selectedIsland.name}</h2>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                        Desa Digital
                      </span>
                    </div>
                    <p className="text-green-600/80 mt-1 flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Indonesia • Desa Wisata
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/50 hover:bg-white/80 rounded-xl transition-colors"
                    onClick={handleBackClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-100px)] hide-scrollbar">
              <div className="p-6">
                <div className="space-y-4">
                  {/* Description */}
                  <div className="bg-white/50 rounded-2xl p-4 border border-green-100 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Tentang Desa</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{selectedIsland.description}</p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100
                      hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg
                          group-hover:scale-110 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors text-sm">
                            Komunitas Aktif
                          </h4>
                          <p className="text-gray-500 text-xs mt-0.5">500+ anggota aktif</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100
                      hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg
                          group-hover:scale-110 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors text-sm">
                            Potensi Tinggi
                          </h4>
                          <p className="text-gray-500 text-xs mt-0.5">15+ sektor unggulan</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 012-2h7a1 1 0 012 2v4a1 1 0 01-2 2H9l-3 3v-3H4a1 1 0 01-2-2V5z" />
                        <path d="M15 7h-1v1a1 1 0 11-2 0V7H6v1a1 1 0 11-2 0V7H2v10h16V7z" />
                      </svg>
                      Statistik Desa
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-600 text-sm">Penduduk</span>
                          <span className="font-semibold text-gray-800 text-sm">3,200+</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="bg-green-500 h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-600 text-sm">UMKM Aktif</span>
                          <span className="font-semibold text-gray-800 text-sm">45+</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60%' }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="bg-green-500 h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-600 text-sm">Produk Unggulan</span>
                          <span className="font-semibold text-gray-800 text-sm">15+</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '40%' }}
                            transition={{ delay: 0.9, duration: 1 }}
                            className="bg-green-500 h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnterVillage}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 
                        text-white py-3 rounded-xl font-semibold text-base shadow-lg
                        hover:from-green-600 hover:to-green-700 transition-all duration-300
                        border border-green-400/30 flex items-center justify-center gap-2
                        relative overflow-hidden group"
                    >
                      <span className="relative z-10">Kunjungi Desa</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2.5 bg-white/10 rounded-lg text-gray-700 font-medium text-xs
                          hover:bg-white/20 transition-all duration-300 border border-gray-200
                          flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        Hubungi
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2.5 bg-white/10 rounded-lg text-gray-700 font-medium text-xs
                          hover:bg-white/20 transition-all duration-300 border border-gray-200
                          flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V4z" />
                        </svg>
                        Simpan
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Canvas
        camera={cameraSettings}
        shadows={!isMobile}
        dpr={1}
        performance={{ min: 0.1, max: 1 }}
        gl={{
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: true,
          antialias: false,
          depth: true,
          stencil: false,
          alpha: false,
          precision: 'lowp'
        }}
        onContextLost={handleContextLost}
        onContextRestored={handleContextRestore}
        frameloop={isContextLost ? 'never' : 'always'}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />

        <color attach="background" args={[sceneSettings.fog.color]} />
        <fog attach="fog" args={[sceneSettings.fog.color, sceneSettings.fog.near, sceneSettings.fog.far]} />
        
        {/* Optimized Lighting */}
        <ambientLight intensity={lightSettings.ambient.intensity} />
        <directionalLight
          position={lightSettings.directional.position}
          intensity={lightSettings.directional.intensity}
          castShadow
          shadow-mapSize-width={lightSettings.directional.shadow.mapSize.width}
          shadow-mapSize-height={lightSettings.directional.shadow.mapSize.height}
          shadow-camera-far={lightSettings.directional.shadow.camera.far}
          shadow-camera-near={lightSettings.directional.shadow.camera.near}
          shadow-camera-left={lightSettings.directional.shadow.camera.left}
          shadow-camera-right={lightSettings.directional.shadow.camera.right}
          shadow-camera-top={lightSettings.directional.shadow.camera.top}
          shadow-camera-bottom={lightSettings.directional.shadow.camera.bottom}
          shadow-bias={lightSettings.directional.shadow.bias}
        />
        
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <OrbitControls
            ref={controlsRef}
            enablePan={!isMobile}
            minDistance={cameraSettings.minDistance}
            maxDistance={cameraSettings.maxDistance}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
            enabled={!isEntering && !isMobile}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.3}
            touchRotateSpeed={0.15}
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