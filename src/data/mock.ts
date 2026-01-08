export interface PathSegment {
  id: number;
  name: string;      // 예: "능동로 가로수길 1"
  roadName: string;  // 예: "능동로" (묶어서 보여줄 때 쓸 큰 이름)
  path: { lat: number; lng: number }[]; // 좌표 배열
  description: string;
}

// 파일(all_roads_walking_paths.json)에 들어있을 법한 데이터 예시
export const STREET_SEGMENTS: PathSegment[] = [
  {
    id: 101,
    name: "능동로 가로수길 1", 
    roadName: "능동로",
    path: [
      { lat: 37.540, lng: 127.070 },
      { lat: 37.541, lng: 127.071 }, // 중간 끊김
    ],
    description: "스타벅스 앞 그늘 구간"
  },
  {
    id: 102,
    name: "능동로 가로수길 2",
    roadName: "능동로",
    path: [
      { lat: 37.541, lng: 127.071 }, // 1번 구간 끝에서 다시 시작
      { lat: 37.543, lng: 127.073 },
    ],
    description: "건대 병원 맞은편"
  },
  // ... 수십 개의 구간들
];