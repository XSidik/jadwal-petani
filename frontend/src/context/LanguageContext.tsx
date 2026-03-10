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
        exporting: "Exporting...",
        exported: "Exported",
        alreadyExported: "This schedule is already exported to Google Calendar.",

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
        deleting: "Deleting...",
        deletingDesc: "Please wait while we delete the data and sync with your Google Calendar.",
        exportingDesc: "Please wait while we sync your farming tasks to Google Calendar.",
        savingDesc: "Please wait while we save your changes and update the task.",
        editTask: "Edit Task",
        updateTaskDesc: "Update task details or mark as completed.",
        taskNameLabel: "Task Name",
        scheduledDateLabel: "Scheduled Date",
        completedLabel: "Completed",
        notCompletedLabel: "Not Completed",
        saving: "Saving...",
        saveChanges: "Save Changes",
        confirmDeleteTitle: "Delete Schedule?",
        confirmDelete: "Are you sure you want to delete this schedule? This will also remove all associated events from your Google Calendar.",
        delete: "Delete",
        cancel: "Cancel",
        exportSuccess: "Schedule successfully exported to Google Calendar!",
        deleteError: "Error deleting schedule",
        exportError: "Error exporting to calendar",
        createError: "Error creating schedule",
        updateError: "Error updating task",
        deleteSuccess: "Schedule successfully deleted!",
        updateSuccess: "Task successfully updated!",
        logoutSuccess: "You have been logged out.",
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
        welcome: "Welcome!",
        loginDesc: "Log in to start managing your planting schedule and integrate with Google Calendar.",
        loginWithGoogle: "Log in with Google",
        termsAgreement: "By logging in, you agree to our Terms of Service and Privacy Policy.",
        account: "Account",
        quickLinks: "Quick Links",
        home: "Home",
        aboutUs: "About Us",
        copyright: "All rights reserved.",
        madeInPart1: "Made with",
        madeInPart2: "in West Lampung",

        // Privacy Policy
        privacyTitle: "Privacy Policy",
        privacyLastUpdated: "Last updated: March 9, 2026",
        privacyIntro: "At Tech Petani, we are committed to protecting your privacy and ensuring your personal information is handled with care and transparency.",
        privacySec1Title: "Information We Collect",
        privacySec1Desc: "We collect information you provide directly to us when you log in via Google, such as your name, email address, and profile picture. We also collect data related to your farming schedules and tasks created on our platform.",
        privacySec2Title: "How We Use Your Information",
        privacySec2Desc: "Your information is used to provide and improve our services, including generating AI-powered planting schedules, syncing with your Google Calendar, and personalizing your user experience.",
        privacySec3Title: "Google Calendar Integration",
        privacySec3Desc: "When you choose to export your schedules, Tech Petani requests access to manage your Google Calendar events. We only create, edit, or delete events specifically related to the farming schedules you manage within our application.",
        privacySec4Title: "Data Retention & Security",
        privacySec4Desc: "We store your data securely and only for as long as necessary to provide our services. You can delete your account and associated data at any time through your account settings or by contacting us.",
        
        // Terms of Service
        termsTitle: "Terms of Service",
        termsLastUpdated: "Last updated: March 9, 2026",
        termsIntro: "By using Tech Petani, you agree to comply with the terms and conditions outlined below. Please read them carefully.",
        termsSec1Title: "Acceptance of Terms",
        termsSec1Desc: "Our platform is designed to provide farming schedule management. By accessing or using our services, you signify your full acceptance of these terms.",
        termsSec2Title: "User Responsibilities",
        termsSec2Desc: "You are responsible for the accuracy of information related to your farming tasks. We are not liable for any production loss resulting from the misapplication of AI-generated schedules.",
        termsSec3Title: "Authorized Access",
        termsSec3Desc: "You must only use the platform for lawful purposes. You are responsible for maintaining the confidentiality of your login credentials.",
        termsSec4Title: "Termination of Service",
        termsSec4Desc: "Tech Petani reserves the right to suspend or terminate access to our services if terms are violated or to protect the integrity of our platform.",
        
        backToHome: "Back to Home",
        aboutTitle: "About Us",
        aboutMission: "Our Mission",
        aboutMissionDesc: "Helping Indonesian farmers increase productivity through digital technology and artificial intelligence.",
        aboutVision: "Our Vision",
        aboutVisionDesc: "To become the leading platform for the modern agricultural ecosystem in Indonesia.",
        aboutStory: "Our Story",
        aboutStoryDesc: "Tech Petani was born from a desire to help traditional farmers transition to modern agriculture with easy-to-use tools."
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
        newSchedule: "Jadwal Baru",
        noSchedules: "Belum Ada Jadwal",
        noSchedulesDesc: "Buat jadwal bertani pertama Anda untuk mulai mengelola tanaman Anda dengan cerdas.",
        createFirst: "Buat Jadwal Pertama",
        plantedDate: "Ditanam",
        export: "Ekspor",
        exporting: "Mengekspor...",
        exported: "Terekspor",
        alreadyExported: "Jadwal ini sudah diekspor ke Google Calendar.",

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
        deleting: "Menghapus...",
        deletingDesc: "Mohon tunggu sementara kami menghapus data dan sinkronisasi dengan Google Calendar Anda.",
        exportingDesc: "Mohon tunggu sementara kami mensinkronkan tugas bertani ke Google Calendar Anda.",
        savingDesc: "Mohon tunggu sementara kami menyimpan perubahan dan memperbarui tugas.",
        editTask: "Edit Tugas",
        updateTaskDesc: "Perbarui detail tugas atau tandai sebagai selesai.",
        taskNameLabel: "Nama Tugas",
        scheduledDateLabel: "Tanggal Terjadwal",
        completedLabel: "Selesai",
        notCompletedLabel: "Belum Selesai",
        saving: "Menyimpan...",
        saveChanges: "Simpan Perubahan",
        confirmDeleteTitle: "Hapus Jadwal?",
        confirmDelete: "Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini juga akan menghapus semua acara terkait dari Google Calendar Anda.",
        delete: "Hapus",
        cancel: "Batal",
        exportSuccess: "Jadwal berhasil diekspor ke Google Calendar!",
        deleteError: "Gagal menghapus jadwal",
        exportError: "Gagal mengekspor ke kalender",
        createError: "Gagal membuat jadwal",
        updateError: "Gagal memperbarui tugas",
        deleteSuccess: "Jadwal berhasil dihapus!",
        updateSuccess: "Tugas berhasil diperbarui!",
        logoutSuccess: "Anda telah keluar dari akun.",
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
        mySchedules: "Jadwal Saya",
        logout: "Keluar",
        login: "Masuk",
        welcome: "Selamat Datang!",
        loginDesc: "Masuk untuk mulai mengelola jadwal tanam Anda dan integrasikan dengan Google Calendar.",
        loginWithGoogle: "Masuk dengan Google",
        termsAgreement: "Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.",
        account: "Akun",
        quickLinks: "Tautan Cepat",
        home: "Beranda",
        aboutUs: "Tentang Kami",
        copyright: "Hak cipta dilindungi undang-undang.",
        madeInPart1: "Dibuat dengan",
        madeInPart2: "di Lampung Barat",

        // Privacy Policy
        privacyTitle: "Kebijakan Privasi",
        privacyLastUpdated: "Terakhir diperbarui: 9 Maret 2026",
        privacyIntro: "Di Tech Petani, kami berkomitmen untuk melindungi privasi Anda dan memastikan informasi pribadi Anda ditangani dengan hati-hati dan transparan.",
        privacySec1Title: "Informasi yang Kami Kumpulkan",
        privacySec1Desc: "Kami mengumpulkan informasi yang Anda berikan langsung kepada kami saat login melalui Google, seperti nama, alamat email, dan foto profil Anda. Kami juga mengumpulkan data terkait jadwal dan tugas pertanian yang Anda buat di platform kami.",
        privacySec2Title: "Bagaimana Kami Menggunakan Informasi Anda",
        privacySec2Desc: "Informasi Anda digunakan untuk menyediakan dan meningkatkan layanan kami, termasuk pembuatan jadwal tanam berbasis AI, sinkronisasi dengan Google Calendar, dan personalisasi pengalaman pengguna Anda.",
        privacySec3Title: "Integrasi Google Calendar",
        privacySec3Desc: "Saat Anda memilih untuk mengekspor jadwal, Tech Petani meminta akses untuk mengelola acara Google Calendar Anda. Kami hanya membuat, mengedit, atau menghapus acara yang secara khusus terkait dengan jadwal pertanian yang Anda kelola di aplikasi kami.",
        privacySec4Title: "Retensi Data & Keamanan",
        privacySec4Desc: "Kami menyimpan data Anda dengan aman dan hanya selama diperlukan untuk menyediakan layanan kami. Anda dapat menghapus akun dan data terkait kapan saja melalui pengaturan akun atau dengan menghubungi kami.",

        // Terms of Service
        termsTitle: "Ketentuan Layanan",
        termsLastUpdated: "Terakhir diperbarui: 9 Maret 2026",
        termsIntro: "Dengan menggunakan Tech Petani, Anda setuju untuk mematuhi syarat dan ketentuan yang diuraikan di bawah ini. Harap baca dengan saksama.",
        termsSec1Title: "Penerimaan Ketentuan",
        termsSec1Desc: "Platform kami dirancang untuk menyediakan pengelolaan jadwal pertanian. Dengan mengakses atau menggunakan layanan kami, Anda menyatakan penerimaan penuh atas ketentuan ini.",
        termsSec2Title: "Tanggung Jawab Pengguna",
        termsSec2Desc: "Anda bertanggung jawab atas keakuratan informasi terkait tugas pertanian Anda. Kami tidak bertanggung jawab atas kerugian produksi sebagai akibat dari salah penggunaan jadwal yang dihasilkan AI.",
        termsSec3Title: "Akses Berwenang",
        termsSec3Desc: "Anda harus menggunakan platform hanya untuk tujuan yang sah. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial login Anda.",
        termsSec4Title: "Penghentian Layanan",
        termsSec4Desc: "Tech Petani berhak menangguhkan atau menghentikan akses ke layanan kami jika ketentuan dilanggar atau untuk melindungi integritas platform kami.",

        backToHome: "Kembali ke Beranda",
        aboutTitle: "Tentang Kami",
        aboutMission: "Misi Kami",
        aboutMissionDesc: "Membantu petani Indonesia meningkatkan produktivitas melalui teknologi digital dan kecerdasan buatan.",
        aboutVision: "Visi Kami",
        aboutVisionDesc: "Menjadi platform utama bagi ekosistem pertanian modern di Indonesia.",
        aboutStory: "Cerita Kami",
        aboutStoryDesc: "Tech Petani lahir dari keinginan untuk membantu petani tradisional beralih ke pertanian modern dengan alat yang mudah digunakan."
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
