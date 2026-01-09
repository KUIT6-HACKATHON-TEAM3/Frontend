import type { LatLng } from "../data/all_roads_walking_paths";

interface UserLocationDto {
    lat: number;
    lng: number;
}

export interface SearchPathRequestDto {
    userLocation: UserLocationDto;
    pinLocation: LatLng;
    addedTimeReq?: number;
}