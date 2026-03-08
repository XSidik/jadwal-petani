"use client";

import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/schedules");
        }
    }, [user, router]);

    return (
        <div className="max-w-md mx-auto py-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-green-100 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden text-center p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-3">
                        <img src="/logo.jpg" alt="Tech Petani Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tech Petani</span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{t("welcome")}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                    {t("loginDesc")}
                </p>

                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/account/google-login`}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 py-4 rounded-2xl font-bold text-gray-700 dark:text-gray-200 hover:border-green-500 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition flex items-center justify-center group"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 mr-3" />
                    {t("loginWithGoogle")}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
                    {t("termsAgreement")}
                </p>
            </div>
        </div>
    );
}
