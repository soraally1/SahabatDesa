import { motion } from 'framer-motion';
import { FaHeart, FaDollarSign, FaRegClock, FaUserFriends } from 'react-icons/fa';

const CrowdfundingStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
    {[
      { icon: FaHeart, value: "50M+", label: "Total Donasi" },
      { icon: FaDollarSign, value: "15", label: "Proyek Sukses" },
      { icon: FaRegClock, value: "5", label: "Proyek Aktif" },
      { icon: FaUserFriends, value: "1000+", label: "Total Supporter" }
    ].map((stat, index) => (
      <motion.div
        key={index}
        whileHover={{ y: -5 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-500/10"
      >
        <stat.icon className="text-3xl text-green-500 mb-3" />
        <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

export default CrowdfundingStats; 