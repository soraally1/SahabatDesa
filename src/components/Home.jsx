import { Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Stars,
  Float,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

// Add ESLint exceptions for Three.js props
/* eslint-disable react/no-unknown-property */

function LoadingScreen() {
  const { progress } = useProgress();
  const [dots, setDots] = useState('');
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [visibleDesaLetters, setVisibleDesaLetters] = useState(0);
  const totalLetters = 'SAHABAT'.length;
  const totalDesaLetters = 'DESA'.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => prev < totalLetters ? prev + 1 : prev);
    }, 200);

    const desaLetterInterval = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleDesaLetters(prev => prev < totalDesaLetters ? prev + 1 : prev);
      }, 200);
      return () => clearInterval(interval);
    }, totalLetters * 200 + 300);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(desaLetterInterval);
    };
  }, [totalLetters, totalDesaLetters]);

  const renderLetter = (letter, index, isVisible, isDesaText = false) => {
    if (!isVisible) return <span key={index} className="opacity-0">{letter}</span>;
    
    return (
      <span 
        key={index}
        className={`inline-block transform-gpu animate-letter-bounce-in hover:text-${isDesaText ? 'white' : 'yellow-300'} transition-colors`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          animationFillMode: 'both',
          textShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        {letter}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-700 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30 animate-floatBackground"></div>
      </div>

      <div className="text-center relative">
        {/* Spinning Circle */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 animate-spin-slow">
            <div className="w-20 h-20 rounded-full bg-green-600 absolute top-2 left-2"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce-slow">🏠</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12 space-y-6 relative">
          {/* Sahabat Text */}
          <div className="text-7xl font-bold text-white tracking-wider relative group perspective">
            {'SAHABAT'.split('').map((letter, i) => renderLetter(letter, i, i < visibleLetters))}
            {visibleLetters === totalLetters && (
              <span className="absolute -right-12 top-0 text-5xl animate-bounce-scale">✨</span>
            )}
          </div>

          {/* Desa Text */}
          <div className="text-7xl font-bold text-yellow-300 tracking-wider relative group perspective">
            {'DESA'.split('').map((letter, i) => renderLetter(letter, i, i < visibleDesaLetters, true))}
          </div>
        </div>

        {/* Loading Text and Progress */}
        <div className="relative">
          <div className="text-2xl text-white/90 font-medium mb-4 tracking-wide">
            <span className="animate-bounce-custom inline-flex items-center gap-2">
              <span className="text-xl animate-bounce-rotate">🚀</span>
              Memuat{dots}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-64 h-3 bg-black/20 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-300 relative animate-pulse-slow"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shine"></div>
              </div>
            </div>
            <div className="mt-2 text-white/80 text-sm font-medium tracking-wider">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Loading Message */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-white/60 text-sm animate-bounce-scale inline-flex items-center gap-2">
              <span className="text-lg animate-bounce-rotate">✨</span>
              Menyiapkan pengalaman terbaik untuk Anda...
              <span className="text-lg animate-bounce-rotate">✨</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Model() {
  const { scene } = useGLTF('/home.glb');
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
        scale={clicked ? 1.8 : 1.5} 
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
        ${isVisible ? 'rotate-0' : 'rotate-180'} group`}
    >
      {isVisible ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-yellow-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      )}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isVisible ? 'Sembunyikan Menu' : 'Tampilkan Menu'}
      </span>
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

function Home({ onStartClick }) {
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [startingWorld, setStartingWorld] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartClick = () => {
    setStartingWorld(true);
    // Add some delay before actual transition
    setTimeout(() => {
      onStartClick();
    }, 500);
  };

  return (
    <div className="relative w-full h-screen flex">
      {loading && <LoadingScreen />}

      <ToggleButton 
        isVisible={isCardVisible} 
        toggleVisibility={() => setIsCardVisible(!isCardVisible)} 
      />

      {/* Left Side Content */}
      <div 
        className={`w-1/2 flex items-center justify-center pointer-events-none bg-gradient-to-r from-black/30 to-transparent transition-transform duration-500 ease-in-out
          ${isCardVisible ? 'translate-x-0' : '-translate-x-full'}`} 
        style={{ zIndex: 20 }}
      >
        <div className="text-left text-white px-12 max-w-xl transform -rotate-1">
          <div className="bg-gradient-to-r from-green-600/90 to-green-500/90 p-8 rounded-3xl shadow-2xl border-4 border-white/30 backdrop-blur-sm relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30"></div>
            
            <h1 className="text-7xl font-bold mb-6 drop-shadow-lg leading-tight relative">
              <span className="inline-block transform hover:scale-105 transition-transform cursor-default animate-float">
                Sahabat Desa 
                <span className="absolute -right-8 top-0 animate-pulse">✨</span>
              </span>
            </h1>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-6 pointer-events-auto">
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
            <div className="mb-8 min-h-[100px] transition-all duration-300 relative">
              <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              <div className="relative p-4">
                {activeTab === 'about' && (
                  <p className="text-2xl drop-shadow-md leading-relaxed font-medium animate-slideRight">
                    Membangun Desa,{" "}
                    <span className="text-yellow-300 font-bold">
                      Menguatkan Indonesia! 🌟
                    </span>
                  </p>
                )}
                {activeTab === 'features' && (
                  <ul className="list-none space-y-3 animate-slideLeft">
                    <li className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">🌾</span>
                      <span className="group-hover:text-yellow-300 transition-colors">Pemberdayaan Masyarakat</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">💡</span>
                      <span className="group-hover:text-yellow-300 transition-colors">Inovasi Desa Digital</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">🤝</span>
                      <span className="group-hover:text-yellow-300 transition-colors">Kolaborasi Komunitas</span>
                    </li>
                  </ul>
                )}
                {activeTab === 'contact' && (
                  <div className="space-y-3 animate-slideUp">
                    <p className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">📧</span>
                      <span className="group-hover:text-yellow-300 transition-colors">info@sahabatdesa.id</span>
                    </p>
                    <p className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">📱</span>
                      <span className="group-hover:text-yellow-300 transition-colors">+62 123 4567 890</span>
                    </p>
                    <p className="flex items-center gap-3 group">
                      <span className="text-2xl group-hover:scale-125 transition-transform">📍</span>
                      <span className="group-hover:text-yellow-300 transition-colors">Jakarta, Indonesia</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pointer-events-auto">
              <button 
                onClick={handleStartClick}
                disabled={startingWorld}
                className={`w-full bg-yellow-400 hover:bg-yellow-300 text-green-800 font-bold py-4 px-8 rounded-2xl transition duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg border-4 border-yellow-300 flex items-center justify-center space-x-2 group relative overflow-hidden
                  ${startingWorld ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 animate-shine"></span>
                <span className="text-xl group-hover:animate-bounce">🚀</span>
                <span>{startingWorld ? 'Mempersiapkan...' : 'Mulai Sekarang'}</span>
              </button>
              <button className="w-full bg-white/90 hover:bg-white text-green-600 font-bold py-4 px-8 rounded-2xl transition duration-300 transform hover:scale-105 hover:-rotate-1 shadow-lg border-4 border-white/70 flex items-center justify-center space-x-2 group relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shine"></span>
                <span className="text-xl group-hover:animate-bounce">📖</span>
                <span>Pelajari Lebih Lanjut</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side 3D Scene */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45 }}
          style={{ 
            background: 'linear-gradient(to bottom, #7dd3fc, #0ea5e9)'
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <spotLight position={[-10, 10, -5]} intensity={1.5} />
            <hemisphereLight intensity={0.5} groundColor="#ffffff" />
            
            <Model />
            <CloudsGroup />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <Environment preset="sunset" />
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

      {/* World Transition Overlay */}
      {startingWorld && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-500 flex items-center justify-center">
          <div className="text-white text-2xl font-bold animate-pulse">
            Mempersiapkan Petualangan Anda...
          </div>
        </div>
      )}
    </div>
  );
}

Home.propTypes = {
  onStartClick: PropTypes.func.isRequired,
};

export default Home; 