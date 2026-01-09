import type { TagCode } from "../type/TagCode";

export interface CreateImojiTagRequestDto {
    user_id: number;
    tag_code: TagCode;
}