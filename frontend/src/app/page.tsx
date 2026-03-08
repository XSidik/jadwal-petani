"use client";

import { Calendar, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function HomePage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ totalUsers: 0, totalSchedules: 0 });

  useEffect(() => {
    api.get("/api/home/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="space-y-12 sm:space-y-20 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-xs sm:text-sm mb-2 sm:mb-4 mx-auto">
          {t("heroBadge")}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight px-2">
          {t("heroTitle")} <br />
          <span className="text-green-600 dark:text-green-500">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
          {t("heroDesc")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-6">
          <Link
            href="/schedules"
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-green-200/20 dark:hover:shadow-green-900/20 flex items-center justify-center group"
          >
            {t("heroStart")}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-2">
        {[
          {
            title: t("feat1Title"),
            desc: t("feat1Desc"),
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20"
          },
          {
            title: t("feat2Title"),
            desc: t("feat2Desc"),
            icon: Calendar,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20"
          },
          {
            title: t("feat3Title"),
            desc: t("feat3Desc"),
            icon: Shield,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/20"
          }
        ].map((feat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className={`${feat.bg} ${feat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 sm:mb-6`}>
              <feat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden mx-2 sm:mx-0">
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
          <Globe className="w-64 h-64" />
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">{stats.totalUsers}</div>
            <div className="text-green-100 text-sm sm:text-base">{t("statsFarmers")}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">{stats.totalSchedules}</div>
            <div className="text-green-100 text-sm sm:text-base">{t("statsSchedules")}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
