import { FaStore, FaGraduationCap, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaFish, FaTshirt, FaBoxOpen, FaCarrot, FaUmbrellaBeach } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import { GiRiceCooker, GiHoneyJar, GiCoconuts, GiFishingBoat, GiSeahorse } from 'react-icons/gi';
import menara from '../../assets/img/menara.jpeg';
import pelatihan from '../../assets/img/pelatihan.jpeg';
import Bambu from '../../assets/Desa1/bambu.jpg';
import Ikan from '../../assets/Desa1/ikan.jpg';
import Beras from '../../assets/Desa1/beras.jpg';
import Kelapa from '../../assets/Desa1/kelapa.jpg';
import Madu from '../../assets/Desa1/madu.jpg';
import Sayur from '../../assets/Desa1/sayur.jpg';
import Tenun from '../../assets/Desa1/tenun.jpg';
import Terumbu from '../../assets/Desa4/Terumbu.jpeg';
import Dermaga from '../../assets/Desa4/Dermaga.jpeg';
import Ecommerce from '../../assets/Desa1/ecomer.jpeg';
import Energi from '../../assets/Desa1/Energy.jpeg';
import RumputLaut from '../../assets/Desa4/Rumput.jpg';

export const statistics = [
  { value: "8,116", label: "Penduduk", icon: FaUsers },
  { value: "35%", label: "Akses Internet", icon: FaWifi },
  { value: "45", label: "UMKM", icon: FaStore },
  { value: "70%", label: "Tingkat Literasi", icon: FaGraduationCap }
];

export const features = [
  {
    icon: GiFishingBoat,
    title: "Potensi Perikanan",
    description: "Kawasan perikanan laut dengan hasil tangkapan utama berupa ikan segar, cumi-cumi, dan kepiting. Pengolahan ikan asin menjadi produk unggulan desa yang dipasarkan hingga luar daerah.",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500/20",
    category: "Perikanan",
    stats: {
      area: "327.94 km²",
      crops: "4 komoditas",
      farmers: "40% nelayan",
      yield: "+30% hasil"
    },
    highlights: [
      "Ikan Asin Khas Riung",
      "Budidaya Kepiting",
      "Pengolahan Hasil Laut",
      "Garam Tradisional"
    ],
    implementation: [
      "Pengembangan budidaya laut",
      "Konservasi terumbu karang",
      "Modernisasi alat tangkap",
      "Pemberdayaan nelayan"
    ]
  },
  {
    icon: FaUmbrellaBeach,
    title: "Wisata Bahari",
    description: "Taman Nasional Laut 17 Pulau Riung menawarkan keindahan terumbu karang, pantai pasir putih, dan spot diving yang menakjubkan. Habitat alami bagi berbagai spesies laut termasuk dugong dan lumba-lumba.",
    color: "from-cyan-500 to-cyan-600",
    textColor: "text-cyan-800",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-500/20",
    category: "Pariwisata",
    stats: {
      area: "17 pulau",
      crops: "6 aktivitas",
      farmers: "3000+ wisatawan",
      yield: "+50% pertumbuhan"
    },
    highlights: [
      "Diving & Snorkeling",
      "Island Hopping",
      "Wisata Mangrove",
      "Sunset Watching"
    ],
    implementation: [
      "Pengembangan homestay",
      "Pelatihan pemandu wisata",
      "Konservasi ekosistem",
      "Promosi digital"
    ]
  },
  {
    icon: FaLeaf,
    title: "Potensi Agrikultur",
    description: "Lahan pertanian menghasilkan jagung, padi ladang, dan kacang hijau sebagai hasil utama. Ditunjang dengan perkebunan buah-buahan lokal seperti mangga dan pisang.",
    color: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-800",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500/20",
    category: "Pertanian",
    stats: {
      area: "150 ha",
      crops: "5 komoditas",
      farmers: "45% petani",
      yield: "+25% hasil"
    },
    highlights: [
      "Jagung Bose",
      "Padi Ladang",
      "Kacang Hijau",
      "Buah Lokal"
    ],
    implementation: [
      "Sertifikasi organik",
      "Pengembangan rempah",
      "Modernisasi pengolahan",
      "Pelatihan petani"
    ]
  },
  {
    icon: FaTshirt,
    title: "UMKM & Kerajinan",
    description: "Pemberdayaan pengrajin tenun ikat khas Flores dan pengolahan hasil laut. Pengembangan produk kerajinan berbasis budaya lokal.",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500/20",
    category: "Ekonomi",
    stats: {
      area: "30 unit",
      crops: "6 jenis",
      farmers: "50 UMKM",
      yield: "+30% omset"
    },
    highlights: [
      "Tenun Ikat Flores",
      "Olahan Hasil Laut",
      "Kerajinan Lokal",
      "Pemasaran Digital"
    ],
    implementation: [
      "Pelatihan pengrajin",
      "Standarisasi produk",
      "Platform digital",
      "Ekspansi pasar"
    ]
  },
  {
    icon: IoEarth,
    title: "Budaya & Tradisi",
    description: "Kekayaan budaya Flores dengan ritual adat, tarian tradisional, dan festival budaya tahunan. Kehidupan masyarakat yang masih menjaga kearifan lokal.",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500/20",
    category: "Budaya",
    stats: {
      area: "6 ritual",
      crops: "4 festival",
      farmers: "2000+ partisipan",
      yield: "100% preservasi"
    },
    highlights: [
      "Ritual Adat",
      "Tarian Tradisional",
      "Festival Budaya",
      "Kearifan Lokal"
    ],
    implementation: [
      "Dokumentasi budaya",
      "Festival tahunan",
      "Pelestarian tradisi",
      "Edukasi generasi muda"
    ]
  },
  {
    icon: FaUsers,
    title: "Demografi & Sosial",
    description: "Populasi 2.500+ jiwa dengan 6 dusun, menciptakan komunitas yang harmonis dengan beragam suku dan agama. Gotong royong masih kuat dalam kehidupan sehari-hari.",
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-800",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500/20",
    category: "Sosial",
    stats: {
      area: "6 dusun",
      crops: "15 RT",
      farmers: "2500+ jiwa",
      yield: "5 RW"
    },
    highlights: [
      "Gotong Royong",
      "Harmoni Sosial",
      "Aktivitas Pemuda",
      "Program Lansia"
    ],
    implementation: [
      "Program sosial",
      "Pemberdayaan pemuda",
      "Pelayanan lansia",
      "Kegiatan komunitas"
    ]
  },
  {
    icon: FaGraduationCap,
    title: "Pendidikan & Kesehatan",
    description: "Fasilitas pendidikan dasar dan menengah, serta layanan kesehatan melalui Puskesmas dan Posyandu. Program pendidikan berbasis kearifan lokal.",
    color: "from-red-500 to-red-600",
    textColor: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-500/20",
    category: "Fasilitas",
    stats: {
      area: "3 sekolah",
      crops: "1 puskesmas",
      farmers: "3 posyandu",
      yield: "90% layanan"
    },
    highlights: [
      "Pendidikan Lokal",
      "Layanan Kesehatan",
      "Posyandu Aktif",
      "Edukasi Masyarakat"
    ],
    implementation: [
      "Pengembangan kurikulum",
      "Peningkatan layanan",
      "Program kesehatan",
      "Edukasi preventif"
    ]
  },
  {
    icon: FaChartLine,
    title: "Program Prioritas",
    description: "Program pengembangan meliputi infrastruktur wisata, konservasi laut, pemberdayaan nelayan, UMKM, dan pelestarian budaya.",
    color: "from-cyan-500 to-cyan-600",
    textColor: "text-cyan-800",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-500/20",
    category: "Pembangunan",
    stats: {
      area: "5 program",
      crops: "3 tahun",
      farmers: "85% target",
      yield: "+60% capaian"
    },
    highlights: [
      "Wisata Bahari",
      "Konservasi Laut",
      "UMKM",
      "Budaya"
    ],
    implementation: [
      "Infrastruktur wisata",
      "Program konservasi",
      "Pemberdayaan UMKM",
      "Pelestarian budaya"
    ]
  }
];

export const projects = [
  {
    title: "Pembangunan Menara Internet",
    description: "Pemasangan menara internet untuk memperluas jangkauan koneksi di seluruh desa",
    progress: 75,
    image: menara
  },
  {
    title: "Pelatihan Digital Marketing",
    description: "Program pelatihan pemasaran digital untuk pelaku UMKM lokal",
    progress: 60,
    image: pelatihan
  }
];

export const crowdfundingProjects = [
  {
    title: "Pengembangan Dermaga Wisata Riung",
    description: "Revitalisasi dermaga utama untuk akses ke Taman Wisata Alam Laut 17 Pulau Riung dan mendukung aktivitas nelayan lokal.",
    target: 750000000,
    raised: 250000000,
    daysLeft: 60,
    supporters: 185,
    image: Dermaga
  },
  {
    title: "Konservasi Terumbu Karang",
    description: "Program rehabilitasi dan konservasi terumbu karang di kawasan 17 pulau Riung.",
    target: 500000000,
    raised: 350000000,
    daysLeft: 20,
    supporters: 245,
    image: Terumbu
  },
  {
    title: "Renewable Energy Project",
    description: "Instalasi panel surya dan sistem smart grid untuk mendukung infrastruktur digital desa.",
    target: 750000000,
    raised: 450000000,
    daysLeft: 25,
    supporters: 312,
    image: Energi
  },
  {
    title: "E-Commerce Development",
    description: "Pengembangan platform e-commerce untuk produk lokal desa dengan sistem pembayaran digital terintegrasi.",
    target: 300000000,
    raised: 225000000,
    daysLeft: 18,
    supporters: 189,
    image: Ecommerce
  }
];

export const featuredProducts = [
  {
    icon: GiRiceCooker,
    title: "Beras Organik Premium",
    description: "Beras organik premium hasil panen petani lokal, ditanam dengan metode SRI (System of Rice Intensification). Bebas pestisida, tekstur pulen, dan aroma alami yang khas. Dikemas dalam kemasan vacuum untuk menjaga kualitas.",
    category: "Pertanian",
    image: Beras,
    price: 18000,
    stock: 100,
    unit: "kg",
    rating: 4.8,
    soldCount: 250
  },
  {
    icon: GiCoconuts,
    title: "Produk Kelapa",
    description: "Minyak kelapa murni (VCO) diproduksi dengan metode cold-pressed tradisional untuk menjaga nutrisi. Cocok untuk memasak, perawatan kulit, dan rambut. Tersedia juga kelapa segar pilihan berkualitas tinggi.",
    category: "Olahan",
    image: Kelapa,
    price: 15000,
    stock: 50,
    unit: "butir",
    rating: 4.7,
    soldCount: 100
  },
  {
    icon: FaFish,
    title: "Ikan Asin Khas Riung",
    description: "Ikan asin premium khas Riung yang diolah secara tradisional dengan cita rasa khas. Menjadi produk unggulan yang dipasarkan hingga luar daerah.",
    category: "Perikanan",
    image: Ikan,
    price: 45000,
    stock: 50,
    unit: "kg",
    rating: 4.8,
    soldCount: 200
  },
  {
    icon: FaBoxOpen,
    title: "Anyaman Bambu",
    description: "Kerajinan anyaman bambu premium hasil karya pengrajin terampil desa. Setiap produk dibuat dengan teliti menggunakan teknik anyaman tradisional turun-temurun. Awet, tahan lama, dan ramah lingkungan.",
    category: "Kerajinan",
    image: Bambu,
    price: 75000,
    stock: 15,
    unit: "pcs",
    rating: 4.5,
    soldCount: 50
  },
  {
    icon: FaTshirt,
    title: "Tenun Flores",
    description: "Kain tenun tradisional dengan motif khas Flores, dibuat oleh penenun terampil Riung. Menggunakan pewarna alami dan teknik tradisional.",
    category: "Kerajinan",
    image: Tenun,
    price: 350000,
    stock: 15,
    unit: "pcs",
    rating: 4.6,
    soldCount: 45
  },
  {
    icon: GiHoneyJar,
    title: "Madu Hutan Riung",
    description: "Madu murni dari lebah liar yang berkembang di kawasan hutan sekitar Desa Riung. Dipanen secara tradisional dengan kualitas premium.",
    category: "Natural",
    image: Madu,
    price: 85000,
    stock: 20,
    unit: "botol",
    rating: 4.2,
    soldCount: 15
  },
  {
    icon: FaCarrot,
    title: "Sayur & Buah Organik",
    description: "Hasil panen segar dari kebun organik bersertifikat. Ditanam tanpa pestisida kimia, dipanen pagi hari untuk menjaga kesegaran. Tersedia sayuran hijau, umbi-umbian, dan buah musiman berkualitas premium.",
    category: "Pertanian",
    image: Sayur,
    price: 12000,
    stock: 40,
    unit: "kg",
    rating: 4.1,
    soldCount: 10
  },
  {
    icon: GiSeahorse,
    title: "Rumput Laut Kering",
    description: "Rumput laut berkualitas tinggi dari budidaya lokal Riung. Diolah dengan standar ekspor, cocok untuk industri makanan dan kosmetik.",
    category: "Perikanan",
    image: RumputLaut,
    price: 25000,
    stock: 100,
    unit: "kg",
    rating: 4.7,
    soldCount: 150
  }
]; 