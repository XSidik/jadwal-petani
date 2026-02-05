"use client";

import { Loader2, Sparkles } from "lucide-react";

interface FullPageLoaderProps {
    message?: string;
    subMessage?: string;
}

export default function FullPageLoader({
    message = "Sedang Memproses...",
    subMessage = "AI kami sedang menyusun jadwal terbaik untuk Anda. Mohon tunggu sebentar."
}: FullPageLoaderProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-green-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-green-100 flex flex-col items-center max-w-sm text-center transform animate-in zoom-in-95 duration-300">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-green-100 p-6 rounded-full">
                        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-white p-2 rounded-full shadow-sm">
                        <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{message}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                    {subMessage}
                </p>

                <div className="mt-8 flex gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
