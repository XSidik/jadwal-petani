"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Sprout, Calendar, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FullPageLoader from "@/components/FullPageLoader";

export default function CreateSchedulePage() {
    const [plantName, setPlantName] = useState("");
    const [plantingDate, setPlantingDate] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
                { plantName, plantingDate },
                {
                    withCredentials: true,
                    transformResponse: [(data) => {
                        try {
                            return JSON.parse(data);
                        } catch (err) {
                            console.error("Failed to parse JSON response:", err);
                            console.log("Raw response data (first 500 chars):", data?.substring(0, 500));
                            console.log("Raw response data (last 500 chars):", data?.substring(data.length - 500));
                            console.log("Response length:", data?.length);
                            throw err;
                        }
                    }]
                }
            );
            router.push("/schedules");
        } catch (err: any) {
            console.error("Full error object:", err);
            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);
                console.error("Response headers:", err.response.headers);
            }
            alert(`Error creating schedule: ${err.message}. Check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-20">Please login to create a schedule.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            {loading && <FullPageLoader />}
            <Link href="/schedules" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold mb-8 group transition-all">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Jadwal
            </Link>

            <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-50 overflow-hidden">
                <div className="bg-green-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Sparkles className="w-16 h-16 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Buat Jadwal Baru</h1>
                    <p className="text-green-100">AI kami akan membantu membuat rencana tugas bertani yang optimal untuk Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="plantName" className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                <Sprout className="w-4 h-4 mr-2 text-green-600" /> Nama Tanaman
                            </label>
                            <input
                                id="plantName"
                                type="text"
                                required
                                value={plantName}
                                onChange={(e) => setPlantName(e.target.value)}
                                placeholder="Contoh: Cabe Rawit, Padi Gogo, dsb."
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="plantingDate" className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-green-600" /> Tanggal Tanam
                            </label>
                            <input
                                id="plantingDate"
                                type="date"
                                required
                                value={plantingDate}
                                onChange={(e) => setPlantingDate(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                Sedang Memproses...
                            </>
                        ) : (
                            <>
                                Generate Jadwal dengan AI
                                <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
