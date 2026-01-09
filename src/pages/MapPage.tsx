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
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [mapLevel, setMapLevel] = useState(level);

  useEffect(() => {
    if (!divRef.current) return;

    // 1) SDK가 이미 로드되어 있으면 바로 init
    const initMap = () => {
      const kakao = window.kakao;
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };
      const map = new kakao.maps.Map(divRef.current, options);
      mapRef.current = map;

      // 현재 위치에 마커 찍기
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
      });
      marker.setMap(map);

      // 지도 레벨 변경 이벤트 리스너 등록
      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        setMapLevel(level);
      });

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
    <div className="relative w-full h-screen">
      <div ref={divRef} style={{ width: "100%", height: 932 }} />
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
        <div ref={cardRef} className="absolute bottom-0 left-0 right-0 bg-white shadow-lg p-0 z-50 rounded-t-3xl overflow-hidden">
          <RoadInfoCard
            roadName={selectedRoad.split(' ')[0]}
            sectionName={selectedRoad}
            isFavorite={false}
          />
        </div>
      )}
    </div>
  );
}