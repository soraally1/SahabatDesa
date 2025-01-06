import { FaStore, FaGraduationCap, FaHandshake, FaWifi, FaLeaf, FaUsers, 
  FaChartLine, FaLightbulb } from 'react-icons/fa';
import { IoEarth } from 'react-icons/io5';
import {  GiCoconuts, Gi3dHammer, GiGraduateCap, GiAbacus, Gi3dGlasses } from 'react-icons/gi';
import Digitalisasi from '../../assets/img/Digitalisasi.jpeg';
import PembangunanTrek from '../../assets/img/PembangunanTrek.jpeg';
import Sekolah from '../../assets/img/Sekolah .jpeg';
import WisataDesa from '../../assets/img/WisataDesa.jpeg';
import Energi from '../../assets/img/Energi.jpeg';
import Jembatan from '../../assets/img/Jembatan.jpeg';
import Palawija from '../../assets/img/Palawija.jpeg';
import AlamWisata from '../../assets/img/AlamWisata.jpeg';
import CampingGround from '../../assets/img/CampingGround.jpeg';
import Kopi from '../../assets/img/Kopi.jpeg';
import PetaniModern from '../../assets/img/PetaniModern.jpeg';
import WisatDesa from '../../assets/img/WisataDesa.jpeg';
import Perkebunan from '../../assets/img/Perkebunan.jpeg';
import Bibit from '../../assets/img/Bibit.jpeg';


export const statistics = [
  { value: "6800+", label: "Penduduk", icon: FaUsers },
  { value: "90%", label: "Akses Internet", icon: FaWifi },
  { value: "50+", label: "UMKM", icon: FaStore },
  { value: "95%", label: "Tingkat Literasi", icon: FaGraduationCap }
];

export const features = [
  {
    icon: FaLeaf,
    title: "Potensi Palawija",
    description: "Produksi palawija meliputi jagung, kacang tanah, dan ubi kayu, dengan penerapan metode bercocok tanam berkelanjutan.",
    color: "from-green-500 to-green-600",
    textColor: "text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-500/20",
    category: "Pertanian",
    stats: {
      area: "20 km²",
      crops: "3 komoditas",
      farmers: "65% petani",
      yield: "+35% hasil tahunan"
    },
    highlights: [
      "Pengelolaan lahan efisien",
      "Peningkatan produktivitas",
      "Kemitraan distribusi",
      "Dukungan pemerintah"
    ],
    implementation: [
      "Pelatihan bercocok tanam modern",
      "Pengolahan hasil panen",
      "Pengendalian hama terpadu",
      "Akses ke pasar yang lebih luas"
    ]
  },
  {
    icon: FaStore,
    title: "Perkebunan",
    description: "Lahan perkebunan meliputi kelapa sawit, karet, dan kopi yang menjadi sumber utama penghidupan warga.",
    color: "from-amber-500 to-amber-600",
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-500/20",
    category: "Ekonomi",
    stats: {
      area: "30 km²",
      crops: "3 tanaman utama",
      farmers: "50% warga",
      yield: "+40% produksi"
    },
    highlights: [
      "Karet berkualitas tinggi",
      "Kopi lokal unggulan",
      "Kelapa sawit ramah lingkungan",
      "Dukungan koperasi"
    ],
    implementation: [
      "Rehabilitasi lahan perkebunan",
      "Pelatihan pengelolaan kebun",
      "Kemitraan koperasi",
      "Ekspansi ke pasar nasional"
    ]
  },
  {
    icon: IoEarth,
    title: "Hutan Wisata",
    description: "Destinasi hutan wisata alami dengan flora dan fauna khas, serta jalur trekking yang menarik.",
    color: "from-teal-500 to-teal-600",
    textColor: "text-teal-800",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-500/20",
    category: "Pariwisata",
    stats: {
      area: "15 km²",
      crops: "5 spot unggulan",
      farmers: "500 pengunjung/tahun",
      yield: "+50% pendapatan wisata"
    },
    highlights: [
      "Jalur trekking alami",
      "Flora & fauna unik",
      "Spot foto ikonik",
      "Keterlibatan masyarakat"
    ],
    implementation: [
      "Pengelolaan jalur trekking",
      "Peningkatan fasilitas wisata",
      "Promosi digital",
      "Kerjasama dengan komunitas"
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
    title: "Pembangunan Wisata Alam Desa Pusat Damai",
    description: "Pembangunan dan pengelolaan jalur trekking serta fasilitas pendukung di hutan wisata Desa Pusat Damai untuk menarik wisatawan dan memberi manfaat ekonomi bagi warga.",
    progress: 70,
    image: PembangunanTrek // Ganti dengan gambar relevan untuk wisata alam
  },
  {
    title: "Digitalisasi Layanan Desa Pusat Damai",
    description: "Implementasi sistem informasi desa dan platform berbasis teknologi untuk mempermudah warga mengakses layanan publik dan informasi terkait kegiatan desa.",
    progress: 40,
    image: Digitalisasi // Ganti dengan gambar relevan untuk digitalisasi
  },
];



export const crowdfundingProjects = [
  {
    title: "Pembangunan Jembatan Desa Pusat Damai",
    description: "Penggalangan dana untuk pembangunan jembatan penghubung antar dusun di Desa Cikoneng. Jembatan ini akan mempermudah akses transportasi warga dan distribusi hasil tani.",
    target: 400000000,
    raised: 250000000,
    daysLeft: 10,
    supporters: 198,
    image: Jembatan
  },
  {
    title: "Pengembangan Wisata Desa Pusat Damai",
    description: "Membangun fasilitas wisata seperti gazebo, jalur trekking, dan area bermain anak untuk meningkatkan daya tarik wisata Desa Cikoneng.",
    target: 500000000,
    raised: 320000000,
    daysLeft: 20,
    supporters: 276,
    image: WisataDesa
  },
  {
    title: "Program Pendidikan Anak Desa Pusat Damai",
    description: "Dukungan pendidikan berupa pembelian buku, alat tulis, dan komputer untuk mendukung kegiatan belajar anak-anak di Desa Cikoneng.",
    target: 200000000,
    raised: 120000000,
    daysLeft: 15,
    supporters: 143,
    image: Sekolah
  },
  {
    title: "Proyek Energi Terbarukan Pusat Damai",
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
    icon: GiCoconuts,
    title: "Produk Palawija Segar Pusat Damai",
    description: "Nikmati hasil palawija segar seperti jagung, kacang-kacangan, dan umbi-umbian dari Desa Pusat Damai. Produk berkualitas tinggi yang dihasilkan langsung dari petani lokal.",
    category: "Pertanian",
    image: Palawija, // Ganti dengan gambar relevan untuk palawija
    price: 20000,
    stock: 100,
    unit: "kg",
    rating: 4.8,
    soldCount: 300
  },
  {
    icon: GiCoconuts,
    title: "Tur Perkebunan Pusat Damai",
    description: "Ikuti tur menyenangkan di perkebunan Desa Pusat Damai. Pelajari cara pengolahan hasil perkebunan seperti buah-buahan tropis dan kopi lokal yang terkenal.",
    category: "Pariwisata",
    image: Perkebunan, // Ganti dengan gambar relevan untuk perkebunan
    price: 50000,
    stock: 50,
    unit: "pax",
    rating: 4.7,
    soldCount: 150
  },
  {
    icon: Gi3dGlasses,
    title: "Trekking dan Wisata Hutan Pusat Damai",
    description: "Jelajahi keindahan hutan wisata Desa Pusat Damai. Nikmati jalur trekking yang memukau dengan udara segar serta pemandangan alam yang luar biasa.",
    category: "Wisata Alam",
    image: WisatDesa, // Ganti dengan gambar relevan untuk hutan wisata
    price: 75000,
    stock: 30,
    unit: "pax",
    rating: 4.9,
    soldCount: 120
  },
  {
    icon: GiCoconuts,
    title: "Paket Bibit Palawija",
    description: "Paket bibit unggul palawija seperti jagung manis, kacang tanah, dan kedelai. Cocok untuk petani dan penghobi berkebun.",
    category: "Pertanian",
    image: Bibit, // Ganti dengan gambar relevan
    price: 15000,
    stock: 200,
    unit: "paket",
    rating: 4.5,
    soldCount: 180
  },
  {
    icon:  GiAbacus,
    title: "Produk Kopi Perkebunan Pusat Damai",
    description: "Kopi khas Desa Pusat Damai dengan cita rasa unik yang dihasilkan dari perkebunan lokal yang ramah lingkungan.",
    category: "Kuliner",
    image: Kopi, // Ganti dengan gambar relevan
    price: 45000,
    stock: 80,
    unit: "paket",
    rating: 4.6,
    soldCount: 100
  },
  {
    icon: GiGraduateCap,
    title: "Camping Ground Hutan Wisata",
    description: "Nikmati pengalaman berkemah yang seru di tengah hutan wisata Desa Pusat Damai. Tempat ini menyediakan fasilitas lengkap untuk camping keluarga atau kelompok.",
    category: "Wisata Alam",
    image: CampingGround, // Ganti dengan gambar relevan
    price: 100000,
    stock: 25,
    unit: "slot",
    rating: 4.8,
    soldCount: 50
  },
  {
    icon: GiGraduateCap,
    title: "Pelatihan Pertanian Modern",
    description: "Ikuti pelatihan tentang teknik pertanian modern seperti hidroponik dan pengelolaan lahan yang efisien di Desa Pusat Damai.",
    category: "Edukasi",
    image: PetaniModern, // Ganti dengan gambar relevan
    price: 75000,
    stock: 40,
    unit: "pax",
    rating: 4.7,
    soldCount: 60
  },
  {
    icon: Gi3dHammer,
    title: "Wisata Petualangan Hutan Wisata",
    description: "Rasakan petualangan di hutan wisata Desa Pusat Damai dengan berbagai kegiatan seperti hiking, birdwatching, dan observasi flora dan fauna lokal.",
    category: "Wisata Alam",
    image: AlamWisata, // Ganti dengan gambar relevan
    price: 125000,
    stock: 20,
    unit: "pax",
    rating: 4.9,
    soldCount: 40
  }
];
