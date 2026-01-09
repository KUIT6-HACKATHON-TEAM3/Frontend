import type { LatLng } from "../data/all_roads_walking_paths";

interface RoadInfoDto {
    segmentId: number;
    roadName: string;
    hasTrees: boolean;
    shadeRank: number;
    coordinates: LatLng[];
}

export interface RoadsNearbyResponseDto {
    status: number;
    message: string;
    data: RoadInfoDto[];
}

export interface RoadsNearbyRequestDto {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
    zoomLevel: number;
}