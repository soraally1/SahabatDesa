import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  FaHandshake, 
  FaBookReader,
  FaBars,
  FaTimes,
  FaUser,
  FaBell
} from 'react-icons/fa';
import { 
  MdAttachMoney,
  MdShoppingCart
} from 'react-icons/md';
import sahabatDesa from '../assets/SahabatDesa.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 font-sans"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.div 
          className={`mx-auto transition-all duration-500 ${
            scrolled 
              ? 'bg-white shadow-lg backdrop-blur-md border-b border-gray-200/50' 
              : 'bg-gradient-to-b from-black/20 to-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
            {/* Mobile Hamburger Menu - Left */}
            <div className="lg:hidden">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <FaBars className="text-xl" />
              </motion.button>
            </div>

            {/* Desktop Logo and Brand - Centered on Mobile */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link to="/island" className="hidden lg:flex items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 group relative"
                >
                  {/* Logo Image */}
                  <motion.img 
                    src={sahabatDesa} 
                    alt="SahabatDesa Logo" 
                    className="h-20 w-20 object-contain relative z-5 transform-gpu
                      transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
                    whileHover={{ 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  />

                  {/* Brand Text */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <motion.span 
                        className={`text-2xl font-bold tracking-tight transition-colors duration-300
                          ${scrolled ? 'text-green-800' : 'text-white'}`}
                      >
                        Sahabat
                      </motion.span>
                      <motion.span 
                        className={`text-2xl font-bold transition-all duration-300
                          ${scrolled ? 'text-green-600' : 'text-green-400'}
                          group-hover:text-green-500`}
                        whileHover={{ scale: 1.05 }}
                      >
                        Desa
                      </motion.span>
                    </div>
                    <div className="relative">
                      <motion.span 
                        className={`text-xs font-medium transition-colors duration-300 relative z-10
                          ${scrolled ? 'text-green-700/80' : 'text-white/90'}`}
                      >
                        Membangun Desa Bersama
                      </motion.span>
                      {/* Animated Underline */}
                      <motion.div 
                        className={`absolute -bottom-0.5 left-0 h-[2px] w-0 group-hover:w-full
                          transition-all duration-300 rounded-full
                          ${scrolled ? 'bg-green-500/30' : 'bg-white/30'}`}
                      />
                    </div>
                  </div>

                  {/* Hover Effect Light */}
                  <motion.div
                    className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
                      ${scrolled ? 'bg-green-300' : 'bg-white'} blur-xl`}
                  />
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Main Navigation Links */}
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
                <NavLink to="/crowdfunding" icon={<MdAttachMoney />} scrolled={scrolled}>
                  Crowdfunding
                </NavLink>
                <NavLink to="/marketplace" icon={<MdShoppingCart />} scrolled={scrolled}>
                  Marketplace
                </NavLink>
                <NavLink to="/education" icon={<FaBookReader />} scrolled={scrolled}>
                  Edukasi
                </NavLink>
                <NavLink to="/collaboration" icon={<FaHandshake />} scrolled={scrolled}>
                  Kerja Sama
                </NavLink>
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    scrolled 
                      ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm font-medium">Cari</span>
                </motion.button>

                {/* Notification Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                    scrolled 
                      ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => setShowNotification(!showNotification)}
                >
                  <FaBell className="text-lg" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* User Profile Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    scrolled 
                      ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                    <FaUser className="text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Guest User</span>
                    <span className={`text-xs ${scrolled ? 'text-green-600' : 'text-green-300'}`}>
                      Masuk / Daftar
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                  scrolled 
                    ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => setShowNotification(!showNotification)}
              >
                <FaBell className="text-lg" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  scrolled 
                    ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaUser className="text-lg" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-4 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifikasi</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <NotificationItem 
                  title="Proyek Baru"
                  message="Ada proyek crowdfunding baru di desa anda!"
                  time="5 menit yang lalu"
                  isNew
                />
                <NotificationItem 
                  title="Transaksi Berhasil"
                  message="Pembelian produk telah berhasil"
                  time="1 jam yang lalu"
                />
                <NotificationItem 
                  title="Update Sistem"
                  message="Sistem telah diperbarui dengan fitur baru"
                  time="1 hari yang lalu"
                />
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                  Lihat Semua Notifikasi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Sidebar and Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => {
                setIsOpen(false);
                setShowNotification(false);
              }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-white shadow-2xl z-50 lg:hidden 
                overflow-hidden flex flex-col"
            >
              {/* Sidebar Header with Gradient */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-white pointer-events-none" />
                <div className="relative p-6 border-b border-gray-200">
                  <div className="flex items-center justify-end mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
                    >
                      <FaTimes className="text-xl" />
                    </motion.button>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <motion.img 
                      src={sahabatDesa} 
                      alt="SahabatDesa Logo" 
                      className="h-24 w-24 object-contain mb-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-green-800">
                        Sahabat<span className="text-green-600">Desa</span>
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">Membangun Desa Bersama</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main Content Scroll Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* User Profile Section */}
                <motion.div 
                  className="p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <FaUser className="text-xl text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Selamat Datang</h3>
                        <button className="text-sm text-green-600 font-medium hover:text-green-700 mt-0.5
                          px-3 py-1 bg-green-50 rounded-full hover:bg-green-100 transition-colors">
                          Masuk / Daftar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Sections */}
                <div className="px-4 py-2">
                  {/* Main Navigation */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Menu Utama
                    </h3>
                    <MobileNavLink to="/crowdfunding" icon={<MdAttachMoney />}>
                      Crowdfunding
                    </MobileNavLink>
                    <MobileNavLink to="/marketplace" icon={<MdShoppingCart />}>
                      Marketplace
                    </MobileNavLink>
                    <MobileNavLink to="/education" icon={<FaBookReader />}>
                      Edukasi
                    </MobileNavLink>
                    <MobileNavLink to="/collaboration" icon={<FaHandshake />}>
                      Kerja Sama
                    </MobileNavLink>
                  </motion.div>

                  {/* Additional Links Section */}
                  <motion.div 
                    className="mt-6 space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Pengaturan
                    </h3>
                    <MobileNavLink to="/profile" icon={<FaUser />}>
                      Profil Saya
                    </MobileNavLink>
                    <MobileNavLink to="/notifications" icon={<FaBell />}>
                      Notifikasi
                      <span className="ml-auto px-2.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                        2
                      </span>
                    </MobileNavLink>
                  </motion.div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <motion.div 
                className="mt-auto p-6 bg-gradient-to-t from-gray-50 to-white border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>© 2024 SahabatDesa</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-green-600 font-medium">v1.0.0</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Made with ❤️ in Indonesia
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

// Desktop NavLink component with hover effects
const NavLink = ({ to, children, icon, scrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        className={`relative px-4 py-2.5 transition-all duration-300 rounded-xl ${
          isActive 
            ? scrolled ? 'bg-green-100 text-green-800' : 'bg-white/20 text-white'
            : scrolled ? 'hover:bg-green-50 text-gray-700' : 'hover:bg-white/10 text-white'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={`text-lg ${
            isActive 
              ? scrolled ? 'text-green-600' : 'text-green-400'
              : scrolled ? 'text-green-500' : 'text-green-400/70'
          }`}>
            {icon}
          </span>
          <span>{children}</span>
        </div>
        {isActive && (
          <motion.div
            className={`absolute -bottom-1 left-2 right-2 h-0.5 ${
              scrolled ? 'bg-green-500' : 'bg-green-400'
            }`}
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 300 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

// Mobile NavLink component
const MobileNavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`text-xl ${isActive ? 'text-green-600' : 'text-green-500'}`}>
          {icon}
        </span>
        <span className="font-medium text-sm">{children}</span>
      </motion.div>
    </Link>
  );
};

// Notification Item Component
const NotificationItem = ({ title, message, time, isNew = false }) => (
  <div className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
    isNew ? 'bg-green-50/50' : ''
  }`}>
    <div className="flex justify-between items-start mb-1">
      <h4 className="font-medium text-gray-800">{title}</h4>
      {isNew && (
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          Baru
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 mb-1">{message}</p>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  scrolled: PropTypes.bool.isRequired
};

MobileNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired
};

NotificationItem.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  isNew: PropTypes.bool
};

export default Navbar; 