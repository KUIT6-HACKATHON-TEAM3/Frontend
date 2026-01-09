// 프로젝트 전역 색상 상수
export const COLORS = {
  primary: {
    100: "#F4F9F1",
    500: "#A8E063",
    900: "#00FF42"
  },
  text: {
    200: "#7B7B7B",
    300: "#3D3D3D",
    500: "#1B1B1B"
  },
  component: {
    500: "#FCFDFB"
  },
} as const;

export type ColorKeys = keyof typeof COLORS;