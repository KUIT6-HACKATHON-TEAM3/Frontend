import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leftArrow from '@/assets/icons/green-arrow-left.svg';

export default function Feedback() {
    const navigate = useNavigate();
    
    // 선택된 태그의 'id'를 관리하는 State
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 태그 목록 (SVG 크기를 부모에 맞추기 위해 width/height 속성 제거 또는 조정)
    const tags = [
        {
            id: 'shade',
            label: '나무그늘',
            // 아이콘: 부모 div(48px)에 맞춰 꽉 차게 설정 (w-full h-full)
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8z"></path><path d="M12 10l4 4-4 4-4-4 4-4z"></path></svg>
        },
        {
            id: 'comfortable',
            label: '걷기편함',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.47 14.47a2 2 0 0 1 0-2.83L16.12 10l1.41 1.41-1.65 1.65a2 2 0 0 1-2.82 0z"></path><path d="M9.53 19.53a2 2 0 0 1-2.83 0L5.06 17.88 6.47 16.47l1.65 1.65a2 2 0 0 1 0 2.82z"></path></svg>
        },
        {
            id: 'quiet',
            label: '한적해요',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
        },
        {
            id: 'nightview',
            label: '야경맛집',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        },
        {
            id: 'datecourse',
            label: '데이트코스',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        },
        {
            id: 'alone',
            label: '혼걸음',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
        },
        {
            id: 'photo',
            label: '인생샷',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        },
        {
            id: 'pet',
            label: '댕댕이천국',
            icon: <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="19" cy="7" r="2.5"></circle><circle cx="5" cy="7" r="2.5"></circle><circle cx="19" cy="17" r="2.5"></circle><circle cx="5" cy="17" r="2.5"></circle></svg>
        }
    ];

    const toggleTag = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    const handleSubmit = () => {
        console.log("선택된 피드백 ID:", selectedTags);
        alert("피드백이 전송되었습니다!");
        navigate("/");
    };

    return (
        <div className="flex flex-col min-h-screen px-6 pt-8 bg-primary-100">
            {/* 헤더 & 메인 텍스트 */}
            <div className='relative flex items-center justify-center mb-8'>
                <button 
                    onClick={() => navigate(-1)}
                    className='absolute left-0 p-2 -ml-2'
                >
                    <img src={leftArrow} alt="뒤로가기" className="w-6 h-6"/>
                </button>
                <h1 className='text-lg font-bold text-gray-800'>피드백</h1>
            </div>

            <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    여유로운 산책을 마쳤어요
                </h2>
                <p className="text-gray-600">
                    오늘 걸었던 길은 마음에 드셨나요?
                </p>
            </div>

            {/* 좋았던 점 선택 (Grid) */}
            <div className="flex-1 w-full">
                {/* ★ 수정: 컨테이너 너비를 제한(max-w-[320px])하고 중앙 정렬(mx-auto)하여 버튼들을 모음 */}
                <div className="max-w-[320px] mx-auto">
                    <h3 className="mb-4 text-sm font-bold text-gray-800">좋았던 점</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={`
                                        aspect-[4/3] rounded-2xl transition-all shadow-sm
                                        flex flex-col items-center justify-center gap-3 p-4
                                        ${isSelected 
                                            ? "bg-[#EBE5DD] text-[#3D3D3D] border-2 border-[#EBE5DD]" 
                                            : "bg-white text-gray-500 border border-transparent hover:border-primary-900 hover:text-gray-900" 
                                        }
                                    `}
                                >
                                    {/* ★ 수정: 아이콘 크기를 w-12 h-12 (48px)로 키움 */}
                                    <div className={`w-12 h-12 transition-colors ${isSelected ? 'text-[#3D3D3D]' : 'text-gray-400'}`}>
                                        {tag.icon}
                                    </div>
                                    
                                    {/* 글씨는 작게 유지 */}
                                    <span className="text-xs font-bold">{tag.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 전송 버튼 */}
            <div className='pb-8 mt-8'>
                <button 
                    onClick={handleSubmit}
                    className="w-full py-4 text-lg font-bold text-white transition-colors rounded-xl shadow-md bg-primary-500 hover:bg-[#2F4A3B] active:scale-[0.98]"
                >
                    전송
                </button>
            </div>
        </div>
    );
}