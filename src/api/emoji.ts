import { http } from "./http";
import type { BasicResponseDto } from "../dto/BasicResponseDto";
import type { TagCode } from "../type/TagCode";

export type EmojiTagReq = {
    user_id: number;
    tag_code: TagCode;
};

export const emojiApi = {
  async addTag(roadId: string | number, body: EmojiTagReq) {
    const { data } = await http.post<BasicResponseDto>(`/api/emoji/${roadId}/tags`, body);
    return data;
  },
};