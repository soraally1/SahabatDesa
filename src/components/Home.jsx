import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
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
import { BsArrowRightShort, BsBook } from 'react-icons/bs';
import { RiRocketLine, RiCommunityLine, RiTeamLine } from 'react-icons/ri';
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import BoatLoadingScreen from './BoatLoadingScreen';
import Village from '../../public/models/Village.glb'
import Loading from './Loading';

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
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
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
        size={0.1}
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

function Model() {
  const { scene } = useGLTF(Village);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(0.01);

  useFrame(() => {
    if (clicked) {
      scene.rotation.y += rotateSpeed;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={hovered ? 0.8 : 0.5}
      floatIntensity={hovered ? 0.8 : 0.5}
    >
      <primitive 
        object={scene} 
        scale={clicked ? 15 : 10} 
        position={[0, -1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          setClicked(!clicked);
          setRotateSpeed(prev => clicked ? 0.01 : prev + 0.01);
        }}
      />
      {hovered && (
        <Html position={[0, 2, 0]} style={{ pointerEvents: 'none' }}>
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
}

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
    
    // Reset transition and navigate after animation completes
    setTimeout(() => {
      setShowBoatTransition(false);
      navigate('/islands');
    }, 4000); // 4 seconds for boat animation
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

  useGLTF.preload(Village);

  return (
    <div className={`relative w-full h-screen ${isDarkTheme ? 'dark' : ''}`}>
      {loading && <Loading />}

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
        className={`fixed lg:relative lg:w-[45%] pointer-events-none
          ${isCardVisible 
            ? 'bottom-0 left-0 right-0 z-20' 
            : 'bottom-[-90vh] left-0 right-0 lg:bottom-0 lg:left-[-100%] z-10'
          }
          transition-all duration-500 ease-in-out`}
        initial={{ y: '100%', x: 0 }}
        animate={{ 
          y: isCardVisible ? 0 : '100%',
          x: isCardVisible ? 0 : (window.innerWidth >= 1024 ? -100 : 0)
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        {/* Drag Handle for Mobile */}
        <div className="lg:hidden w-full flex justify-center items-center py-3 pointer-events-auto">
          <div className="w-16 h-1.5 bg-white/30 rounded-full" />
        </div>

        <div className="text-left text-white w-full max-w-2xl mx-auto pt-10 px-8 pb-safe lg:pb-0 lg:px-12">
          <div className="bg-gradient-to-br from-green-600/95 via-green-500/95 to-green-600/95 
            rounded-t-[2.5rem] lg:rounded-[2.5rem] shadow-2xl border-t-4 lg:border-4 border-white/30 
            backdrop-blur-md relative overflow-hidden group"
          >
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-white/5"></div>

            {/* Content Container */}
            <div className="relative p-6 md:p-8 lg:p-10 pointer-events-auto space-y-10 lg:space-y-8">
              {/* Title Section */}
              <div className="space-y-5">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold 
                  drop-shadow-lg leading-tight relative tracking-tight"
                >
                  <span className="inline-block transform hover:scale-105 
                    transition-transform cursor-default animate-float"
                  >
                    Sahabat Desa 
                    <span className="absolute -right-8 top-0 animate-pulse"></span>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-medium tracking-wide">
                  {t.subtitle}
                </p>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-3">
                {['about', 'features', 'contact'].map((tab) => (
                  <TabButton
                    key={tab}
                    tab={tab}
                    activeTab={activeTab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[180px] bg-black/10 rounded-2xl p-6 backdrop-blur-sm
                border-2 border-white/10 transition-all duration-300"
              >
                {activeTab === 'about' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-lg md:text-xl leading-relaxed"
                  >
                    <p className="flex items-center gap-3">
                      <RiCommunityLine className="text-3xl text-yellow-300 animate-bounce" />
                      {t.subtitle}
                    </p>
                  </motion.div>
                )}
                {activeTab === 'features' && (
                  <motion.ul 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <li className="flex items-center gap-3 group">
                      <RiCommunityLine className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">{t.features.community}</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <MdLightbulb className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">{t.features.innovation}</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <RiTeamLine className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">{t.features.collaboration}</span>
                    </li>
                  </motion.ul>
                )}
                {activeTab === 'contact' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <p className="flex items-center gap-3 group">
                      <MdEmail className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">info@sahabatdesa.id</span>
                    </p>
                    <p className="flex items-center gap-3 group">
                      <MdPhone className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">+62 123 4567 890</span>
                    </p>
                    <p className="flex items-center gap-3 group">
                      <MdLocationOn className="text-2xl group-hover:scale-125 transition-transform text-yellow-300" />
                      <span className="group-hover:text-yellow-300 transition-colors">Jakarta, Indonesia</span>
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleStartClick}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-800 font-bold 
                    py-4 px-6 rounded-2xl transition-all duration-300 transform 
                    hover:scale-[1.02] hover:rotate-1 shadow-lg border-4 border-yellow-300 
                    flex items-center justify-center gap-3 group relative overflow-hidden
                    text-base md:text-lg"
                >
                  <RiRocketLine className="text-xl group-hover:animate-bounce" />
                  <span>{t.buttons.start}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 
                    animate-shine"></span>
                </button>
                <button className="w-full bg-white/90 hover:bg-white text-green-600 font-bold 
                  py-4 px-6 rounded-2xl transition-all duration-300 transform 
                  hover:scale-[1.02] hover:-rotate-1 shadow-lg border-4 border-white/70 
                  flex items-center justify-center gap-3 group relative overflow-hidden
                  text-base md:text-lg"
                >
                  <BsBook className="text-xl group-hover:animate-bounce" />
                  <span>{t.buttons.learn}</span>
                  <BsArrowRightShort className="text-2xl group-hover:translate-x-2 transition-transform" />
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                    animate-shine"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Container */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        {/* Toggle Button */}
        <button
          onClick={() => {
            soundEffects.click.play();
            setIsCardVisible(!isCardVisible);
          }}
          className={`bg-white/10 backdrop-blur-sm p-3 rounded-full 
            hover:bg-white/20 transition-all duration-300 transform hover:scale-110 
            border-2 border-white/30 ${isCardVisible ? 'rotate-0' : 'rotate-180'} group
            shadow-lg`}
        >
          <IoIosArrowDown className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" />
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <LanguageToggle currentLang={currentLang} onToggle={toggleLanguage} />
          <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          style={{ 
            background: isDarkTheme
              ? 'linear-gradient(to bottom, #1a1a1a, #2d3748)'
              : 'linear-gradient(to bottom, #7dd3fc, #0ea5e9)'
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={isDarkTheme ? 0.5 : 1} />
            <directionalLight position={[10, 10, 5]} intensity={isDarkTheme ? 1 : 2} castShadow />
            <spotLight position={[-10, 10, -5]} intensity={isDarkTheme ? 0.8 : 1.5} />
            <hemisphereLight intensity={0.5} groundColor={isDarkTheme ? "#111111" : "#ffffff"} />
            
            <ParticleField />
            <Model />
            <CloudsGroup />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={10} size={2} speed={0.4} />
            
            <Environment preset={isDarkTheme ? "night" : "sunset"} />
            <OrbitControls 
              enableZoom={false} 
              autoRotate 
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

Home.propTypes = {};

export default Home; 