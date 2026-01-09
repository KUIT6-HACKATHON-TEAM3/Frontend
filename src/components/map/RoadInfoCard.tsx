import emptyHeart from '@/assets/icons/empty-heart.svg';
import fullHeart from '@/assets/icons/full-heart.svg';
//import arrowUp from '@/assets/icons/arrow-up.svg'

interface Emoji {
    emoji: string;
    label: string;
}

interface Props {
    roadName: string,
    emotions: Emoji[],
    sectionName: string,
    isFavorite: boolean,
    onAddFavorite: () => void,
}

export default function RoadInfoCard({
    roadName,
    emotions = [{emoji: "✨", label:"야경맛집"}, {emoji:"👫", label:"데이트코스"}, {emoji: "🌳", label:"나무그늘"}, {emoji:"🐶", label:"댕댕이천국"}],
    sectionName,
    isFavorite,
    onAddFavorite,
}: Props) {
    return (
        <div className="bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 pb-8 w-full">
            {/* 헤더 영역 */}
            <div className="flex flex-row items-start justify-between mb-6">
                <div className='flex flex-col gap-1'>
                    <span className="inline-block px-2 py-1 bg-[#E8EADF] text-[#7A7E68] text-[11px] font-bold rounded w-fit">
                        추천 산책로
                    </span>
                    <h1 className='text-2xl font-bold leading-tight text-gray-800'>{roadName}</h1>
                    <h3 className='text-sm text-gray-500'>{sectionName} • 1.2km</h3>
                </div>

                <button className="transition-transform active:scale-95 hover:opacity-80" onClick={onAddFavorite}>
                    <img 
                        src={isFavorite ? fullHeart : emptyHeart} 
                        alt="찜하기" 
                        className="w-8 h-8"
                    />
                </button>
            </div>

            {/* 태그 영역 */}
            <div className="flex gap-2 pb-1 mb-6 overflow-x-auto scrollbar-hide">
                {emotions.map((e, i) => {
                    return (
                        <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg whitespace-nowrap">
                            <div>{e.emoji} {e.label}</div>
                        </span>
                    );
                })}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex gap-3">
                <button className="flex items-center justify-center flex-1 gap-2 py-4 text-sm font-bold text-gray-700 transition-colors bg-gray-50 rounded-2xl hover:bg-gray-100">
                    <span>🎵</span> {/* 음악 아이콘 대체 */}
                    BGM 추천
                </button>
            </div>
        </div>
    );
}