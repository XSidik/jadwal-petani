"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Inbox, CalendarPlus, Trash2, Edit, CheckCircle2, Clock, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Schedule } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SchedulesPage() {
    const { t } = useLanguage();
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
        if (!confirm(t("confirmDelete"))) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}`, { withCredentials: true });
            setSchedules(schedules.filter(s => s.scheduleId !== id));
        } catch (err) {
            alert(t("deleteError"));
        }
    };

    const handleExport = async (id: number) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/${id}/export`, {}, { withCredentials: true });
            alert(t("exportSuccess"));
        } catch (err) {
            alert(t("exportError"));
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!user) return <div className="text-center py-20">{t("loginRequiredList")}</div>;

    return (
        <div className="space-y-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                    <CalendarIcon className="w-8 h-8 mr-3 text-green-600 dark:text-green-500" />
                    {t("schedulesTitle")}
                </h1>
                <Link href="/schedules/create" className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition flex items-center shadow-md">
                    <Plus className="w-5 h-5 mr-2" /> {t("newSchedule")}
                </Link>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-16 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-4">
                    <Inbox className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t("noSchedules")}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{t("noSchedulesDesc")}</p>
                    <Link href="/schedules/create" className="inline-flex bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow-lg">
                        {t("createFirst")}
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8">
                    {schedules.map((schedule) => (
                        <div key={schedule.scheduleId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-600 dark:bg-green-700 text-white px-6 py-5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{schedule.plantName}</h2>
                                    <p className="text-green-100 dark:text-green-200 flex items-center mt-1">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        {t("plantedDate")}: {new Date(schedule.plantingDate).toLocaleDateString(t("langCode") === "en" ? "en-US" : "id-ID", { dateStyle: "long" })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport(schedule.scheduleId)}
                                        className="bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-white transition flex items-center text-sm font-semibold"
                                    >
                                        <CalendarPlus className="w-4 h-4 mr-2" /> {t("export")}
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
                                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                                <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 px-4">{t("task")}</th>
                                                <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 px-4">{t("description")}</th>
                                                <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 px-4">{t("date")}</th>
                                                <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 px-4">{t("status")}</th>
                                                <th className="pb-4 font-semibold text-gray-600 dark:text-gray-400 px-4 text-right">{t("action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                            {schedule.tasks.map((task) => (
                                                <tr key={task.id} className={task.isCompleted ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
                                                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">{task.taskName}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">{task.description}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                        {new Date(task.scheduledDate).toLocaleDateString(t("langCode") === "en" ? "en-US" : "id-ID", { dateStyle: "medium" })}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {task.isCompleted ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" /> {t("completed")}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                                                                <Clock className="w-3 h-3 mr-1" /> {t("waiting")}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <Link href={`/schedules/edit/${task.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition">
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
