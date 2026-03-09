"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();

    const sections = [
        { icon: Eye, title: t("privacySec1Title"), desc: t("privacySec1Desc") },
        { icon: Shield, title: t("privacySec2Title"), desc: t("privacySec2Desc") },
        { icon: Lock, title: t("privacySec3Title"), desc: t("privacySec3Desc") },
        { icon: FileText, title: t("privacySec4Title"), desc: t("privacySec4Desc") }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                    {t("privacyTitle")}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {t("privacyLastUpdated")}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-12">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-10 text-center italic">
                    "{t("privacyIntro")}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {section.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <Link 
                    href="/" 
                    className="text-green-600 dark:text-green-500 font-semibold hover:underline"
                >
                    {t("backToHome")}
                </Link>
            </div>
        </div>
    );
}
