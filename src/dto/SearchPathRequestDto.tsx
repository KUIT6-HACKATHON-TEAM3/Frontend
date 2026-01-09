import type { LatLng } from "../data/all_roads_walking_paths";

interface UserLocationDto {
    lat: number;
    lng: number;
}

export interface SearchPathRequestDto {
    user_location: UserLocationDto;
    pin_location: LatLng;
    added_time_req?: number;
}