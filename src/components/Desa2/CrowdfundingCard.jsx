import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CrowdfundingCard = ({ title, description, target, raised, daysLeft, supporters, image }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg
      hover:shadow-2xl transition-all duration-300 border border-gray-100 group w-full max-w-sm"
  >
    <div className="relative h-48 sm:h-56">
      <div 
        className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700" 
        style={{ backgroundImage: `url(${image})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-2">
        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 rounded-full text-xs sm:text-sm font-semibold text-green-600 shadow-sm">
          Aktif
        </span>
        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600/95 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm">
          Crowdfunding
        </span>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-md line-clamp-2">
          {title}
        </h3>
      </div>
    </div>

    <div className="p-4 sm:p-6">
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
        {description}
      </p>
      
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3">
          <span className="font-medium text-gray-700">Target: Rp{target.toLocaleString()}</span>
          <span className="font-bold text-green-600">{Math.round((raised/target) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((raised/target) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg font-bold text-gray-800">
            <span className="text-xs sm:text-sm text-green-600 mr-1">Rp</span>
            {raised.toLocaleString()}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1">Terkumpul</div>
        </div>
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg font-bold text-gray-800">{daysLeft}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1">Hari Lagi</div>
        </div>
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg font-bold text-gray-800">{supporters}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1">Supporter</div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white 
          py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-sm 
          hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">Dukung Proyek</span>
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-green-700 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </div>
  </motion.div>
);

CrowdfundingCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  raised: PropTypes.number.isRequired,
  daysLeft: PropTypes.number.isRequired,
  supporters: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired
};

export default CrowdfundingCard; 