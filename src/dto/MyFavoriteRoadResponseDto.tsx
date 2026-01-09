interface FavoriteRoadDto {
    favoriteId: number;
    segmentId: number;
    roadName: string;
    createdAst: string;
}

export interface MyFavoriteRoadResponseDto {
    statue: number;
    message: string;
    data: FavoriteRoadDto[]
}