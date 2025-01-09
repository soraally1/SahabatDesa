import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaRegClock, FaUsers, FaChartLine, FaHandHoldingHeart, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';

const CrowdfundingCard = ({ title, description, target, raised, daysLeft, supporters, image }) => {
  const [showDetails, setShowDetails] = useState(false);
  const progress = Math.round((raised/target) * 100);
  const isUrgent = daysLeft <= 7;
  const isPopular = supporters >= 200;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg
        hover:shadow-2xl transition-all duration-300 border border-gray-100 group w-full max-w-[360px] relative"
    >
      {/* Image Container */}
      <div className="relative h-44 md:h-52">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700" 
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isUrgent && (
            <motion.span
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="px-2 py-1 bg-red-500/95 rounded-full text-xs 
                font-medium text-white shadow-sm flex items-center gap-1"
            >
              <FaRegClock className="text-[10px]" />
              Mendesak
            </motion.span>
          )}
          {isPopular && (
            <span className="px-2 py-1 bg-yellow-500/95 rounded-full text-xs 
              font-medium text-white shadow-sm flex items-center gap-1"
            >
              <FaChartLine className="text-[10px]" />
              Populer
            </span>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base md:text-lg font-bold text-white mb-1 line-clamp-2 leading-snug">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        <div className="relative mb-4">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed pr-7">
            {description}
          </p>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="absolute -top-1 right-0 p-1.5 text-gray-400 hover:text-gray-600 
              hover:bg-gray-50 rounded-full transition-colors"
          >
            <FaInfoCircle className="text-base" />
          </button>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-gray-600">Target: Rp{target.toLocaleString()}</span>
            <span className={`font-semibold ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progress >= 100
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gradient-to-r from-blue-500 to-blue-400'
              }`}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center min-w-[90px]">
            <div className="text-sm font-bold text-gray-800 flex items-center justify-center">
              <span className="text-xs text-blue-600 shrink-0">Rp</span>
              <span className="truncate max-w-[80px]">{raised.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
              Terkumpul
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-gray-800">
              <span className={isUrgent ? 'text-red-600' : ''}>
                {daysLeft}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
              Hari Lagi
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-gray-800">
              {supporters}
            </div>
            <div className="text-[10px] text-gray-500 font-medium mt-0.5">
              Supporter
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
            hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaHandHoldingHeart className="text-base" />
          Dukung Proyek
        </motion.button>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl mx-4"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FaUsers className="text-blue-500 text-base" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Jumlah Supporter</h4>
                  <p className="text-gray-500 text-xs">{supporters} orang telah mendukung</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FaRegClock className="text-blue-500 text-base" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Sisa Waktu</h4>
                  <p className="text-gray-500 text-xs">{daysLeft} hari tersisa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FaChartLine className="text-blue-500 text-base" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Progress</h4>
                  <p className="text-gray-500 text-xs">
                    Terkumpul Rp{raised.toLocaleString()} dari Rp{target.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="w-full mt-5 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium
                hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

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