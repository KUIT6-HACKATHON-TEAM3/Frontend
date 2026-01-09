interface RoadInfoDataDto {
    segmen_id: number;
    road_name: string;
    total_like_count: number;
    is_liked: boolean;
}

export interface RoadInfoResponseDto {
    status: number;
    messsage: string;
    data: RoadInfoDataDto;
}