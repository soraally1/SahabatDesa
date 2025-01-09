import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProjectCard = ({ title, description, progress, image }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
  >
    <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
    <div className="p-8">
      <h3 className="text-2xl font-bold text-green-800 mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed mb-6">{description}</p>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-sm font-medium text-gray-500 mt-3">{progress}% selesai</p>
    </div>
  </motion.div>
);

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired
};

export default ProjectCard; 