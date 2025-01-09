import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaUsers, FaProjectDiagram, FaRegClock, FaRegHeart, FaShare } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';

const projects = [
  {
    id: 1,
    title: "Pembangunan Pusat Kerajinan Desa",
    description: "Membangun pusat kerajinan untuk mengembangkan UMKM lokal dan meningkatkan ekonomi desa.",
    target: 150000000,
    raised: 89000000,
    backers: 234,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 2,
    title: "Program Digitalisasi Pertanian",
    description: "Implementasi teknologi IoT untuk meningkatkan hasil pertanian dan efisiensi penggunaan air.",
    target: 200000000,
    raised: 156000000,
    backers: 312,
    daysLeft: 20,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80",
  },
  {
    id: 3,
    title: "Pengembangan Ekowisata Desa",
    description: "Membangun infrastruktur ekowisata untuk meningkatkan pendapatan desa dari sektor pariwisata.",
    target: 300000000,
    raised: 210000000,
    backers: 456,
    daysLeft: 25,
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80",
  },
];

const stats = [
  {
    icon: <FaHandHoldingHeart className="text-4xl text-emerald-500" />,
    value: "Rp 5M+",
    label: "Total Dana Terkumpul",
  },
  {
    icon: <FaUsers className="text-4xl text-emerald-500" />,
    value: "10,000+",
    label: "Kontributor Aktif",
  },
  {
    icon: <FaProjectDiagram className="text-4xl text-emerald-500" />,
    value: "50+",
    label: "Proyek Sukses",
  },
];

const ProjectCard = ({ project }) => {
  const progress = (project.raised / project.target) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-56 group">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-4">
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-emerald-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaRegHeart className="text-xl" />
            </button>
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-emerald-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaShare className="text-xl" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
          <FaRegClock className="mr-2" />
          {project.daysLeft} hari lagi
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 hover:text-emerald-500 transition-colors duration-300 cursor-pointer">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-emerald-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="font-bold text-2xl text-emerald-600 mb-1">
              Rp {(project.raised).toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-600">terkumpul dari</p>
            <p className="text-sm text-gray-600">Rp {(project.target).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-right">
            <p className="font-bold text-2xl text-emerald-600 mb-1">{project.backers}</p>
            <p className="text-sm text-gray-600">orang telah</p>
            <p className="text-sm text-gray-600">berkontribusi</p>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
          <FaHandHoldingHeart className="mr-2 text-xl" />
          Dukung Proyek Ini
        </button>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    target: PropTypes.number.isRequired,
    raised: PropTypes.number.isRequired,
    backers: PropTypes.number.isRequired,
    daysLeft: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
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
    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
      {stat.icon}
    </div>
    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
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

const CrowdfundingPage = () => {
  return (
    <Layout
      pageTitle="Crowdfunding untuk Desa"
      pageDescription="Bersama membangun desa yang lebih baik melalui pendanaan kolektif untuk proyek-proyek pembangunan dan pemberdayaan masyarakat desa."
      gradientFrom="emerald-500"
      gradientTo="emerald-700"
    >
      {/* Stats Section */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Proyek Unggulan
          </h2>
          <p className="text-gray-600 text-lg">
            Pilih dan dukung proyek-proyek pembangunan desa yang menginspirasi dan membawa dampak positif bagi masyarakat.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Punya Ide Proyek?
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Ajukan proposal proyek Anda dan dapatkan dukungan dari ribuan kontributor yang peduli dengan pembangunan desa.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-emerald-500 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ajukan Proyek Sekarang
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CrowdfundingPage; 