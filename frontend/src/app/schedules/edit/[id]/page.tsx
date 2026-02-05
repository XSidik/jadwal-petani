"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Calendar, ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EditTaskPage() {
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { user } = useAuth();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/task/${id}`, { withCredentials: true });
                const task = res.data;
                setTaskName(task.taskName);
                setDescription(task.description);
                setScheduledDate(task.scheduledDate.split("T")[0]);
                setIsCompleted(task.isCompleted);
            } catch (err) {
                console.error("Error fetching task:", err);
                router.push("/schedules");
            } finally {
                setFetching(false);
            }
        };

        if (user && id) {
            fetchTask();
        }
    }, [user, id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/task/${id}`,
                { taskName, description, scheduledDate, isCompleted },
                { withCredentials: true }
            );
            router.push("/schedules");
        } catch (err) {
            alert("Error updating task");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-20">Loading...</div>;
    if (!user) return <div className="text-center py-20">Please login to edit tasks.</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/schedules" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold mb-8 group transition-all">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Jadwal
            </Link>

            <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-50 overflow-hidden">
                <div className="bg-green-600 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Edit Tugas</h1>
                    <p className="text-green-100">Perbarui detail tugas atau tandai sebagai selesai.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="taskName" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Nama Tugas
                            </label>
                            <input
                                id="taskName"
                                type="text"
                                required
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="scheduledDate" className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-green-600" /> Tanggal Terjadwal
                            </label>
                            <input
                                id="scheduledDate"
                                type="date"
                                required
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={(e) => setIsCompleted(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-14 h-8 rounded-full shadow-inner transition-colors ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${isCompleted ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <div className="ml-4 flex items-center">
                                    <span className={`text-lg font-bold transition-colors ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                        {isCompleted ? "Selesai" : "Belum Selesai"}
                                    </span>
                                    {isCompleted && <CheckCircle2 className="w-5 h-5 ml-2 text-green-500" />}
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-3 w-6 h-6" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
