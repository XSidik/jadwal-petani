"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { Calendar, ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import FullPageLoader from "@/components/FullPageLoader";

export default function EditTaskPage() {
    const { t } = useLanguage();
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/api/schedule/task/${id}`);
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

        if (!authLoading && !user) {
            router.push("/login");
        } else if (user && id) {
            fetchTask();
        }
    }, [user, id, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(
                `/api/schedule/task/${id}`,
                { id: Number(id), taskName, description, scheduledDate, isCompleted }
            );
            toast.success(t("updateSuccess") || "Task updated successfully");
            router.push("/schedules");
        } catch (err) {
            toast.error(t("updateError"));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || fetching || !user) return <div className="text-center py-20">{t("processing")}</div>;

    return (
        <div className="max-w-2xl mx-auto">
            {loading && <FullPageLoader message={t("saving")} subMessage={t("savingDesc")} />}
            <Link href="/schedules" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold mb-8 group transition-all">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> {t("backToList")}
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl shadow-green-100/50 dark:shadow-none border border-green-50 dark:border-gray-700 overflow-hidden">
                <div className="bg-green-600 dark:bg-green-700 p-6 sm:p-8 text-white">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("editTask")}</h1>
                    <p className="text-green-100 dark:text-green-200 text-sm sm:text-base">{t("updateTaskDesc")}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="taskName" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t("taskNameLabel")}
                            </label>
                            <input
                                id="taskName"
                                type="text"
                                required
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full px-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium text-base sm:text-lg text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t("description")}
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-base sm:text-lg text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="scheduledDate" className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" /> {t("scheduledDateLabel")}
                            </label>
                            <input
                                id="scheduledDate"
                                type="date"
                                required
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full h-12 sm:h-auto px-4 py-3 sm:py-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-base sm:text-lg text-gray-900 dark:text-gray-100"
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
                                    <div className={`w-12 sm:w-14 h-7 sm:h-8 rounded-full shadow-inner transition-colors ${isCompleted ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                    <div className={`absolute left-1 top-1 w-5 sm:w-6 h-5 sm:h-6 bg-white dark:bg-gray-200 rounded-full transition-transform shadow-md ${isCompleted ? 'translate-x-5 sm:translate-x-6' : ''}`}></div>
                                </div>
                                <div className="ml-4 flex items-center">
                                    <span className={`text-base sm:text-lg font-bold transition-colors ${isCompleted ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {isCompleted ? t("completedLabel") : t("notCompletedLabel")}
                                    </span>
                                    {isCompleted && <CheckCircle2 className="w-5 h-5 ml-2 text-green-500 dark:text-green-400" />}
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                {t("saving")}
                            </>
                        ) : (
                            <>
                                <Save className="mr-3 w-6 h-6" />
                                {t("saveChanges")}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
