import type { LatLng } from "../data/all_roads_walking_paths";

interface UserLocationDto {
    lat: number;
    lng: number;
}

interface RoadInfoDto {
    start: LatLng;
    end: LatLng;
}

export interface SearchPathRequestDto {
    user_location: UserLocationDto;
    target_type: string;
    road_info: RoadInfoDto;
    pin_location: LatLng;   // 맞나용
    added_time_req: number;
}