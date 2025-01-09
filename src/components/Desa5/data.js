import { FaStore, FaGraduationCap, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaBoxOpen, FaCarrot, FaTshirt } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import { GiRiceCooker, GiHoneyJar } from 'react-icons/gi';
import Pertanian from '../../assets/Desa5/pertanian.jpeg';
import Bambu from '../../assets/Desa5/bambu.jpeg';
import kopi from '../../assets/Desa5/kopi.jpeg';
import Wisata from '../../assets/Desa5/wisata.jpg';
import Sayur from '../../assets/Desa1/sayur.jpg';
import Tikar from '../../assets/Desa5/tikar.jpeg';
import Hutan from '../../assets/Desa5/huta.jpeg';
import Pembangkit from '../../assets/Desa5/pembangkit.jpeg';
import Puskesmas from '../../assets/Desa5/PusatKesehatan.jpeg';
import Sentra from '../../assets/Desa5/sentra.jpeg';
import Jalan from '../../assets/Desa5/jalan.jpeg';

export const statistics = [
  { value: "4,500", label: "Penduduk", icon: FaUsers },
  { value: "40%", label: "Akses Internet", icon: FaWifi },
  { value: "85", label: "UMKM", icon: FaStore },
  { value: "90%", label: "Tingkat Literasi", icon: FaGraduationCap }
];

export const features = [
  {
    icon: FaLeaf,
    title: "Pertanian & Perkebunan",
    description: "Penghasil komoditas utama seperti padi, jagung, dan ubi kayu. Perkebunan kopi menjadi salah satu produk unggulan dengan cita rasa khas Long Bawan yang dipasarkan hingga luar daerah.",
    color: "from-green-500 to-green-600",
    textColor: "text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-500/20",
    category: "Pertanian",
    stats: {
      area: "500 ha",
      crops: "4 komoditas",
      farmers: "65% petani",
      yield: "+45% hasil"
    },
    highlights: [
      "Padi Lokal",
      "Kopi Premium",
      "Jagung",
      "Ubi Kayu"
    ],
    implementation: [
      "Modernisasi pertanian",
      "Pelatihan petani",
      "Pengembangan varietas",
      "Sertifikasi produk"
    ]
  },
  {
    icon: IoEarth,
    title: "Wisata Alam",
    description: "Destinasi wisata alam yang menawarkan keindahan sungai, air terjun, dan pegunungan. Aktivitas trekking di perbukitan menjadi daya tarik utama bagi wisatawan yang mencari pengalaman ekowisata.",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500/20",
    category: "Pariwisata",
    stats: {
      area: "250 km²",
      crops: "6 destinasi",
      farmers: "3000+ wisatawan",
      yield: "+40% pertumbuhan"
    },
    highlights: [
      "Air Terjun",
      "Trekking",
      "Wisata Sungai",
      "Ekowisata"
    ],
    implementation: [
      "Pengembangan jalur",
      "Pelatihan pemandu",
      "Konservasi alam",
      "Promosi digital"
    ]
  },
  {
    icon: FaUsers,
    title: "Budaya & Tradisi",
    description: "Masyarakat Long Bawan memiliki adat istiadat yang kuat dengan berbagai upacara adat tahunan. Tradisi gotong royong masih sangat kental dalam kehidupan sehari-hari.",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500/20",
    category: "Budaya",
    stats: {
      area: "10 ritual",
      crops: "6 festival",
      farmers: "4000+ partisipan",
      yield: "100% preservasi"
    },
    highlights: [
      "Upacara Adat",
      "Gotong Royong",
      "Festival Budaya",
      "Kuliner Khas"
    ],
    implementation: [
      "Dokumentasi budaya",
      "Festival tahunan",
      "Pelestarian tradisi",
      "Edukasi generasi muda"
    ]
  },
  {
    icon: FaTshirt,
    title: "Kerajinan & UMKM",
    description: "Pengembangan kerajinan berbahan dasar bambu, kayu, dan rotan seperti tikar dan keranjang. Pemberdayaan UMKM lokal untuk meningkatkan ekonomi masyarakat.",
    color: "from-yellow-500 to-yellow-600",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500/20",
    category: "Ekonomi",
    stats: {
      area: "85 unit",
      crops: "12 jenis",
      farmers: "150 pengrajin",
      yield: "+35% omset"
    },
    highlights: [
      "Kerajinan Bambu",
      "Anyaman Rotan",
      "Produk Kayu",
      "Tikar Tradisional"
    ],
    implementation: [
      "Pelatihan pengrajin",
      "Standarisasi produk",
      "Pemasaran digital",
      "Pengembangan desain"
    ]
  },
  {
    icon: FaChartLine,
    title: "Infrastruktur & Fasilitas",
    description: "Program pengembangan infrastruktur meliputi akses jalan, fasilitas pendidikan (SD & SMP), layanan kesehatan (Puskesmas Pembantu & Posyandu), dan transportasi.",
    color: "from-red-500 to-red-600",
    textColor: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-500/20",
    category: "Infrastruktur",
    stats: {
      area: "8 program",
      crops: "5 tahun",
      farmers: "75% target",
      yield: "+50% capaian"
    },
    highlights: [
      "Akses Jalan",
      "Fasilitas Pendidikan",
      "Layanan Kesehatan",
      "Transportasi"
    ],
    implementation: [
      "Perbaikan jalan",
      "Pembangunan sekolah",
      "Pengembangan Pustu",
      "Peningkatan akses"
    ]
  }
];

export const projects = [
  {
    title: "Pengembangan Infrastruktur Jalan",
    description: "Perbaikan dan pembangunan akses jalan untuk memperlancar transportasi di desa",
    progress: 65,
    image: Jalan
  },
  {
    title: "Modernisasi Pertanian",
    description: "Program peningkatan teknologi pertanian untuk meningkatkan hasil tani",
    progress: 80,
    image: Pertanian
  }
];

export const crowdfundingProjects = [
  {
    title: "Pembangunan Pusat Kesehatan",
    description: "Pengembangan fasilitas Puskesmas Pembantu dan Posyandu untuk meningkatkan layanan kesehatan.",
    target: 600000000,
    raised: 420000000,
    daysLeft: 45,
    supporters: 280,
    image: Puskesmas
  },
  {
    title: "Konservasi Hutan Adat",
    description: "Program pelestarian hutan adat dan pengembangan pertanian berkelanjutan.",
    target: 400000000,
    raised: 280000000,
    daysLeft: 30,
    supporters: 185,
    image: Hutan
  },
  {
    title: "Pembangkit Listrik Mini",
    description: "Instalasi pembangkit listrik mini untuk daerah-daerah yang belum terjangkau.",
    target: 850000000,
    raised: 595000000,
    daysLeft: 20,
    supporters: 425,
    image: Pembangkit
  },
  {
    title: "Sentra UMKM Digital",
    description: "Pengembangan pusat pemasaran digital untuk produk-produk UMKM Long Bawan.",
    target: 350000000,
    raised: 245000000,
    daysLeft: 35,
    supporters: 165,
    image: Sentra
  }
];

export const featuredProducts = [
  {
    icon: GiRiceCooker,
    title: "Kopi Long Bawan",
    description: "Kopi premium khas Long Bawan dengan cita rasa unik yang telah dikenal hingga luar daerah. Ditanam dan diolah dengan metode tradisional.",
    category: "Pertanian",
    image: kopi,
    price: 85000,
    stock: 100,
    unit: "kg",
    rating: 4.9,
    soldCount: 450
  },
  {
    icon: GiHoneyJar,
    title: "Tiket Wisata Desa Long Bawan",
    description: "Tiket Wisata Desa Long Bawan",
    category: "Pariwisata",
    image: Wisata,
    price: 25000,
    stock: 50,
    unit: "orang",
    rating: 4.7,
    soldCount: 200
  },
  {
    icon: FaBoxOpen,
    title: "Kerajinan Bambu",
    description: "Kerajinan tangan berbahan dasar bambu seperti keranjang dan peralatan rumah tangga. Dibuat dengan teknik tradisional.",
    category: "Kerajinan",
    image: Bambu,
    price: 150000,
    stock: 35,
    unit: "pcs",
    rating: 4.6,
    soldCount: 85
  },
  {
    icon: FaTshirt,
    title: "Tikar Anyaman",
    description: "Tikar tradisional hasil anyaman rotan dengan motif khas Long Bawan. Dibuat dengan teliti oleh pengrajin lokal.",
    category: "Kerajinan",
    image: Tikar,
    price: 350000,
    stock: 20,
    unit: "pcs",
    rating: 4.8,
    soldCount: 65
  },
  {
    icon: FaCarrot,
    title: "Sayur & Umbi Organik",
    description: "Hasil pertanian organik seperti ubi kayu, jagung, dan sayuran segar dari kebun masyarakat Long Bawan.",
    category: "Pertanian",
    image: Sayur,
    price: 15000,
    stock: 75,
    unit: "kg",
    rating: 4.5,
    soldCount: 180
  }
]; 