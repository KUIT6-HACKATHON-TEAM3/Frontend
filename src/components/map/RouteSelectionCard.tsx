import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onBack: () => void;
  minTime: number | null; 
  onSelectRoute: (addedTime?: number) => void;
}

export default function RouteSelectionCard({ minTime, onSelectRoute }: Props) {
  // 기본 추가 시간 10분
  const [extraTime, setExtraTime] = useState(10);
  
  // 스크롤 컨테이너 참조
  const scrollRef = useRef<HTMLDivElement>(null);

  // +5분 단위로 12개 옵션 생성 (5 ~ 60분)
  const timeOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
  const ITEM_HEIGHT = 40; // 각 시간 항목의 높이 (px)

  // 스크롤 이벤트 핸들러: 가운데 위치한 아이템 계산
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollTop = scrollRef.current.scrollTop;
    // 현재 스크롤 위치를 아이템 높이로 나누어 인덱스 계산 (반올림)
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    
    // 범위를 벗어나지 않게 안전장치
    if (index >= 0 && index < timeOptions.length) {
      setExtraTime(timeOptions[index]);
    }
  };

  return (
    <motion.div className="flex flex-col h-full px-6 pb-6 bg-[#4A4A4A]/5 relative overflow-y-auto scrollbar-hide">
      {/* 상단 헤더 */}
      <div className="flex items-center mt-4 mb-6"> 
        <h2 className="text-xl font-bold text-gray-700">출발/도착 설정</h2>
      </div>

      <div className="flex flex-col gap-4 pb-10">
        
        {/* 옵션 A: 최소길 */}
        <div 
          onClick={() => onSelectRoute(0)}
          className="bg-white rounded-2xl p-6 shadow-sm border border-transparent cursor-pointer active:scale-[0.99] transition-all hover:border-[#B4B998]/50 group"
        >
          <div className="w-10 h-10 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-3 text-[#B4B998] group-hover:bg-[#B4B998] group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-800">최소길</h3>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-sm font-medium text-gray-400">예상 소요시간</span>
            <span className="text-2xl font-bold text-gray-700">{minTime}분</span>
          </div>
          <div className="flex items-center text-sm font-bold text-[#B4B998]">
            시작하기 <span className="ml-1">→</span>
          </div>
        </div>

        {/* 옵션 B: 여유길 (수직 휠 피커 적용) */}
        <div 
           // 여기선 카드 전체 클릭 이벤트를 제거하고, 하단 버튼으로 명확히 분리하거나
           // 컨테이너 클릭 시에만 작동하도록 합니다.
           className="relative bg-white border border-transparent shadow-sm rounded-2xl p-6 hover:border-[#B4B998]/50 transition-all"
        >
          <div className="w-10 h-10 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-3 text-[#B4B998]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          
          <h3 className="mb-1 text-lg font-bold text-gray-800">여유길</h3>
          
          <div className="flex items-end gap-1 mb-6">
            <span className="text-sm font-medium text-gray-400">예상 소요시간</span>
            <span className="text-2xl font-bold text-gray-700">
               {minTime}<span className="text-lg font-medium text-gray-400">분</span> + {extraTime}<span className="text-lg font-medium text-[#B4B998]">분</span>
            </span>
          </div>

          {/* ★ 수직 휠 피커 영역 */}
          <div className="relative w-full mb-6 overflow-hidden bg-gray-50 rounded-xl h-28">
            {/* 가운데 강조선 (선택 영역 표시) */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[40px] bg-[#B4B998]/10 border-y border-[#B4B998]/30 pointer-events-none z-10" />
            
            {/* 스크롤 리스트 */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide py-[52px]" // padding으로 첫/끝 아이템 센터링
            >
                {timeOptions.map((time) => (
                    <div 
                        key={time} 
                        className={`
                            h-[40px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer
                            ${extraTime === time ? "font-bold text-[#B4B998] text-xl scale-110" : "text-gray-400 text-sm"}
                        `}
                        // 클릭하면 해당 위치로 스크롤 이동 (선택 사항)
                        onClick={(e) => {
                             e.stopPropagation();
                             if(scrollRef.current) {
                                 // 해당 아이템의 인덱스 찾아서 스크롤 이동
                                 const idx = timeOptions.indexOf(time);
                                 scrollRef.current.scrollTo({
                                     top: idx * ITEM_HEIGHT,
                                     behavior: 'smooth'
                                 });
                             }
                        }}
                    >
                        +{time}분
                    </div>
                ))}
            </div>
          </div>

          {/* 버튼 영역: 사용자가 시간을 고르고 명확하게 누를 수 있도록 분리 */}
          <button
            onClick={() => onSelectRoute(extraTime)}
            className="w-full py-3 bg-[#B4B998] text-white font-bold rounded-xl shadow-md hover:bg-[#A3A889] transition-colors flex items-center justify-center"
          >
            이 시간으로 시작하기 <span className="ml-1">→</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}