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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31914.801176374993!2d120.71466995000002!3d0.8777455499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3276dad5777c1275%3A0x1da8c87e1e794adc!2sPagaitan%2C%20Ogodeide%2C%20Toli-Toli%20Regency%2C%20Central%20Sulawesi!5e0!3m2!1sen!2sid!4v1735532538792!5m2!1sen!2sid"
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
              <p className="text-gray-600">0.8777° N, 120.7147° E</p>
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