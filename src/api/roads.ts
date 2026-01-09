import { http } from "./http";
import type { RoadInfoResponseDto } from "../dto/RoadInfoResponseDto";
import type { RoadsNearbyRequestDto, RoadsNearbyResponseDto } from "../dto/RoadsNearbyResponseDto";

export const roadsApi = {
  async getDetail(segmentId: string | number) {
    const { data } = await http.get<RoadInfoResponseDto>(`/api/roads/${segmentId}`);
    return data;
  },

  async getNearby(params: RoadsNearbyRequestDto) {
    const { data } = await http.get<RoadsNearbyResponseDto>("/api/roads/nearby", { params });
    return data;
  },
};