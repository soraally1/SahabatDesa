import { motion } from 'framer-motion';
import { 
  FaShoppingCart, FaStore, FaBoxOpen, FaChartLine, FaUsers, FaHandshake,
  FaStar, FaRegHeart, FaShareAlt, FaSearch, FaFilter, FaTags, FaMapMarkerAlt
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import bambu from '../../assets/Desa1/bambu.jpg';
const categories = [
  {
    id: 1,
    name: 'Kerajinan Tangan',
    icon: <FaBoxOpen />,
    count: '120+ produk'
  },
  {
    id: 2,
    name: 'Makanan & Minuman',
    icon: <FaStore />,
    count: '85+ produk'
  },
  {
    id: 3,
    name: 'Pertanian',
    icon: <FaTags />,
    count: '95+ produk'
  }
];

const products = [
  {
    id: 1,
    name: 'Tas Anyaman Bambu',
    price: 'Rp 250.000',
    image: bambu,
    seller: 'UMKM Kreatif Desa Sukamaju',
    rating: 4.8,
    reviews: 24,
    location: 'Desa Sukamaju, Jawa Barat',
    description: 'Tas anyaman bambu premium dengan motif tradisional, hasil karya pengrajin lokal.',
    tags: ['Kerajinan', 'Aksesoris', 'Ramah Lingkungan']
  },
  // ... more products
];

const stats = [
  {
    icon: <FaStore className="text-3xl text-orange-500" />,
    value: '250+',
    label: 'UMKM Terdaftar'
  },
  {
    icon: <FaBoxOpen className="text-3xl text-orange-500" />,
    value: '1,500+',
    label: 'Produk Terjual'
  },
  {
    icon: <FaHandshake className="text-3xl text-orange-500" />,
    value: '50+',
    label: 'Desa Bergabung'
  }
];

const CategoryCard = ({ category }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:shadow-2xl transition-all duration-300 group cursor-pointer"
  >
    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors duration-300">
      <div className="text-orange-500 group-hover:text-white transition-colors duration-300 text-3xl">
        {category.icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors duration-300">
      {category.name}
    </h3>
    <p className="text-gray-600">{category.count}</p>
  </motion.div>
);

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    count: PropTypes.string.isRequired,
  }).isRequired,
};

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-64 group">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-4">
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaRegHeart className="text-xl" />
            </button>
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaShareAlt className="text-xl" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 left-4 flex space-x-2">
          {product.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-white bg-opacity-90 text-orange-500 px-3 py-1 rounded-full text-sm font-medium shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold hover:text-orange-500 transition-colors duration-300 cursor-pointer">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-orange-500">{product.price}</p>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-6">
          <div className="flex items-center text-orange-500 mr-4">
            <FaStar className="mr-1" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-gray-500 ml-1">({product.reviews} ulasan)</span>
          </div>
          <div className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-1" />
            <span className="text-sm">{product.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-3">
              <FaStore className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Penjual</p>
              <p className="font-medium text-gray-800">{product.seller}</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center">
            <FaShoppingCart className="mr-2" />
            Beli
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:shadow-2xl transition-all duration-300"
  >
    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
      {stat.icon}
    </div>
    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
      {stat.value}
    </h3>
    <p className="text-gray-600 font-medium">{stat.label}</p>
  </motion.div>
);

StatCard.propTypes = {
  stat: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const SearchBar = () => (
  <div className="relative max-w-4xl mx-auto">
    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
      <FaSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Cari produk UMKM..."
      className="w-full pl-14 pr-4 py-4 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow duration-300"
    />
    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
      <FaFilter />
    </button>
  </div>
);

const MarketplacePage = () => {
  return (
    <Layout
      pageTitle="Marketplace UMKM Desa"
      pageDescription="Temukan produk-produk berkualitas dari UMKM desa di seluruh Indonesia."
      gradientFrom="orange-500"
      gradientTo="orange-700"
    >
      {/* Search Section */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <SearchBar />
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Kategori Produk
          </h2>
          <p className="text-gray-600 text-lg">
            Jelajahi berbagai kategori produk UMKM dari desa-desa di Indonesia
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Produk Unggulan
          </h2>
          <p className="text-gray-600 text-lg">
            Temukan produk-produk terbaik dari UMKM desa pilihan
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Bergabung sebagai Penjual
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Kembangkan UMKM Anda dan jangkau lebih banyak pembeli melalui marketplace kami
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-orange-500 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <FaStore className="mr-2" />
                Daftar Sekarang
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-orange-500 text-orange-500 px-12 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center"
              >
                <FaChartLine className="mr-2" />
                Pelajari Lebih Lanjut
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketplacePage; 