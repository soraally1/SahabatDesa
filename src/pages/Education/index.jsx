import { motion } from 'framer-motion';
import { 
  FaGraduationCap, FaBook, FaLaptop, FaUsers, FaChalkboardTeacher,
  FaCertificate, FaCalendarAlt, FaClock, FaUserGraduate, FaRegBookmark,
  FaShareAlt, FaPlayCircle, FaFileAlt, FaRegStar
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import digital from '../../assets/Desa1/digital.jpeg';

const courses = [
  {
    id: 1,
    title: 'Manajemen UMKM Digital',
    description: 'Pelajari cara mengelola UMKM di era digital dengan strategi pemasaran online dan pengelolaan keuangan digital.',
    instructor: 'Dr. Siti Rahayu',
    duration: '8 minggu',
    level: 'Pemula',
    students: 1250,
    rating: 4.8,
    reviews: 156,
    image: digital,
    tags: ['Bisnis', 'Digital Marketing', 'Keuangan']
  },
  // ... more courses
];

const features = [
  {
    icon: <FaLaptop />,
    title: 'Pembelajaran Online',
    description: 'Akses materi pembelajaran kapan saja dan di mana saja melalui platform digital kami.'
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Mentor Berpengalaman',
    description: 'Dibimbing langsung oleh praktisi dan akademisi yang ahli di bidangnya.'
  },
  {
    icon: <FaCertificate />,
    title: 'Sertifikat Resmi',
    description: 'Dapatkan sertifikat yang diakui setelah menyelesaikan program pembelajaran.'
  }
];

const stats = [
  {
    icon: <FaUserGraduate className="text-3xl text-blue-500" />,
    value: '5,000+',
    label: 'Peserta Lulus'
  },
  {
    icon: <FaBook className="text-3xl text-blue-500" />,
    value: '50+',
    label: 'Program Pelatihan'
  },
  {
    icon: <FaUsers className="text-3xl text-blue-500" />,
    value: '100+',
    label: 'Mentor Aktif'
  }
];

const CourseCard = ({ course }) => {
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
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-4">
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-blue-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaRegBookmark className="text-xl" />
            </button>
            <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-blue-500 hover:text-white transform hover:scale-110 transition-all duration-300">
              <FaShareAlt className="text-xl" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 left-4 flex space-x-2">
          {course.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-white bg-opacity-90 text-blue-500 px-3 py-1 rounded-full text-sm font-medium shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
            <FaChalkboardTeacher className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Instruktur</p>
            <p className="font-medium text-gray-800">{course.instructor}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-500 mb-2">
              <FaClock className="mr-2" />
              <span className="font-semibold">Durasi</span>
            </div>
            <p className="text-gray-800 font-bold">{course.duration}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-500 mb-2">
              <FaUsers className="mr-2" />
              <span className="font-semibold">Peserta</span>
            </div>
            <p className="text-gray-800 font-bold">{course.students} siswa</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex text-blue-500">
              <FaRegStar className="mr-1" />
              <span className="font-bold">{course.rating}</span>
            </div>
            <span className="text-gray-500 ml-1">({course.reviews} ulasan)</span>
          </div>
          <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-sm font-medium">
            {course.level}
          </span>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
            <FaPlayCircle className="mr-2" />
            Mulai Belajar
          </button>
          <button className="flex-1 border-2 border-blue-500 text-blue-500 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center">
            <FaFileAlt className="mr-2" />
            Lihat Silabus
          </button>
        </div>
      </div>
    </motion.div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    students: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

const FeatureCard = ({ feature }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:shadow-2xl transition-all duration-300 group"
  >
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 transition-colors duration-300">
      <div className="text-blue-500 group-hover:text-white transition-colors duration-300 text-3xl">
        {feature.icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-500 transition-colors duration-300">
      {feature.title}
    </h3>
    <p className="text-gray-600">{feature.description}</p>
  </motion.div>
);

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
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
      {stat.icon}
    </div>
    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
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

const EducationPage = () => {
  return (
    <Layout
      pageTitle="Pendidikan untuk Desa"
      pageDescription="Program pendidikan dan pelatihan untuk meningkatkan kapasitas masyarakat desa."
      gradientFrom="blue-500"
      gradientTo="blue-700"
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
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-24 mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Program Pembelajaran
          </h2>
          <p className="text-gray-600 text-lg">
            Pilih program pembelajaran yang sesuai dengan kebutuhan pengembangan desa Anda
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Mulai Perjalanan Belajar Anda
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Tingkatkan pengetahuan dan keterampilan Anda untuk membangun desa yang lebih maju
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-500 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <FaGraduationCap className="mr-2" />
                Daftar Sekarang
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-500 text-blue-500 px-12 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                Jadwal Konsultasi
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationPage; 