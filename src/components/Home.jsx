import React, { Suspense, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stars,
  Float,
  Html,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { FaSun, FaMoon } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';
import { MdEmail, MdPhone, MdLocationOn, MdLightbulb } from 'react-icons/md';
import { BsBook } from 'react-icons/bs';
import { RiRocketLine, RiCommunityLine, RiTeamLine } from 'react-icons/ri';
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import BoatLoadingScreen from './BoatLoadingScreen';
import Village from '../../public/models/Village.glb'
import Loading from './Loading';
import { HiLightBulb } from 'react-icons/hi';

// Add ESLint exceptions for Three.js props
/* eslint-disable react/no-unknown-property */

// Sound effects
const soundEffects = {
  hover: new Howl({ src: ['/sounds/Woosh.mp3'], volume: 0.5 }),
  click: new Howl({ src: ['/sounds/Bloop.mp3'], volume: 0.5 }),
  success: new Howl({ src: ['/sounds/Success.mp3'], volume: 0.5 }),
};

// Language translations
const translations = {
  en: {
    title: 'Village Friend',
    subtitle: 'Building Villages, Strengthening Indonesia! 🌟',
    features: {
      title: 'Features',
      community: 'Community Empowerment',
      innovation: 'Digital Village Innovation',
      collaboration: 'Community Collaboration'
    },
    contact: {
      title: 'Contact',
      email: 'Email',
      phone: 'Phone',
      address: 'Address'
    },
    buttons: {
      start: 'Start Now',
      learn: 'Learn More',
      preparing: 'Preparing...'
    }
  },
  id: {
    title: 'Sahabat Desa',
    subtitle: 'Membangun Desa, Menguatkan Indonesia! 🌟',
    features: {
      title: 'Fitur',
      community: 'Pemberdayaan Masyarakat',
      innovation: 'Inovasi Desa Digital',
      collaboration: 'Kolaborasi Komunitas'
    },
    contact: {
      title: 'Kontak',
      email: 'Email',
      phone: 'Telepon',
      address: 'Alamat'
    },
    buttons: {
      start: 'Mulai Sekarang',
      learn: 'Pelajari Lebih Lanjut',
      preparing: 'Mempersiapkan...'
    }
  }
};

// Particle system component
const ParticleField = () => {
  const count = 30;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Notification component
const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      } text-white`}
    >
      {message}
    </motion.div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error']),
  onClose: PropTypes.func.isRequired
};

// Theme switcher component
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={() => {
      soundEffects.click.play();
      onToggle();
    }}
    className="fixed top-4 right-4 z-30 bg-white/10 backdrop-blur-sm p-3 rounded-full 
      hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border-2 border-white/30
      group"
  >
    {isDark ? (
      <FaSun className="h-6 w-6 text-yellow-300 group-hover:rotate-90 transition-transform duration-300" />
    ) : (
      <FaMoon className="h-6 w-6 text-white group-hover:-rotate-12 transition-transform duration-300" />
    )}
  </button>
);

ThemeToggle.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

// Language switcher component
const LanguageToggle = ({ currentLang, onToggle }) => (
  <button
    onClick={() => {
      soundEffects.click.play();
      onToggle();
    }}
    className="fixed top-4 right-20 z-30 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
      hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border-2 border-white/30
      text-white font-bold flex items-center gap-2 group"
  >
    <IoLanguage className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
    {currentLang.toUpperCase()}
  </button>
);

LanguageToggle.propTypes = {
  currentLang: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired
};

// Optimize Model component without LOD
const Model = React.memo(() => {
  const { scene } = useGLTF(Village, {
    draco: true // Enable draco compression
  });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(0.01);
  const modelRef = useRef();

  // Clean up memory when component unmounts
  useEffect(() => {
    return () => {
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  useFrame(() => {
    if (clicked && modelRef.current) {
      modelRef.current.rotation.y += rotateSpeed;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={hovered ? 0.8 : 0.5}
      floatIntensity={hovered ? 0.8 : 0.5}
    >
      <group 
        ref={modelRef}
        position={[0, 0, 0]}
        scale={clicked ? 13 : 10}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          setClicked(!clicked);
          setRotateSpeed(prev => clicked ? 0.01 : prev + 0.01);
        }}
      >
        <primitive 
          object={scene} 
          rotation={[0, Math.PI / 4, 0]}
        />
      </group>
      {hovered && (
        <Html position={[0, 1, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-lg text-sm border-4 border-green-400 transform -rotate-2 animate-bounce">
            <span className="text-green-600 font-bold flex items-center gap-2">
              <span className="text-lg">🏠</span>
              {clicked ? "Klik untuk menghentikan!" : "Klik untuk memutar rumah!"}
              <span className="text-lg">✨</span>
            </span>
          </div>
        </Html>
      )}
    </Float>
  );
});

Model.displayName = 'Model';

function CartoonCloud({ position, scale = 1, speed = 0.3 }) {
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
      {hovered && (
        <Html position={[0, 1, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-lg text-sm border-4 border-blue-400 transform rotate-2 animate-pulse">
            <span className="text-blue-600 font-bold flex items-center gap-2">
              <span className="text-lg">☁️</span>
              {clicked ? "Klik untuk memutihkan!" : "Klik untuk menggelapkan!"}
              <span className="text-lg">✨</span>
            </span>
          </div>
        </Html>
      )}
    </Float>
  );
}

CartoonCloud.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
  speed: PropTypes.number
};

function CloudsGroup() {
  return (
    <group>
      <CartoonCloud position={[-6, 4, -5]} scale={0.4} speed={0.4} />
      <CartoonCloud position={[6, 5, -8]} scale={0.5} speed={0.3} />
      <CartoonCloud position={[-3, 6, -6]} scale={0.3} speed={0.5} />
      <CartoonCloud position={[4, 3, -4]} scale={0.25} speed={0.45} />
      <CartoonCloud position={[0, 5, -7]} scale={0.45} speed={0.35} />
      <CartoonCloud position={[-5, 2, -3]} scale={0.2} speed={0.5} />
    </group>
  );
}

function ToggleButton({ isVisible, toggleVisibility }) {
  return (
    <button
      onClick={toggleVisibility}
      className={`absolute top-4 left-4 z-30 bg-white/10 backdrop-blur-sm p-3 rounded-full 
        hover:bg-white/20 transition-all duration-300 transform hover:scale-110 border-2 border-white/30
        ${isVisible ? 'rotate-0' : 'rotate-360'} group`}
    >
      {isVisible ? (
        <IoIosArrowBack className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" />
      ) : (
        <IoIosArrowForward className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" />
      )}
    </button>
  );
}

ToggleButton.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleVisibility: PropTypes.func.isRequired
};

function TabButton({ tab, activeTab, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl transition-all transform hover:scale-105 relative group
        ${activeTab === tab 
          ? 'bg-yellow-400 text-green-800 font-bold shadow-lg border-2 border-yellow-300' 
          : 'bg-white/20 text-white hover:bg-white/30'}`}
    >
      {typeof tab === 'string' ? tab.charAt(0).toUpperCase() + tab.slice(1) : tab}
      <span className={`absolute inset-0 rounded-xl border-2 border-white/30 
        transition-transform duration-300 ${activeTab === tab ? 'scale-0' : 'group-hover:scale-110'}`}
      ></span>
    </button>
  );
}

TabButton.propTypes = {
  tab: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

// Add new components
const FloatingIsland = ({ position, scale, rotationSpeed = 0.001, children }) => {
  const islandRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += rotationSpeed;
      islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group
      ref={islandRef}
      position={position}
      scale={hovered ? scale * 1.1 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
};

FloatingIsland.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number.isRequired,
  rotationSpeed: PropTypes.number,
  children: PropTypes.node.isRequired
};

const ParticleWave = () => {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.sin(i / 10) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] = Math.sin(i / 10 + time) * 2;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#4CAF50"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const FloatingTip = () => {
  const tips = [
    "Jelajahi fitur desa digital kami! 🌐",
    "Bergabung dengan komunitas desa! 🤝",
    "Temukan potensi desamu! ⭐",
    "Mari berkolaborasi untuk Indonesia! 🇮🇩"
  ];
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-30 w-full max-w-[90vw] sm:max-w-sm md:max-w-md hidden md:block"
    >
      <motion.div
        className="flex items-center gap-2 bg-green-500/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl
          shadow-lg border border-white/20 mx-4 sm:mx-0"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HiLightBulb className="text-xl sm:text-2xl text-white flex-shrink-0" />
        <motion.p
          key={currentTip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-sm sm:text-base text-white flex-1 min-w-0"
        >
          {tips[currentTip]}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

function Home() {
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentLang, setCurrentLang] = useState('id');
  const [notifications, setNotifications] = useState([]);
  const [showBoatTransition, setShowBoatTransition] = useState(false);
  const navigate = useNavigate();

  // Get current translations
  const t = translations[currentLang];

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // Preload model
  useEffect(() => {
    useGLTF.preload(Village);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const handleStartClick = () => {
    soundEffects.success.play();
    setShowBoatTransition(true);
    
    setTimeout(() => {
      setShowBoatTransition(false);
      navigate('/islands');
    }, 4000);
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
    addNotification(
      `Switched to ${isDarkTheme ? 'light' : 'dark'} mode`,
      'info'
    );
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'id' ? 'en' : 'id');
    addNotification(
      `Language changed to ${currentLang === 'id' ? 'English' : 'Bahasa Indonesia'}`,
      'info'
    );
  };

  // Memoize camera settings
  const cameraSettings = useMemo(() => ({
    position: [2, 15, 7],
    fov: 35,
    near: 0.1,
    far: 1000
  }), []);

  // Memoize scene settings
  const sceneSettings = useMemo(() => ({
    stars: {
      radius: 80,
      depth: 40,
      count: 1000,
      factor: 3,
      saturation: 0,
      fade: true,
      speed: 0.3
    },
    sparkles: {
      count: 20,
      scale: 6,
      size: 1.5,
      speed: 0.2
    },
    fog: {
      color: isDarkTheme ? '#1a1a1a' : '#87CEEB',
      near: 1,
      far: 30
    },
    background: isDarkTheme 
      ? 'linear-gradient(to bottom, #1a1a1a, #2d3748)'
      : 'linear-gradient(to bottom, #87CEEB, #60A5FA)',
  }), [isDarkTheme]);

  // Memoize light settings
  const lightSettings = useMemo(() => ({
    ambient: {
      intensity: isDarkTheme ? 0.3 : 0.6
    },
    directional: {
      position: [5, 5, 5],
      intensity: isDarkTheme ? 0.6 : 1.2,
      color: isDarkTheme ? '#ffffff' : '#ffffff'
    },
    spot: {
      position: [-5, 5, -5],
      intensity: isDarkTheme ? 0.4 : 0.8,
      color: isDarkTheme ? '#ffffff' : '#ffffff'
    },
    hemisphere: {
      intensity: isDarkTheme ? 0.3 : 0.6,
      skyColor: isDarkTheme ? '#ffffff' : '#87CEEB',
      groundColor: isDarkTheme ? '#000000' : '#ffffff'
    }
  }), [isDarkTheme]);

  return (
    <div className={`relative w-full h-screen ${isDarkTheme ? 'dark' : ''}`}>
      {loading && <Loading onComplete={handleLoadingComplete} />}

      <AnimatePresence>
        {showBoatTransition && <BoatLoadingScreen />}
        {notifications.map(({ id, message, type }) => (
          <Notification
            key={id}
            message={message}
            type={type}
            onClose={() => removeNotification(id)}
          />
        ))}
      </AnimatePresence>

      {/* Bottom Sheet / Side Card Content */}
      <motion.div 
        className={`fixed lg:relative lg:w-[30%] pointer-events-none
          ${isCardVisible 
            ? 'bottom-0 left-0 right-0 z-20' 
            : 'bottom-[-90vh] left-0 right-0 lg:bottom-0 lg:left-[-100%] z-10'
          }
          transition-all duration-500 ease-in-out`}
      >
        {/* Drag Handle for Mobile */}
        <div className="lg:hidden w-full flex justify-center items-center py-1 pointer-events-auto">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        <div className="text-left w-full max-w-md mx-auto px-3 sm:px-4 md:px-6 lg:px-4 pb-safe lg:pb-0 pt-3 lg:pt-28">
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-500 glass-card 
            rounded-t-[1.5rem] lg:rounded-[1.5rem] shadow-2xl border border-white/20 
            relative overflow-hidden group pointer-events-auto transform hover:scale-[1.02] transition-all duration-500">
            
            {/* Content Container */}
            <div className="relative p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
              {/* Enhanced Title Section */}
              <div className="space-y-2 sm:space-y-3">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text 
                    bg-gradient-to-r from-white via-white/90 to-white tracking-tight leading-none
                    text-shadow-glow relative z-10">
                    {t.title}
                  </h1>
                  <motion.div 
                    className="absolute -right-2 -top-2 text-2xl sm:text-3xl animate-float"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-sm sm:text-base text-white/90 font-medium leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {t.subtitle}
                </motion.p>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="bg-black/10 backdrop-blur-md rounded-lg p-1 border border-white/10">
                <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-1 sm:gap-1.5 hide-scrollbar">
                  {['about', 'features', 'contact'].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium
                        relative overflow-hidden flex-shrink-0 ${activeTab === tab 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                          : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                      {activeTab === tab && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/30 to-green-400/0"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="min-h-[180px] bg-gradient-to-br from-black/20 via-black/10 to-black/5 
                rounded-lg p-3 sm:p-4 backdrop-blur-md border border-white/10 relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 sm:space-y-4 relative"
                    >
                      <div className="flex items-start gap-2 sm:gap-3 group">
                        <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg
                          border border-green-400/20 shadow-lg animate-float">
                          <RiCommunityLine className="text-lg sm:text-xl text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-base sm:text-lg font-bold text-white bg-gradient-to-r from-white to-white/80 
                            bg-clip-text text-transparent">
                            Tentang Kami
                          </h3>
                          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                            Platform inovatif yang menghubungkan dan memberdayakan desa-desa di Indonesia 
                            melalui teknologi digital dan kolaborasi komunitas.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2 sm:space-y-3 relative"
                    >
                      {Object.entries(t.features).slice(1).map(([key, value], index) => (
                        <motion.div 
                          key={key}
                          className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg transition-all duration-300
                            bg-gradient-to-r hover:from-white/10 hover:to-transparent group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 10 }}
                        >
                          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/20 
                            rounded-lg border border-green-400/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                            {key === 'community' && <RiCommunityLine className="text-lg sm:text-xl text-white" />}
                            {key === 'innovation' && <MdLightbulb className="text-lg sm:text-xl text-white" />}
                            {key === 'collaboration' && <RiTeamLine className="text-lg sm:text-xl text-white" />}
                          </div>
                          <span className="text-sm sm:text-base text-white/90 font-medium group-hover:text-white 
                            transition-colors duration-300">
                            {value}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'contact' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 sm:space-y-4 relative"
                    >
                      <div className="grid gap-2 sm:gap-3">
                        <motion.a 
                          href="mailto:info@sahabatdesa.id"
                          className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg 
                            bg-gradient-to-r hover:from-white/10 hover:to-transparent
                            transition-all duration-300 group"
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/20 
                            rounded-lg border border-green-400/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                            <MdEmail className="text-lg sm:text-xl text-white" />
                          </div>
                          <span className="text-sm sm:text-base text-white/90 font-medium group-hover:text-white">
                            info@sahabatdesa.id
                          </span>
                        </motion.a>
                        
                        <motion.a 
                          href="tel:+6281234567890"
                          className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg 
                            bg-gradient-to-r hover:from-white/10 hover:to-transparent
                            transition-all duration-300 group"
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/20 
                            rounded-lg border border-green-400/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                            <MdPhone className="text-lg sm:text-xl text-white" />
                          </div>
                          <span className="text-sm sm:text-base text-white/90 font-medium group-hover:text-white">
                            +62 000 0000 0000
                          </span>
                        </motion.a>

                        <motion.div 
                          className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg 
                            bg-gradient-to-r hover:from-white/10 hover:to-transparent
                            transition-all duration-300 group"
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-500/20 to-green-600/20 
                            rounded-lg border border-green-400/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                            <MdLocationOn className="text-lg sm:text-xl text-white" />
                          </div>
                          <span className="text-sm sm:text-base text-white/90 font-medium group-hover:text-white">
                            Semarang, Jawa Tengah
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="space-y-1.5 sm:space-y-2">
                <motion.button 
                  onClick={handleStartClick}
                  className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white 
                    font-bold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] hover:rotate-1 
                    shadow-lg border border-green-400/30 flex items-center justify-center gap-2
                    relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RiRocketLine className="text-base sm:text-lg group-hover:rotate-12 transition-transform" />
                  <span className="text-xs sm:text-sm relative z-10">{t.buttons.start}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.button>

                <motion.button 
                  className="w-full bg-white/10 backdrop-blur-sm text-white font-bold py-2 sm:py-3 rounded-lg 
                    transition-all transform hover:scale-[1.02] hover:-rotate-1 
                    shadow-lg border border-white/20 flex items-center justify-center gap-2
                    relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BsBook className="text-base sm:text-lg group-hover:rotate-12 transition-transform" />
                  <span className="text-xs sm:text-sm relative z-10">{t.buttons.learn}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Container */}
      <div className="fixed top-0 left-0 right-0 p-2 sm:p-3 md:p-4 flex justify-between items-center z-30">
        {/* Toggle Button */}
        <button
          onClick={() => {
            soundEffects.click.play();
            setIsCardVisible(!isCardVisible);
          }}
          className={`bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full 
            hover:bg-white/20 transition-all duration-300 transform hover:scale-110 
            border border-white/30 ${isCardVisible ? 'rotate-0' : 'rotate-180'} group
            shadow-lg`}
        >
          <IoIosArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-yellow-300 transition-colors" />
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle currentLang={currentLang} onToggle={toggleLanguage} />
          <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Keep Floating Tip */}
      <FloatingTip />

      {/* 3D Scene with optimized settings */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <Canvas
          camera={cameraSettings}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true,
            alpha: false
          }}
          style={{ 
            background: sceneSettings.background
          }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={[sceneSettings.fog.color, sceneSettings.fog.near, sceneSettings.fog.far]} />
            <color attach="background" args={[sceneSettings.fog.color]} />
            
            <ambientLight 
              intensity={lightSettings.ambient.intensity} 
            />
            <directionalLight 
              position={lightSettings.directional.position} 
              intensity={lightSettings.directional.intensity}
              color={lightSettings.directional.color}
              castShadow={false}
            />
            <spotLight 
              position={lightSettings.spot.position} 
              intensity={lightSettings.spot.intensity}
              color={lightSettings.spot.color}
            />
            <hemisphereLight 
              intensity={lightSettings.hemisphere.intensity}
              color={lightSettings.hemisphere.skyColor}
              groundColor={lightSettings.hemisphere.groundColor}
            />
            
            <ParticleField />
            <Model />
            <CloudsGroup />
            <Stars {...sceneSettings.stars} />
            <Sparkles {...sceneSettings.sparkles} />
            
            <Environment 
              preset={isDarkTheme ? "night" : "sunset"}
              background={false}
            />
            <OrbitControls 
              enableZoom={false}
              autoRotate 
              autoRotateSpeed={0.2}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.3}
            />

            {/* Add Particle Wave */}
            <ParticleWave />

            {/* Update Floating Islands with static colors */}
            <FloatingIsland position={[-5, 2, -5]} scale={0.8} rotationSpeed={0.001}>
              <mesh>
                <boxGeometry args={[1, 0.2, 1]} />
                <meshStandardMaterial color="#4CAF50" />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 0.5, 6]} />
                <meshStandardMaterial color="#2E7D32" />
              </mesh>
            </FloatingIsland>

            <FloatingIsland position={[5, 3, -6]} scale={0.6} rotationSpeed={-0.001}>
              <mesh>
                <boxGeometry args={[1, 0.2, 1]} />
                <meshStandardMaterial color="#2E7D32" />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.3, 0.6, 6]} />
                <meshStandardMaterial color="#4CAF50" />
              </mesh>
            </FloatingIsland>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

// Add custom CSS to hide scrollbar but keep functionality
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

Home.propTypes = {};

export default Home; 