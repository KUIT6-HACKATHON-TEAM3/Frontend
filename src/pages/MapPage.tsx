import { useEffect, useRef, useState, useCallback } from "react";
import type { LatLng, RoadData } from "../data/all_roads_walking_paths";
import RoadPolyline from "../components/map/RoadPolyline";
import RoadInfoCard from "../components/map/RoadInfoCard";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import curlogImg from "@/assets/icons/current-location.svg"
import destImg from "@/assets/icons/destination.svg"
import RouteSelectionCard from "../components/map/RouteSelectionCard";
import { routesApi } from "../api/routes";
import { useNavigate } from "react-router-dom";
import useFavoriteRoadsStore from "../stores/FavoriteRoadsStore";

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
  pointsByRoad: Map<string, RoadData>;
};

// 카드에 표시할 데이터 타입 정의
interface CardData {
  type: 'ROAD' | 'DESTINATION' | 'ROUTE_OPTIONS';
  title: string;       // 예: "능동로 가로수길" 또는 "📍 선택한 위치"
  description: string; // 예: "1구간" 또는 "서울 광진구 ..."
  isFavorite?: boolean;
  estimatedTime: number | null; // 예상 도보 시간 (분)
  segmentId?: number;  // ROAD 타입일 때 사용
}

// Haversine 공식을 사용한 거리 계산 함수 (미터 단위)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위
}

export default function MapPage({
  appKey,
  center = { lat: 37.5408, lng: 127.0793 },
  level = 3,
  pointsByRoad,
}: Props) {
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const destinationPinRef = useRef<any>(null); // 목적지 마커 Ref

  // 충돌 방지용 시간 기록
  const lastPolylineClickTime = useRef<number>(0);

  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapLevel, setMapLevel] = useState(level);
  const [myLocation, setMyLocation] = useState(center);
  const currentMarkerRef = useRef<any>(null);

  // ★ 변경점: 단순히 로드 이름만 저장하는 게 아니라, 카드에 띄울 전체 데이터를 관리
  const [cardData, setCardData] = useState<CardData | null>(null);

  // 검색어 상태관리
  const [searchKeyword, setSearchKeyword] = useState("");
  // 검색된 경로 (파란색으로 표시)
  const [searchedPath, setSearchedPath] = useState<LatLng[] | null>(null);

  // Zustand store에서 즐겨찾기 관련 함수들 가져오기
  const { isFavorite: checkIsFavorite, addFavorite, removeFavoriteBySegmentId, loadFavorites } = useFavoriteRoadsStore();

  // 현재 카드의 segment_id에 대한 즐겨찾기 상태
  const isFavorite = cardData?.segmentId ? checkIsFavorite(cardData.segmentId) : false;


  // 1. 선(Polyline) 클릭 핸들러
  const handleRoadSelect = useCallback((roadName: string, segmentId: number) => {
    lastPolylineClickTime.current = Date.now();
    
    // 선을 누르면 마커 지우기
    if (destinationPinRef.current) {
      destinationPinRef.current.setMap(null);
      destinationPinRef.current = null;
    }

    setCardData({
      type: 'ROAD',
      title: roadName.split(" ")[0], // 대제목
      description: roadName,    // 소제목 (구간 이름)
      estimatedTime: null,
      isFavorite: false,
      segmentId: segmentId,
    });
    setIsSearchVisible(true);
  }, []);

  // ★ 공통 함수: 특정 좌표에 핀 찍고 목적지 카드 띄우기
  // (지도 클릭 시 & 검색 결과 클릭 시 공통 사용)
  const handleSelectLocation = useCallback((coords: any, name: string, address: string) => {
      if (!mapRef.current || !window.kakao) return;
      const kakao = window.kakao;

      // 1. 기존 마커 제거
      if (destinationPinRef.current) {
          destinationPinRef.current.setMap(null);
      }

      // 2. 새 마커 생성
      const imageSrc = destImg;
      const imageSize = new kakao.maps.Size(36, 42);
      const imageOption = { offset: new kakao.maps.Point(15, 30) };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const marker = new kakao.maps.Marker({
          position: coords,
          image: markerImage
      });

      marker.setMap(mapRef.current);
      destinationPinRef.current = marker;

      // 3. 지도 중심 이동
      mapRef.current.panTo(coords);

      // 4. 카드 데이터 업데이트
      setCardData({
          type: 'DESTINATION',
          title: name || "📍 선택한 위치", // 장소명이 있으면 장소명, 없으면 기본값
          description: address || "주소 정보 없음",
          estimatedTime: 0,
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

    const imageSrc = destImg;
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
          description: address,
          estimatedTime: null
        });
        setIsSearchVisible(true);
      }
    });

  }, [handleSelectLocation]);

  // ★ 추가: 키워드 검색 실행 함수
  const searchPlaces = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    if (!window.kakao || !window.kakao.maps.services) return;
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(searchKeyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색 결과 중 첫 번째 장소로 이동
        const place = data[0];
        const coords = new window.kakao.maps.LatLng(place.y, place.x);
        
        // 장소 선택 처리 (핀 찍고 카드 열기)
        handleSelectLocation(coords, place.place_name, place.address_name || place.road_address_name);
        
        // 키보드 내리기 (모바일 등)
        (document.activeElement as HTMLElement)?.blur();

      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

useEffect(() => {
      console.log("Current Location Updated:", myLocation);
  }, [myLocation]);

useEffect(() => {
  // GPS 사용 가능 여부 확인
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMyLocation(newPos); // 상태 업데이트

        // 지도가 이미 로드되어 있다면 중심 이동 & 마커 이동
        if (mapRef.current && window.kakao) {
          const moveLatLon = new window.kakao.maps.LatLng(newPos.lat, newPos.lng);
          
          // 1. 지도 중심 이동 (부드럽게)
          mapRef.current.panTo(moveLatLon);

          // 2. 초기 마커(빨간색) 위치도 내 위치로 이동
          if (currentMarkerRef.current) {
            currentMarkerRef.current.setPosition(moveLatLon);
          }
        }
      },
      (err) => {
        console.error("GPS 정보를 가져오지 못했습니다.", err);
      },
      {
        enableHighAccuracy: true, // 높은 정확도 사용
        maximumAge: 0, 
        timeout: 5000 
      }
    );
  }
}, []);

  // 즐겨찾기 목록 로드
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

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

      // 초기 마커 (색)
      const imageSrc = curlogImg;
      const imageSize = new kakao.maps.Size(36, 42);
      const imageOption = { offset: new kakao.maps.Point(15, 30) };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
        image: markerImage
      });
      marker.setMap(map);

      currentMarkerRef.current = marker;

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
              <button className="p-2 text-xl leading-none text-gray-400 rounded-full hover:bg-gray-50"
              onClick={() => navigate("/settings")}
              >☰</button>

              <input type="text" placeholder="어느 길을 걷고 싶으신가요?" className="flex-1 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none" />
              <button className="p-2 text-[#B4B998] hover:bg-gray-50 rounded-full text-xl leading-none">🔍</button>
            <div 
              // ★ 수정: 검색바 컨테이너 클릭 시 카드가 있다면 닫기
                onClick={() => {
                    if (cardData) {
                        setCardData(null);
                        // 필요하다면 마커도 지우기 (선택사항)
                        // if (destinationPinRef.current) destinationPinRef.current.setMap(null);
                    }
                }}
              className="pointer-events-auto bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-3 flex items-center gap-3">
              <button className="p-2 text-xl leading-none text-gray-400 rounded-full hover:bg-gray-50">☰</button>
              <input 
                type="text" 
                placeholder="어느 길을 걷고 싶으신가요?" 
                className="flex-1 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        searchPlaces();
                    }
                }}
              />
              <button
                onClick={(e) => {
                    e.stopPropagation(); // 부모의 onClick(카드닫기)과 겹치지 않게
                    searchPlaces();
                }}
                className="p-2 text-[#B4B998] hover:bg-gray-50 rounded-full text-xl leading-none">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
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
                        handleRoadSelect("능동로 가로수길 1구간", 1);
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
        Array.from(pointsByRoad.entries()).map(([roadName, roadData]) => (
          <RoadPolyline
            key={roadName}
            map={mapRef.current}
            points={roadData.path}
            sectionName={roadName}
            mapLevel={mapLevel}
            onRoadSelect={() => handleRoadSelect(roadName, roadData.segmentId)}
          />
        ))
      }

      {/* 검색된 경로 (파란색) */}
      {isMapReady && mapRef.current && searchedPath && (
        <RoadPolyline
          key="searched-route"
          map={mapRef.current}
          points={searchedPath}
          sectionName="검색된 경로"
          mapLevel={mapLevel}
          strokeColor="#0066FF"
          strokeWeight={6}
          strokeOpacity={0.9}
          onRoadSelect={() => {}}
        />
      )}

      {/* 하단 카드 영역 */}
      <AnimatePresence mode="wait">
        {cardData && (
          <motion.div
            key="bottom-card" // 이 키가 변하면 안 됨 (그래야 카드가 유지되면서 커짐)
            layout // 크기/위치 변화 자동 애니메이션
            ref={cardRef}

            // 드래그 기능
            drag="y" // Y축 드래그 활성화
            dragConstraints={{ top: 0, bottom: 0 }} // 드래그 후 제자리로 돌아오려는 탄성(고무줄)
            dragElastic={0.1} // 당길 때 저항감 (0 ~ 1, 작을수록 뻑뻑함)
            
            onDragEnd={(_, info) => {
              const y = info.offset.y; // 이동한 거리 (음수: 위로, 양수: 아래로)
              
              // 1. 위로 100px 이상 당겼고 && 현재 '목적지(작은카드)' 상태라면 -> 전체화면으로
              if (y < -100 && cardData.type === 'DESTINATION') {
                 setCardData({ ...cardData, type: 'ROUTE_OPTIONS' });
              }
              
              // 2. 아래로 100px 이상 당겼고 && 현재 '경로선택(큰카드)' 상태라면 -> 원래대로
              else if (y > 100 && cardData.type === 'ROUTE_OPTIONS') {
                 setCardData({ ...cardData, type: 'DESTINATION' });
              }
              
              // 3. 아래로 100px 이상 당겼고 && '목적지' 상태라면? -> 아예 닫기 (취소)
              else if (y > 100 && cardData.type === 'DESTINATION') {
                 setCardData(null);
                 if (destinationPinRef.current) destinationPinRef.current.setMap(null);
              }
            }}

            style={{ 
                bottom: cardData.type === 'ROUTE_OPTIONS' ? 0 : '-50vh' 
            }}

            className={`absolute bottom-0 left-0 right-0 z-50 pointer-events-auto bg-white 
              shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-t-[32px] overflow-hidden
              ${cardData.type === 'ROUTE_OPTIONS' ? 'h-[92vh]' : 'h-auto pb-[50vh]'} 
            `}
            variants={bottomCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
                type: "spring", 
                damping: 30,    
                stiffness: 400,  
                mass: 1 
            }}
          >
            <motion.div 
              layout="position"
              className="w-full h-8 flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing bg-white z-10 absolute top-0 left-0 right-0 rounded-t-[32px]">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                <div className={`pt-8 ${cardData.type === 'ROUTE_OPTIONS' ? 'h-full' : 'h-auto'}`}></div>
            </motion.div>
            <div className={`pt-8 ${cardData.type === 'ROUTE_OPTIONS' ? 'h-full' : 'h-auto'}`}>
            {/* 1. 길 정보 (ROAD) */}
            {cardData.type === 'ROAD' && (
              <motion.div layout="position">
              <RoadInfoCard
                roadName={cardData.title}
                sectionName={cardData.description}
                emotions={[{emoji: "✨", label:"야경맛집"}, {emoji:"👫", label:"데이트코스"}, {emoji: "🌳", label:"나무그늘"}, {emoji:"🐶", label:"댕댕이천국"}]}
                isFavorite={isFavorite}
                onAddFavorite={async () => {
                  if (!localStorage.getItem("refreshToken")) {
                    if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {navigate("/login");}
                    return;
                  }

                  if (!cardData.segmentId) return;

                  if (isFavorite) {
                    // 이미 즐겨찾기되어 있으면 삭제
                    await removeFavoriteBySegmentId(cardData.segmentId);
                  } else {
                    // 즐겨찾기 추가
                    await addFavorite(cardData.segmentId, cardData.title);
                  }
                }}
              />
              </motion.div>
            )}

            {/* 2. 목적지 정보 (DESTINATION) */}
            {cardData.type === 'DESTINATION' && (
              <motion.div layout="position" className="w-full p-6 pb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{cardData.title}</h3>
                  <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">도착지</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">{cardData.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                        if (!destinationPinRef.current) return;

                        // 목적지 좌표 가져오기
                        const destPosition = destinationPinRef.current.getPosition();
                        const destLat = destPosition.getLat();
                        const destLng = destPosition.getLng();

                        // Haversine 공식으로 거리 계산 (미터)
                        const distanceInMeters = Math.round(
                          calculateDistance(center.lat, center.lng, destLat, destLng)
                        );

                        // 도보 예상 시간 계산 (카카오맵 기준: 67m/분)
                        const walkingTimeInMinutes = Math.ceil(distanceInMeters / 67);

                        setCardData({ ...cardData, type: 'ROUTE_OPTIONS', estimatedTime: walkingTimeInMinutes });
                    }}
                    className="flex-1 bg-[#B4B998] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#A3A889] transition-colors"
                  >
                    이 위치로 경로 탐색
                  </button>
                  <button
                    onClick={() => {
                      setCardData(null);
                      setSearchedPath(null); // 경로 초기화
                      if (destinationPinRef.current) destinationPinRef.current.setMap(null);
                    }}
                    className="px-4 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. 경로 선택 옵션 (ROUTE_OPTIONS) */}
            {cardData.type === 'ROUTE_OPTIONS' && (
              <motion.div layout="position" className="h-full">
              <RouteSelectionCard
                minTime={cardData.estimatedTime}
                onBack={() => setCardData({ ...cardData, type: 'DESTINATION' })}
                onSelectRoute={async (addedTime) => {
                    try {
                      const response = await routesApi.search({
                        user_location: {lat: center.lat, lng: center.lng},
                        pin_location: {lat: destinationPinRef.current.lat, lng: destinationPinRef.current.lng},
                        added_time_req: addedTime
                      });

                      console.log('경로 검색 결과:', response);

                      // 선택한 경로 타입에 따라 path 선택
                      const path = addedTime === 0
                        ? response.data.fastest.path
                        : response.data.avenue.path;

                      // 경로를 state에 저장 (다음 렌더링에서 파란색 Polyline으로 표시)
                      setSearchedPath(path);

                      // 로깅
                      if (addedTime === 0) {
                        console.log('최소길 경로:', response.data.fastest);
                        console.log('소요시간:', response.data.fastest.summary.actual_time, '분');
                        console.log('거리:', response.data.fastest.summary.distance_meter, 'm');
                      } else {
                        console.log('여유길 경로:', response.data.avenue);
                        console.log('소요시간:', response.data.avenue.summary.actual_time, '분');
                        console.log('거리:', response.data.avenue.summary.distance_meter, 'm');
                        console.log('안내 메시지:', response.data.avenue.summary.display_msg);
                      }

                    } catch (error) {
                      console.error('경로 검색 실패:', error);
                      // TODO: 에러 처리 (사용자에게 알림 표시 등)
                    }
                }}
              />
              </motion.div>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}