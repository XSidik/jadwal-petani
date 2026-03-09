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
                const path = window.location.pathname;
                const publicPages = ["/", "/privacy", "/terms", "/login"];
                if (publicPages.includes(path)) {
                    return Promise.reject(error);
                }

                const isSchedulesRoute = path.startsWith("/schedules");
                const redirectTo = isSchedulesRoute ? "/login" : "/";

                if (path !== redirectTo) {
                    window.location.href = redirectTo;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
