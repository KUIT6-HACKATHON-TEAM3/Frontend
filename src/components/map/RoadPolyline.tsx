import { useEffect, useRef } from "react";
import type { LatLng } from "../../data/all_roads_walking_paths";

type Props = {
  map: any; // kakao.maps.Map
  points: LatLng[];
  roadName: string;
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  onRoadSelect: () => void;
};

export default function RoadPolyline({
  map,
  points,
  roadName,
  strokeColor = "#B9BE94",
  strokeWeight = 5,
  strokeOpacity = 1,
  onRoadSelect,
}: Props) {
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !window.kakao) return;

    const kakao = window.kakao;
    const path = points.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

    // 기존 polyline 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // 새 polyline 생성
    const polyline = new kakao.maps.Polyline({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle: "solid",
      clickable: true, // 클릭 가능하도록 설정
    });

    polyline.setMap(map);
    polylineRef.current = polyline;

    // 마우스오버 효과
    kakao.maps.event.addListener(polyline, "mouseover", () => {
      polyline.setOptions({
        strokeColor: "#E0FF02",
        strokeWeight: strokeWeight + 3,
        strokeOpacity: 1,
      });
    });

    kakao.maps.event.addListener(polyline, "mouseout", () => {
      polyline.setOptions({
        strokeColor: "#B9BE94",
        strokeWeight,
        strokeOpacity,
      });
    });

    // 클릭 이벤트 등록
    kakao.maps.event.addListener(polyline, "click", () => {
      onRoadSelect();
    });

    // cleanup
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, points, roadName, strokeColor, strokeWeight, strokeOpacity, onRoadSelect]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
