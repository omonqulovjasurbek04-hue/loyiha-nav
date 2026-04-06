import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config: AxiosRequestConfig | any) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("Refresh token yo'q");

        const { data } = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newToken = data.data.access_token;
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", data.data.refresh_token);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      return Promise.reject(new Error("Internet aloqasi yo'q"));
    }

    const errorMessages: Record<number, string> = {
      400: error.response.data?.error?.message || "Noto'g'ri so'rov",
      403: "Bu amalni bajarish uchun ruxsat yo'q",
      404: "Ma'lumot topilmadi",
      429: "Ko'p so'rov. Biroz kutib turing",
      500: "Server xatosi. Qayta urining",
      502: "Server vaqtincha ishlamayapti",
      503: "Xizmat vaqtincha mavjud emas",
    };

    const message =
      errorMessages[error.response.status] ||
      error.response.data?.error?.message ||
      "Noma'lum xatolik";

    return Promise.reject(new Error(message));
  },
);

export default api;
