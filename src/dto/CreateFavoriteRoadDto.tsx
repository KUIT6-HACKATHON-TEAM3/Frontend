interface FavoriteIdDto {
    favoriteId: number;
}


export interface CreateFavoriteRoadResponseDto {
    status: number;
    message: string;
    data: FavoriteIdDto;
}