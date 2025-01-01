import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FeatureDetailModal = ({ feature, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-5 pattern-dots pattern-gray-500 pattern-bg-white pattern-size-4" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-br ${feature.color} p-4 rounded-xl shadow-lg`}
              >
                <feature.icon className="text-3xl text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-green-800">{feature.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Dampak", value: "9.5/10" },
              { label: "Progres", value: "75%" },
              { label: "Prioritas", value: "Tinggi" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(feature.stats).map(([key, value]) => (
              <div key={key} className="bg-green-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-800">{value}</div>
                <div className="text-green-600 font-medium capitalize">{key}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">Manfaat</h3>
              <ul className="space-y-3">
                {feature.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4">Implementasi</h3>
              <ul className="space-y-3">
                {feature.implementation.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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