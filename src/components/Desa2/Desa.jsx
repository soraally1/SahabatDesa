import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandshake } from 'react-icons/fa';

// Import components
import FeatureCard from './FeatureCard';
import StatisticCard from './StatisticCard';
import ProjectCard from './ProjectCard';
import MapSection from './MapSection';
import CrowdfundingCard from './CrowdfundingCard';
import CrowdfundingStats from './CrowdfundingStats';
import FeatureDetailModal from './FeatureDetailModal';
import ProductCard from './ProductCard';
import MarketplaceHeader from './MarketplaceHeader';
import HeroSection from './HeroSection';

// Import data
import { features, statistics, projects, crowdfundingProjects, featuredProducts } from './data';

function Desa() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(featuredProducts);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let filtered = [...featuredProducts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'Semua') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply stock filter
    switch (stockFilter) {
      case 'in-stock':
        filtered = filtered.filter(product => product.stock > 5);
        break;
      case 'low-stock':
        filtered = filtered.filter(product => product.stock <= 5 && product.stock > 0);
        break;
      case 'out-stock':
        filtered = filtered.filter(product => product.stock === 0);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-seller':
        filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'newest':
        // Assuming the array is already sorted by newest first
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, stockFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100/80">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 z-50"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <StatisticCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Rest of the sections with improved spacing and hierarchy */}
      <div className="max-w-7xl mx-auto px-8 py-24 space-y-32">
        {/* Overview Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-5xl font-black text-green-800 mb-8 tracking-tight 
            bg-gradient-to-r from-green-800 to-green-600 bg-clip-text ">
            Tentang Desa Cikoneng
          </h2>
          <p className="text-gray-700 text-xl leading-relaxed max-w-4xl font-light">
          Desa Cikoneng memiliki sejarah yang kaya. Pada masa penjajahan Belanda, wilayah ini merupakan kawasan hutan yang kemudian dijadikan perkampungan oleh masyarakat setempat untuk menghindari kejaran pasukan Kompeni Belanda. Seorang tokoh masyarakat bernama Eyang Bagus Solihin dianggap sebagai cikal bakal berdirinya Desa Cikoneng.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature} 
              onClick={() => setSelectedFeature(feature)}
            />
          ))}
        </motion.div>

        <FeatureDetailModal
          feature={selectedFeature}
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />

        {/* Projects Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-green-800 mb-8">Proyek Berjalan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-black text-green-800 mb-8 tracking-tight">
            Lokasi Desa
          </h2>
          <MapSection />
        </motion.div>

        {/* Marketplace Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Marketplace Header */}
          <MarketplaceHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Featured Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </motion.div>

        {/* Crowdfunding Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-green-800 mb-4 tracking-tight">
              Dukung Pengembangan Desa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bergabunglah dalam misi kami untuk membangun desa digital yang modern dan berkelanjutan. 
              Setiap dukungan Anda membawa perubahan nyata bagi masyarakat.
            </p>
          </div>

          <CrowdfundingStats />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {crowdfundingProjects.map((project, index) => (
              <CrowdfundingCard key={index} {...project} />
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="bg-green-800 text-white p-16 rounded-3xl text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Mari Bergabung dalam Pengembangan Desa</h2>
          <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Jadilah bagian dari transformasi digital Desa Cikoneng Bersama-sama kita 
            wujudkan desa yang modern dan berkelanjutan.
          </p>
          <button 
            className="bg-white text-green-800 text-lg font-bold py-5 px-10 
              rounded-full transition-all duration-300 transform hover:scale-105 
              shadow-lg flex items-center gap-3 mx-auto"
          >
            <span>Dukung Desa Cikoneng</span>
            <FaHandshake className="text-2xl" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Desa; 