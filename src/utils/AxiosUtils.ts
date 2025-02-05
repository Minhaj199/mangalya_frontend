import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { handleAlert } from "./alert/SweeAlert";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKENT_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request Interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers["AuthorizationForAdmin"] = adminToken;
    }

    const userToken = localStorage.getItem("userToken");
    const refresh = localStorage.getItem("userRefresh");
    if (userToken) {
      config.headers["AuthForUser"] = userToken;
      if (refresh) {
        config.headers["RefreshAuthForUser"] = refresh;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.headers["authorizationforuser"]) {
      localStorage.setItem("userRefresh", response.headers["authorizationforuser"]);
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = { ...error.config, headers: { ...error.config.headers } };

    if (error.response?.status === 402 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers["AuthForUser"] = newToken;
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${import.meta.env.VITE_BACKENT_URL}/user/getNewToken`, {
          refresh: localStorage.getItem("userRefresh"),
        });
        if (data?.token) {
          localStorage.setItem("userToken", data.token);
          onTokenRefreshed(data.token);
          isRefreshing = false;
          originalRequest.headers["AuthForUser"] = data.token;
          return client(originalRequest);
        }
      } catch (error) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userRefresh");
        handleAlert("error", "Session expired. Please login again.");
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 405) {
      localStorage.removeItem("adminToken");
      handleAlert("info", "Admin session expired.");
      return Promise.reject(new Error("Admin token expired."));
    }

    return Promise.reject(new Error(error.response?.data?.message || error.message));
  }
);

export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  return await client(options);
};


