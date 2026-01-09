import { useEffect, useRef, useState } from "react";
import type { LatLng } from "../data/all_roads_walking_paths";
import RoadPolyline from "../components/map/RoadPolyline";

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
  const [isMapReady, setIsMapReady] = useState(false);

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

  return (
    <>
      <div ref={divRef} style={{ width: "100%", height: 932 }} />
      {isMapReady && mapRef.current &&
        Array.from(pointsByRoad.entries()).map(([roadName, points]) => (
          <RoadPolyline
            key={roadName}
            map={mapRef.current}
            points={points}
            roadName={roadName}
            onRoadSelect={() => {
              console.log(`${roadName} 클릭됨!`);
              // 여기서 원하는 동작을 추가할 수 있습니다
            }}
          />
        ))
      }
    </>
  );
}