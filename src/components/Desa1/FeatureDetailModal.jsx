import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const FeatureDetailModal = ({ feature, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-4xl mx-auto my-8 h-[80vh] flex flex-col shadow-2xl border border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <motion.div 
            className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-sm rounded-t-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-gray-600 leading-relaxed max-w-3xl">
              {feature.description}
            </p>
          </motion.div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
            <div className="grid grid-cols-3 gap-8">
              {[
                { 
                  label: "Dampak", 
                  value: "9.5/10", 
                  icon: "⭐", 
                  color: "bg-gradient-to-br from-amber-50 to-amber-100",
                  borderColor: "border-amber-200",
                  shadowColor: "shadow-amber-100",
                  textColor: "text-amber-700"
                },
                { label: "Progres", value: "75%", icon: "📈", color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border border-blue-200" },
                { label: "Prioritas", value: "Tinggi", icon: "🎯", color: "bg-gradient-to-br from-green-50 to-green-100 text-green-600 border border-green-200" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className={`
                    ${stat.color} ${stat.borderColor} ${stat.textColor}
                    rounded-2xl p-6 flex flex-col items-center justify-center
                    text-center shadow-lg hover:shadow-xl transition-all duration-300
                    border backdrop-blur-sm relative overflow-hidden
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"></div>
                  <motion.span 
                    className="text-4xl mb-3 relative z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    {stat.icon}
                  </motion.span>
                  <motion.span 
                    className="text-2xl font-bold mb-1 relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  <motion.span 
                    className="text-sm font-medium opacity-75 relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.label}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #666;
              }
            `}</style>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(feature.stats).map(([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 capitalize">
                    {key}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center gap-3">
                  <span className="bg-green-200/80 p-2 rounded-lg">✨</span> 
                  Manfaat
                </h3>
                <div className="space-y-4">
                  {feature.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-white/80 rounded-xl p-4 hover:bg-white transition-colors duration-200 border border-green-100"
                    >
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center gap-3">
                  <span className="bg-blue-200/80 p-2 rounded-lg">🎯</span>
                  Implementasi
                </h3>
                <div className="space-y-4">
                  {feature.implementation.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-white/80 rounded-xl p-4 hover:bg-white transition-colors duration-200 border border-blue-100"
                    >
                      <div className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

FeatureDetailModal.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      area: PropTypes.string,
      crops: PropTypes.string,
      farmers: PropTypes.string,
      yield: PropTypes.string
    }),
    highlights: PropTypes.arrayOf(PropTypes.string),
    implementation: PropTypes.arrayOf(PropTypes.string)
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

FeatureDetailModal.defaultProps = {
  feature: null
};

export default FeatureDetailModal; 