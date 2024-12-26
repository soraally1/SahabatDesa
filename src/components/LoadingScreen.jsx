import { Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const { progress, loaded, total } = useProgress();
  const progressPercent = Math.round(progress);

  return (
    <Html center>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-amber-100 to-orange-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center space-y-8 p-12 bg-white/20 backdrop-blur-lg rounded-3xl border-4 border-brown-400 
          shadow-[0_10px_50px_rgba(0,0,0,0.15),_0_15px_25px_rgba(0,0,0,0.1),_inset_0_-5px_15px_rgba(0,0,0,0.05)]
          hover:shadow-[0_15px_60px_rgba(0,0,0,0.2),_0_20px_30px_rgba(0,0,0,0.15),_inset_0_-7px_20px_rgba(0,0,0,0.08)]
          transition-shadow duration-300"
        >
          {/* Cute village house loading icon */}
          <div className="relative w-40 h-40">
            <motion.div 
              className="absolute w-32 h-32 left-4 top-4"
              animate={{ 
                y: [0, -8, 0],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Simple house shape with enhanced shadows */}
              <div className="w-full h-20 bg-red-400 rounded-lg absolute bottom-0 
                shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.15),_4px_8px_12px_rgba(0,0,0,0.2)]" 
              />
              <div className="w-full h-16 bg-brown-600 absolute -top-8 left-0 transform rotate-45 origin-bottom-left
                shadow-[inset_-4px_4px_8px_rgba(0,0,0,0.2),_4px_4px_8px_rgba(0,0,0,0.15)]" 
              />
              <div className="w-6 h-8 bg-yellow-200 absolute bottom-4 left-4 rounded
                shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1),_2px_2px_4px_rgba(0,0,0,0.15)]" 
              />
              <motion.div 
                className="w-4 h-4 bg-white absolute top-0 right-8
                  shadow-[0_0_15px_rgba(255,255,255,0.8),_0_0_5px_rgba(255,255,255,0.6)]"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Progress text with enhanced drop shadow */}
            <div className="absolute inset-0 flex items-center justify-center mt-8">
              <motion.span 
                className="text-3xl font-bold text-brown-800 font-comic
                  drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {progressPercent}%
              </motion.span>
            </div>
          </div>
          
          <motion.h2 
            className="text-4xl font-comic font-bold text-brown-800
              drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)]"
            animate={{ 
              y: [0, -5, 0],
              rotateZ: [-2, 2, -2]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Building Village...
          </motion.h2>
          
          {/* Cute progress bar with enhanced shadows */}
          <div className="relative w-64 h-4 bg-white/40 rounded-full overflow-hidden border-2 border-brown-400
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-green-400 to-green-600
                shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Loading status with enhanced text shadow */}
          <motion.p 
            className="text-brown-700 text-sm font-comic
              drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {loaded} / {total} village items gathered
          </motion.p>

          {/* Village-themed tips with enhanced shadows */}
          <div className="text-brown-600 text-sm mt-4 font-comic space-y-2
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
            <motion.p
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] transition-all duration-200"
            >
              Tip: Use WASD to explore the village
            </motion.p>
            <motion.p
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] transition-all duration-200"
            >
              Press E to interact with villagers
            </motion.p>
          </div>
        </div>
      </motion.div>
    </Html>
  );
};

export default LoadingScreen;
