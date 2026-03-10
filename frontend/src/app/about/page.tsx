"use client";

import { Target, Eye, BookOpen, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AboutPage() {
    const { t } = useLanguage();

    const values = [
        { icon: Target, title: t("aboutMission"), desc: t("aboutMissionDesc") },
        { icon: Eye, title: t("aboutVision"), desc: t("aboutVisionDesc") },
        { icon: BookOpen, title: t("aboutStory"), desc: t("aboutStoryDesc") }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-green-600 uppercase bg-green-100 rounded-full dark:bg-green-900/40 dark:text-green-400">
                    {t("heroBadge")}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    {t("aboutTitle")}
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t("footerDesc")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
                {values.map((value, index) => (
                    <div 
                        key={index} 
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                            <value.icon className="w-7 h-7" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {value.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                            {value.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-green-600 dark:bg-green-700 rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden group">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-colors duration-700"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-colors duration-700"></div>
                
                <h2 className="text-3xl font-bold mb-6 relative z-10">
                    {t("heroTitle")} {t("heroTitleHighlight")}
                </h2>
                <p className="text-green-50/90 text-lg mb-10 max-w-xl mx-auto relative z-10">
                    {t("heroDesc")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                    <Link 
                        href="/" 
                        className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center"
                    >
                        {t("heroStart")}
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>

            <div className="text-center mt-12 pb-8">
                <Link 
                    href="/" 
                    className="text-gray-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                >
                    {t("backToHome")}
                </Link>
            </div>
        </div>
    );
}
