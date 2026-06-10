export interface Review {
  name: string;
  rating: number;
  content: string;
  date: string;
}

export interface Trail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  distance: string;
  duration: string;
  difficulty: "쉬움" | "보통" | "어려움";
  category: "nature" | "ocean" | "alley" | "culture";
  categoryLabel: string;
  image: string;
  location: string;
  tags: string[];
  tips: string[];
  reviews: Review[];
  checklist: string[];
  season: string;
}

export const trails: Trail[] = [
  {
    id: "1",
    title: "비자림 비밀의 숲길",
    subtitle: "천년의 비자나무 사이로 비치는 햇살과 바람",
    description: "제주 구좌읍 깊은 곳에 위치한 신비로운 숲길입니다. 수백 년 된 비자나무들이 터널을 이뤄 고요한 산책을 즐기기 좋습니다.",
    details: "비자림은 500~800년생 비자나무들이 군락을 이룬 세계적으로도 보기 드문 원시림입니다. 붉은 화산송이(Scoria) 길을 걸으며 비자나무가 뿜어내는 짙은 피톤치드를 온몸으로 느낄 수 있습니다. 비 오는 날이면 더욱 깊어지는 흙 내음과 신비로운 안개가 몽환적인 분위기를 자아냅니다.",
    distance: "3.2 km",
    duration: "1시간 10분",
    difficulty: "쉬움",
    category: "nature",
    categoryLabel: "숲/자연",
    image: "/images/forest_trail.png",
    location: "제주특별자치도 제주시 구좌읍 비자숲길 15",
    tags: ["피톤치드", "치유", "숲터널", "가족여행"],
    tips: [
      "아침 8시~9시 사이에 방문하시면 이슬 머금은 숲과 조용한 산책을 즐기실 수 있습니다.",
      "화산송이 길이므로 편안한 운동화나 단화를 신는 것을 권장합니다.",
      "입구에서 가벼운 생수 한 병을 챙겨 들어가세요."
    ],
    reviews: [
      { name: "김민우", rating: 5, content: "비 오는 날 방문했는데 정말 신비로웠습니다. 숲 향기가 아직도 잊혀지지 않네요.", date: "2026-05-20" },
      { name: "이지연", rating: 5, content: "부모님 모시고 가기 딱 좋은 코스입니다. 평탄하고 걷기 편해요.", date: "2026-05-18" },
      { name: "David L.", rating: 4, content: "Beautiful cedar forest. Highly recommend going early to beat any crowds.", date: "2026-05-12" }
    ],
    checklist: [
      "편한 운동화 착용하기",
      "카메라 또는 휴대폰 완충하기",
      "쓰레기 되가져올 작은 봉투",
      "가벼운 식수"
    ],
    season: "사계절 내내 (특히 비 오는 날 추천)"
  },
  {
    id: "2",
    title: "한두기 바다노을길",
    subtitle: "검은 현무암과 붉은 노을이 만들어내는 해안 절경",
    description: "제주 해안을 따라 걷는 고요한 올레길 코스로, 바위 위를 스치는 파도와 수평선 너머로 저무는 붉은 노을이 아름다운 길입니다.",
    details: "한두기 바다노을길은 제주시 용담동 해안을 따라 걷는 코스로, 오랜 세월 파도에 깎인 검은 현무암 바위들과 넓게 펼쳐진 푸른 바다가 어우러져 절경을 이룹니다. 특히 해 질 무렵에 방문하면 온 하늘과 바다가 주황빛과 붉은빛으로 물드는 황홀한 일몰을 감상할 수 있습니다. 바다 위를 가로지르는 용담 구름다리와 인근 용두암까지 함께 둘러보며 제주의 서정적인 바다 정취를 온전히 느껴보세요.",
    distance: "2.8 km",
    duration: "50분",
    difficulty: "쉬움",
    category: "ocean",
    categoryLabel: "바다",
    image: "/images/coast_trail.png",
    location: "제주특별자치도 제주시 용담이동 서해안로 일대",
    tags: ["바다노을", "해안도로", "용두암", "낙조"],
    tips: [
      "일몰 시간 약 30분 전에 방문하시면 하늘이 물드는 가장 아름다운 순간을 보실 수 있습니다.",
      "바닷바람이 강할 수 있으니 체온 유지를 위해 가벼운 바람막이나 겉옷을 준비하세요.",
      "용담 구름다리 근처 포구의 야경도 수려하니 해가 진 후에도 가볍게 산책해보세요."
    ],
    reviews: [
      { name: "민지현", rating: 5, content: "제주공항 근처라서 여행 첫날이나 마지막 날 노을 보러 가기에 정말 최고의 코스입니다.", date: "2026-05-25" },
      { name: "최승우", rating: 4, content: "해안도로를 따라 맛집과 카페가 많아서 걷다가 마음에 드는 곳에 들어가 쉬기 좋습니다.", date: "2026-05-19" }
    ],
    checklist: [
      "바람막이 점퍼",
      "편안한 운동화",
      "카메라 또는 충전된 스마트폰",
      "선글라스"
    ],
    season: "사계절 내내 (특히 맑은 날 해질녘 추천)"
  },
  {
    id: "3",
    title: "성읍민속마을 돌담길",
    subtitle: "백년의 역사와 바람을 견뎌낸 전통 제주 돌담 골목",
    description: "시간이 멈춘 듯한 옛 제주의 초가집과 현무암 돌담 골목입니다. 돌담 벽 너머로 보이는 팽나무와 고즈넉한 제주 정취를 느껴보세요.",
    details: "제주도 서귀포시에 위치한 성읍민속마을은 조선시대 정의현의 도읍지였던 옛 모습을 그대로 간직한 민속촌이자 실제 주민들이 생활하는 마을입니다. 거칠고 투박하게 쌓아 올린 검은 현무암 돌담길 구석구석을 걷다 보면, 제주 특유의 올레 감성과 옛 민초들의 삶의 지혜가 고스란히 느껴집니다. 해질녘 주황빛 가로등이 켜지는 조용한 돌담 골목은 한층 더 아늑함을 선사합니다.",
    distance: "2.1 km",
    duration: "45분",
    difficulty: "쉬움",
    category: "alley",
    categoryLabel: "숨은 골목",
    image: "/images/hanok_alley.png",
    location: "제주특별자치도 서귀포시 표선면 성읍정의현로 일대",
    tags: ["제주돌담", "역사여행", "인생샷", "초가집"],
    tips: [
      "실제 주민분들이 조용히 거주하는 생활 공간이므로 소음에 주의해 주세요.",
      "마을 안 전통 찻집에서 제주의 따뜻한 귤피차나 메밀차 한 잔을 즐겨보세요.",
      "오후 5시~6시 무렵 붉은 하늘 아래 돌담 그림자가 드리워질 때 가장 예쁩니다."
    ],
    reviews: [
      { name: "정다은", rating: 5, content: "제주 특유의 초가집과 투박한 돌담이 너무 조화로워요. 산책하는 내내 마음이 평온해졌습니다.", date: "2026-05-29" },
      { name: "박준형", rating: 4, content: "민속마을 입구 무료 주차장을 이용하고 천천히 도보로 들어가시는 것을 추천합니다.", date: "2026-05-22" }
    ],
    checklist: [
      "편안한 걷기용 단화",
      "카메라 또는 충전된 스마트폰",
      "주민 생활권 에티켓 준수 (정숙)",
      "햇빛 가릴 모자"
    ],
    season: "사계절 내내 (특히 바람 부는 가을)"
  },
  {
    id: "4",
    title: "사계리 감성 서점길",
    subtitle: "제주 바닷바람과 책 향기가 어우러진 작은 문화 도피처",
    description: "산방산 아래 복잡한 마음을 정리할 수 있는 작고 소중한 독립 서점입니다. 오직 책과 나에게만 집중하는 고요한 시간.",
    details: "제주 서부 산방산 아래, 조용한 사계리 시골 마을 주택가 골목길에 자리 잡은 아담한 책방 코스입니다. 베스트셀러 대신 제주의 감성이 묻어나는 인문학 도서와 제주 작가들의 독특한 독립 출판물들이 서가를 아늑하게 메우고 있습니다. 따뜻한 노란 조명 아래, 잔잔한 파도 소리를 배경 삼아 책장을 넘기며 여행 속 나만의 고유한 아지트를 누릴 수 있습니다.",
    distance: "1.2 km",
    duration: "30분",
    difficulty: "쉬움",
    category: "culture",
    categoryLabel: "문화/예술",
    image: "/images/bookstore.png",
    location: "제주특별자치도 서귀포시 안덕면 사계남로 골목 안길",
    tags: ["독립출판", "감성서점", "제주북카페", "아날로그"],
    tips: [
      "대형 서점과 달리 매우 조용하고 프라이빗한 공간이므로 책방 내부 에티켓을 꼭 지켜주세요.",
      "서점 주인이 직접 큐레이션한 도서에 적힌 짧은 코멘트 카드를 꼭 읽어보세요.",
      "서점 안 미니 카페에서 판매하는 청귤 에이드나 핸드드립 커피와 함께 독서를 권합니다."
    ],
    reviews: [
      { name: "이혜진", rating: 5, content: "조용히 생각을 정리하기 너무 좋은 공간이었습니다. 책 냄새와 커피 향의 조합이 너무 평온해요.", date: "2026-05-31" },
      { name: "James K.", rating: 5, content: "A cozy cultural spot in Jeju. The selection of local independent prints was amazing.", date: "2026-05-27" }
    ],
    checklist: [
      "도서 구매 담아갈 에코백",
      "여행 일기를 기록할 노트와 필기구",
      "이어폰 (나만의 배경음악용)",
      "서점 정숙 에티켓"
    ],
    season: "비 내리는 제주의 오후 추천"
  }
];
