import type { TagCode } from "../type/TagCode";

interface TagInfoDto {
    code: TagCode;
    label: string;
    emoji: string;
    count: number;
}

interface RoadDataDto {
    road_id: number;
    total_count: number;
    my_selection: TagCode;
    stats: TagInfoDto[];
}

export interface ImojiTagStatsResponseDto {
    status: number;
    data: RoadDataDto;
}