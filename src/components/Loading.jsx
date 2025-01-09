import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from 'prop-types';

// List of all 3D models to preload
const MODEL_PATHS = [
  '/models/Boat.glb',
  '/models/Marketplace.glb',
  '/models/Desa1.glb',
  '/models/Desa2.glb',
  '/models/Desa3.glb',
  '/models/Desa4.glb',
  '/models/Village.glb'
];

// Loading messages with village theme
const LOADING_MESSAGES = [
  "Mempersiapkan perjalanan ke desa...",
  "Mengumpulkan hasil panen...",
  "Menyiapkan kerajinan desa...",
  "Menata pasar tradisional...",
  "Menyambut kedatangan Anda..."
];

function Loading({ onComplete }) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [visibleDesaLetters, setVisibleDesaLetters] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedModels, setLoadedModels] = useState({});
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');
  const totalLetters = 'SAHABAT'.length;
  const totalDesaLetters = 'DESA'.length;

  // Dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Letters animation
  useEffect(() => {
    const letterInterval = setInterval(() => {
      setVisibleLetters(prev => prev < totalLetters ? prev + 1 : prev);
    }, 100);

    const desaLetterInterval = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleDesaLetters(prev => prev < totalDesaLetters ? prev + 1 : prev);
      }, 100);
      return () => clearInterval(interval);
    }, totalLetters * 100 + 150);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(desaLetterInterval);
    };
  }, [totalLetters, totalDesaLetters]);

  // Model preloading
  useEffect(() => {
    const loader = new GLTFLoader();
    let totalLoaded = 0;

    const preloadModels = async () => {
      try {
        const loadPromises = MODEL_PATHS.map((path) => {
          return new Promise((resolve, reject) => {
            loader.load(
              path,
              (gltf) => {
                setLoadedModels(prev => ({
                  ...prev,
                  [path]: gltf
                }));
                resolve(gltf);
              },
              // Progress callback
              (xhr) => {
                if (xhr.lengthComputable) {
                  totalLoaded += xhr.loaded;
                  const progress = (totalLoaded / (MODEL_PATHS.length * xhr.total)) * 100;
                  setLoadingProgress(Math.min(progress, 100));
                  
                  // Complete loading when progress reaches 100%
                  if (progress >= 100) {
                    onComplete();
                  }
                }
              },
              reject
            );
          });
        });

        await Promise.all(loadPromises);
        onComplete(); // Ensure completion even if progress calculation was off
      } catch (error) {
        console.error('Error preloading models:', error);
        onComplete();
      }
    };

    preloadModels();

    return () => {
      // Clean up loaded models
      Object.values(loadedModels).forEach(model => {
        if (model && model.scene) {
          model.scene.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }
      });
    };
  }, [onComplete]);

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
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shine"></div>
              </div>
            </div>
            <div className="mt-2 text-white/80 text-sm font-medium tracking-wider">
              {Math.round(loadingProgress)}%
            </div>
          </div>

          {/* Loading Message */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                className="text-white/60 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="animate-bounce-scale inline-flex items-center gap-2">
                  <span className="text-lg animate-bounce-rotate">✨</span>
                  {LOADING_MESSAGES[currentMessage]}
                  <span className="text-lg animate-bounce-rotate">✨</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

Loading.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default Loading; 