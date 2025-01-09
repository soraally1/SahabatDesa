import { motion } from 'framer-motion';
import { 
  FaHandshake, FaUsers, FaLightbulb, FaChartLine, FaComments, FaProjectDiagram,
  FaRegBookmark, FaShareAlt, FaRegClock, FaMapMarkerAlt, FaUserFriends
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';

const projects = [
  {
    id: 1,
    title: "Program Pemberdayaan UMKM",
    description: "Kolaborasi dengan berbagai stakeholder untuk mengembangkan UMKM desa melalui pelatihan dan pendampingan.",
    partners: ["Bank BRI", "Kementerian UMKM", "Universitas Indonesia"],
    impact: "500+ UMKM",
    duration: "12 bulan",
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 2,
    title: "Inovasi Pertanian Terpadu",
    description: "Kerjasama dengan institusi penelitian untuk mengembangkan sistem pertanian modern yang berkelanjutan.",
    partners: ["IPB University", "FAO Indonesia", "Kementerian Pertanian"],
    impact: "1000+ Petani",
    duration: "24 bulan",
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  },
  {
    id: 3,
    title: "Digitalisasi Desa",
    description: "Program transformasi digital desa melalui implementasi teknologi dan pelatihan masyarakat.",
    partners: ["Google Indonesia", "Telkom Indonesia", "Kementerian Kominfo"],
    impact: "250+ Desa",
    duration: "18 bulan",
    status: "Aktif",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  }
];

const features = [
  {
    icon: <FaHandshake className="text-3xl text-purple-600" />,
    title: "Kolaborasi Multi-Stakeholder",
    description: "Mempertemukan berbagai pemangku kepentingan untuk pembangunan desa"
  },
  {
    icon: <FaLightbulb className="text-3xl text-purple-600" />,
    title: "Inovasi Berkelanjutan",
    description: "Mengembangkan solusi inovatif untuk tantangan di desa"
  },
  {
    icon: <FaChartLine className="text-3xl text-purple-600" />,
    title: "Dampak Terukur",
    description: "Monitoring dan evaluasi dampak program secara berkala"
  }
];

const stats = [
  {
    icon: <FaHandshake className="text-4xl text-purple-500" />,
    value: "100+",
    label: "Mitra Aktif"
  },
  {
    icon: <FaUsers className="text-4xl text-purple-500" />,
    value: "50,000+",
    label: "Penerima Manfaat"
  },
  {
    icon: <FaProjectDiagram className="text-4xl text-purple-500" />,
    value: "25+",
    label: "Program Kolaborasi"
  }
];

const ProjectCard = ({ project }) => {
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
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-purple-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaRegBookmark className="text-xl" />
            </button>
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-purple-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaShareAlt className="text-xl" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          {project.status}
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 hover:text-purple-500 transition-colors duration-300 cursor-pointer">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-800">Mitra Program:</h4>
          <div className="flex flex-wrap gap-2">
            {project.partners.map((partner, index) => (
              <span 
                key={index}
                className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors duration-300 cursor-pointer flex items-center"
              >
                <FaUserFriends className="mr-2" />
                {partner}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center text-purple-500 mb-2">
              <FaUsers className="mr-2" />
              <span className="font-semibold">Dampak</span>
            </div>
            <p className="text-gray-800 font-bold">{project.impact}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center text-purple-500 mb-2">
              <FaRegClock className="mr-2" />
              <span className="font-semibold">Durasi</span>
            </div>
            <p className="text-gray-800 font-bold">{project.duration}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
            <FaHandshake className="mr-2" />
            Bergabung
          </button>
          <button className="flex-1 border-2 border-purple-500 text-purple-500 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center">
            <FaChartLine className="mr-2" />
            Info Detail
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    partners: PropTypes.arrayOf(PropTypes.string).isRequired,
    impact: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

const FeatureCard = ({ feature }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500 transition-colors duration-300">
        <div className="text-purple-500 group-hover:text-white transition-colors duration-300 text-3xl">
          {feature.icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-500 transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  );
};

FeatureCard.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
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
    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
      {stat.icon}
    </div>
    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
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

const ContactSection = () => (
  <div className="container mx-auto px-6 py-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12"
    >
      <div className="flex items-center justify-center mb-8">
        <FaComments className="text-5xl text-purple-500 mr-4" />
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Hubungi Tim Kolaborasi
        </h2>
      </div>
      <p className="text-center text-gray-600 text-lg mb-12">
        Punya pertanyaan atau ingin mendiskusikan potensi kolaborasi? Tim kami siap membantu.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
            <FaHandshake className="mr-3 text-purple-500" />
            Kontak Langsung
          </h3>
          <ul className="space-y-4">
            {[
              { icon: <FaComments />, text: "Email: kolaborasi@sahabatdesa.id" },
              { icon: <FaUsers />, text: "Phone: (021) 1234-5678" },
              { icon: <FaMapMarkerAlt />, text: "WhatsApp: +62 812-3456-7890" }
            ].map((item, index) => (
              <li key={index} className="flex items-center text-gray-600 hover:text-purple-500 transition-colors duration-300 cursor-pointer group">
                <span className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-500 transition-colors duration-300">
                  <span className="text-purple-500 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </span>
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
            <FaRegClock className="mr-3 text-purple-500" />
            Jam Operasional
          </h3>
          <ul className="space-y-4">
            {[
              "Senin - Jumat: 09:00 - 17:00",
              "Sabtu: 09:00 - 15:00",
              "Minggu: Tutup"
            ].map((time, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                {time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  </div>
);

const CollaborationPage = () => {
  return (
    <Layout
      pageTitle="Kolaborasi untuk Desa"
      pageDescription="Membangun ekosistem kolaborasi yang kuat antara desa, pemerintah, swasta, dan akademisi untuk pembangunan desa yang berkelanjutan."
      gradientFrom="purple-500"
      gradientTo="purple-700"
    >
      {/* Features Section */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 py-24 mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
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
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Program Kolaborasi
          </h2>
          <p className="text-gray-600 text-lg">
            Bergabung dengan program kolaborasi yang sesuai dengan visi dan misi pembangunan desa Anda.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Mari Berkolaborasi
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Jadilah bagian dari gerakan kolaborasi untuk membangun desa yang lebih baik dan berkelanjutan.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-purple-500 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <FaHandshake className="mr-2" />
                Ajukan Program
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-500 text-purple-500 px-12 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors duration-300 flex items-center justify-center"
              >
                <FaUsers className="mr-2" />
                Jadi Mitra
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />
    </Layout>
  );
};

export default CollaborationPage; 