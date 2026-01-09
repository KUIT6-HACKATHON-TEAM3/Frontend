# Garosugil Web

Spring Boot 서버와 연동되는 **가로수길 산책 경로 추천 서비스**의 웹 클라이언트입니다.
React와 카카오맵 API를 활용하여 사용자에게 최적의 산책 경로와 인터랙티브한 지도 경험을 제공합니다.

## 🛠️ 기술 스택

### Core

* **React 18**
* **TypeScript 5**
* **Vite** (Build Tool)

### Styling & UI

* **Tailwind CSS** (Utility-first CSS)
* **Framer Motion** (바텀 시트 및 인터랙션 애니메이션)

### Maps & State

* **Kakao Maps SDK** (지도 시각화 및 마커 처리)
* **React Router DOM** (페이지 라우팅)
* **Axios** (HTTP Client)

## ✨ 주요 기능

### 🗺️ 지도 및 경로 탐색 (`MapPage.tsx`)

* **실시간 위치 추적**: `navigator.geolocation`을 이용한 현 위치 표시 및 지도 중심 이동.
* **산책로 시각화**: `RoadPolyline` 컴포넌트를 통해 추천 산책로(Polyline)를 지도 위에 렌더링.
* **인터랙티브 마커**: 목적지 설정 및 출발/도착 핀(Pin) 커스텀 이미지 적용.
* **바텀 시트 UI**: Framer Motion을 활용한 드래그 가능한 하단 정보 카드 (경로 정보 → 상세 설정 → 길 안내).

### 🚶‍♀️ 경로 옵션 설정 (`RouteSelectionCard.tsx`)

* **맞춤 경로 선택**: '최단 경로(최소길)' vs '여유로운 산책 경로(여유길)' 선택 기능.
* **시간 조절 휠**: 스크롤 휠 UI를 통해 산책 시간을 5분 단위로 직관적으로 조절 가능.

### 🔐 인증 시스템 (`Login.tsx`, `Signup.tsx`)

* **JWT 연동**: 백엔드 API와 연동하여 HttpOnly Cookie 기반의 보안 로그인 처리.
* **회원가입**: 이메일, 비밀번호, 닉네임을 통한 신규 회원 등록.

### 📝 피드백 시스템 (`Feedback.tsx`)

* **태그 기반 리뷰**: "나무그늘", "야경맛집", "댕댕이천국" 등 감성 태그를 선택하여 산책 경험 공유.
* **직관적인 UI**: 그리드 레이아웃과 SVG 아이콘을 활용한 버튼형 인터페이스.

## 📂 프로젝트 구조

```bash
src/
├── assets/
│   └── icons/           # SVG 및 이미지 리소스 (logo, current-location 등)
├── components/
│   └── map/
│       ├── RoadPolyline.tsx      # 지도 위 산책로 렌더링
│       ├── RoadInfoCard.tsx      # 도로 정보 및 찜하기 카드
│       └── RouteSelectionCard.tsx # 경로 옵션 및 시간 선택 카드
├── pages/
│   ├── Login.tsx        # 로그인 페이지
│   ├── Signup.tsx       # 회원가입 페이지
│   ├── MapPage.tsx      # 메인 지도 화면
│   ├── Feedback.tsx     # 산책 종료 후 피드백
│   └── Settings.tsx     # 설정 및 마이페이지
├── api/
│   └── auth.ts          # 로그인/회원가입 API 호출 로직
├── data/
│   └── all_roads_walking_paths.ts # 산책로 좌표 데이터
└── App.tsx              # 라우팅 설정

```

## 🚀 실행 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정해야 합니다.

```env
# 카카오 맵 JavaScript 키
VITE_KAKAO_JS_KEY=your_kakao_js_key_here

# 백엔드 API 주소
VITE_API_URL=http://localhost:8080

```

### 2. 패키지 설치 및 실행

```bash
# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev

```

## 🔌 API 연동 흐름 (Auth)

1. **로그인 요청**: `authApi.login()`을 호출하여 이메일/비밀번호 전송.
2. **토큰 처리**:
* **Access Token**: 보안을 위해 브라우저의 **Cookie**에 자동 저장 (백엔드 `Set-Cookie` 헤더).
* **Refresh Token**: 응답 본문(Body)으로 수신 후 로컬 변수/메모리에 저장하여 갱신 시 사용.


3. **API 요청**: `withCredentials: true` 설정을 통해 모든 API 요청 시 쿠키가 자동으로 포함됨.

## 🎨 UI/UX 하이라이트

* **Framer Motion Variants**: `topBarVariants`, `bottomCardVariants` 등을 정의하여 부드러운 스프링(Spring) 애니메이션 구현.
* **Responsive Map Control**: 지도 레벨(Zoom Level)에 따라 산책로 선의 두께(`strokeWeight`)가 동적으로 조절됨.

## 📜 라이센스
