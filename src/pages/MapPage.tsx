import { useEffect, useRef, useState, useCallback } from "react";
import type { LatLng } from "../data/all_roads_walking_paths";
import RoadPolyline from "../components/map/RoadPolyline";
import RoadInfoCard from "../components/map/RoadInfoCard";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    kakao: any;
  }
}

// 애니메이션 설정 (타입 제거하여 오류 방지)
const topBarVariants = {
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

const bottomCardVariants = {
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

export default function MapPage({
  appKey,
  center = { lat: 37.5408, lng: 127.0793 },
  level = 3,
  pointsByRoad,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  
  // ★ 클릭 충돌 방지용 시간 기록
  const lastPolylineClickTime = useRef<number>(0);

  // 최신 상태 참조용 Ref
  const stateRef = useRef({ selectedRoad: null as string | null, isSearchVisible: true });

  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [mapLevel, setMapLevel] = useState(level);

  useEffect(() => {
    stateRef.current = { selectedRoad, isSearchVisible };
  }, [selectedRoad, isSearchVisible]);

  // 1. 선(Polyline) 클릭 핸들러
  const handleRoadSelect = useCallback((roadName: string) => {
    // 클릭 시간 기록
    lastPolylineClickTime.current = Date.now();
    
    setSelectedRoad(roadName);
    setIsSearchVisible(true); 
  }, []);

  // 2. 지도 빈 곳 클릭 핸들러
  const handleMapClick = useCallback(() => {
    // 0.5초 이내에 선을 클릭했다면 지도 클릭은 무시
    const timeDiff = Date.now() - lastPolylineClickTime.current;
    if (timeDiff < 500) return;

    const { selectedRoad, isSearchVisible } = stateRef.current;

    if (selectedRoad) {
      setSelectedRoad(null); // 카드 닫기
      setIsSearchVisible(false);
    } else {
      setIsSearchVisible(!isSearchVisible); // 검색창 토글
    }
  }, []);

  useEffect(() => {
    if (!appKey || !divRef.current) return;

    const initMap = () => {
      const kakao = window.kakao;
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };
      const map = new kakao.maps.Map(divRef.current, options);
      mapRef.current = map;

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
      });
      marker.setMap(map);

      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        setMapLevel(map.getLevel());
      });

      // 지도 클릭 이벤트 연결
      kakao.maps.event.addListener(map, 'click', handleMapClick);

      setIsMapReady(true);
    };

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
        s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
        s.async = true;
        document.head.appendChild(s);
        return s;
      })();

    const onLoad = () => {
      window.kakao.maps.load(initMap);
    };

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
                    if(selectedRoad) handleMapClick(); 
                    else handleRoadSelect("능동로 가로수길 1구간");
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

      {/* 하단 카드 */}
      <AnimatePresence>
        {selectedRoad && (
            <motion.div 
                key="bottom-card"
                ref={cardRef} 
                className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto"
                variants={bottomCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
            <RoadInfoCard
                roadName="능동로 가로수길" 
                sectionName={selectedRoad}
                isFavorite={false}
            />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}