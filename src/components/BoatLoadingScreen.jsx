import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Cloud Component
const Cloud = ({ delay = 0, duration = 20, scale = 1, top = "20%" }) => (
  <motion.div
    className="absolute"
    initial={{ right: "-20%" }}
    animate={{ right: "120%" }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
    style={{ top }}
  >
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      <div className="absolute w-16 h-6 bg-white rounded-full opacity-90" />
      <div className="absolute w-10 h-10 bg-white rounded-full -top-4 -left-2 opacity-90" />
      <div className="absolute w-10 h-10 bg-white rounded-full -top-4 left-6 opacity-90" />
    </div>
  </motion.div>
);

Cloud.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  scale: PropTypes.number,
  top: PropTypes.string
};

// Bird Component
const Bird = ({ delay = 0, duration = 10, top = "30%" }) => (
  <motion.div
    className="absolute"
    initial={{ left: "-5%" }}
    animate={{ left: "105%" }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
    style={{ top }}
  >
    <motion.div
      animate={{ y: [-2, 2] }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        <motion.div
          className="w-3 h-1 bg-white rounded-full transform -rotate-[30deg]"
          animate={{ rotate: [-30, -20] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-3 h-1 bg-white rounded-full transform rotate-[30deg] -ml-1"
          animate={{ rotate: [30, 20] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  </motion.div>
);

Bird.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  top: PropTypes.string
};

// Loading UI Component
function LoadingUI({ progress = 0, onLoadComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsExiting(true);
    }
  }, [progress]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      animate={isExiting ? {
        scale: 1.1,
        opacity: 0
      } : {
        scale: 1,
        opacity: 1
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut"
      }}
      onAnimationComplete={() => {
        if (isExiting) {
          onLoadComplete();
        }
      }}
    >
      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600"
        animate={isExiting ? {
          y: "-100%"
        } : {
          y: "0%"
        }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"
          animate={isExiting ? {
            opacity: 0
          } : {
            opacity: 1
          }}
          transition={{
            duration: 0.5
          }}
        />
        
        {/* Sun */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-yellow-200"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isExiting ? {
            opacity: 0,
            scale: 2,
            y: -100
          } : {
            opacity: 1,
            scale: 1,
            y: 0
          }}
          transition={{ 
            duration: isExiting ? 1 : 0.5,
            ease: "easeInOut"
          }}
          style={{
            boxShadow: '0 0 60px rgba(255, 255, 200, 0.6)'
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Clouds with exit animation */}
        <AnimatePresence>
          {!isExiting && (
            <>
              <Cloud delay={0} duration={25} scale={1.2} top="15%" />
              <Cloud delay={2} duration={20} scale={0.8} top="25%" />
              <Cloud delay={4} duration={22} scale={1} top="10%" />
              <Cloud delay={6} duration={18} scale={0.9} top="20%" />
            </>
          )}
        </AnimatePresence>

        {/* Birds with exit animation */}
        <AnimatePresence>
          {!isExiting && (
            <>
              <Bird delay={0} duration={8} top="18%" />
              <Bird delay={1.5} duration={7} top="22%" />
              <Bird delay={3} duration={9} top="15%" />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Progress Circle */}
        <motion.div 
          className="absolute top-10 right-10 backdrop-blur-sm bg-white/10 p-4 rounded-2xl"
          initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
          animate={isExiting ? {
            opacity: 0,
            scale: 0,
            rotate: 180
          } : {
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            bounce: 0.4
          }}
        >
          <div className="relative w-20 h-20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                className="text-white opacity-20"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
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
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* 2D Boat Animation */}
        <div className="relative w-full h-96 overflow-hidden mt-20">
          {/* Background waves with exit animation */}
          <AnimatePresence>
            {!isExiting && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 left-0 w-[200%] h-24"
                    initial={{ x: i % 2 === 0 ? "0%" : "-100%" }}
                    animate={{
                      x: i % 2 === 0 ? "-100%" : "0%"
                    }}
                    exit={{
                      opacity: 0,
                      y: 100
                    }}
                    transition={{
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      bottom: `${i * 8}px`,
                      background: `linear-gradient(90deg, transparent 0%, ${i === 0 ? '#93C5FD' : '#60A5FA'} 50%, transparent 100%)`,
                      opacity: 0.2 - i * 0.05,
                      filter: 'blur(4px)'
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Boat with exit animation */}
          <motion.div
            className="absolute left-1/2 bottom-24 -translate-x-1/2"
            initial={{ x: "-200%", rotate: -5 }}
            animate={isExiting ? {
              x: "200%",
              y: -100,
              rotate: 5,
              scale: 0.8
            } : {
              x: "-50%",
              y: [-8, 8],
              rotate: [-2, 2]
            }}
            transition={isExiting ? {
              duration: 1.5,
              ease: "easeInOut"
            } : {
              x: { duration: 1, type: "spring", bounce: 0.4 },
              y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              rotate: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
          >
            {/* Boat Body */}
            <div className="relative scale-150">
              <motion.div 
                className="w-32 h-12 bg-orange-700 rounded-b-full shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              />
              <motion.div 
                className="absolute bottom-8 w-40 h-4 bg-orange-800 -left-4 shadow-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              />
              
              {/* Sail */}
              <div className="absolute -top-20 left-12">
                <motion.div 
                  className="w-16 h-20 bg-white rounded-tl-full border-l-2 border-t-2 border-gray-300 relative overflow-hidden shadow-lg"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2, type: "spring", bounce: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Mast */}
              <motion.div 
                className="absolute -top-20 left-20 w-2 h-20 bg-orange-900 shadow-md"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              />

              {/* Water splashes */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`splash-${i}`}
                  className="absolute bottom-0 w-2 h-2 rounded-full bg-blue-200"
                  style={{
                    left: `${i * 20 - 20}px`,
                    opacity: 0.6
                  }}
                  animate={{
                    y: [-10, 10],
                    opacity: [0.6, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Loading Text with exit animation */}
        <motion.div 
          className="text-5xl font-bold text-white flex flex-col items-center justify-center gap-2 mt-4"
          initial={{ y: 50, opacity: 0 }}
          animate={isExiting ? {
            y: 50,
            opacity: 0,
            scale: 0.9
          } : {
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-gradient-to-r from-white via-blue-100 to-white 
              bg-clip-text text-transparent relative font-extrabold tracking-wider px-8 py-4 rounded-xl
              backdrop-blur-sm bg-white/10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% auto"
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
                  scale: [1, 1.2, 1]
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
      </div>
    </motion.div>
  );
}

LoadingUI.propTypes = {
  progress: PropTypes.number,
  onLoadComplete: PropTypes.func.isRequired
};

// Main Component
const BoatLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleLoadComplete = () => {
    navigate('/islands');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 1.2,
        ease: "easeInOut"
      }}
    >
      <LoadingUI progress={progress} onLoadComplete={handleLoadComplete} />
    </motion.div>
  );
};

export default BoatLoadingScreen; 