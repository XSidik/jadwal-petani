"use client";

import { LogIn, Sprout, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/schedules");
        }
    }, [user, router]);

    return (
        <div className="max-w-md mx-auto py-20">
            <div className="bg-white rounded-3xl shadow-2xl shadow-green-100 border border-gray-100 overflow-hidden text-center p-10">
                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Sprout className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Selamat Datang!</h1>
                <p className="text-gray-600 mb-10 leading-relaxed">
                    Masuk untuk mulai mengelola jadwal tanam Anda dan integrasikan dengan Google Calendar.
                </p>

                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/account/google-login`}
                    className="w-full bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center group"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 mr-3" />
                    Masuk dengan Google
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <p className="mt-8 text-sm text-gray-400">
                    Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                </p>
            </div>
        </div>
    );
}
