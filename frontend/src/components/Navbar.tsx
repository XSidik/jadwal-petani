"use client";

import Link from "next/link";
import { Calendar, User, LogOut, ChevronDown, Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [userName, setUserName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Basic check for user info
        api.get("/api/account/user")
            .then(res => setUserName(res.data.name))
            .catch(() => setUserName(null));

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await api.post("/api/account/logout", {});
        toast.success(t("logoutSuccess") || "Logged out");
        window.location.href = "/";
    };

    return (
        <nav className="bg-green-600 dark:bg-green-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-white dark:bg-gray-100 p-1 rounded-lg mr-2 group-hover:rotate-12 transition-transform duration-300">
                                <img src="/logo.png" alt="Tech Petani Logo" className="w-7 h-7 object-contain" />
                            </div>
                            <span className="text-white text-xl font-bold tracking-tight">Tech Petani</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-green-700/50 hover:bg-green-700 text-white transition-all duration-200 border border-green-50/30 active:scale-95 text-xs font-bold"
                            title={language === 'id' ? 'Ganti ke English' : 'Switch to Indonesian'}
                        >
                            <Globe className="w-4 h-4" />
                            <span>{language.toUpperCase()}</span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-green-700/50 hover:bg-green-700 text-white transition-all duration-200 border border-green-50/30 active:scale-95"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>

                        {userName ? (
                            <>
                                <Link href="/schedules" className="text-green-50 hover:text-white transition-colors duration-200 flex items-center font-medium">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>{t("mySchedules")}</span>
                                </Link>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 bg-green-700/50 hover:bg-green-700 text-white px-3 py-1.5 rounded-full border border-green-50/30 transition-all duration-200"
                                    >
                                        <div className="bg-green-500 p-1 rounded-full">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold max-w-[120px] truncate">{userName}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                {t("logout")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/api/account/google-login`}
                                className="bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                            >
                                {t("login")}
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-white hover:bg-green-700 focus:outline-none transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-green-700 dark:bg-green-900 border-t border-green-500/20 py-4 px-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col space-y-3">
                        {userName ? (
                            <>
                                <div className="flex items-center px-3 py-3 bg-green-800/50 dark:bg-black/20 rounded-xl">
                                    <div className="bg-green-500 p-2 rounded-full mr-3 text-white">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-white font-bold truncate">{userName}</p>
                                        <p className="text-green-200 text-xs">{t("welcome")}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/schedules"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white hover:bg-green-600 px-4 py-3 rounded-xl flex items-center font-medium transition-colors"
                                >
                                    <Calendar className="w-5 h-5 mr-3 text-green-200" />
                                    {t("mySchedules")}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:bg-red-600/20 hover:text-red-100 px-4 py-3 rounded-xl flex items-center font-medium transition-colors text-left"
                                >
                                    <LogOut className="w-5 h-5 mr-3 text-red-300" />
                                    {t("logout")}
                                </button>
                            </>
                        ) : (
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL}/api/account/google-login`}
                                className="bg-white text-green-600 px-4 py-3 rounded-xl font-bold text-center shadow-lg active:scale-95 flex items-center justify-center"
                            >
                                <User className="w-5 h-5 mr-2" />
                                {t("loginWithGoogle")}
                            </a>
                        )}

                        <div className="pt-4 border-t border-green-600/50 flex items-center justify-between px-2">
                            <div className="flex space-x-3">
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-800/50 text-white font-bold text-sm border border-green-500/30"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>{language.toUpperCase()}</span>
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="p-2.5 rounded-xl bg-green-800/50 text-white border border-green-500/30"
                                >
                                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
