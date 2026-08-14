# 한눈섬길 — 디자인 시스템

작성일 2026-07-29 · 개정 2026-08-13 (v1.1)
범위: 파운데이션 토큰 + 기본 컴포넌트 + 레이아웃/그리드 + 매거진 페이지 패턴

**원칙**

- 모든 수치는 4 또는 8의 배수 (선 두께 제외)
- 줄간격은 % 정수, 끝자리 0 또는 5
- 폰트는 Noto Sans KR 단일
- 키 컬러는 500에 배치

---

## 1. Color

### 1-1. Base

| Token | HEX |
|---|---|
| `--white` | `#FFFFFF` |
| `--black` | `#000000` |

### 1-2. Main — 키 컬러 `#0F3E17` @ 500

| Token | HEX | 흰 글씨 | 등급 | 검은 글씨 | 등급 |
|---|---|---|---|---|---|
| `--main-50` | `#E6FDE5` | 1.07:1 | – | 19.55:1 | AAA |
| `--main-100` | `#BCD2BC` | 1.61:1 | – | 13.08:1 | AAA |
| `--main-200` | `#94A994` | 2.51:1 | – | 8.36:1 | AAA |
| `--main-300` | `#688468` | 4.13:1 | AA Large | 5.09:1 | AA |
| `--main-400` | `#3C603E` | 7.16:1 | AAA | 2.93:1 | – |
| **`--main-500`** | **`#0F3E17`** | 12.20:1 | AAA | 1.72:1 | – |
| `--main-600` | `#093712` | 13.40:1 | AAA | 1.57:1 | – |
| `--main-700` | `#04300C` | 14.65:1 | AAA | 1.43:1 | – |
| `--main-800` | `#022904` | 15.89:1 | AAA | 1.32:1 | – |
| `--main-900` | `#022100` | 17.21:1 | AAA | 1.22:1 | – |

> 키 컬러의 명도가 L\*22로 낮아 600~900 구간이 좁게 붙는다. 이 구간을 넓히려면 키 컬러를 600에 배치하면 되고, 그때는 700~900이 한 단계씩 더 여유를 갖는다.

### 1-3. Sub — 키 컬러 `#B6CED5` @ 500

| Token | HEX | 흰 글씨 | 등급 | 검은 글씨 | 등급 |
|---|---|---|---|---|---|
| `--sub-50` | `#E7FAFF` | 1.08:1 | – | 19.52:1 | AAA |
| `--sub-100` | `#DCF1F7` | 1.17:1 | – | 17.97:1 | AAA |
| `--sub-200` | `#D3E8EE` | 1.27:1 | – | 16.55:1 | AAA |
| `--sub-300` | `#C9DFE6` | 1.38:1 | – | 15.18:1 | AAA |
| `--sub-400` | `#C0D7DD` | 1.50:1 | – | 14.01:1 | AAA |
| **`--sub-500`** | **`#B6CED5`** | 1.64:1 | – | 12.78:1 | AAA |
| `--sub-600` | `#8B9DA2` | 2.82:1 | – | 7.44:1 | AAA |
| `--sub-700` | `#626E71` | 5.27:1 | AA | 3.99:1 | AA Large |
| `--sub-800` | `#3A4346` | 10.14:1 | AAA | 2.07:1 | – |
| `--sub-900` | `#151D1F` | 17.11:1 | AAA | 1.23:1 | – |

### 1-4. Gray

| Token | HEX | 흰 글씨 | 등급 | 검은 글씨 | 등급 |
|---|---|---|---|---|---|
| `--gray-50` | `#F6F6F6` | 1.08:1 | – | 19.43:1 | AAA |
| `--gray-100` | `#E8E8E8` | 1.23:1 | – | 17.14:1 | AAA |
| `--gray-200` | `#D4D4D4` | 1.48:1 | – | 14.17:1 | AAA |
| `--gray-300` | `#BBBBBB` | 1.92:1 | – | 10.94:1 | AAA |
| `--gray-400` | `#A0A0A0` | 2.61:1 | – | 8.03:1 | AAA |
| `--gray-500` | `#848484` | 3.74:1 | AA Large | 5.61:1 | AA |
| `--gray-600` | `#6A6A6A` | 5.41:1 | AA | 3.88:1 | AA Large |
| `--gray-700` | `#525252` | 7.81:1 | AAA | 2.69:1 | – |
| `--gray-800` | `#3B3B3B` | 11.20:1 | AAA | 1.87:1 | – |
| `--gray-900` | `#282828` | 14.74:1 | AAA | 1.42:1 | – |

> 등급 기준 — AAA 7:1 이상 / AA 4.5:1 이상 / AA Large 3:1 이상 (18px 이상 또는 14px Bold)

---

## 2. Typography

### 2-1. Font

| 항목 | 값 |
|---|---|
| Family | **Noto Sans KR** |
| Fallback | `'Noto Sans KR', 'Noto Sans', sans-serif` |
| Weight | 300 Light / 400 Regular / 500 Medium / 700 Bold |
| 숫자 | `font-feature-settings: "tnum" 1` — 고정폭 |

### 2-2. Scale

| Token | Size | Line Height | Weight | Letter Spacing |
|---|---|---|---|---|
| `--font-display` | 64px | 120% | 300 | -2% |
| `--font-h1` | 48px | 125% | 400 | -2% |
| `--font-h2` | 40px | 130% | 400 | -1% |
| `--font-h3` | 32px | 135% | 500 | -1% |
| `--font-h4` | 24px | 140% | 500 | 0 |
| `--font-h5` | 20px | 145% | 500 | 0 |
| `--font-body-lg` | 20px | 160% | 400 | 0 |
| `--font-body` | 16px | 160% | 400 | 0 |
| `--font-caption` | 12px | 150% | 400 | 0 |
| `--font-label` | 12px | 100% | 500 | 5% |
| `--font-data-lg` | 40px | 100% | 300 | -2% |
| `--font-data` | 20px | 100% | 500 | 0 |

### 2-3. 유동 타입 (반응형)

화면 폭에 따라 축소되는 토큰. 최소값은 Narrow 가독성 하한, 최대값은 2-2 스케일 값이다.

| Token | 반응형 값 |
|---|---|
| `--font-display` | `clamp(32px, 5vw, 64px)` |
| `--font-h1` | `clamp(28px, 3.6vw, 48px)` |
| `--font-h4` | `clamp(19px, 1.8vw, 22px)` |
| `--font-data-lg` | `clamp(28px, 3.2vw, 40px)` |
| `--font-body` / `--font-caption` / `--font-label` | 고정 (16 / 12 / 12) |

---

## 3. Spacing

4의 배수. 16 이상은 8의 배수.

| Token | 값 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 48px |
| `--space-9` | 64px |
| `--space-10` | 80px |
| `--space-11` | 96px |
| `--space-12` | 128px |

---

## 4. Radius

| Token | 값 |
|---|---|
| `--radius-none` | 0 |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 999px |

---

## 5. Border

| Token | 값 |
|---|---|
| `--border-thin` | 1px |
| `--border-base` | 2px |
| `--border-color` | `--gray-200` |
| `--border-color-strong` | `--gray-400` |

---

## 6. Button

3가지 상태만 정의한다 — **Default / Hover / Disabled**

### 6-1. Size

| Size | Font | Padding | Height | Radius |
|---|---|---|---|---|
| Large | 20px | 16px 32px | 64px | 8px |
| Medium | 16px | 12px 24px | 48px | 8px |
| Small | 12px | 8px 16px | 32px | 8px |

### 6-2. Primary (Filled)

| 상태 | 배경 | 텍스트 | 테두리 |
|---|---|---|---|
| Default | `--main-500` `#0F3E17` | `--white` | 없음 |
| Hover | `--main-600` `#093712` | `--white` | 없음 |
| Disabled | `--gray-200` `#D4D4D4` | `--gray-400` `#A0A0A0` | 없음 |

### 6-3. Secondary (Outline)

| 상태 | 배경 | 텍스트 | 테두리 |
|---|---|---|---|
| Default | `--white` | `--main-500` | 1px `--main-500` |
| Hover | `--main-50` `#E6FDE5` | `--main-500` | 1px `--main-500` |
| Disabled | `--white` | `--gray-400` | 1px `--gray-200` |

### 6-4. Tertiary (Text)

| 상태 | 배경 | 텍스트 | 테두리 |
|---|---|---|---|
| Default | 투명 | `--main-500` | 없음 |
| Hover | `--gray-50` `#F6F6F6` | `--main-500` | 없음 |
| Disabled | 투명 | `--gray-400` | 없음 |

---

## 7. Layout & Grid

### 7-1. 컨테이너

| 항목 | 값 |
|---|---|
| 콘텐츠 최대 폭 | 1440px |
| 좌우 마진 | `clamp(16px, 4vw, 40px)` |
| 페이지 배경 | `--white` |

1440px 초과 시 콘텐츠는 가운데 정렬한다. 풀블리드 이미지와 반전 섹션의 배경은 화면 폭 전체로 확장한다.

### 7-2. 12컬럼 그리드

```css
grid-template-columns: repeat(12, minmax(0, 1fr));
column-gap: clamp(16px, 2.2vw, 32px);
row-gap: clamp(24px, 3vw, 40px);
```

모든 요소는 12컬럼 위에 span 단위로 배치한다. 컬럼 수는 전 구간 12로 고정하고 스팬만 재배치한다.

### 7-3. 브레이크포인트

| 이름 | 범위 |
|---|---|
| Wide | 1120px 이상 |
| Mid | 768 – 1119px |
| Narrow | 767px 이하 |

### 7-4. 스팬 매핑

| 역할 | Wide | Mid | Narrow |
|---|---|---|---|
| 섹션 번호 | 3 | 12 | 12 |
| 섹션 제목 | 5 | 7 | 12 |
| 섹션 리드문 | 4 | 5 | 12 |
| 본문 카드 (2열) | 6 | 12 | 12 |
| 본문 카드 (4열) | 3 | 6 | 12 |
| 통계 카드 (3열) | 4 | 6 | 12 |
| 정보 테이블 | 8 | 12 | 12 |
| 목차 — 번호 | 1 | 1 | 2 |
| 목차 — 제목 | 6 | 7 | 10 |
| 목차 — 태그 | 3 | 4 | 12 |
| 목차 — 날짜 | 2 | 12 | 12 |

### 7-5. 수직 리듬

| 구간 | 값 |
|---|---|
| 섹션 상하 패딩 | `clamp(48px, 7vw, 104px)` |
| 블록 사이 | `clamp(24px, 3vw, 40px)` |
| 요소 사이 | `--space-2` ~ `--space-5` |

---

## 8. Page Pattern — 매거진 게시글

### 8-1. 골격

```
커버 (마스트헤드)
섹션 01  헤더 → 풀블리드 사진 + 풀쿼트 → 스텝 그리드 → 포인트 4
섹션 02  반전 섹션(--main-500) · 카드 3개 병렬
섹션 03  헤더 → 통계 3 → 정보 테이블 8 + CTA 4
게시글 목차
```

### 8-2. 커버

색면과 타입으로만 구성한다. 구성 순서는 라벨 → 제목 → 리드문 → 하단 메타 rail(발행일 · 필자 · 분량 · 섹션 앵커). 텍스트는 `--white`.

### 8-3. 서체 위계

| 위치 | 토큰 | Weight |
|---|---|---|
| 커버 제목 | `--font-display` | 300 (강조 어절 500) |
| 섹션 제목 | `--font-h1` | 400 |
| 소제목 | `--font-h4` | 500 |
| 본문 | `--font-body` / 15px | 300 |
| 라벨 / 캡션 | `--font-label` / `--font-caption` | 500 / 400 |

본문은 `line-height: 180%`, `word-break: keep-all`, `text-wrap: pretty`.

### 8-4. 구분선

카드·그림자·라운드를 쓰지 않고 1px 헤어라인으로 구획한다.

| 위치 | 값 |
|---|---|
| 상단 강조선 | 1px `--gray-900` |
| 부속선 | 1px `--gray-100` |
| 반전 섹션 강조선 | 1px `rgba(255,255,255,0.4)` |
| 반전 섹션 부속선 | 1px `rgba(255,255,255,0.22)` |

선 두께는 전 구간 1px.

---

## 9. 매거진 컴포넌트

### 9-1. Step Item

`번호(--main-100) + 시간 라벨(--main-500)` → 사진(선택) → 소제목 `--font-h4` → 본문. Wide 6 또는 3컬럼.

### 9-2. Full-bleed Figure

높이 `clamp(260px, 44vw, 560px)`. 하단 60%에 `linear-gradient(rgba(2,33,0,0) → rgba(2,33,0,0.72))`를 깔고 풀쿼트를 얹을 수 있다. 캡션은 1440 컨테이너 기준 정렬, `--font-caption` `--gray-500`.

### 9-3. Post Index

행 구성은 번호 / 제목 / 태그 / 날짜, 스팬은 7-4 표를 따른다. 행 구분선 1px `--gray-900`.
현재 글 행은 배경 `#F2FCF1`, 텍스트 `--main-500`, 화면 폭 전체로 확장하며 다음 행 간격까지 배경이 이어진다. 좌우 패딩과 굵은 강조선은 쓰지 않는다.

### 9-4. Stat Card

라벨 `--font-label` → 수치 `--font-data-lg` `--main-500` → 요약 18px/500 → 설명 14px/300. 상단 1px `--gray-900`.

---

## 10. 이미지 없는 게시글

| 요소 | 사진 있음 | 사진 없음 |
|---|---|---|
| 섹션 01 히어로 | 풀블리드 사진 + 오버레이 풀쿼트 | `--main-500` 색면 풀쿼트 밴드 |
| 스텝 사진 | 표시 | 숨김 |
| 식사 4칸 | 사진 + 캡션 | 1px 구분선 + 텍스트 리스트 |
| 목차 · 통계 | — | 동일 |

사진 자리는 `--gray-100` 플레이스홀더로 두고 캡션은 유지한다. 사진·정보 출처는 섹션 하단에 `--font-caption`으로 표기한다.

---

## 11. 게시글 컬러 룰

게시물마다 달라지는 것은 **커버 배경색 하나**다. 나머지는 파운데이션 컬러를 쓴다.

| 대상 | 색 |
|---|---|
| 커버 배경 | 아래 팔레트 중 1개, 게시글 단위 고정 |
| 커버 텍스트 | `--white` |
| 본문 강조 · 번호 · 수치 · CTA · 반전 섹션 | `--main-500` / `--main-900` / `--main-100` / `--main-50` |

### 커버 팔레트

| 이름 | HEX | 이름 | HEX |
|---|---|---|---|
| 포레스트 | `#0F3E17` | 탠저린 | `#93450F` |
| 시글래스 | `#0A5754` | 머스터드 | `#6E5108` |
| 코발트 | `#123C86` | 라일락 | `#4A3691` |
| 스카이 | `#125F8C` | 체리 | `#87204A` |
| 코랄 | `#9E2F28` | 민트 | `#15613D` |

한 게시물에는 한 색만 쓴다. 이 팔레트는 매거진 커버 전용이며 서비스 UI에는 적용하지 않는다.

---

## 12. 접근성

- 등급 기준 — AAA 7:1 이상 / AA 4.5:1 이상 / AA Large 3:1 이상
- 12~13px 텍스트에 반투명 흰색을 쓰지 않는다. 반전 배경 위에서는 `--white` 또는 `--main-50`.
- 커버 배경은 흰 글자 대비 5.5:1 이상만 채택한다.
- 밝은 배경 위 강조색은 `--main-500`. `--main-100`은 장식 숫자 전용.

---

## 13. 아직 안 정한 것

- [ ] 키 컬러 배치 — 500 유지할지, 600으로 옮길지
- [ ] Semantic 컬러 (Success / Warning / Error / Info) — 등록 여부와 색상
- [ ] 그림자 사용 여부
- [ ] 아이콘 세트
- [ ] 다크모드
- [ ] Input, Checkbox, Radio, Select 등 나머지 파운데이션 컴포넌트

---

## 부록 — CSS

```css
:root {
  /* Base */
  --white: #FFFFFF;
  --black: #000000;

  /* Main */
  --main-50:  #E6FDE5;
  --main-100: #BCD2BC;
  --main-200: #94A994;
  --main-300: #688468;
  --main-400: #3C603E;
  --main-500: #0F3E17;
  --main-600: #093712;
  --main-700: #04300C;
  --main-800: #022904;
  --main-900: #022100;

  /* Sub */
  --sub-50:  #E7FAFF;
  --sub-100: #DCF1F7;
  --sub-200: #D3E8EE;
  --sub-300: #C9DFE6;
  --sub-400: #C0D7DD;
  --sub-500: #B6CED5;
  --sub-600: #8B9DA2;
  --sub-700: #626E71;
  --sub-800: #3A4346;
  --sub-900: #151D1F;

  /* Gray */
  --gray-50:  #F6F6F6;
  --gray-100: #E8E8E8;
  --gray-200: #D4D4D4;
  --gray-300: #BBBBBB;
  --gray-400: #A0A0A0;
  --gray-500: #848484;
  --gray-600: #6A6A6A;
  --gray-700: #525252;
  --gray-800: #3B3B3B;
  --gray-900: #282828;

  /* Typography */
  --font-family: 'Noto Sans KR', 'Noto Sans', sans-serif;

  --font-display: 64px;   --lh-display: 120%;
  --font-h1: 48px;        --lh-h1: 125%;
  --font-h2: 40px;        --lh-h2: 130%;
  --font-h3: 32px;        --lh-h3: 135%;
  --font-h4: 24px;        --lh-h4: 140%;
  --font-h5: 20px;        --lh-h5: 145%;
  --font-body-lg: 20px;   --lh-body-lg: 160%;
  --font-body: 16px;      --lh-body: 160%;
  --font-caption: 12px;   --lh-caption: 150%;
  --font-label: 12px;     --lh-label: 100%;
  --font-data-lg: 40px;   --lh-data-lg: 100%;
  --font-data: 20px;      --lh-data: 100%;

  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-bold: 700;

  /* Fluid Typography */
  --font-display-fluid: clamp(32px, 5vw, 64px);
  --font-h1-fluid:      clamp(28px, 3.6vw, 48px);
  --font-h4-fluid:      clamp(19px, 1.8vw, 22px);
  --font-data-lg-fluid: clamp(28px, 3.2vw, 40px);

  /* Spacing */
  --space-1: 4px;    --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;   --space-5: 24px;   --space-6: 32px;
  --space-7: 40px;   --space-8: 48px;   --space-9: 64px;
  --space-10: 80px;  --space-11: 96px;  --space-12: 128px;

  /* Layout */
  --container-max: 1440px;
  --container-pad: clamp(16px, 4vw, 40px);
  --grid-columns: 12;
  --grid-gutter: clamp(16px, 2.2vw, 32px);
  --grid-row-gap: clamp(24px, 3vw, 40px);
  --section-pad-y: clamp(48px, 7vw, 104px);
  --bp-wide: 1120px;
  --bp-mid: 768px;

  /* Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;

  /* Border */
  --border-thin: 1px;
  --border-base: 2px;
  --border-color: var(--gray-200);
  --border-color-strong: var(--gray-400);
}
```
