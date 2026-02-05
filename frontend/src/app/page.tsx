import { Sprout, Calendar, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
          <Sprout className="w-4 h-4 mr-2" />
          Masa Depan Pertanian Indonesia
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Kelola Pertanian Anda <br />
          <span className="text-green-600">Lebih Cerdas</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Optimalkan hasil panen dengan jadwal tanam berbasis AI dan integrasi Google Calendar yang mulus.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/schedules"
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-green-200 flex items-center group"
          >
            Mulai Sekarang
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-sm">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Jawal Berbasis AI",
            desc: "Dapatkan rekomendasi waktu tanam terbaik berdasarkan jenis tanaman.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50"
          },
          {
            title: "Integrasi Calendar",
            desc: "Ekspor seluruh jadwal tugas ke Google Calendar secara otomatis.",
            icon: Calendar,
            color: "text-blue-500",
            bg: "bg-blue-50"
          },
          {
            title: "Data Terpusat",
            desc: "Semua riwayat dan rencana tanam tersimpan aman di satu tempat.",
            icon: Shield,
            color: "text-green-500",
            bg: "bg-green-50"
          }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`${feat.bg} ${feat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Globe className="w-64 h-64" />
        </div>
        <div className="relative z-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <div className="text-green-100">Petani Terdaftar</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-green-100">Jadwal Dibuat</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-green-100">Kepuasan Pengguna</div>
          </div>
        </div>
      </section>
    </div>
  );
}
