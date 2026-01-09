/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F4F9F1", // [배경색] 앱 전체 배경
          200: "#EBE5DD", // [NEW] 선택된 버튼 배경 (베이지색) - 팔레트 우측 상단
          300: "#B4B998", // [아이콘] 연두색/올리브 계열 - 팔레트 중간
          500: "#3E6B4F", // [강조] 전송 버튼, 메인 브랜드 컬러 - 팔레트 좌측 상단
          600: "#2F503B", // [호버] 전송 버튼 클릭 시 더 어두운 색
        },
        text: {
          200: "#7B7B7B", // [글자] 보조 텍스트 (회색) - 팔레트 우측 하단
          300: "#3D3D3D", // [글자] 중간 강조 텍스트
          500: "#1B1B1B"  // [글자] 메인 타이틀 (검정) - 팔레트 좌측 하단
        },
        component: {
          500: "#FCFDFB" // 흰색에 가까운 컴포넌트 배경
        }
      }
    },
  },
  plugins: [],
}