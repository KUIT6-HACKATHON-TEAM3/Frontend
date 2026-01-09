import type { LatLng } from "../data/all_roads_walking_paths";

interface FastestPathSummaryDto {
    actualTime: number;
    distanceMeter: number;
}

interface AvenuePathSummaryDto {
    reqAddedTime: number;
    targetTotalTime: number;
    actualTime: number;
    distanceMeter: number;
    displayMsg: string;
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