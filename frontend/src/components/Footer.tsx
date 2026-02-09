"use client";

import { Sprout, Facebook, Twitter, Instagram, Linkedin, ChevronRight, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-900 text-gray-300 mt-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Sprout className="text-green-500 w-8 h-8 mr-3" />
                            <span className="text-white text-2xl font-bold">Jadwal Petani</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                            {t("footerDesc")}
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-green-500 hover:bg-green-600 hover:text-white transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-green-500 rounded"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", href: "/" },
                                { label: "My Schedules", href: "/schedules" },
                                { label: "Create Schedule", href: "/schedules/create" },
                                { label: "About Us", href: "#" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="hover:text-green-500 transition duration-300 flex items-center group">
                                        <ChevronRight className="w-3 h-3 mr-2 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                            {t("contactUs")}
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-green-500 rounded"></span>
                        </h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mt-1 mr-3">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span>{t("address")}</span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-green-500 mr-3">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span>info@jadwalpetani.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 Jadwal Petani. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition duration-300">{t("privacyPolicy")}</a>
                        <a href="#" className="hover:text-white transition duration-300">{t("termsOfService")}</a>
                        <a href="#" className="hover:text-white transition duration-300">{t("cookiePolicy")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
