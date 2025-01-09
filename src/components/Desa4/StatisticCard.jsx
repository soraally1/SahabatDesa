import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const StatisticCard = ({ value, label, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-green-500/10
      hover:shadow-2xl transition-all duration-300 group"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-md
        group-hover:scale-110 transition-transform duration-300">
        <Icon className="text-2xl text-white" />
      </div>
      <h3 className="text-3xl font-bold text-green-800">{value}</h3>
    </div>
    <p className="text-gray-600 text-lg font-medium group-hover:text-green-700 transition-colors duration-300">{label}</p>
  </motion.div>
);

StatisticCard.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
};

export default StatisticCard; 