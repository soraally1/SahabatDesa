import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaGraduationCap, FaHandshake, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaLightbulb, FaMapMarkedAlt } from 'react-icons/fa';
import { BsArrowDownCircle } from 'react-icons/bs';
import { IoEarth } from 'react-icons/io5';
import { MdLocationOn, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import PropTypes from 'prop-types';




// Sound effects
const soundEffects = {
  hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.5 }),
  click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.5 }),
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-green-500/20"
    onHoverStart={() => soundEffects.hover.play()}
  >
    <div className="flex items-start gap-6">
      <div className="bg-green-500 p-4 rounded-xl">
        <Icon className="text-3xl text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </div>
    </div>
  </motion.div>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

// New components
const StatisticCard = ({ value, label, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-green-500/10"
  >
    <Icon className="text-4xl text-green-500 mb-4" />
    <h3 className="text-3xl font-bold text-green-800 mb-2">{value}</h3>
    <p className="text-gray-600 text-lg font-medium">{label}</p>
  </motion.div>
);

StatisticCard.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
};

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

// Add new Map component
const MapSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white/20"
  >
    <iframe
      src= "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31914.801176374993!2d120.71466995000002!3d0.8777455499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3276dad5777c1275%3A0x1da8c87e1e794adc!2sPagaitan%2C%20Ogodeide%2C%20Toli-Toli%20Regency%2C%20Central%20Sulawesi!5e0!3m2!1sen!2sid!4v1735532538792!5m2!1sen!2sid" 
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </motion.div>
);

// Add new Location Info component
const LocationInfo = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-green-500/20"
  >
    <div className="flex items-start gap-6">
      <div className="bg-green-500 p-4 rounded-xl">
        <FaMapMarkedAlt className="text-3xl text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-3 tracking-tight">Lokasi Strategis</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Desa Pagaitan terletak di Kecamatan Likupang Timur, Kabupaten Minahasa Utara, Sulawesi Utara. 
          Posisi strategis ini memudahkan akses ke berbagai fasilitas penting dan menjadi 
          pusat pengembangan ekonomi digital di wilayah tersebut.
        </p>
      </div>
    </div>
  </motion.div>
);

function Desa1() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statistics = [
    { value: "2,500+", label: "Penduduk", icon: FaUsers },
    { value: "85%", label: "Akses Internet", icon: FaWifi },
    { value: "120+", label: "UMKM", icon: FaStore },
    { value: "95%", label: "Tingkat Literasi", icon: FaGraduationCap }
  ];

  const projects = [
    {
      title: "Pembangunan Menara Internet",
      description: "Pemasangan menara internet untuk memperluas jangkauan koneksi di seluruh desa",
      progress: 75,
      image: "/images/tower-project.jpg"
    },
    {
      title: "Pelatihan Digital Marketing",
      description: "Program pelatihan pemasaran digital untuk pelaku UMKM lokal",
      progress: 60,
      image: "/images/training-project.jpg"
    },
    // Add more projects...
  ];

  const features = [
    {
      icon: FaWifi,
      title: "Infrastruktur Digital",
      description: "Pengembangan akses internet dan infrastruktur digital untuk mendukung aktivitas online masyarakat."
    },
    {
      icon: FaStore,
      title: "Marketplace Digital",
      description: "Platform penjualan online untuk memasarkan produk lokal Desa Pagaitan ke pasar yang lebih luas."
    },
    {
      icon: FaGraduationCap,
      title: "Pelatihan Digital",
      description: "Program pelatihan pemasaran digital dan teknologi informasi untuk warga desa."
    },
    {
      icon: FaHandshake,
      title: "Kolaborasi Antar Desa",
      description: "Kerja sama dengan desa lain dalam pengembangan infrastruktur dan pertukaran pengetahuan."
    },
    {
      icon: FaLeaf,
      title: "Pertanian Berkelanjutan",
      description: "Implementasi teknologi smart farming untuk meningkatkan hasil pertanian."
    },
    {
      icon: FaChartLine,
      title: "Monitoring Ekonomi",
      description: "Sistem pemantauan pertumbuhan ekonomi desa secara real-time."
    },
    {
      icon: IoEarth,
      title: "Ekowisata Digital",
      description: "Promosi potensi wisata desa melalui platform digital."
    },
    {
      icon: FaLightbulb,
      title: "Inovasi Sosial",
      description: "Program pemberdayaan masyarakat berbasis teknologi."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Back Button */}
      <motion.button
        onClick={() => {
          soundEffects.click.play();
          navigate(-1);
        }}
        className="fixed top-4 left-4 z-40 bg-white/80 backdrop-blur-sm p-3 rounded-full 
          hover:bg-white transition-all duration-300 transform hover:scale-110 
          border-2 border-green-500/20 shadow-lg group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MdArrowBack className="text-2xl text-green-600 group-hover:text-green-700" />
      </motion.button>

      {/* Enhanced Hero Section */}
      <div className="relative h-[80vh] bg-[url('/images/pagaitan.jpg')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 text-center tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Desa Pagaitan
          </motion.h1>
          <motion.div 
            className="flex items-center gap-3 text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MdLocationOn className="text-3xl text-green-400" />
            <span className="font-medium tracking-wide">Sulawesi Utara, Indonesia</span>
          </motion.div>
          
          {/* Add scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute center pt-52"
          >
            <BsArrowDownCircle className="text-3xl text-white/80" />
          </motion.div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <StatisticCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        {/* Overview Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-green-800 mb-6 tracking-tight">Tentang Desa Pagaitan</h2>
          <p className="text-gray-700 text-xl leading-relaxed max-w-4xl">
            Desa Pagaitan di Sulawesi Utara sedang dalam proses transformasi digital untuk meningkatkan 
            kesejahteraan masyarakatnya. Dengan fokus pada pengembangan infrastruktur internet, 
            desa ini bertujuan untuk memberdayakan warga dalam memasarkan produk lokal secara daring 
            dan meningkatkan akses ke sumber daya digital untuk sekolah dan pusat kesehatan.
          </p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.div>

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

        {/* Add Map Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-green-800 mb-8">Lokasi Desa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <MapSection />
            </div>
            <div className="md:col-span-1">
              <LocationInfo />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div 
          className="bg-green-800 text-white p-16 rounded-3xl text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Mari Bergabung dalam Pengembangan Desa</h2>
          <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Jadilah bagian dari transformasi digital Desa Pagaitan. Bersama-sama kita 
            wujudkan desa yang modern dan berkelanjutan.
          </p>
          <button 
            onClick={() => soundEffects.click.play()}
            className="bg-white text-green-800 text-lg font-bold py-5 px-10 
              rounded-full transition-all duration-300 transform hover:scale-105 
              shadow-lg flex items-center gap-3 mx-auto"
          >
            <span>Dukung Desa Pagaitan</span>
            <FaHandshake className="text-2xl" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Desa1;
