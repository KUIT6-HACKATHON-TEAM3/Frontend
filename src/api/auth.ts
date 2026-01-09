import { http, tokenStorage } from "./http"

// ---- Request/Response 타입(서버 스펙에 맞게 수정) ----
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
  refresh_token: string; // 서버는 snake_case로 응답
  // accessToken은 쿠키로 전달됨
  // user?: {...}
};

export type SendEmailCodeReq = { email: string };
export type VerifyEmailCodeReq = { email: string; code: string };

export const authApi = {
  async signup(body: SignupReq) {
    const { data } = await http.post("/api/auth/signup", body);
    return data;
  },

  async login(body: LoginReq) {
    const { data } = await http.post<AuthRes>("/api/auth/login", body);
    // accessToken은 쿠키로 자동 저장됨
    tokenStorage.setRefreshToken(data.refresh_token);
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
    // accessToken은 쿠키로 자동 저장됨
    tokenStorage.setRefreshToken(data.refresh_token);
    return data;
  },

  logout() {
    tokenStorage.clear();
  },
};