import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  appKey: string; // Kakao JavaScript 키
  center?: { lat: number; lng: number };
  level?: number;
};

export default function MapPage({
  appKey,
  center = { lat: 37.5408, lng: 127.0793 }, // 건국대학교
  level = 3,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 1) SDK가 이미 로드되어 있으면 바로 init
    const initMap = () => {
      const kakao = window.kakao;
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };
      const map = new kakao.maps.Map(mapRef.current, options);

      // 예시: 마커 하나 찍기
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.lat, center.lng),
      });
      marker.setMap(map);
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
      script.removeEventListener("load", onLoad);
      // 보통 SDK script는 전역 재사용하므로 제거하지 않습니다.
      // (여러 페이지에서 지도 쓰면 다시 로드 비용 발생)
    };
  }, [appKey, center.lat, center.lng, level]);

  return <div ref={mapRef} style={{ width: "100%", height: 932 }} />;
}