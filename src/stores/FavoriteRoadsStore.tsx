import { create } from "zustand";
import { favoritesApi } from "../api/favorites";

interface FavoriteRoadDto {
    favorite_id: number;
    segment_id: number;
    road_name: string;
    created_at: string;
}

interface FavoriteRoadsStore {
    favorites: FavoriteRoadDto[];
    isLoading: boolean;
    error: string | null;

    // API 연결된 액션들
    loadFavorites: () => Promise<void>;
    addFavorite: (segmentId: number, roadName: string) => Promise<void>;
    removeFavorite: (favoriteId: number) => Promise<void>;
    removeFavoriteBySegmentId: (segmentId: number) => Promise<void>;

    // 유틸리티
    isFavorite: (segmentId: number) => boolean;
    getFavoriteId: (segmentId: number) => number | null;
    clearError: () => void;
}

const useFavoriteRoadsStore = create<FavoriteRoadsStore>((set, get) => ({
    favorites: [],
    isLoading: false,
    error: null,

    loadFavorites: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await favoritesApi.list();
            set({ favorites: result.data, isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : '즐겨찾기 목록을 불러오는데 실패했습니다',
                isLoading: false
            });
        }
    },

    addFavorite: async (segmentId: number, roadName: string) => {
        // 이미 즐겨찾기된 경우 중복 방지
        if (get().isFavorite(segmentId)) {
            return;
        }

        set({ error: null });
        try {
            const result = await favoritesApi.add({
                segment_id: segmentId,
                road_name: roadName
            });

            // 낙관적 업데이트: 새로운 즐겨찾기 추가
            const newFavorite: FavoriteRoadDto = {
                favorite_id: result.data.favorite_id,
                segment_id: segmentId,
                road_name: roadName,
                created_at: new Date().toISOString()
            };

            set(state => ({
                favorites: [...state.favorites, newFavorite]
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : '즐겨찾기 추가에 실패했습니다'
            });
            throw err; // 호출하는 쪽에서 에러 처리 가능하도록
        }
    },

    removeFavorite: async (favoriteId: number) => {
        set({ error: null });

        // 낙관적 업데이트를 위해 이전 상태 저장
        const previousFavorites = get().favorites;

        // 즉시 UI에서 제거
        set(state => ({
            favorites: state.favorites.filter(f => f.favorite_id !== favoriteId)
        }));

        try {
            await favoritesApi.remove(favoriteId);
        } catch (err) {
            // 실패 시 이전 상태로 복구
            set({
                favorites: previousFavorites,
                error: err instanceof Error ? err.message : '즐겨찾기 삭제에 실패했습니다'
            });
            throw err;
        }
    },

    removeFavoriteBySegmentId: async (segmentId: number) => {
        const favoriteId = get().getFavoriteId(segmentId);
        if (favoriteId === null) {
            return;
        }
        await get().removeFavorite(favoriteId);
    },

    isFavorite: (segmentId: number) => {
        return get().favorites.some(f => f.segment_id === segmentId);
    },

    getFavoriteId: (segmentId: number) => {
        const favorite = get().favorites.find(f => f.segment_id === segmentId);
        return favorite ? favorite.favorite_id : null;
    },

    clearError: () => {
        set({ error: null });
    }
}));

export default useFavoriteRoadsStore;
