import { FaStore, FaGraduationCap, FaHandshake, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaLightbulb, FaShoppingBasket, FaFish, FaTshirt, FaBoxOpen, FaCarrot } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import { GiRiceCooker, GiHoneyJar, GiCoconuts } from 'react-icons/gi';
import Jalan from '../../assets/img/jalan.jpeg';
import Kerajinan from '../../assets/img/Kerajinan.jpeg';
import Pertanian from '../../assets/img/Pertanian.jpeg';
import Posyandu from '../../assets/img/Posyandu.jpeg';
import Camping from '../../assets/img/Camping.jpeg';
import Gunung from '../../assets/img/Gunung.jpeg';
import Alam from '../../assets/img/Alam.jpeg';
import KebunBunga from '../../assets/img/Kebun Bunga.jpeg';
import Wisata from '../../assets/img/Wisata.jpeg';
import SeniUkir from '../../assets/img/Seni Ukir.jpeg';
import Prewed from '../../assets/img/Prewed.jpeg';
import Pantai from '../../assets/img/Pantai.jpeg';
import Sekolah from '../../assets/img/Sekolah .jpeg';
import WisataDesa from '../../assets/img/WisataDesa.jpeg';
import Energi from '../../assets/img/Energi.jpeg';
import Jembatan from '../../assets/img/Jembatan.jpeg';


export const statistics = [
  { value: "2700+", label: "Penduduk", icon: FaUsers },
  { value: "90%", label: "Akses Internet", icon: FaWifi },
  { value: "110+", label: "UMKM", icon: FaStore },
  { value: "95%", label: "Tingkat Literasi", icon: FaGraduationCap }
];

export const features = [
  {
    icon: FaLeaf,
    title: "Potensi Agrikultur",
    description: "Lahan pertanian seluas 45.23 km² dengan fokus pada produksi padi, jagung, dan kelapa, didukung sistem irigasi modern dan teknologi smart farming.",
    color: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-800",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500/20",
    category: "Pertanian",
    stats: {
      area: "45.23 km²",
      crops: "3 komoditas",
      farmers: "60% petani",
      yield: "+40% hasil"
    },
    highlights: [
      "Sistem Irigasi Pintar",
      "Pertanian Organik",
      "Peralatan Modern",
      "Program Pelatihan"
    ],
    implementation: [
      "Instalasi sistem irigasi otomatis",
      "Pelatihan petani modern",
      "Sertifikasi organik",
      "Pengadaan alat modern"
    ]
  },
  {
    icon: FaStore,
    title: "UMKM & Kerajinan",
    description: "Pemberdayaan kerajinan lokal seperti tenun tradisional dan anyaman bambu, dengan integrasi marketplace digital untuk pemasaran global.",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500/20",
    category: "Ekonomi",
    stats: {
      area: "25 unit",
      crops: "8 jenis",
      farmers: "120 UMKM",
      yield: "+25% omset"
    },
    highlights: [
      "Pasar Digital",
      "Pelatihan Keterampilan",
      "Kontrol Kualitas",
      "Pemasaran Global"
    ],
    implementation: [
      "Pembuatan platform digital",
      "Pelatihan pengrajin",
      "Standarisasi produk",
      "Ekspansi pasar"
    ]
  },
  {
    icon: IoEarth,
    title: "Wisata & Budaya",
    description: "Destinasi wisata alam Danau Pagaitan, tradisi Maulid Nabi dengan karnaval budaya, dan ritual panen 'Mompohulu' yang unik.",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500/20",
    category: "Pariwisata",
    stats: {
      area: "5 lokasi",
      crops: "3 acara",
      farmers: "1000+ pengunjung",
      yield: "+55% wisatawan"
    },
    highlights: [
      "Wisata Alam",
      "Acara Budaya",
      "Tradisi Lokal",
      "Keterlibatan Masyarakat"
    ],
    implementation: [
      "Pengembangan destinasi",
      "Kalender event budaya",
      "Promosi digital",
      "Pemberdayaan masyarakat"
    ]
  },
  {
    icon: FaUsers,
    title: "Demografi & Sosial",
    description: "Populasi 2.300 jiwa dengan 5 dusun dan 12 RT / 4 RW, menciptakan komunitas yang erat dengan beragam fasilitas sosial.",
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-800",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500/20",
    category: "Sosial",
    stats: {
      area: "5 dusun",
      crops: "12 RT",
      farmers: "2300 jiwa",
      yield: "4 RW"
    },
    highlights: [
      "Balai Warga",
      "Program Sosial",
      "Aktivitas Pemuda",
      "Layanan Lansia"
    ],
    implementation: [
      "Pembangunan fasilitas",
      "Program sosial",
      "Aktivitas pemuda",
      "Pelayanan lansia"
    ]
  },
  {
    icon: FaGraduationCap,
    title: "Pendidikan & Kesehatan",
    description: "Fasilitas pendidikan SD dan SMP, serta layanan kesehatan melalui Puskesmas Pembantu dan 2 unit Posyandu.",
    color: "from-red-500 to-red-600",
    textColor: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-500/20",
    category: "Fasilitas",
    stats: {
      area: "2 sekolah",
      crops: "1 puskesmas",
      farmers: "2 posyandu",
      yield: "100% layanan"
    },
    highlights: [
      "Pendidikan Berkualitas",
      "Akses Kesehatan",
      "Perkembangan Anak",
      "Kesehatan Masyarakat"
    ],
    implementation: [
      "Pengembangan sekolah",
      "Peningkatan layanan kesehatan",
      "Program kesehatan anak",
      "Edukasi masyarakat"
    ]
  },
  {
    icon: FaChartLine,
    title: "Program Prioritas",
    description: "Lima program utama meliputi infrastruktur jalan, pelatihan pemuda, modernisasi pertanian, UMKM, dan pengembangan wisata.",
    color: "from-cyan-500 to-cyan-600",
    textColor: "text-cyan-800",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-500/20",
    category: "Pembangunan",
    stats: {
      area: "5 program",
      crops: "3 tahun",
      farmers: "100% target",
      yield: "+70% capaian"
    },
    highlights: [
      "Infrastruktur",
      "Pelatihan Pemuda",
      "Pertanian",
      "Pariwisata"
    ],
    implementation: [
      "Pembangunan infrastruktur",
      "Pelatihan pemuda",
      "Modernisasi pertanian",
      "Pengembangan wisata"
    ]
  },
  {
    icon: FaHandshake,
    title: "Pemberdayaan Masyarakat",
    description: "Program pemberdayaan melalui pelatihan keterampilan kerja dan pengembangan UMKM untuk meningkatkan kesejahteraan.",
    color: "from-indigo-500 to-indigo-600",
    textColor: "text-indigo-800",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-500/20",
    category: "Pemberdayaan",
    stats: {
      area: "10 program",
      crops: "500 peserta",
      farmers: "85% kelulusan",
      yield: "+45% pendapatan"
    },
    highlights: [
      "Pelatihan Keterampilan",
      "Pengembangan Usaha",
      "Pembangunan Komunitas",
      "Pertumbuhan Ekonomi"
    ],
    implementation: [
      "Pelatihan keterampilan",
      "Pengembangan bisnis",
      "Pembangunan komunitas",
      "Pertumbuhan ekonomi"
    ]
  },
  {
    icon: FaLightbulb,
    title: "Inovasi Desa",
    description: "Transformasi menuju smart village dengan fokus pada digitalisasi layanan dan pengembangan ekonomi kreatif.",
    color: "from-amber-500 to-amber-600",
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500/20",
    category: "Inovasi",
    stats: {
      area: "15 inovasi",
      crops: "5 sektor",
      farmers: "90% adopsi",
      yield: "+65% efisiensi"
    },
    highlights: [
      "Layanan Digital",
      "Sistem Pintar",
      "Ekonomi Kreatif",
      "Integrasi Teknologi"
    ],
    implementation: [
      "Digitalisasi layanan",
      "Implementasi sistem pintar",
      "Pengembangan ekonomi kreatif",
      "Integrasi teknologi"
    ]
  }
];



export const projects = [
  {
    title: "Pembangunan Infrastruktur Jalan Desa",
    description: "Pembangunan dan perbaikan jalan desa untuk meningkatkan aksesibilitas antar dusun.",
    progress: 80,
    image: Jalan // Ganti dengan gambar relevan untuk infrastruktur jalan
  },
  {
    title: "Pelatihan Keterampilan Kerajinan Tangan",
    description: "Program pelatihan keterampilan untuk pengrajin lokal dalam pembuatan kerajinan bambu dan tenun tradisional.",
    progress: 50,
    image: Kerajinan // Ganti dengan gambar relevan untuk pelatihan kerajinan
  },
  {
    title: "Penyuluhan Pertanian Berkelanjutan",
    description: "Program penyuluhan untuk petani mengenai metode pertanian organik dan pemanfaatan teknologi modern.",
    progress: 65,
    image: Pertanian // Ganti dengan gambar relevan untuk pertanian
  },
  {
    title: "Pembangunan Fasilitas Kesehatan",
    description: "Pembangunan fasilitas kesehatan tambahan seperti posyandu dan peningkatan layanan Puskesmas Pembantu.",
    progress: 90,
    image: Posyandu // Ganti dengan gambar relevan untuk fasilitas kesehatan
  }
];


export const crowdfundingProjects = [
  {
    title: "Pembangunan Jembatan Desa Cikoneng",
    description: "Penggalangan dana untuk pembangunan jembatan penghubung antar dusun di Desa Cikoneng. Jembatan ini akan mempermudah akses transportasi warga dan distribusi hasil tani.",
    target: 400000000,
    raised: 250000000,
    daysLeft: 10,
    supporters: 198,
    image: Jembatan
  },
  {
    title: "Pengembangan Wisata Desa Cikoneng",
    description: "Membangun fasilitas wisata seperti gazebo, jalur trekking, dan area bermain anak untuk meningkatkan daya tarik wisata Desa Cikoneng.",
    target: 500000000,
    raised: 320000000,
    daysLeft: 20,
    supporters: 276,
    image: WisataDesa
  },
  {
    title: "Program Pendidikan Anak Desa Cikoneng",
    description: "Dukungan pendidikan berupa pembelian buku, alat tulis, dan komputer untuk mendukung kegiatan belajar anak-anak di Desa Cikoneng.",
    target: 200000000,
    raised: 120000000,
    daysLeft: 15,
    supporters: 143,
    image: Sekolah
  },
  {
    title: "Proyek Energi Terbarukan Desa Cikoneng",
    description: "Instalasi panel surya untuk mengurangi ketergantungan pada listrik konvensional serta mendukung kebutuhan energi ramah lingkungan bagi warga.",
    target: 600000000,
    raised: 400000000,
    daysLeft: 25,
    supporters: 310,
    image: Energi
  },
];


export const featuredProducts = [
  {
    icon: GiRiceCooker,
    title: "Paket Wisata Sejarah Cikoneng",
    description: "Nikmati perjalanan menyusuri situs sejarah di Desa Cikoneng, termasuk kunjungan ke candi kuno dan situs budaya lainnya. Paket wisata ini menawarkan pengalaman yang mendalam tentang sejarah dan budaya lokal.",
    category: "Pertanian",
    image: Wisata,
    price: 18000,
    stock: 100,
    unit: "paket",
    rating: 4.8,
    soldCount: 250
  },
  {
    icon: GiCoconuts,
    title: "Trekking Gunung Cikoneng",
    description: "Rasakan pengalaman petualangan seru dengan trekking di Gunung Cikoneng. Nikmati pemandangan alam yang mempesona dan udara segar sambil menjelajahi flora dan fauna lokal.",
    category: "Olahan",
    image: Gunung,
    price: 15000,
    stock: 50,
    unit: "pax",
    rating: 4.7,
    soldCount: 100
  },
  {
    icon: FaFish,
    title: "Jelajah Alam Desa Cikoneng",
    description: "Jelajahi alam Desa Cikoneng dengan trekking, camping, dan perjalanan menarik lainnya. Nikmati pemandangan alam yang mempesona dan udara segar sambil menjelajahi flora dan fauna lokal.",
    category: "Perikanan",
    image: Alam,
    price: 35000,
    stock: 25,
    unit: "pax",
    rating: 4.6,
    soldCount: 75
  },
  {
    icon: FaBoxOpen,
    title: "Workshop Seni Ukir Batu",
    description: "Pelajari seni ukir batu tradisional yang telah diwariskan turun-temurun di Desa Cikoneng. Dalam workshop ini, Anda akan membuat karya seni unik yang mencerminkan budaya lokal.",
    category: "Kerajinan",
    image: SeniUkir,
    price: 75000,
    stock: 15,
    unit: "pax",
    rating: 4.5,
    soldCount: 50
  },
  {
    icon: FaTshirt,
    title: "Foto Pre-Wedding di Alam Cikoneng",
    description: "Abadikan momen spesial Anda di lokasi-lokasi indah di Desa Cikoneng. Paket foto pre-wedding dengan latar belakang alam yang menawan dan budaya lokal yang kental.",
    category: "Kerajinan",
    image: Prewed,
    price: 250000,
    stock: 8,
    unit: "pax",
    rating: 4.4,
    soldCount: 30
  },
  {
    icon: FaShoppingBasket,
    title: "Paket Wisata Pantai Cikoneng",
    description: "Cobalah pengalaman liburan santai di pantai-pantai indah di sekitar Desa Cikoneng. Nikmati pasir putih, air laut yang jernih, serta aktivitas air yang seru seperti snorkeling dan berenang.",
    category: "Kuliner",
    image: Pantai,
    price: 25000,
    stock: 30,
    unit: "pax",
    rating: 4.3,
    soldCount: 20
  },
  {
    icon: GiHoneyJar,
    title: "Camping di Tepi Danau Cikoneng",
    description: "Nikmati pengalaman berkemah yang tenang di tepi danau yang indah di Desa Cikoneng. Dengan udara sejuk dan pemandangan spektakuler, camping di sini akan menjadi pengalaman yang tak terlupakan.",
    category: "Natural",
    image: Camping,
    price: 85000,
    stock: 20,
    unit: "tenda",
    rating: 4.2,
    soldCount: 15
  },
  {
    icon: FaCarrot,
    title: "Tur Kebun Bunga Cikoneng",
    description: "Ikuti tur kebun bunga di Desa Cikoneng, tempat Anda bisa menikmati berbagai jenis bunga yang mekar sepanjang tahun. Pelajari cara merawat tanaman dan nikmati pemandangan yang memukau.",
    category: "Pertanian",
    image: KebunBunga,
    price: 12000,
    stock: 40,
    unit: "pax",
    rating: 4.1,
    soldCount: 10
  }
]; 