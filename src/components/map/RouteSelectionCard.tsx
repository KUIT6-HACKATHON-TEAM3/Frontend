import { motion } from "framer-motion";

interface Props {
  onBack: () => void; // 뒤로가기 버튼 눌렀을 때 실행할 함수
  onSelectRoute: (type: 'MIN' | 'LEISURE') => void; // (나중에 쓸 것) 경로 선택 시 함수
}

export default function RouteSelectionCard({ onBack, onSelectRoute }: Props) {
  return (
    <motion.div
      className="flex flex-col h-full p-6 bg-[#4A4A4A]/5 relative overflow-y-auto"
    >
      {/* 1. 상단 헤더 (뒤로가기) */}
      <div className="flex items-center mt-4 mb-6">
        <h2 className="text-xl font-bold text-gray-700">출발/도착 설정</h2>
      </div>

      {/* 2. 옵션 목록 */}
      <div className="flex flex-col gap-4 pb-10">
        
        {/* 옵션 A: 최소길 */}
        <div 
          onClick={() => onSelectRoute('MIN')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-transparent cursor-pointer active:scale-[0.98] transition-all hover:border-[#B4B998]/50"
        >
          <div className="w-10 h-10 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-3 text-[#B4B998]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-800">최소길</h3>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-sm font-medium text-gray-400">걸리는 시간</span>
            <span className="text-2xl font-bold text-gray-700">10분</span>
          </div>
          <div className="flex items-center text-sm font-bold text-[#B4B998]">
            시작하기 <span className="ml-1">→</span>
          </div>
        </div>

        {/* 옵션 B: 여유길 */}
        <div 
           onClick={() => onSelectRoute('LEISURE')}
           className="bg-white rounded-2xl p-6 shadow-sm border border-transparent cursor-pointer active:scale-[0.98] transition-all hover:border-[#B4B998]/50"
        >
          <div className="w-10 h-10 bg-[#F4F9F1] rounded-full flex items-center justify-center mb-3 text-[#B4B998]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-800">여유길</h3>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-sm font-medium text-gray-400">걸리는 시간</span>
            <span className="text-2xl font-bold text-gray-700">10~분</span>
          </div>
          <div className="flex items-center text-sm font-bold text-[#B4B998]">
            시작하기 <span className="ml-1">→</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}