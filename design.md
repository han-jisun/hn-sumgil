web application/stitch/projects/15273525735598502025/screens/15903726197554659056
이 문서는 색상 대비, 타이포그래피 계층, 그리고 컴포넌트 구조를 명확히 정의하여 향후 일관된 디자인 확장을 돕습니다.
# Design System: 한눈섬길 (Hn-Sumgil)

## 1. Color Palette
인천 섬의 청량함과 여행의 활기를 담은 컬러 시스템입니다. 배경 이미지 위에서의 가독성을 위해 고대비 텍스트와 세미 투명 레이어를 활용합니다.

### Brand Colors
- **Primary (Blue):** `#00A3FF` (메인 강조색, 버튼 및 활성 탭)
- **Secondary (Cyan):** `#00BCD4` (보조 강조색, 정보 태그)
- **Point (Orange):** `#FF5722` (인기 순위 등 주목도 필요한 요소)

### Neutral Colors
- **Background:** `rgba(0, 0, 0, 0.4)` (배경 이미지 위 텍스트 가독성을 위한 오버레이)
- **Surface:** `rgba(255, 255, 255, 0.05)` (카드형 컴포넌트 배경)
- **Text Primary:** `#FFFFFF` (기본 텍스트 및 제목)
- **Text Secondary:** `rgba(255, 255, 255, 0.7)` (설명 및 부가 정보)
- **Border:** `rgba(255, 255, 255, 0.1)` (구분선 및 외곽선)

---

## 2. Typography
사용자의 시선을 사로잡는 굵은 헤드라인과 정보 전달력을 높이는 본문 서체를 사용합니다.

- **Display 1:** Sans-serif, 32px, Bold, Tracking -0.02em (메인 슬로건)
- **Heading 1:** Sans-serif, 24px, Bold (섹션 타이틀, 카드 제목)
- **Body 1:** Sans-serif, 16px, Regular (본문 설명, 요약)
- **Caption:** Sans-serif, 12px, Medium (태그, 통계 정보)

---

## 3. Spacing & Grid
- **Container Padding:** 20px (좌우 여백)
- **Section Spacing:** 48px (섹션 간 간격)
- **Item Spacing:** 16px (카드 및 리스트 내부 요소 간격)
- **Border Radius:** 24px (카드 및 버튼 둥글기)

---

## 4. Components

### Navigation Bar
- 상단 고정, 투명 배경 처리.
- 로고와 '홈', '탐색하기' 등 주요 메뉴 포함.

### Hero Section
- 섬 배경 이미지를 전면에 배치.
- 중앙 정렬된 메인 슬로건과 탐색 유도 버튼(`Primary Blue`).

### Ranking Card
- `Surface` 배경과 `Border` 적용.
- 섬 이미지 썸네일, 인기 순위 배지, 핵심 정보(소요시간, 비용, 가능 여부)를 포함한 그리드 레이아웃.
- 하단에 '상세 정보 확인' 고스트 버튼 배치.

### Footer
- 하단 배치, 보조 메뉴 리스트와 저작권 정보 포함