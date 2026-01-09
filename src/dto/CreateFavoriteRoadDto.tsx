interface FavoriteIdDto {
    favoriteId: number;
}

export interface CreateFavoriteRoadRequestDto {
    segmentId: number,
    roadName: string
}

export interface CreateFavoriteRoadResponseDto {
    status: number;
    message: string;
    data: FavoriteIdDto;
}