import type { LatLng } from "../data/all_roads_walking_paths";

interface RoadInfoDto {
    segment_id: number;
    road_name: string;
    has_trees: boolean;
    shade_rank: number;
    coordinates: LatLng[];
}

export interface RoadsNearbyResponseDto {
    status: number;
    message: string;
    data: RoadInfoDto[];
}

export interface RoadsNearbyRequestDto {
    min_lat: number;
    min_lng: number;
    max_lat: number;
    max_lng: number;
    zoom_level: number;
}