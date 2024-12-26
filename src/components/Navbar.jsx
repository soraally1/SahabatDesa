import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  FaHome, 
  FaHandshake, 
  FaBookReader,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { 
  MdAttachMoney,
  MdShoppingCart
} from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
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

  // Close mobile menu when route changes
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
          className={`mx-auto px-6 py-4 transition-all duration-300 ${
            scrolled 
              ? 'bg-green-800/90 shadow-lg backdrop-blur-md' 
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <div className="bg-green-600/20 p-2 rounded-lg backdrop-blur-sm">
                  <FaHome className="text-2xl text-yellow-300 group-hover:text-yellow-400 transition-colors" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                  Sahabat<span className="text-yellow-300 group-hover:text-yellow-400 transition-colors">Desa</span>
                </span>
              </motion.div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink to="/crowdfunding" icon={<MdAttachMoney />}>
                Crowdfunding
              </NavLink>
              <NavLink to="/marketplace" icon={<MdShoppingCart />}>
                Marketplace
              </NavLink>
              <NavLink to="/education" icon={<FaBookReader />}>
                Edukasi
              </NavLink>
              <NavLink to="/collaboration" icon={<FaHandshake />}>
                Kerja Sama
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled 
                    ? 'bg-green-700/50 hover:bg-green-600/50' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes className="text-xl text-white" /> : <FaBars className="text-xl text-white" />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden backdrop-blur-md bg-gradient-to-b from-green-800/95 to-green-900/95 border-t border-white/10"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Desktop NavLink component with hover effects
const NavLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        className={`relative px-4 py-2.5 transition-all duration-300 rounded-lg ${
          isActive 
            ? 'bg-white/20 text-yellow-300' 
            : 'hover:bg-white/10 text-white hover:text-yellow-300'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center space-x-2 text-sm font-medium tracking-wide">
          <span className={`text-lg ${isActive ? 'text-yellow-300' : 'text-yellow-300/70'}`}>
            {icon}
          </span>
          <span>{children}</span>
        </div>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300"
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
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-white/20 text-yellow-300' 
            : 'hover:bg-white/10 text-white'
        }`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`text-xl ${isActive ? 'text-yellow-300' : 'text-yellow-300/70'}`}>
          {icon}
        </span>
        <span className="font-medium tracking-wide text-sm">{children}</span>
      </motion.div>
    </Link>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired
};

MobileNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired
};

export default Navbar; 