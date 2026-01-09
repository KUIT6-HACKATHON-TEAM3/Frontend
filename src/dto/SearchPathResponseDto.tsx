import type { LatLng } from "../data/all_roads_walking_paths";

interface FastestPathSummaryDto {
    actual_time: number;
    distance_meter: number;
}

interface AvenuePathSummaryDto {
    req_added_time: number;
    target_total_time: number;
    actual_time: number;
    distance_meter: number;
    display_msg: string;
}

interface FastestPathInfoDto {
    type: "FASTEST";
    summary: FastestPathSummaryDto;
    path: LatLng[]
}

interface AvenuePathInfoDto {
    type: "AVENUE";
    summary: AvenuePathSummaryDto;
    path: LatLng[]
}

interface PathRecommendationDto {
    fastest: FastestPathInfoDto;
    avenue: AvenuePathInfoDto;
}

export interface SearchPathResponseDto {
    status: number;
    message: string;
    data: PathRecommendationDto;
}