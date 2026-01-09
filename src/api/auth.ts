import { http, tokenStorage } from "./http";

export type SignupReq = {
  email: string;
  password: string;
  nickname: string;
};

export type LoginReq = {
  email: string;
  password: string;
};

export type AuthRes = {
  status: number;
  message: string;
  data: {
    refreshToken: string;
    nickname: string;
  }
};

export type SendEmailCodeReq = { email: string };
export type VerifyEmailCodeReq = { email: string; code: string };

export const authApi = {
  async signup(body: SignupReq) {

    const { data } = await http.post("/api/auth/signup", body, {
      withCredentials: false
    });
    return data;
  },

  async login(body: LoginReq) {
    const { data } = await http.post<AuthRes>("/api/auth/login", body);
    console.log("Login response:", data);
    console.log("Refresh token:", data.data?.refreshToken);
    // accessToken은 쿠키로 자동 저장됨
    tokenStorage.setRefreshToken(data.data.refreshToken);
    return data;
  },

  async sendEmailCode(body: SendEmailCodeReq) {
    const { data } = await http.post("/api/auth/send", body);
    return data;
  },

  async verifyEmailCode(body: VerifyEmailCodeReq) {
    const { data } = await http.post("/api/auth/verify", body);
    return data;
  },

  async reissue(refreshToken: string) {
    const { data } = await http.post<AuthRes>("/api/auth/reissue", { refreshToken });
    tokenStorage.setRefreshToken(data.data.refreshToken);
    return data;
  },

  logout() {
    tokenStorage.clear();
  },
};