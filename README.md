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

* **카카오맵 통합**
  - 카카오맵 SDK 동적 로드 및 Services 라이브러리 활용
  - 지도 레벨(줌)에 따라 산책로 선 굵기 자동 조절

* **실시간 위치 추적**
  - `navigator.geolocation`을 이용한 현재 위치 수집
  - 빨간 마커로 현재 위치 표시 및 지도 중심 이동

* **산책로 시각화**
  - `all_roads_walking_paths.ts` 데이터 기반 Polyline 렌더링
  - 마우스 오버 시 산책로 강조 표시 (색상 변경)
  - 클릭 시 산책로 상세 정보 카드 표시

* **경로 탐색 워크플로우**
  1. 지도 클릭으로 목적지 설정 (목적지 마커 생성)
  2. "경로 탐색" 버튼 클릭
  3. 최소길/여유길 선택 + 추가 산책 시간 설정
  4. `routesApi.search()` 호출로 경로 검색
  5. 검색된 경로를 파란 Polyline으로 표시

* **바텀 시트 UI**
  - Framer Motion 드래그 인터랙션
  - 3가지 카드 타입: ROAD(산책로 정보) / DESTINATION(목적지 설정) / ROUTE_OPTIONS(경로 선택)
  - 위/아래 드래그로 카드 상태 전환

### 🚶‍♀️ 경로 옵션 설정 (`RouteSelectionCard.tsx`)

* **2가지 경로 타입**
  - **최소길**: 가장 빠른 경로 (fastest)
  - **여유길**: 산책로 중심의 여유로운 경로 (avenue)

* **시간 조절 휠 피커**
  - 0~30분까지 1분 단위 선택 가능
  - 스크롤 휠 UI로 직관적인 시간 설정
  - 선택한 시간만큼 산책 시간 추가

* **거리 및 시간 계산**
  - Haversine 공식으로 두 지점 간 거리 계산
  - 도보 속도 67m/분 기준 예상 시간 산출

### ⭐ 즐겨찾기 시스템 (`FavoriteRoadsStore.tsx`)

* **Zustand 상태 관리**
  - 즐겨찾기 목록 클라이언트 상태 관리
  - `loadFavorites()`: 서버에서 즐겨찾기 목록 로드
  - `addFavorite()`: 산책로 즐겨찾기 추가
  - `removeFavorite()`: 즐겨찾기 삭제 (낙관적 UI 업데이트)
  - `isFavorite()`: 즐겨찾기 여부 확인

* **Settings 페이지 연동**
  - 사용자가 즐겨찾기한 산책로 목록 표시
  - 클릭 시 해당 산책로로 지도 이동

### 🔐 인증 시스템 (`auth.ts`, `http.ts`)

* **JWT 토큰 기반 인증**
  - Access Token: HttpOnly Cookie에 자동 저장 (보안)
  - Refresh Token: LocalStorage에 저장

* **자동 토큰 재발급**
  - Axios 인터셉터로 401 응답 감지
  - 동시성 제어로 중복 재발급 요청 방지
  - 재발급 실패 시 로그인 페이지로 리다이렉트

* **회원가입 플로우**
  - 이메일 인증 코드 발송 (`sendEmailCode`)
  - 인증 코드 검증 (`verifyEmailCode`)
  - 회원가입 완료 (`signup`)

### 📝 피드백 및 태그 시스템 (`Feedback.tsx`, `emoji.ts`)

* **감성 태그 선택**
  - "나무그늘", "야경맛집", "댕댕이천국", "데이트코스" 등
  - 그리드 레이아웃 + SVG 아이콘 UI

* **태그 통계 표시**
  - 각 산책로별 태그 집계
  - RoadInfoCard에 이모지로 표시

### 🎵 음악 추천 (`music.ts`)

* **산책 중 음악 추천**
  - 선택한 산책로와 기분에 맞는 음악 추천
  - `recommend(roadId, mood)` API 호출

### 🔍 근처 산책로 검색 (`roads.ts`)

* **위치 기반 검색**
  - `getNearby(lat, lng)`: 현재 위치 근처 산책로 조회
  - `getDetail(segmentId)`: 특정 산책로 상세 정보 조회

## 📂 프로젝트 구조

```bash
src/
├── api/                 # API 통신 레이어
│   ├── http.ts          # Axios 인스턴스, 인터셉터, 토큰 재발급
│   ├── auth.ts          # 인증 (로그인/회원가입/이메일 인증)
│   ├── roads.ts         # 산책로 정보 조회 (상세, 근처 검색)
│   ├── routes.ts        # 경로 검색 (최소길/여유길)
│   ├── favorites.ts     # 즐겨찾기 관리 (추가/조회/삭제)
│   ├── emoji.ts         # 이모지 태그 추가
│   └── music.ts         # 음악 추천
├── assets/
│   └── icons/           # SVG 및 이미지 리소스
├── components/
│   ├── map/
│   │   ├── RoadPolyline.tsx      # 카카오맵 산책로 Polyline 렌더링
│   │   ├── RoadInfoCard.tsx      # 산책로 정보 카드 (좋아요, 태그)
│   │   └── RouteSelectionCard.tsx # 경로 옵션 (최소길/여유길, 시간 휠)
│   ├── AuthInput.tsx    # 인증 입력 필드
│   └── Button.tsx       # 공통 버튼 컴포넌트
├── constants/
│   └── colors.ts        # 색상 팔레트
├── data/
│   └── all_roads_walking_paths.ts # 산책로 좌표 데이터
├── dto/                 # API 요청/응답 타입 정의
│   ├── RoadInfoResponseDto.tsx
│   ├── SearchPathResponseDto.tsx
│   └── ... 등
├── pages/
│   ├── MapPage.tsx      # 메인 지도 화면 (경로 검색, 마커, Polyline)
│   ├── Login.tsx        # 로그인 페이지
│   ├── Signup.tsx       # 회원가입 페이지
│   ├── Settings.tsx     # 설정 및 마이페이지
│   └── Feedback.tsx     # 산책 후 태그 기반 피드백
├── stores/              # Zustand 상태 관리
│   ├── FavoriteRoadsStore.tsx  # 즐겨찾기 목록 관리
│   ├── UserInfoStore.tsx       # 사용자 정보
│   └── UserLocationStore.tsx   # 사용자 위치
├── type/                # 커스텀 타입 정의
├── App.tsx              # 라우팅 설정
└── main.tsx             # 진입점

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


## 배포 url
https://frontend-ochre-chi-68.vercel.app/