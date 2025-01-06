import { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sea from './sea';

/* eslint-disable react/no-unknown-property */

// Island component with hover text
const Island = ({ position, rotation, scale, modelPath, onClick, name }) => {
  const { scene } = useGLTF(modelPath);
  const [hovered, setHovered] = useState(false);
  
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    <group>
      <primitive
        object={scene.clone()}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHovered(false);
        }}
      />
      {hovered && (
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.8}
          position={[position[0], position[1] + (window.innerWidth < 768 ? 50 : 100), position[2]]}
        >
          <Text
            fontSize={window.innerWidth < 768 ? 20 : 30}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/JosefinSans-VariableFont_wght.ttf"
            maxWidth={window.innerWidth < 768 ? 150 : 200}
            textAlign="center"
            letterSpacing={0.1}
            fontWeight={700}
          >
            {name}
            <meshBasicMaterial 
              attach="material" 
              color="white"
              toneMapped={false}
            />
          </Text>
          <pointLight
            intensity={2}
            distance={window.innerWidth < 768 ? 30 : 50}
            color="white"
            position={[0, 0, 20]}
          />
        </Float>
      )}
    </group>
  );
};

Island.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  modelPath: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

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
          target.x,                    // Same x as island
          target.y + 60,              // Slightly above island
          target.z + 150              // In front of island
        );
      }

      // Smoothly move camera to target position with easing
      camera.position.lerp(targetPosition.current, 0.03);  // Slower lerp for smoother motion
      
      // Make camera look at the island
      const lookAtPosition = new THREE.Vector3(target.x, target.y, target.z);
      camera.lookAt(lookAtPosition);

      // Check if we're close enough to target
      if (camera.position.distanceTo(targetPosition.current) < 1) {
        onZoomComplete();
      }
    } else {
      targetPosition.current = null;
      // Return to initial position when not zooming
      camera.position.lerp(initialPosition.current, 0.02);  // Slower lerp for smoother motion
      // Reset camera rotation to initial state
      const defaultLookAt = new THREE.Vector3(0, -50, 0);  // Look at center of scene
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
const CartoonCloud = ({ position, scale = 1, speed = 0.3 }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [bounceEffect, setBounceEffect] = useState(false);
  const cloudShape = new THREE.Shape();
  
  cloudShape.moveTo(0, 0);
  cloudShape.bezierCurveTo(-3, 0, -3, 4, 0, 4);
  cloudShape.bezierCurveTo(1.5, 4, 2, 3, 3, 3);
  cloudShape.bezierCurveTo(6, 3, 6, 0, 3, 0);
  cloudShape.bezierCurveTo(2, 0, 1.5, 0, 0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.8,
    bevelSize: 0.8,
    bevelOffset: 0,
    bevelSegments: 5
  };

  useEffect(() => {
    if (clicked) {
      setBounceEffect(true);
      const timer = setTimeout(() => setBounceEffect(false), 500);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  const geometry = new THREE.ExtrudeGeometry(cloudShape, extrudeSettings);
  
  return (
    <Float
      speed={speed}
      rotationIntensity={hovered ? 0.3 : 0.1}
      floatIntensity={hovered ? 0.4 : 0.2}
    >
      <mesh 
        geometry={geometry} 
        position={position}
        scale={bounceEffect ? scale * 1.3 : hovered ? scale * 1.2 : scale}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <meshPhongMaterial 
          color={clicked ? "#e6e6e6" : "#ffffff"}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.2 : 0.1}
          shininess={100}
          specular="#ffffff"
        />
      </mesh>
    </Float>
  );
};

CartoonCloud.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
  speed: PropTypes.number
};

// CloudsGroup component
const CloudsGroup = () => {
  return (
    <group>
      {/* Background clouds */}
      <CartoonCloud position={[-600, 200, -500]} scale={2.0} speed={0.4} />
      <CartoonCloud position={[600, 250, -800]} scale={2.5} speed={0.3} />
      <CartoonCloud position={[-300, 300, -600]} scale={1.8} speed={0.5} />
      <CartoonCloud position={[400, 150, -400]} scale={1.5} speed={0.45} />
      <CartoonCloud position={[0, 250, -700]} scale={2.2} speed={0.35} />
      <CartoonCloud position={[-500, 100, -300]} scale={1.6} speed={0.5} />
      <CartoonCloud position={[300, 180, -600]} scale={1.9} speed={0.4} />
      <CartoonCloud position={[-200, 220, -500]} scale={1.7} speed={0.45} />

      {/* Clouds above Marketplace */}
      <CartoonCloud position={[0, 100, 0]} scale={1.2} speed={0.3} />
      <CartoonCloud position={[30, 120, 30]} scale={1.0} speed={0.35} />
      <CartoonCloud position={[-30, 90, -30]} scale={1.1} speed={0.25} />

      {/* Clouds above Desa Sejahtera */}
      <CartoonCloud position={[-200, 120, 200]} scale={1.3} speed={0.3} />
      <CartoonCloud position={[-170, 100, 170]} scale={1.1} speed={0.4} />
      <CartoonCloud position={[-230, 140, 230]} scale={1.0} speed={0.35} />

      {/* Clouds above Desa Kreatif */}
      <CartoonCloud position={[200, 110, 200]} scale={1.2} speed={0.35} />
      <CartoonCloud position={[230, 130, 230]} scale={1.0} speed={0.3} />
      <CartoonCloud position={[170, 90, 170]} scale={1.1} speed={0.4} />

      {/* Additional decorative clouds between islands */}
      <CartoonCloud position={[-100, 80, 100]} scale={0.8} speed={0.45} />
      <CartoonCloud position={[100, 95, 100]} scale={0.9} speed={0.4} />
      <CartoonCloud position={[0, 110, 150]} scale={1.0} speed={0.35} />
    </group>
  );
};

// Add InitialCameraAnimation component
const InitialCameraAnimation = () => {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(true);
  const startPosition = useRef(new THREE.Vector3(0, 1000, 1500));
  const targetPosition = useRef(new THREE.Vector3(0, 300, 1000));

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
  const navigate = useNavigate();
  const controlsRef = useRef();

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

  const islands = [
    {
      position: [0, -45, 0],
      rotation: [0, 0, 0],
      scale: [50, 50, 50],
      modelPath: '/models/Marketplace.glb',
      route: '/marketplace',
      name: 'Pasar Desa',
      description: 'Pusat kegiatan ekonomi desa dengan berbagai produk lokal dan kerajinan tradisional.'
    },
    {
      position: [-200, -35, 200],
      rotation: [0, Math.PI / 4, 0],
      scale: [50, 50, 50],
      modelPath: '/models/Desa1.glb',
      route: '/islands/desa1',
      name: 'Desa Sejahtera',
      description: 'Desa yang fokus pada pengembangan pertanian dan pemberdayaan masyarakat.'
    },
    {
      position: [200, -40, 200],
      rotation: [0, -Math.PI / 4, 0],
      scale: [30, 30, 30],
      modelPath: '/models/Desa2.glb',
      route: '/islands/desa2',
      name: 'Desa Kreatif',
      description: 'Pusat inovasi dan kreativitas dengan fokus pada ekonomi kreatif dan digital.'
    },
    {
        position: [450, -50, 50],
        rotation: [0, -Math.PI / 4, 0],
        scale: [50, 50, 50],
        modelPath: '/models/Desa3.glb',
        route: '/islands/desa3',
        name: 'Desa Wisata',
        description: 'Tempat wisata yang menawarkan pengalaman unik dan menarik.'
      },
      {
        position: [-450, -50, 50],
        rotation: [0, -50, 0],
        scale: [10, 10, 10],
        modelPath: '/models/Desa4.glb',
        route: '/desa4',
        name: 'Desa Pembangun',
        description: 'Desa yang fokus pada pembangunan infrastruktur dan pemerataan pendidikan.'
      }
  ];

  const handleIslandClick = (island) => {
    if (selectedIsland === island) return;
    
    setSelectedIsland(island);
    setIsZooming(true);
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  };

  const handleZoomComplete = () => {
    setShowInfo(true);
  };

  const handleEnterVillage = () => {
    if (selectedIsland) {
      navigate(selectedIsland.route);
    }
  };

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
    >
      {showInfo && selectedIsland && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10 
            bg-white/90 backdrop-blur-md p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl 
            border-2 sm:border-4 border-green-500/30 w-[90%] sm:w-[500px] max-h-[80vh] overflow-y-auto
            scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 sm:mb-4">{selectedIsland.name}</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">{selectedIsland.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
            <button
              onClick={handleBackClick}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg sm:rounded-xl 
                hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Kembali
            </button>
            <button
              onClick={handleEnterVillage}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl 
                hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              Masuk Desa
            </button>
          </div>
        </motion.div>
      )}

      <Canvas
        camera={{
          position: [0, 300, 1000],
          fov: window.innerWidth < 768 ? 60 : 45,
          near: 0.1,
          far: 2000
        }}
        shadows
      >
        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#87CEEB', 400, 1000]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 100, 50]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Suspense fallback={null}>
          {/* Environment and controls */}
          <Environment preset="sunset" />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={window.innerWidth < 768 ? 150 : 200}
            maxDistance={window.innerWidth < 768 ? 600 : 800}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
            enabled={!isEntering}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            touchRotateSpeed={0.3}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />
          
          {/* Initial camera animation */}
          {isEntering && <InitialCameraAnimation />}
          
          {/* Camera animation for island selection */}
          <CameraController
            target={selectedIsland ? new THREE.Vector3(...selectedIsland.position) : null}
            isZooming={isZooming}
            onZoomComplete={handleZoomComplete}
          />
          
          {/* Clouds */}
          <CloudsGroup />
          
          {/* Sea */}
          <Sea position={[0, -40, 0]} rotation={[-Math.PI / 2, 0, 0]} />
          
          {/* Islands */}
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

export default IslandScene; 