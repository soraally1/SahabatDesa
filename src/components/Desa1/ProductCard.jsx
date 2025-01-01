import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaWhatsapp, FaInfoCircle, FaStar } from 'react-icons/fa';
import { playSoundEffect } from './utils/soundEffects';

const ProductCard = ({ icon: Icon, title, description, category, image, price, stock, unit, rating, soldCount }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl group 
      hover:shadow-2xl transition-all duration-300 border border-green-100"
  >
    <div className="h-64 bg-cover bg-center relative overflow-hidden" 
      style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full
        text-sm font-medium text-green-800 transform group-hover:scale-105 transition-transform duration-300
        shadow-lg">
        {category}
      </div>
      {stock <= 5 && (
        <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full
          text-sm font-medium text-white animate-pulse shadow-lg">
          Stok Terbatas!
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <h4 className="font-bold text-green-800">Deskripsi Produk</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          <Icon className="text-2xl text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">{title}</h3>
      </div>
      
      <div className="flex items-center justify-between mb-4 bg-green-50/50 p-4 rounded-xl">
        <div>
          <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transform transition-transform duration-300">
            Rp {price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">per {unit}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-600">Stok</div>
          <div className={`font-bold ${stock <= 5 ? 'text-red-500' : 'text-gray-700'} 
            group-hover:scale-110 transform transition-transform duration-300`}>
            {stock} {unit}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating})</span>
        </div>
        <div className="text-sm text-gray-600">
          Terjual {soldCount}+
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSoundEffect('click');
            window.open(`https://wa.me/6285123456789?text=Halo, saya tertarik dengan produk ${title}. Apakah masih tersedia?`, '_blank');
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 
            text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 
            transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaWhatsapp className="text-xl" />
          <span>Pesan</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSoundEffect('click');
            // Add to cart functionality here
          }}
          className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 
            py-3 px-4 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaInfoCircle className="text-xl" />
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