"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Inbox, CalendarPlus, Trash2, Edit, CheckCircle2, Clock, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Schedule } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchSchedules = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule`, { withCredentials: true });
            setSchedules(res.data);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSchedules();
        }
    }, [user]);

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}`, { withCredentials: true });
            setSchedules(schedules.filter(s => s.scheduleId !== id));
        } catch (err) {
            alert("Error deleting schedule");
        }
    };

    const handleExport = async (id: number) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}/export`, {}, { withCredentials: true });
            alert("Jadwal berhasil diekspor ke Google Calendar!");
        } catch (err) {
            alert("Error exporting to calendar");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!user) return <div className="text-center py-20">Please login to see your schedules.</div>;

    return (
        <div className="space-y-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <CalendarIcon className="w-8 h-8 mr-3 text-green-600" />
                    Jadwal Bertani Saya
                </h1>
                <Link href="/schedules/create" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center shadow-md">
                    <Plus className="w-5 h-5 mr-2" /> New Schedule
                </Link>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                    <Inbox className="w-16 h-16 text-gray-200 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700">Belum Ada Jadwal</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Buat jadwal bertani pertama Anda untuk mulai mengelola tanaman Anda dengan cerdas.</p>
                    <Link href="/schedules/create" className="inline-flex bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow-lg">
                        Buat Jadwal Pertama
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8">
                    {schedules.map((schedule) => (
                        <div key={schedule.scheduleId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-600 text-white px-6 py-5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{schedule.plantName}</h2>
                                    <p className="text-green-100 flex items-center mt-1">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Ditanam: {new Date(schedule.plantingDate).toLocaleDateString("id-ID", { dateStyle: "long" })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport(schedule.scheduleId)}
                                        className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition flex items-center text-sm font-semibold"
                                    >
                                        <CalendarPlus className="w-4 h-4 mr-2" /> Export
                                    </button>
                                    <button
                                        onClick={() => handleDelete(schedule.scheduleId)}
                                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-4 font-semibold text-gray-600 px-4">Tugas</th>
                                                <th className="pb-4 font-semibold text-gray-600 px-4">Deskripsi</th>
                                                <th className="pb-4 font-semibold text-gray-600 px-4">Tanggal</th>
                                                <th className="pb-4 font-semibold text-gray-600 px-4">Status</th>
                                                <th className="pb-4 font-semibold text-gray-600 px-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {schedule.tasks.map((task) => (
                                                <tr key={task.id} className={task.isCompleted ? "bg-green-50/50" : ""}>
                                                    <td className="py-4 px-4 font-medium text-gray-900">{task.taskName}</td>
                                                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{task.description}</td>
                                                    <td className="py-4 px-4 text-gray-600">
                                                        {new Date(task.scheduledDate).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {task.isCompleted ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                                <Clock className="w-3 h-3 mr-1" /> Menunggu
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <Link href={`/schedules/edit/${task.id}`} className="text-blue-600 hover:text-blue-800 transition">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
