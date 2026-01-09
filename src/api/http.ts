import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type ReissueResponse = {
  refresh_token: string;
};

const tokenStorage = {
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },
  setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
  },
  clear() {
    localStorage.removeItem("refreshToken");
  },
};

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---- 토큰 재발급(동시성 제어) ----
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function onRefreshed(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function reissueToken(): Promise<ReissueResponse> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post<ReissueResponse>(
    `${BASE_URL}/api/auth/reissue`,
    { refreshToken },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true // 쿠키 포함
    }
  );

  return res.data;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // 401 처리 (재발급)
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      // 이미 재발급 중이면 큐에 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) return reject(error);
            resolve(http(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const response = await reissueToken();
        tokenStorage.setRefreshToken(response.refresh_token);

        onRefreshed("success");

        return http(original);
      } catch (e) {
        tokenStorage.clear();
        onRefreshed(null);
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export { tokenStorage };