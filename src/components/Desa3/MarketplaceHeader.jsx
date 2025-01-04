import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter } from 'react-icons/fa';

const MarketplaceHeader = ({ 
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  stockFilter,
  setStockFilter,
  showFilters,
  setShowFilters
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8"
  >
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-green-100">
      {/* Search and Main Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-green-100 focus:border-green-500 
                focus:outline-none transition-colors duration-300"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 rounded-xl border-2 border-green-100 focus:border-green-500 
              focus:outline-none transition-colors duration-300 bg-white cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Olahan">Olahan</option>
            <option value="Perikanan">Perikanan</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Natural">Natural</option>
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 rounded-xl border-2 border-green-100 hover:border-green-500 
              transition-colors duration-300 flex items-center gap-2 bg-white"
          >
            <FaFilter className="text-green-600" />
            <span className="text-green-600">Filter</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-6 border-t border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Harga</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full px-4 py-2 rounded-lg border border-green-100"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                  className="w-full px-4 py-2 rounded-lg border border-green-100"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Stok</label>
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-green-100"
              >
                <option value="all">Semua</option>
                <option value="in-stock">Tersedia</option>
                <option value="low-stock">Stok Menipis</option>
                <option value="out-stock">Habis</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-green-100"
              >
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="best-seller">Terlaris</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Quick Category Pills */}
    <div className="flex flex-wrap gap-3 mt-6">
      {['Semua', 'Pertanian', 'Olahan', 'Perikanan', 'Kerajinan', 'Kuliner', 'Natural'].map((cat) => (
        <motion.button
          key={cat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(cat === 'Semua' ? '' : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
            ${selectedCategory === (cat === 'Semua' ? '' : cat)
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-green-50'}`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

MarketplaceHeader.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  stockFilter: PropTypes.string.isRequired,
  setStockFilter: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  setShowFilters: PropTypes.func.isRequired
};

export default MarketplaceHeader; 