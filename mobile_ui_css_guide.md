# 📱 한눈섬길 (HN-Sumgil) 모바일 UI/CSS 수정 구조 가이드

이 문서는 **한눈섬길** 프로젝트의 모바일(Smartphones & Mobile Browsers, 360px~430px 기준) 반응형 UI/CSS 수정 작업을 효율적으로 진행하기 위한 **페이지 및 컴포넌트별 구조 맵과 체크리스트 가이드**입니다.

---

## 🗺️ 1. 페이지 및 컴포넌트 전체 구조 맵

```mermaid
graph TD
    App[Root Layout: layout.tsx] --> Nav[Navbar.tsx: #main-navbar]
    App --> Main[Main Content: #main-content]
    App --> Footer[Footer: #main-footer]

    Main --> HomePage[1. 메인 화면: / (page.tsx)]
    Main --> ExplorePage[2. 섬 탐색: /explore (page.tsx)]
    Main --> DetailPage[3. 섬 상세: /explore/[id] (IslandDetailClient.tsx)]
    Main --> ThemePage[4. 테마 매거진: /theme/[id] (MagazineViewer.tsx)]

    HomePage --> Hero[히어로 섹션: #hero-section]
    HomePage --> Curation[백패킹 성지: #curation-section]
    HomePage --> FerryComp[배편 요금 비교: #ferry-comparison-section]
    HomePage --> Youtube[유튜브 리뷰: #youtube-reviews-section]

    ExplorePage --> ExploreHeader[탐색 헤더 & 검색: #explore-header-section]
    ExplorePage --> ExploreControls[필터 & 정렬: #explore-controls-container]
    ExplorePage --> ExploreGrid[16개 섬 그리드: #explore-islands-section]

    DetailPage --> DetailIntro[섬 소개 카드: #island-intro-card]
    DetailPage --> DetailGallery[4구획 갤러리: #island-gallery-grid]
    DetailPage --> DetailAccordion[8종 아코디언 섹션: #island-sections-container]

    ThemePage --> Vol1[대청도 매거진: vol1.html]
    ThemePage --> Vol2[자월도 1박 4식 매거진: vol2.html]
```

---

## 🧩 2. 페이지별 주요 컴포넌트 및 ID 가이드

### ① 공통 요소 (Layout & Navigation)
- **파일 경로**: `src/components/Navbar.tsx`, `src/app/layout.tsx`
- **주요 ID**:
  - `#main-navbar` : 상단 내비게이션 바 (모바일 높이 `h-[72px]`)
  - `#nav-logo-link` : 한눈섬길 로고
  - `#nav-link-explore` : '한눈 탐색' 메뉴
  - `#nav-link-theme` : '테마 섬길' 메뉴
  - `#main-footer` : 하단 푸터 영역
- **모바일 점검 포인트**:
  - 상단 내비게이션 모바일 좌우 여백 (`px-4 sm:px-10`)
  - 모바일 해상도에서 텍스트 축소 (`text-xs sm:text-base`) 및 여백 적절성

---

### ② 메인 페이지 (`/`)
- **파일 경로**: `src/app/page.tsx`, `src/data/main.ts`
- **주요 ID 및 구조**:
  - `#hero-section` : 히어로 비주얼 (모바일 높이 `h-[100dvh] min-h-[600px]`)
    - `#hero-main-title` : 대형 타이틀 (`text-4xl sm:text-[88px]`)
    - `#hero-subtitle-ticker` : 롤링 텍스트 (`text-lg sm:text-[20px]`)
    - `#hero-cta-explore-btn` : `섬 탐색` CTA 버튼
    - `#hero-bottom-bar` : 하단 인디케이터 & 조종 바
  - `#curation-section` : 백패킹 인증 성지 컬렉션 (굴업도/무의도/대이작도)
    - `#curation-tab-popular`, `#curation-tab-recent` : 탭 버튼
    - `#curation-cards-grid` : 카드 3종 (모바일 1열 `grid-cols-1 md:grid-cols-3`)
  - `#ferry-comparison-section` : 배편 최저가 & 최단시간 Top 3
    - `#departure-filter-tabs` : 출발지 탭 버튼 3종 (`#departure-btn-0~2`)
    - `#cheap-ferry-routes-column`, `#fast-ferry-routes-column` : 2컬럼 비교 (모바일 1열 Stack)
  - `#youtube-reviews-section` : 유튜브 리뷰 카드 3종 & 모달 (`#youtube-video-modal`)

---

### ③ 섬 탐색 페이지 (`/explore`)
- **파일 경로**: `src/app/explore/page.tsx`
- **주요 ID 및 구조**:
  - `#explore-header-section` : 타이틀 및 검색 바
    - `#explore-search-input` : 검색 입력창 (`<input>`)
  - `#explore-controls-container` : 필터 & 정렬 컨트롤
    - `#explore-filter-nav` : 카테고리 필터 (전체/백패킹/트레킹/야영장)
    - `#explore-sort-controls` : 정렬 5종 (기본/시간/운임/숙박/식당)
  - `#explore-islands-section` : 16개 섬 리스트
    - `#explore-islands-grid` : 모바일 1열~2열 카드 그리드 (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`)
    - `#explore-island-card-[id]` : 각 섬 카드 요소

---

### ④ 섬 상세 페이지 (`/explore/[id]`)
- **파일 경로**: `src/components/IslandDetailClient.tsx`
- **주요 ID 및 구조**:
  - `#island-detail-container` : 상세 페이지 최상위 컨테이너
    - `#island-back-link` : '목록으로 돌아가기' 버튼
    - `#island-intro-card` : 섬 타이틀, 뱃지, 설명, 네이버 지도 링크
    - `#island-gallery-grid` : 4구획 대표 사진 (모바일 2x2 그리드 `grid-cols-2 sm:grid-cols-4`)
  - `#island-sections-container` : 8종 정보 아코디언
    - `#section-ferry` : 여객선 운항 및 운임 정보 (`#ferry-booking-link` 예매 버튼)
    - `#section-restaurant` : 주변 식당 정보
    - `#section-lodge` : 주변 숙박업소 현황
    - `#section-camping` : 야영장 정보
    - `#section-tide` : 실시간 3일 조석(물때) 정보 (모바일 1열~3열)
    - `#section-spot` : 추천 관광 명소 (모바일 1열 카드)
    - `#section-blog` : 네이버 블로그 최신 후기
    - `#section-youtube` : 생생 유튜브 영상 가이드 & 팝업 모달 (`#island-youtube-modal`)

---

### ⑤ 테마 섬길 매거진 페이지 (`/theme/[id]`)
- **파일 경로**: 
  - `src/app/theme/[id]/page.tsx`
  - `src/components/MagazineViewer.tsx`
  - `src/magazine/vol1.html` (대청도 낭만 트레킹)
  - `src/magazine/vol2.html` (자월도 1박 4식 패키지)
- **주요 구조**:
  - 아티클 메인 헤더 및 인트로 피치 박스
  - 3 ICONIC SPOTS 비경 카드
  - 일정별 맞춤 코스 탭 스위처 (당일치기 / 1박2일 / 2박3일)
  - 트레킹 미식 가이드 4선 카드 & 미식 상세 모달 (`#gourmet-modal`)
  - 트레킹 BGM 플레이리스트 & 하단 플로팅 플레이어 (`#youtube-player-bar`)
  - 1박 4식 민박 패키지 포토 갤러리 (사진 클릭 시 확대 모달 `#image-modal`)

---

## 📐 3. 모바일 반응형 CSS 디테일 점검 체크리스트

모바일 디바이스(아이폰 SE, 아이폰 14/15, 갤럭시 S23/S24 등)에서 시각적 완성도를 극대화하기 위한 체크리스트입니다.

| 점검 항목 | 체크 내용 | 추천 Tailwind CSS 패턴 |
| :--- | :--- | :--- |
| **1. 타이틀 & 본문 폰트** | 모바일 화면에서 글자가 과도하게 크거나 원치 않는 어색한 줄바꿈 방지 | `text-2xl sm:text-4xl`, `leading-tight`, `break-keep` (단어 단위 줄바꿈) |
| **2. 좌우 패딩 & 여백** | 화면 양 끝에 글자나 카드가 딱 붙지 않도록 안전 여백 제공 | `px-4 sm:px-6 md:px-10`, `py-6 sm:py-10` |
| **3. 터치 영역 (Touch Target)** | 손가락 터치가 용이하도록 버튼/탭 최소 높이 44px 이상 확보 | `h-11`, `h-12`, `min-h-[44px]`, `py-2.5 px-4` |
| **4. 가로 스크롤 탭** | 모바일에서 탭 버튼이 찌그러지지 않고 부드럽게 가로 스크롤되도록 설정 | `flex overflow-x-auto whitespace-nowrap scrollbar-none` |
| **5. 그리드 수량 전환** | PC의 3~4열 구조가 모바일에서는 1열 또는 2열로 자연스럽게 전환 | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| **6. 팝업 / 모달 스크롤** | 모바일 화면 높이가 작을 때 모달이 잘리지 않고 내부 스크롤 가능 | `max-h-[85vh] overflow-y-auto p-4 sm:p-6` |
| **7. 이미지 비율 & 오버플로우** | 이미지가 깨지거나 가로 뷰포트를 이탈하지 않도록 조절 | `w-full h-full object-cover rounded-xl overflow-hidden` |

---

## 🛠️ 4. 모바일 디테일 수정 추천 워크플로우

1. **대상 페이지 선택**: 
   - 예: `"메인 화면의 히어로 타이틀 폰트 크기랑 모바일 하단 바 여백 조정해줘"`
   - 예: `"섬 상세 페이지의 주변 식당 카드 모바일 패딩 수정해줘"`
2. **요청 전달**: 원하시는 픽셀/스타일 느낌을 말씀해 주시면 대상 컴포넌트 파일을 정확히 수정합니다.
3. **빌드 및 검증**: 수정 후 `pnpm run build` 검증 및 `main` 브랜치 자동 커밋/푸시를 진행합니다.

---
* 문서 생성일: 2026-08-08
* 문서 상태: 최신 한눈섬길 ID 및 컴포넌트 맵 반영 완료
