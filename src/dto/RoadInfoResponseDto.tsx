interface EmotionDto {
    emoji: string;
    label: string;
}
interface RoadInfoDataDto {
    segmentId: number;
    roadName: string;
    emotions: EmotionDto[];
    totalLikeCount: number;
    isLiked: boolean;
}

export interface RoadInfoResponseDto {
    status: number;
    messsage: string;
    data: RoadInfoDataDto;
}