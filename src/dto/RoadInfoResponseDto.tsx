interface EmotionDto {
    emoji: string;
    label: string;
}
interface RoadInfoDataDto {
    segment_id: number;
    road_name: string;
    emotions: EmotionDto[];
    total_like_count: number;
    is_liked: boolean;
}

export interface RoadInfoResponseDto {
    status: number;
    messsage: string;
    data: RoadInfoDataDto;
}