interface FavoriteIdDto {
    favorite_id: number;
}

export interface CreateFavoriteRoadRequestDto {
    segment_id: number,
    road_name: string
}

export interface CreateFavoriteRoadResponseDto {
    status: number;
    message: string;
    data: FavoriteIdDto;
}