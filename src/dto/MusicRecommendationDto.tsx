import type { TimeOfDay } from "../type/TimeOfDay";
import type { Weather } from "../type/Weather";

interface PlaylistInfoDto {
    themeTitle: string;
    recommendReason: string;
    playlistUrl: string;
    thumbnailUrl: string;
}

export interface MusicRecommendationRequestDto {
    roadId: number;
    weather: Weather;
    timeOfDay: TimeOfDay;
}

export interface MusicRecommendationResponseDto {
    status: number;
    data: PlaylistInfoDto;
}