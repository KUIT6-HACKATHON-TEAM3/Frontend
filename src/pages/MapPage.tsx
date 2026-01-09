import { useEffect, useRef, useState, useCallback } from "react";
import type { LatLng } from "../data/all_roads_walking_paths";
import RoadPolyline from "../components/map/RoadPolyline";
import RoadInfoCard from "../components/map/RoadInfoCard";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import curlogImg from "@/assets/icons/current-location.svg"
import destImg from "@/assets/icons/destination.svg"
import RouteSelectionCard from "../components/map/RouteSelectionCard";

declare global {
  interface Window {
    kakao: any;
  }
}

// 애니메이션 설정
const topBarVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 }
  },
  exit: { 
    y: -100, 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const bottomCardVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 0.8 }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

type Props = {
  appKey: string;
  center?: { lat: number; lng: number };
  level?: number;
  pointsByRoad: Map<string, LatLng[]>;
};

// 카드에 표시할 데이터 타입 정의
interface CardData {
  type: 'ROAD' | 'DESTINATION' | 'ROUTE_OPTIONS';
  title: string;       // 예: "능동로 가로수길" 또는 "📍 선택한 위치"
  description: string; // 예: "1구간" 또는 "서울 광진구 ..."
}

export default function MapPage({
  appKey,
  center = { lat: 37.5408, lng: 127.0793 },
  level = 3,
  pointsByRoad,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const destinationPinRef = useRef<any>(null); // 목적지 마커 Ref

  // 충돌 방지용 시간 기록
  const lastPolylineClickTime = useRef<number>(0);

  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapLevel, setMapLevel] = useState(level);

  // ★ 변경점: 단순히 로드 이름만 저장하는 게 아니라, 카드에 띄울 전체 데이터를 관리
  const [cardData, setCardData] = useState<CardData | null>(null);

  // 1. 선(Polyline) 클릭 핸들러
  const handleRoadSelect = useCallback((roadName: string) => {
    lastPolylineClickTime.current = Date.now();
    
    // 선을 누르면 마커는 지워주는 센스 (선택 사항)
    if (destinationPinRef.current) {
      destinationPinRef.current.setMap(null);
      destinationPinRef.current = null;
    }

    setCardData({
      type: 'ROAD',
      title: "능동로 가로수길", // 대제목
      description: roadName    // 소제목 (구간 이름)
    });
    setIsSearchVisible(true); 
  }, []);

  // 2. 지도 빈 곳 클릭 핸들러 (마커 생성 + 주소 변환 + 카드 열기)
  const handleMapClick = useCallback((mouseEvent: any) => {
    // 선 클릭 직후(0.5초 이내)라면 지도 클릭 무시 (이벤트 버블링 방지)
    const timeDiff = Date.now() - lastPolylineClickTime.current;
    if (timeDiff < 500) return;

    // 카카오 맵 객체나 mouseEvent가 없으면 리턴
    if (!mapRef.current || !mouseEvent || !window.kakao) return;

    const kakao = window.kakao;
    const latLng = mouseEvent.latLng;

    // 2-1. 마커 찍기
    if (destinationPinRef.current) {
      destinationPinRef.current.setMap(null);
    }

    const imageSrc = {curlogImg};
    const imageSize = new kakao.maps.Size(36, 42);
    const imageOption = { offset: new kakao.maps.Point(15, 30) };
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    const marker = new kakao.maps.Marker({
      position: latLng,
      image: markerImage
    });
    
    marker.setMap(mapRef.current);
    destinationPinRef.current = marker;

    // 2-2. 주소 변환 (Geocoding)
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0].address?.address_name || result[0].road_address?.address_name || "주소 정보 없음";
        
        // 2-3. 카드 데이터 업데이트 (카드 열기)
        setCardData({
          type: 'DESTINATION',
          title: "📍 목적지 설정",
          description: address
        });
        setIsSearchVisible(true);
      }
    });

  }, []);

  useEffect(() => {
    if (!appKey || !divRef.current) return;

    const initMap = () => {
      const kakao = window.kakao;
      if (!kakao.maps.services) {
        console.error("Kakao Maps Services 라이브러리가 로드되지 않았습니다. 새로고침 해주세요.");
        return;
      }
      
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };
      const map = new kakao.maps.Map(divRef.current, options);
      mapRef.current = map;

      // 초기 마커 (빨간색)
      const imageSrc = {destImg};
      const imageSize = new kakao.maps.Size(36, 42);
      const imageOption = { offset: new kakao.maps.Point(15, 30) };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
        image: markerImage
      });
      marker.setMap(map);

      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        setMapLevel(map.getLevel());
      });

      // 지도 클릭 이벤트 연결 (인자 전달 방식 수정)
      kakao.maps.event.addListener(map, 'click', handleMapClick);

      setIsMapReady(true);
    };

    // ★ 중요: services 라이브러리 추가 (&libraries=services)
    const scriptSrc = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;

    const existingScript = document.querySelector(
      `script[src*="libraries=services"]` 
    ) as HTMLScriptElement | null;

    if (window.kakao?.maps && window.kakao.maps.services) {
      initMap();
      return;
    }
    // 기존 services 없는 스크립트 제거(충돌방지)
    const oldScript = document.querySelector(`script[src^="//dapi.kakao.com/v2/maps/sdk.js"]:not([src*="libraries=services"])`);
    if (oldScript) {
      oldScript.remove();
    }

    const script = existingScript ?? (() => {
      const s = document.createElement("script");
      s.src = scriptSrc;
      s.async = true;
      document.head.appendChild(s);
      return s;
    })();

    const onLoad = () => { window.kakao.maps.load(initMap); };
    script.addEventListener("load", onLoad);
    return () => { script.removeEventListener("load", onLoad); };
  }, [appKey, center.lat, center.lng, level, handleMapClick]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      
      {/* 상단 검색바 */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            key="top-bar"
            variants={topBarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-40 pointer-events-none top-4 left-4 right-4"
          >
            <div className="pointer-events-auto bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3">
              <button className="p-2 text-xl leading-none text-gray-400 rounded-full hover:bg-gray-50">☰</button>
              <input type="text" placeholder="어느 길을 걷고 싶으신가요?" className="flex-1 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none" />
              <button className="p-2 text-[#B4B998] hover:bg-gray-50 rounded-full text-xl leading-none">🔍</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={divRef} id="kakao-map-container" style={{ width: "100%", height: "100%" }} />

      {!appKey && (
         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-gray-500 pointer-events-none bg-gray-200/90">
            <div className="flex flex-col items-center pointer-events-auto">
                <p className="mb-2 text-xl font-bold">🚫 지도 API 키 없음</p>
                <button 
                onClick={(e) => {
                    e.stopPropagation();
                    // 테스트용 가짜 데이터 주입
                    if(cardData) {
                        setCardData(null); 
                    } else {
                        handleRoadSelect("능동로 가로수길 1구간");
                    }
                }}
                className="px-6 py-3 mt-4 bg-white text-[#B4B998] font-bold rounded-xl shadow-md border border-[#B4B998]"
                >
                테스트 버튼
                </button>
            </div>
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
      
      {/* 하단 카드 영역 */}
      <AnimatePresence mode="wait">
        {cardData && (
          <motion.div
            key="bottom-card" // ★ 중요: 이 키가 변하면 안 됩니다! (그래야 카드가 유지되면서 커짐)
            layout // ★ 크기/위치 변화 자동 애니메이션
            ref={cardRef}
            className={`absolute bottom-0 left-0 right-0 z-50 pointer-events-auto bg-white 
              ${cardData.type === 'ROUTE_OPTIONS' 
                ? 'h-screen rounded-none' // 전체 화면
                : 'rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)]' // 일반 모드
              }`}
            variants={bottomCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // ★ 수정됨: 속도를 늦춰서 애니메이션이 '잘 보이게' 변경
            transition={{ 
                type: "spring", 
                damping: 25,    // 반동을 줄이고 부드럽게 (기존 20 -> 25)
                stiffness: 60,  // 속도를 늦춤 (기존 100 -> 60)
                mass: 0.8 
            }}
          >
            {/* 1. 길 정보 (ROAD) */}
            {cardData.type === 'ROAD' && (
              <RoadInfoCard
                roadName={cardData.title}
                sectionName={cardData.description}
                isFavorite={false}
              />
            )}

            {/* 2. 목적지 정보 (DESTINATION) */}
            {cardData.type === 'DESTINATION' && (
              <div className="w-full p-6 pb-8">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{cardData.title}</h3>
                  <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">도착지</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">{cardData.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                        setCardData({ ...cardData, type: 'ROUTE_OPTIONS' });
                    }}
                    className="flex-1 bg-[#B4B998] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#A3A889] transition-colors"
                  >
                    이 위치로 경로 탐색
                  </button>
                  <button
                    onClick={() => {
                      setCardData(null);
                      if (destinationPinRef.current) destinationPinRef.current.setMap(null);
                    }}
                    className="px-4 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 3. 경로 선택 옵션 (ROUTE_OPTIONS) */}
            {cardData.type === 'ROUTE_OPTIONS' && (
              <RouteSelectionCard
                onBack={() => setCardData({ ...cardData, type: 'DESTINATION' })}
                onSelectRoute={(type) => {
                    console.log("선택된 경로:", type);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}