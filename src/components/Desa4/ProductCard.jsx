import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaWhatsapp, FaInfoCircle, FaStar, FaShoppingCart } from 'react-icons/fa';
import { playSoundEffect } from './utils/soundEffects';


const ProductCard = ({ icon: Icon, title, description, category, image, price, stock, unit, rating, soldCount }) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg group 
      hover:shadow-2xl transition-all duration-500 border border-green-100/50 w-full max-w-sm mx-auto"
  >
    {/* Image Container */}
    <div className="relative h-52 sm:h-60 lg:h-64 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center transform transition-all duration-500"
        whileHover={{ scale: 1.05 }}
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover' 
        }}
      />
      
      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
        opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Category & Stock Badges */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full
            text-sm font-medium text-green-700 shadow-md"
        >
          {category}
        </motion.span>
        {stock <= 5 && (
          <motion.span 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full
              text-sm font-medium text-white shadow-md"
          >
            Stok Terbatas!
          </motion.span>
        )}
      </div>

      {/* Description Overlay with Elegant Animation */}
      <motion.div 
        initial={false}
        animate={{ 
          opacity: 0,
          y: 20,
          pointerEvents: 'none'
        }}
        whileHover={{ 
          opacity: 1,
          y: 0,
          pointerEvents: 'auto'
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      >
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl w-full mx-4 shadow-xl">
          <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            Deskripsi Produk
          </h4>
          <p className="text-gray-600 leading-relaxed line-clamp-4 text-sm">{description}</p>
        </div>
      </motion.div>
    </div>

    {/* Content Section */}
    <div className="p-5 sm:p-6">
      {/* Title and Icon */}
      <div className="flex items-start gap-3 mb-4">
        <motion.div 
          whileHover={{ rotate: 12, scale: 1.1 }}
          className="bg-green-100 p-2.5 rounded-xl flex-shrink-0 shadow-sm"
        >
          <Icon className="text-xl text-green-600" />
        </motion.div>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-700 
          transition-colors duration-300 leading-tight line-clamp-2">{title}</h3>
      </div>
      
      {/* Price and Stock Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-3 rounded-xl">
          <div className="text-xl font-bold text-green-700 group-hover:scale-105 
            transform transition-all duration-300">
            Rp {price.toLocaleString()}
          </div>
          <div className="text-xs text-green-600/80 font-medium">per {unit}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-3 rounded-xl text-center">
          <div className={`text-lg font-bold ${stock <= 5 ? 'text-red-500' : 'text-gray-700'} 
            group-hover:scale-105 transform transition-all duration-300`}>
            {stock} {unit}
          </div>
          <div className="text-xs text-gray-500 font-medium">Tersedia</div>
        </div>
      </div>

      {/* Rating and Sales with Enhanced Design */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-xl">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`${i < rating ? 'text-yellow-400' : 'text-gray-200'} 
              text-base transition-colors duration-300`} />
          ))}
          <span className="ml-1.5 text-xs font-medium text-gray-600">({rating})</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <FaShoppingCart className="text-green-600" />
          Terjual {soldCount}+
        </div>
      </div>

      {/* Action Buttons with Enhanced Design */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSoundEffect('click');
            window.open(`https://wa.me/628813873761?text=Halo, saya tertarik dengan produk ${title}. Apakah masih tersedia?`, '_blank');
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 
            text-white py-2.5 px-4 rounded-xl text-sm font-semibold
            hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaWhatsapp className="text-lg" />
          <span>Pesan</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => playSoundEffect('click')}
          className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 
            py-2.5 px-4 rounded-xl text-sm font-semibold
            hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaInfoCircle className="text-lg" />
          <span>Detail</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

ProductCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  soldCount: PropTypes.number.isRequired
};

export default ProductCard; 