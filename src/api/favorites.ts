import { http } from "./http";
import type { CreateFavoriteRoadRequestDto, CreateFavoriteRoadResponseDto } from "../dto/CreateFavoriteRoadDto";
import type { MyFavoriteRoadResponseDto } from "../dto/MyFavoriteRoadResponseDto";
import type { DeleteFavoriteRoadResponseDto } from "../dto/DeleteFavoriteRoadResponseDto";

export const favoritesApi = {
  async add(body: CreateFavoriteRoadRequestDto) {
    const { data } = await http.post<CreateFavoriteRoadResponseDto>("/api/favorites", body, {
      withCredentials: false
    });
    return data;
  },

  async list() {
    const { data } = await http.get<MyFavoriteRoadResponseDto>("/api/favorites");
    return data;
  },

  async remove(favoriteId: string | number) {
    const { data } = await http.delete<DeleteFavoriteRoadResponseDto>(`/api/favorites/${favoriteId}`);
    return data;
  },
};