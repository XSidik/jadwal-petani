"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Inbox, CalendarPlus, Trash2, Edit, CheckCircle2, Clock, CalendarIcon, ChevronDown, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Schedule } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";
import FullPageLoader from "@/components/FullPageLoader";

export default function SchedulesPage() {
    const { t } = useLanguage();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [fetching, setFetching] = useState(true);
    const { user, loading } = useAuth();
    const router = useRouter();
    const [expandedSchedules, setExpandedSchedules] = useState<number[]>([]);
    const [exportingId, setExportingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSchedule = (id: number) => {
        setExpandedSchedules(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const fetchSchedules = async () => {
        try {
            const res = await api.get("/api/schedule");
            setSchedules(res.data);
            // Default to expanding the first schedule if no expansion state exists
            if (res.data.length > 0 && expandedSchedules.length === 0) {
                setExpandedSchedules([res.data[0].scheduleId]);
            }
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchSchedules();
        }
    }, [user, loading, router]);

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            await api.delete(`/api/schedule/${deletingId}`);
            setSchedules(schedules.filter(s => s.scheduleId !== deletingId));
            toast.success(t("deleteSuccess") || "Schedule deleted");
            setIsDeleteModalOpen(false);
        } catch (err) {
            toast.error(t("deleteError"));
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    const handleExport = async (id: number) => {
        setExportingId(id);
        try {
            await api.post(`/api/schedule/${id}/export`, {});
            toast.success(t("exportSuccess"));
            await fetchSchedules();
        } catch (err: any) {
            const message = err.response?.data?.message || t("exportError");
            toast.error(message);
        } finally {
            setExportingId(null);
        }
    };

    if (loading || fetching || !user) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="space-y-6 sm:space-y-8">
            {isDeleting && <FullPageLoader message={t("deleting")} subMessage={t("deletingDesc")} />}
            {exportingId !== null && <FullPageLoader message={t("exporting")} subMessage={t("exportingDesc")} />}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                    <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-600 dark:text-green-500" />
                    {t("schedulesTitle")}
                </h1>
                <Link href="/schedules/create" className="bg-green-600 dark:bg-green-700 text-white px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl sm:rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition flex items-center justify-center shadow-md font-bold sm:font-normal">
                    <Plus className="w-5 h-5 mr-2" /> {t("newSchedule")}
                </Link>
            </div>

            {schedules.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 sm:p-16 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-4">
                    <Inbox className="w-12 h-12 sm:w-16 sm:h-16 text-gray-200 dark:text-gray-700 mx-auto" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">{t("noSchedules")}</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm sm:base">{t("noSchedulesDesc")}</p>
                    <Link href="/schedules/create" className="inline-flex bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition shadow-lg w-full sm:w-auto justify-center">
                        {t("createFirst")}
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:gap-8">
                    {schedules.map((schedule) => (
                        <div key={schedule.scheduleId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-600 dark:bg-green-700 text-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center group cursor-pointer" onClick={() => toggleSchedule(schedule.scheduleId)}>
                                    <div className="mr-3 p-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                        {expandedSchedules.includes(schedule.scheduleId) ? (
                                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold capitalize">{schedule.plantName}</h2>
                                        <p className="text-green-100 dark:text-green-200 flex items-center mt-1 text-sm sm:text-base">
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            {t("plantedDate")}: {new Date(schedule.plantingDate).toLocaleDateString(t("langCode") === "en" ? "en-US" : "id-ID", { dateStyle: "long" })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:gap-2">
                                    {(() => {
                                        const isExported = schedule.tasks.some(t => !!t.eventId);
                                        return (
                                            <button
                                                onClick={() => handleExport(schedule.scheduleId)}
                                                disabled={exportingId === schedule.scheduleId || isExported}
                                                className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-lg transition flex items-center text-xs sm:text-sm font-bold sm:font-semibold disabled:opacity-70 disabled:cursor-not-allowed ${isExported
                                                    ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                                    : "bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 hover:bg-green-50 dark:hover:bg-white"
                                                    }`}
                                            >
                                                {exportingId === schedule.scheduleId ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("exporting")}
                                                    </>
                                                ) : isExported ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> {t("exported")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CalendarPlus className="w-4 h-4 mr-2" /> {t("export")}
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })()}
                                    <button
                                        onClick={() => handleDeleteClick(schedule.scheduleId)}
                                        className="bg-red-500 text-white p-2 sm:p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center aspect-square"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {expandedSchedules.includes(schedule.scheduleId) && (
                                <div className="p-0 sm:p-6 transition-all duration-300 origin-top">
                                    {/* Desktop Tablet View */}
                                    <div className="hidden sm:block overflow-x-auto">
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
                                                            <Link href={`/schedules/edit/${task.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition inline-block p-1">
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View (Cards) */}
                                    <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                        {schedule.tasks.map((task) => (
                                            <div key={task.id} className={`p-4 flex flex-col gap-3 ${task.isCompleted ? "bg-green-50/30 dark:bg-green-900/10" : "bg-white dark:bg-gray-800"}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{task.taskName}</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                            <CalendarIcon className="w-3 h-3 mr-1" />
                                                            {new Date(task.scheduledDate).toLocaleDateString(t("langCode") === "en" ? "en-US" : "id-ID", { dateStyle: "medium" })}
                                                        </p>
                                                    </div>
                                                    <Link href={`/schedules/edit/${task.id}`} className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </div>

                                                {task.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 dark:border-gray-700 pl-3 py-0.5">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-1">
                                                    {task.isCompleted ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {t("completed")}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                                                            <Clock className="w-3.5 h-3.5 mr-1.5" /> {t("waiting")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={t("confirmDeleteTitle") || "Hapus Jadwal?"}
                message={t("confirmDelete")}
                confirmText={t("delete") || "Hapus"}
                cancelText={t("cancel") || "Batal"}
                isLoading={isDeleting}
            />
        </div>
    );
}
