"use client";

import Link from "next/link";
import { Sprout, Calendar, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Navbar() {
    const [userName, setUserName] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Basic check for user info
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/account/user`, { withCredentials: true })
            .then(res => setUserName(res.data.name))
            .catch(() => setUserName(null));

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/account/logout`, {}, { withCredentials: true });
        window.location.href = "/";
    };

    return (
        <nav className="bg-green-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <div className="bg-white p-1.5 rounded-lg mr-2 group-hover:rotate-12 transition-transform duration-300">
                                <Sprout className="text-green-600 w-6 h-6" />
                            </div>
                            <span className="text-white text-xl font-bold tracking-tight">Jadwal Petani</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        {userName ? (
                            <>
                                <Link href="/schedules" className="text-green-50 hover:text-white transition-colors duration-200 flex items-center font-medium">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span className="hidden sm:inline">My Schedules</span>
                                </Link>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 bg-green-700/50 hover:bg-green-700 text-white px-3 py-1.5 rounded-full border border-green-500/30 transition-all duration-200"
                                    >
                                        <div className="bg-green-500 p-1 rounded-full">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold max-w-[120px] truncate">{userName}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-2 border-b border-gray-50 mb-1 sm:hidden">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                                            </div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Log out
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
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
