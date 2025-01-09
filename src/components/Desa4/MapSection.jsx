import { motion } from 'framer-motion';
import { MdLocationOn } from 'react-icons/md';
import { FaMapMarkedAlt, FaUserFriends, FaRegStar } from 'react-icons/fa';

const MapSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white/20"
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7893.65155968875!2d121.02677944732467!3d-8.4187648286696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1736386905649!5m2!1sid!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-xl"
        />
      </div>
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl">
        <h3 className="text-2xl font-bold text-green-800 mb-6">Informasi Lokasi</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MdLocationOn className="text-2xl text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Alamat</h4>
              <p className="text-gray-600">Desa Pagaitan, Kecamatan Ogodeide, Kabupaten Toli-Toli, Sulawesi Tengah</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaMapMarkedAlt className="text-2xl text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Koordinat</h4>
              <p className="text-gray-600">-8.419443622804637, 121.02532023283055</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUserFriends className="text-2xl text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Populasi</h4>
              <p className="text-gray-600">2,500+ Penduduk</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaRegStar className="text-2xl text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Potensi Utama</h4>
              <p className="text-gray-600">Pertanian, Perikanan, Digital Economy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default MapSection; 