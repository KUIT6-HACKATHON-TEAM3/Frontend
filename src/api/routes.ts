// src/api/routes.ts
import { http } from "./http";
import type { SearchPathRequestDto } from "../dto/SearchPathRequestDto";
import type { SearchPathResponseDto } from "../dto/SearchPathResponseDto";

export const routesApi = {
  async search(body: SearchPathRequestDto) {
    const { data } = await http.post<SearchPathResponseDto>("/api/routes/search", body);
    return data;
  },
};