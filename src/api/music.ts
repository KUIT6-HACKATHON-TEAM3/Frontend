// src/api/music.ts
import { http } from "./http";
import type { MusicRecommendationRequestDto, MusicRecommendationResponseDto } from "../dto/MusicRecommendationDto";

export const musicApi = {
  async recommend(body: MusicRecommendationRequestDto) {
    const { data } = await http.post<MusicRecommendationResponseDto>("/api/music/recommend", body);
    return data;
  },
};