import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== "undefined") {
                const isSchedulesRoute = window.location.pathname.startsWith("/schedules");
                const redirectTo = isSchedulesRoute ? "/login" : "/";
                
                if (window.location.pathname !== redirectTo) {
                    window.location.href = redirectTo;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
