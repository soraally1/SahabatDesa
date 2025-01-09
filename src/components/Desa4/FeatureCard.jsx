import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { playSoundEffect } from './utils/soundEffects';

const FeatureCard = ({ icon: Icon, title, description, onClick, color, textColor, bgColor, borderColor, category }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl ${borderColor}
    hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group`}
    onHoverStart={() => playSoundEffect('hover')}
    onClick={() => {
      playSoundEffect('click');
      onClick?.();
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/80 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="absolute -right-16 -bottom-16 w-48 h-48 opacity-10 blur-xl rounded-full bg-gradient-to-br ${color}" />
    
    <div className="flex flex-col items-start gap-6 relative z-10">
      <div className={`bg-gradient-to-br ${color} p-4 rounded-xl shadow-lg 
        transform -rotate-3 group-hover:rotate-0 transition-all duration-300 group-hover:scale-110`}>
        <Icon className="text-3xl text-white" />
      </div>
      <div className={`px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium
        transform transition-transform duration-300 group-hover:scale-105 flex items-center gap-2`}>
        <span className="w-2 h-2 rounded-full bg-current" />
        {category}
      </div>
      <div>
        <h3 className={`text-2xl font-extrabold ${textColor} mb-3 tracking-tight 
          font-heading leading-tight group-hover:translate-x-2 transition-transform duration-300`}>{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg font-light group-hover:text-gray-800 transition-colors duration-300">{description}</p>
      </div>
    </div>
  </motion.div>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
};

export default FeatureCard; 