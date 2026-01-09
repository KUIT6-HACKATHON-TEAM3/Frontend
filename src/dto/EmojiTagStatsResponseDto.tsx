import type { TagCode } from "../type/TagCode";

interface TagInfoDto {
    code: TagCode;
    label: string;
    emoji: string;
    count: number;
}

interface RoadDataDto {
    roadId: number;
    totalCount: number;
    mySelection: TagCode;
    stats: TagInfoDto[];
}

export interface ImojiTagStatsResponseDto {
    status: number;
    data: RoadDataDto;
}