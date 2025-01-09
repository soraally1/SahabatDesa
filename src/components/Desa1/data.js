import { FaStore, FaGraduationCap, FaHandshake, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaLightbulb, FaShoppingBasket, FaFish, FaTshirt, FaBoxOpen, FaCarrot } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import { GiRiceCooker, GiHoneyJar, GiCoconuts } from 'react-icons/gi';
import menara from '../../assets/img/Menara.jpeg';
import pelatihan from '../../assets/img/pelatihan.jpeg';
import Bambu from '../../assets/Desa1/bambu.jpg';
import Ikan from '../../assets/Desa1/ikan.jpg';
import Beras from '../../assets/Desa1/beras.jpg';
import Kelapa from '../../assets/Desa1/kelapa.jpg';
import Madu from '../../assets/Desa1/madu.jpg';
import Sagu from '../../assets/Desa1/sagu.jpg';
import Sayur from '../../assets/Desa1/sayur.jpg';
import Tenun from '../../assets/Desa1/tenun.jpg';
import Digital from '../../assets/Desa1/digital.jpeg';
import Ecommerce from '../../assets/Desa1/ecomer.jpeg';
import energy from '../../assets/Desa1/energy.jpeg';
import farming from '../../assets/Desa1/farming.jpeg';

export const statistics = [
  { value: "2,500+", label: "Penduduk", icon: FaUsers },
  { value: "85%", label: "Akses Internet", icon: FaWifi },
  { value: "120+", label: "UMKM", icon: FaStore },
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
    title: "Smart Farming Innovation Center",
    description: "Pembangunan pusat inovasi pertanian pintar dengan teknologi IoT dan AI untuk optimalisasi hasil panen.",
    target: 500000000,
    raised: 350000000,
    daysLeft: 15,
    supporters: 234,
    image: farming
  },
  {
    title: "Digital Skills Training Hub",
    description: "Program pelatihan keterampilan digital untuk pemuda desa, mencakup coding, digital marketing, dan data analytics.",
    target: 250000000,
    raised: 180000000,
    daysLeft: 20,
    supporters: 156,
    image: Digital
  },
  {
    title: "Renewable Energy Project",
    description: "Instalasi panel surya dan sistem smart grid untuk mendukung infrastruktur digital desa.",
    target: 750000000,
    raised: 450000000,
    daysLeft: 25,
    supporters: 312,
    image: energy
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
    title: "Ikan Air Tawar",
    description: "Ikan nila dan lele segar dari kolam budidaya ramah lingkungan. Dipanen langsung saat dipesan untuk menjamin kesegaran maksimal. Bebas bahan kimia dan antibiotik, cocok untuk hidangan sehat keluarga.",
    category: "Perikanan",
    image: Ikan,
    price: 35000,
    stock: 25,
    unit: "kg",
    rating: 4.6,
    soldCount: 75
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
    title: "Tenun Tradisional",
    description: "Kain tenun eksklusif dengan motif khas Pagaitan, ditenun tangan menggunakan benang berkualitas tinggi. Setiap motif menceritakan kisah budaya lokal. Cocok untuk pakaian adat dan koleksi pribadi.",
    category: "Kerajinan",
    image: Tenun,
    price: 250000,
    stock: 8,
    unit: "pcs",
    rating: 4.4,
    soldCount: 30
  },
  {
    icon: FaShoppingBasket,
    title: "Olahan Sagu",
    description: "Makanan tradisional berbahan sagu pilihan, diolah dengan resep warisan leluhur. Tersedia varian sinonggi dan kapurung dengan cita rasa otentik. Dikemas higienis dan tahan lama, cocok untuk oleh-oleh.",
    category: "Kuliner",
    image: Sagu,
    price: 25000,
    stock: 30,
    unit: "pcs",
    rating: 4.3,
    soldCount: 20
  },
  {
    icon: GiHoneyJar,
    title: "Madu Hutan",
    description: "Madu murni dari lebah liar hutan Pagaitan, dipanen secara tradisional dan berkelanjutan. Kaya antioksidan dan enzim alami. Dikemas dalam botol kaca premium untuk menjaga keaslian rasa dan khasiat.",
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
  }
]; 