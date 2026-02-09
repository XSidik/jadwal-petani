"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        // Hero Section
        heroBadge: "The Future of Indonesian Agriculture",
        heroTitle: "Manage Your Farming",
        heroTitleHighlight: "Smarter",
        heroDesc: "Optimize your harvest with AI-based planting schedules and seamless Google Calendar integration.",
        heroStart: "Get Started",
        heroLearn: "Learn More",

        // Features
        feat1Title: "AI-Powered Schedule",
        feat1Desc: "Get the best planting time recommendations based on plant types.",
        feat2Title: "Calendar Integration",
        feat2Desc: "Automatically export all task schedules to Google Calendar.",
        feat3Title: "Centralized Data",
        feat3Desc: "All history and planting plans are safely stored in one place.",

        // Stats
        statsFarmers: "Registered Farmers",
        statsSchedules: "Schedules Created",
        statsSatisfaction: "User Satisfaction",

        // Schedules Page
        schedulesTitle: "My Farming Schedules",
        newSchedule: "New Schedule",
        noSchedules: "No Schedules Yet",
        noSchedulesDesc: "Create your first farming schedule to start managing your plants smartly.",
        createFirst: "Create First Schedule",
        plantedDate: "Planted",
        export: "Export",

        // Table
        task: "Task",
        description: "Description",
        date: "Date",
        status: "Status",
        action: "Action",
        completed: "Completed",
        waiting: "Waiting",
        langCode: "en",

        // Create/Edit Page
        backToList: "Back to Schedule List",
        createNewSchedule: "Create New Schedule",
        aiDescription: "Our AI will help create an optimal farming task plan for you.",
        plantNameLabel: "Plant Name",
        plantNamePlaceholder: "Example: Chili, Rice, etc.",
        plantingDateLabel: "Planting Date",
        generateWithAI: "Generate Schedule with AI",
        processing: "Processing...",
        editTask: "Edit Task",
        updateTaskDesc: "Update task details or mark as completed.",
        taskNameLabel: "Task Name",
        scheduledDateLabel: "Scheduled Date",
        completedLabel: "Completed",
        notCompletedLabel: "Not Completed",
        saving: "Saving...",
        saveChanges: "Save Changes",
        confirmDelete: "Are you sure you want to delete this schedule?",
        exportSuccess: "Schedule successfully exported to Google Calendar!",
        deleteError: "Error deleting schedule",
        exportError: "Error exporting to calendar",
        createError: "Error creating schedule",
        updateError: "Error updating task",
        loginRequiredCreate: "Please login to create a schedule.",
        loginRequiredEdit: "Please login to edit tasks.",
        loginRequiredList: "Please login to see your schedules.",

        // Footer
        footerDesc: "Digital platform to help farmers manage planting schedules, monitor harvests, and increase Indonesian agricultural productivity.",
        contactUs: "Contact Us",
        address: "Modern Agriculture St. No. 123, South Jakarta, Indonesia",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",

        // Navbar
        mySchedules: "My Schedules",
        logout: "Log out",
        login: "Login",
        account: "Account"
    },
    id: {
        // Hero Section
        heroBadge: "Masa Depan Pertanian Indonesia",
        heroTitle: "Kelola Pertanian Anda",
        heroTitleHighlight: "Lebih Cerdas",
        heroDesc: "Optimalkan hasil panen dengan jadwal tanam berbasis AI dan integrasi Google Calendar yang mulus.",
        heroStart: "Mulai Sekarang",
        heroLearn: "Pelajari Lebih Lanjut",

        // Features
        feat1Title: "Jadwal Berbasis AI",
        feat1Desc: "Dapatkan rekomendasi waktu tanam terbaik berdasarkan jenis tanaman.",
        feat2Title: "Integrasi Calendar",
        feat2Desc: "Ekspor seluruh jadwal tugas ke Google Calendar secara otomatis.",
        feat3Title: "Data Terpusat",
        feat3Desc: "Semua riwayat dan rencana tanam tersimpan aman di satu tempat.",

        // Stats
        statsFarmers: "Petani Terdaftar",
        statsSchedules: "Jadwal Dibuat",
        statsSatisfaction: "Kepuasan Pengguna",

        // Schedules Page
        schedulesTitle: "Jadwal Bertani Saya",
        newSchedule: "New Schedule",
        noSchedules: "Belum Ada Jadwal",
        noSchedulesDesc: "Buat jadwal bertani pertama Anda untuk mulai mengelola tanaman Anda dengan cerdas.",
        createFirst: "Buat Jadwal Pertama",
        plantedDate: "Ditanam",
        export: "Export",

        // Table
        task: "Tugas",
        description: "Deskripsi",
        date: "Tanggal",
        status: "Status",
        action: "Aksi",
        completed: "Selesai",
        waiting: "Menunggu",
        langCode: "id",

        // Create/Edit Page
        backToList: "Kembali ke Daftar Jadwal",
        createNewSchedule: "Buat Jadwal Baru",
        aiDescription: "AI kami akan membantu membuat rencana tugas bertani yang optimal untuk Anda.",
        plantNameLabel: "Nama Tanaman",
        plantNamePlaceholder: "Contoh: Cabe Rawit, Padi Gogo, dsb.",
        plantingDateLabel: "Tanggal Tanam",
        generateWithAI: "Generate Jadwal dengan AI",
        processing: "Sedang Memproses...",
        editTask: "Edit Tugas",
        updateTaskDesc: "Perbarui detail tugas atau tandai sebagai selesai.",
        taskNameLabel: "Nama Tugas",
        scheduledDateLabel: "Tanggal Terjadwal",
        completedLabel: "Selesai",
        notCompletedLabel: "Belum Selesai",
        saving: "Menyimpan...",
        saveChanges: "Simpan Perubahan",
        confirmDelete: "Apakah Anda yakin ingin menghapus jadwal ini?",
        exportSuccess: "Jadwal berhasil diekspor ke Google Calendar!",
        deleteError: "Gagal menghapus jadwal",
        exportError: "Gagal mengekspor ke kalender",
        createError: "Gagal membuat jadwal",
        updateError: "Gagal memperbarui tugas",
        loginRequiredCreate: "Silakan login untuk membuat jadwal.",
        loginRequiredEdit: "Silakan login untuk mengedit tugas.",
        loginRequiredList: "Silakan login untuk melihat jadwal Anda.",

        // Footer
        footerDesc: "Platform digital untuk membantu petani mengelola jadwal tanam, memantau hasil panen, dan meningkatkan produktivitas pertanian Indonesia.",
        contactUs: "Hubungi Kami",
        address: "Jl. Pertanian Modern No. 123, Jakarta Selatan, Indonesia",
        privacyPolicy: "Kebijakan Privasi",
        termsOfService: "Ketentuan Layanan",
        cookiePolicy: "Kebijakan Cookie",

        // Navbar
        mySchedules: "My Schedules",
        logout: "Log out",
        login: "Login",
        account: "Account"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("id");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language | null;
        if (savedLang) {
            setLanguage(savedLang);
        }
        setMounted(true);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "id" ? "en" : "id";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    const t = (key: string): string => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
