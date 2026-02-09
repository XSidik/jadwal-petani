"use client";

import { Sprout, Calendar, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-sm mb-4">
          <Sprout className="w-4 h-4 mr-2" />
          {t("heroBadge")}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          {t("heroTitle")} <br />
          <span className="text-green-600 dark:text-green-500">{t("heroTitleHighlight")}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t("heroDesc")}
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/schedules"
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-green-200/20 dark:hover:shadow-green-900/20 flex items-center group"
          >
            {t("heroStart")}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
            {t("heroLearn")}
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
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
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className={`${feat.bg} ${feat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
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
            <div className="text-green-100">{t("statsFarmers")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-green-100">{t("statsSchedules")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-green-100">{t("statsSatisfaction")}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
