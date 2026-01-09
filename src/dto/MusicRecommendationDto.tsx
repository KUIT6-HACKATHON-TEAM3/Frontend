import type { TimeOfDay } from "../type/TimeOfDay";
import type { Weather } from "../type/Weather";

interface PlaylistInfoDto {
    theme_title: string;
    recommend_reason: string;
    playlist_url: string;
    thumbnail_url: string;
}

export interface MusiveRecommendationRequestDto {
    road_id: number;
    weather: Weather;
    time_of_day: TimeOfDay;
}

export interface MusicRecommendationResponseDto {
    status: number;
    data: PlaylistInfoDto;
}