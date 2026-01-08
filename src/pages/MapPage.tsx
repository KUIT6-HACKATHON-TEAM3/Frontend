import { useState } from "react";
import { Container as MapDiv, NaverMap, Polyline } from "react-naver-maps";
import BottomSheet from "../components/BottomSheet";
import { STREET_SEGMENTS, PathSegment } from "../data/mock"; // 데이터 import

export default function MapPage() {
  // 선택된 '조각(Segment)' 하나를 저장
  const [selectedSegment, setSelectedSegment] = useState<PathSegment | null>(null);

  return (
    <div className="w-full h-screen relative">
      <MapDiv style={{ width: "100%", height: "100%" }}>
        <NaverMap center={{ lat: 37.541, lng: 127.072 }} zoom={15}>
          
          {/* 배열(STREET_SEGMENTS)을 순회하며 선을 여러 개 그림 */}
          {STREET_SEGMENTS.map((segment) => {
            // 현재 그려지는 선이 선택된 선인지 확인
            const isSelected = selectedSegment?.id === segment.id;

            return (
              <Polyline
                key={segment.id} // 리액트 반복문 필수값
                path={segment.path}
                // 선택되면 '형광 초록(두께 10)', 아니면 '진한 초록(두께 5)'
                strokeColor={isSelected ? "#00FF00" : "#1EC800"} 
                strokeWeight={isSelected ? 10 : 5}
                strokeOpacity={0.8}
                clickable={true} // 클릭 가능하게 설정
                onClick={() => setSelectedSegment(segment)} // 클릭 시 해당 조각 정보 저장
              />
            );
          })}

        </NaverMap>
      </MapDiv>

      {/* 하단 카드에는 "능동로 가로수길 1" 처럼 구체적인 이름이 뜸 */}
      {selectedSegment && (
        <BottomSheet
          title={selectedSegment.roadName}   // 큰 제목: "능동로"
          subTitle={selectedSegment.name}    // 소제목: "능동로 가로수길 1"
          onClose={() => setSelectedSegment(null)}
          // ... 기타 props
        />
      )}
    </div>
  );
}