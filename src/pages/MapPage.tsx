import { useEffect, useRef, useState, useCallback } from "react";
import type { LatLng } from "../data/all_roads_walking_paths";
import RoadPolyline from "../components/map/RoadPolyline";
import RoadInfoCard from "../components/map/RoadInfoCard";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  appKey: string; // Kakao JavaScript 키
  center?: { lat: number; lng: number };
  level?: number;
  pointsByRoad: Map<string, LatLng[]>;
};

export default function MapPage({
  appKey,
  center = { lat: 37.5408, lng: 127.0793 }, // 건국대학교
  level = 3,
  pointsByRoad,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);       // kakao.maps.Map
  const cardRef = useRef<HTMLDivElement | null>(null);
  const destinationPinRef = useRef<any>(null);  // 클릭한 위치의 마커
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [mapLevel, setMapLevel] = useState(level);
  const [clickedPinLocation, setClickedPinLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!appKey || !divRef.current) return;

    // 1) SDK가 이미 로드되어 있으면 바로 init
    const initMap = () => {
      const kakao = window.kakao;
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };
      const map = new kakao.maps.Map(divRef.current, options);
      mapRef.current = map;

      // 마커 이미지 생성
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png';
        const imageSize = new kakao.maps.Size(36, 42);
        const imageOption = { offset: new kakao.maps.Point(15, 30) };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      // 현재 위치에 마커 찍기
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
        image: markerImage
      });
      marker.setMap(map);

      // 지도 레벨 변경 이벤트 리스너 등록
      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        setMapLevel(level);
      });

      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        // 기존 마커가 있으면 제거
        if (destinationPinRef.current) {
          destinationPinRef.current.setMap(null);
        }

        const pinLocation = mouseEvent.latLng;
        const newLocation = {
          lat: pinLocation.getLat(),
          lng: pinLocation.getLng(),
        };

        setClickedPinLocation(newLocation);

        // 마커 이미지 생성
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png';
        const imageSize = new kakao.maps.Size(36, 42);
        const imageOption = { offset: new kakao.maps.Point(15, 30) };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        // 새 마커 생성 및 표시
        destinationPinRef.current = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(newLocation.lat, newLocation.lng),
          image: markerImage
        });
        destinationPinRef.current.setMap(map);
      })

      // 지도 준비 완료
      setIsMapReady(true);
    };

    // 2) SDK 스크립트가 없으면 동적으로 삽입
    const existingScript = document.querySelector(
      'script[src^="//dapi.kakao.com/v2/maps/sdk.js"]'
    ) as HTMLScriptElement | null;

    if (window.kakao?.maps) {
      initMap();
      return;
    }

    const script =
      existingScript ??
      (() => {
        const s = document.createElement("script");
        // autoload=false로 두고, 로드 완료 후 kakao.maps.load로 초기화(React에서 안전)
        s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
        s.async = true;
        document.head.appendChild(s);
        return s;
      })();

    const onLoad = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
    };

    script.addEventListener("load", onLoad);

    return () => {
      // 이벤트 리스너만 제거 (메모리 누수 방지)
      script.removeEventListener("load", onLoad);
      // script 태그 자체는 DOM에 유지 (재사용 위해)
    };
  }, [appKey, center.lat, center.lng, level]);

  const handleRoadSelect = useCallback((roadName: string) => {
    console.log('Road selected:', roadName);
    setSelectedRoad(roadName);
  }, []);

  // 카드 밖 클릭 감지
  useEffect(() => {
    if (!selectedRoad) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedRoad(null);
      }
    };

    // 약간의 지연을 주어 도로 클릭 이벤트와 겹치지 않도록 함
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedRoad]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      
      <div className="absolute z-40 pointer-events-none top-4 left-4 right-4">
        <div className="pointer-events-auto bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3">
          <button className="p-2 text-xl leading-none text-gray-400 rounded-full hover:bg-gray-50">
            ☰ {/* Menu 아이콘 대체 */}
          </button>
          <input type="text" placeholder="어느 길을 걷고 싶으신가요?" className="flex-1 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none" />
          <button className="p-2 text-[#B4B998] hover:bg-gray-50 rounded-full text-xl leading-none">
            🔍 {/* Search 아이콘 대체 */}
          </button>
        </div>
      </div>

      <div ref={divRef} style={{ width: "100%", height: "100%" }} />

      {!appKey && (
         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-gray-500 bg-gray-200/90">
            <p className="mb-2 text-xl font-bold">🚫 지도 API 키 없음</p>
            <p className="mb-6 text-sm">테스트 모드로 UI를 확인합니다.</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoad(selectedRoad ? null : "능동로 가로수길 1구간");
              }}
              className="px-6 py-3 bg-white text-[#B4B998] font-bold rounded-xl shadow-md border border-[#B4B998]"
            >
              {selectedRoad ? "카드 닫기" : "👉 하단 카드 열기 테스트"}
            </button>
         </div>
      )}

      {isMapReady && mapRef.current &&
        Array.from(pointsByRoad.entries()).map(([roadName, points]) => (
          <RoadPolyline
            key={roadName}
            map={mapRef.current}
            points={points}
            sectionName={roadName}
            mapLevel={mapLevel}
            onRoadSelect={() => handleRoadSelect(roadName)}
          />
        ))
      }

      {selectedRoad && (
        <div ref={cardRef} className="absolute bottom-0 left-0 right-0 z-50">
          <RoadInfoCard
            roadName="능동로 가로수길" // 실제 데이터 연결 시 수정 필요
            sectionName={selectedRoad}
            isFavorite={false}
          />
        </div>
      )}
    </div>
  );
}