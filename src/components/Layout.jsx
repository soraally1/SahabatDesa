import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaArrowUp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Layout = ({ children, pageTitle, pageDescription, gradientFrom, gradientTo, textColor = "white" }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
  };

  // Split title into words for animation
  const titleWords = pageTitle.split(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`min-h-[90vh] md:min-h-screen bg-gradient-to-br from-${gradientFrom} to-${gradientTo} text-${textColor} relative overflow-hidden flex items-center`}>
        {/* Animated Background Pattern - Responsive adjustments */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] animate-floatBackground scale-75 md:scale-100"></div>
        </div>

        {/* Animated Shapes - Responsive sizes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-16 -left-16 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full mix-blend-overlay"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/2 -right-16 md:-right-32 w-48 h-48 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-16 left-1/3 w-24 h-24 md:w-48 md:h-48 bg-white rounded-full mix-blend-overlay"
          />
        </div>

        {/* Decorative Elements - Responsive positioning */}
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-20 left-20 w-4 h-4 bg-white opacity-30 rounded-full"></div>
          <div className="absolute top-40 right-40 w-6 h-6 bg-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-white opacity-25 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-white opacity-15 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Top Decorative Line - Responsive spacing */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 md:mb-12 inline-block"
            >
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <div className={`w-8 md:w-12 h-1 bg-${textColor} rounded-full opacity-75`}></div>
                <div className={`w-3 md:w-4 h-3 md:h-4 bg-${textColor} rounded-full opacity-50`}></div>
                <div className={`w-12 md:w-20 h-1 bg-${textColor} rounded-full opacity-75`}></div>
              </div>
            </motion.div>

            {/* Title with Word Animation - Responsive typography */}
            <div className="mb-6 md:mb-8 overflow-hidden">
              {titleWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut"
                  }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight inline-block mr-3 md:mr-5 tracking-tight"
                  style={{
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Decorative Line Between Title and Description - Responsive width */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-16 md:w-24 h-1 mx-auto mb-6 md:mb-8 origin-left"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.9), rgba(255,255,255,0.1))`
              }}
            />

            {/* Description with Enhanced Typography - Responsive text size */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto font-light px-4 md:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.2px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {pageDescription}
            </motion.p>

            {/* Bottom Decorative Elements - Responsive spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex justify-center items-center gap-2 md:gap-4 mb-8 md:mb-12"
            >
              <div className={`w-12 md:w-16 h-1 bg-${textColor} rounded-full opacity-30`}></div>
              <div className={`w-2 md:w-3 h-2 md:h-3 bg-${textColor} rounded-full opacity-50`}></div>
              <div className={`w-16 md:w-24 h-1 bg-${textColor} rounded-full opacity-30`}></div>
            </motion.div>

            {/* Call to Action Buttons - Responsive layout and sizing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4 px-4 md:px-0"
            >
              <button className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-${textColor} text-${gradientFrom} rounded-full font-semibold text-sm md:text-base
                transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                Mulai Sekarang
              </button>
              <button className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-${textColor} text-green-500 rounded-full font-semibold text-sm md:text-base
                hover:bg-white/10 transition-all duration-300`}>
                Pelajari Lebih Lanjut
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator - Responsive positioning */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
          onClick={scrollToContent}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm font-medium tracking-wider mb-2 opacity-75">SCROLL DOWN</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaChevronDown className="text-xl md:text-2xl opacity-75" />
            </motion.div>
          </div>
        </motion.div>

        {/* Hero Bottom Wave - Responsive height */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto scale-150 md:scale-100">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {children}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.5
        }}
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white
          hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 z-50 ${showScrollTop ? 'visible' : 'invisible'}`}
      >
        <FaArrowUp className="text-xl" />
      </motion.button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6">SahabatDesa</h3>
                <p className="text-gray-400 mb-6">Membangun desa bersama untuk Indonesia yang lebih baik.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaTwitter className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                </div>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-6">Tautan</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 transition-colors"></span>
                      Tentang Kami
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Kontak
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      FAQ
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-6">Layanan</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="/crowdfunding" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Crowdfunding
                    </a>
                  </li>
                  <li>
                    <a href="/marketplace" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Marketplace
                    </a>
                  </li>
                  <li>
                    <a href="/education" className="text-gray-400 hover:text-white transition-colors flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      Edukasi
                    </a>
                  </li>
                </ul>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-6">Hubungi Kami</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Email: info@sahabatdesa.id
                  </li>
                  <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Phone: (021) 1234-5678
                  </li>
                  <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Jakarta, Indonesia
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400"
          >
            <p>© 2024 SahabatDesa. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
  pageDescription: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
  textColor: PropTypes.string
};

export default Layout; 