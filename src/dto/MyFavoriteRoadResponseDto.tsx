interface FavoriteRoadDto {
    favorite_id: number;
    segment_id: number;
    road_name: string;
    created_at: string;
}

export interface MyFavoriteRoadResponseDto {
    statue: number;
    message: string;
    data: FavoriteRoadDto[]
}