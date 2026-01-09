import { useEffect, useRef } from "react";
import type { LatLng } from "../../data/all_roads_walking_paths";
import { COLORS } from "../../constants/colors";

type Props = {
  map: any; // kakao.maps.Map
  points: LatLng[];
  sectionName: string;
  mapLevel: number;
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  onRoadSelect: () => void;
};

export default function RoadPolyline({
  map,
  points,
  sectionName,
  mapLevel,
  strokeColor = COLORS.primary[500],
  strokeWeight = 5,
  strokeOpacity = 1,
  onRoadSelect,
}: Props) {
  // 지도 레벨에 따른 strokeWeight 계산
  // 레벨이 낮을수록(확대) 더 두껍게, 레벨이 높을수록(축소) 더 얇게
  const calculatedStrokeWeight = Math.max(1, strokeWeight - mapLevel + 3);
  const polylineRef = useRef<any>(null);
  const onRoadSelectRef = useRef(onRoadSelect);

  // 최신 onRoadSelect를 ref에 저장
  useEffect(() => {
    onRoadSelectRef.current = onRoadSelect;
  }, [onRoadSelect]);

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
      strokeWeight: calculatedStrokeWeight,
      strokeOpacity,
      strokeStyle: "solid",
      clickable: true, // 클릭 가능하도록 설정
    });

    polyline.setMap(map);
    polylineRef.current = polyline;

    // 마우스오버 효과
    kakao.maps.event.addListener(polyline, "mouseover", () => {
      polyline.setOptions({
        strokeColor: COLORS.primary[900],
        strokeWeight: calculatedStrokeWeight + 3,
        strokeOpacity: 1,
      });
    });

    kakao.maps.event.addListener(polyline, "mouseout", () => {
      polyline.setOptions({
        strokeColor: COLORS.primary[500],
        strokeWeight: calculatedStrokeWeight,
        strokeOpacity,
      });
    });

    // 클릭 이벤트 등록
    kakao.maps.event.addListener(polyline, "click", () => {
      onRoadSelectRef.current();
    });

    // cleanup
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, points, sectionName, mapLevel, strokeColor, strokeWeight, strokeOpacity, calculatedStrokeWeight]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
