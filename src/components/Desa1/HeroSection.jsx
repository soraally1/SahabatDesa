import { motion } from 'framer-motion';
import { MdLocationOn } from 'react-icons/md';
import { BsArrowDownCircle } from 'react-icons/bs';
import DesaPagaitan from '../../assets/img/DesaPagaitan.jpg';

const HeroSection = () => (
  <div 
    className="relative min-h-screen"
    style={{
      backgroundImage: `url(${DesaPagaitan})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70" />
    
    <div className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-6xl mx-auto"
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 tracking-tight"
        >
          Desa Pagaitan
        </motion.h1>

        <motion.div 
          className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <MdLocationOn className="text-2xl sm:text-3xl md:text-4xl text-green-400" />
          <span className="font-light tracking-wide text-white/90">
            Sulawesi Utara, Indonesia
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-12 font-light px-4"
        >
          Selamat datang di Desa Pagaitan, sebuah permata tersembunyi di jantung Sulawesi Utara
        </motion.p>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.8, 0.4, 0.8]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <BsArrowDownCircle className="text-3xl sm:text-4xl text-white/80 hover:text-green-400 transition-colors cursor-pointer" />
      </motion.div>
    </div>
  </div>
);

export default HeroSection; 