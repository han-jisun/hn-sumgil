"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import islandsData from "@/app/data/islands.json";
import imageData from "@/app/data/image.json";

const islandIdMap: Record<string, string> = {
  "굴업도": "gureopdo",
  "대연평": "daeyeonpyeong",
  "대이작도": "daeijakdo",
  "대청도": "daecheongdo",
  "덕적도": "deokjeokdo",
  "문갑도": "mungapdo",
  "백령도": "baengnyeongdo",
  "백아도": "baegado",
  "소연평": "soyeonpyeong",
  "소이작도": "soijakdo",
  "소청도": "socheongdo",
  "승봉도": "seungbongdo",
  "울도": "uldo",
  "자월도": "jawoldo",
  "지도": "jido",
  "소야도": "soyado"
};

interface IslandFerry {
  time: string;
  fare: string;
}

interface IslandData {
  island: string;
  address: string;
  areaCode: number;
  sigunguCode: number;
  ferries: IslandFerry[];
}

interface IslandMetaInfo {
  backpacking: boolean;
  trekking: boolean;
  desc: string;
  stay: string;
  topSpots: string;
  tags: string[];
  carFerry: string;
  departure: string;
}

const islandMeta: Record<string, IslandMetaInfo> = {
  "굴업도": {
    backpacking: true,
    trekking: true,
    desc: "한국의 갈라파고스라 불리는 백패킹의 성지 개머리언덕과 해안 절벽",
    stay: "1박 2일 추천",
    topSpots: "개머리언덕, 코끼리바위, 목기해변",
    tags: ["#일몰명소", "#해루질", "#사슴서식지", "#백패킹성지"],
    carFerry: "여객 전용 (차량 선적 불가)",
    departure: "인천항 연안여객터미널 (덕적도 환승)"
  },
  "대연평": {
    backpacking: false,
    trekking: true,
    desc: "평화기념관과 조기역사관이 있는 서해 최북단의 평화로운 섬",
    stay: "1박 2일 권장",
    topSpots: "평화공원, 조기역사관, 망향전망대",
    tags: ["#평화안보체험", "#조기파시역사", "#바다조망", "#꽃게미식"],
    carFerry: "여객 전용 (쾌속선 운항)",
    departure: "인천항 연안여객터미널"
  },
  "대이작도": {
    backpacking: true,
    trekking: true,
    desc: "썰물 때만 나타나는 신비의 모래섬 풀등과 울창한 해송 숲길",
    stay: "당일치기 또는 1박 2일",
    topSpots: "풀등(신비의 모래사구), 부아산 구름다리, 작은풀안해변",
    tags: ["#신비의풀등", "#해송산책로", "#가족피서", "#해루질"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  },
  "대청도": {
    backpacking: true,
    trekking: true,
    desc: "옥빛 바다와 한국 유일의 활동성 모래사막이 어우러진 비경",
    stay: "1박 2일 ~ 2박 3일",
    topSpots: "옥죽동 모래사막, 서풍받이, 농여해변",
    tags: ["#한국의사하라", "#서풍받이트레킹", "#지질명소", "#옥빛바다"],
    carFerry: "차량 선적 가능 (대형 차도선)",
    departure: "인천항 연안여객터미널"
  },
  "덕적도": {
    backpacking: true,
    trekking: true,
    desc: "해송 숲과 드넓은 백사장이 어우러진 캠핑과 휴양의 대표 섬",
    stay: "당일치기 또는 1박 2일",
    topSpots: "서포리 해변, 비조봉 등산로, 밧지름 해변",
    tags: ["#해송숲캠핑", "#자전거하이킹", "#해변휴양", "#가족여행"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  },
  "문갑도": {
    backpacking: true,
    trekking: true,
    desc: "한적하고 때 묻지 않은 깃대봉 등산로와 독특한 돌담 골목길",
    stay: "1박 2일 추천",
    topSpots: "깃대봉 등산로, 한월리 해변, 마을 돌담길",
    tags: ["#고요한힐링", "#원시숲길", "#돌담마을", "#낚시포인트"],
    carFerry: "여객 전용 (차량 선적 불가)",
    departure: "인천항 연안여객터미널 (덕적도 환승)"
  },
  "백령도": {
    backpacking: false,
    trekking: true,
    desc: "심청이의 설화와 천연기념물 사곶사빈, 비경의 두무진 절벽",
    stay: "1박 2일 ~ 2박 3일 추천",
    topSpots: "두무진 유람선, 사곶천연비행장, 콩돌해안",
    tags: ["#두무진기암절벽", "#천연비행장", "#심청각", "#백령냉면"],
    carFerry: "차량 선적 가능 (대형 쾌속선)",
    departure: "인천항 연안여객터미널"
  },
  "백아도": {
    backpacking: true,
    trekking: true,
    desc: "발전소 마을 앞 절경과 남조봉 기차바위가 있는 고요한 비박지",
    stay: "1박 2일 추천",
    topSpots: "남조봉 기차바위, 발전소 선착장, 백아분교터",
    tags: ["#기차바위암릉", "#오지백패킹", "#은하수명소", "#호젓한휴식"],
    carFerry: "여객 전용 (도보 승선)",
    departure: "인천항 연안여객터미널 (덕적도 환승)"
  },
  "소연평": {
    backpacking: false,
    trekking: true,
    desc: "얼굴바위와 깨끗한 포구가 맞이하는 때 묻지 않은 소박한 섬",
    stay: "1박 2일 권장",
    topSpots: "얼굴바위 기암, 소연평 등대길, 어촌 포구",
    tags: ["#얼굴바위", "#조용한포구", "#바다산책", "#힐링쉼터"],
    carFerry: "여객 전용 (쾌속선)",
    departure: "인천항 연안여객터미널"
  },
  "소이작도": {
    backpacking: true,
    trekking: true,
    desc: "해안을 따라 이어진 갯티길과 손가락 바위의 신비로운 형상",
    stay: "당일치기 또는 1박 2일",
    topSpots: "손가락바위, 갯티길 데크로, 벌안해변",
    tags: ["#손가락바위", "#갯티길산책", "#바다낚시", "#해변캠핑"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  },
  "소청도": {
    backpacking: true,
    trekking: true,
    desc: "분바위와 푸른 하늘 아래 우뚝 솟은 등대가 지키는 고요의 섬",
    stay: "1박 2일 ~ 2박 3일",
    topSpots: "분바위(월석), 소청등대, 예동포구",
    tags: ["#하얀분바위", "#역사깊은등대", "#서해일몰", "#야생조류관찰"],
    carFerry: "차량 선적 가능 (쾌속선)",
    departure: "인천항 연안여객터미널"
  },
  "승봉도": {
    backpacking: true,
    trekking: true,
    desc: "울창한 산림과 이일레 해수욕장, 촛대바위 등 기암괴석의 향연",
    stay: "당일치기 또는 1박 2일",
    topSpots: "이일레 해수욕장, 촛대바위, 남대문바위",
    tags: ["#이일레해변", "#촛대바위", "#해안산책로", "#가족휴양"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  },
  "울도": {
    backpacking: true,
    trekking: true,
    desc: "덕적 군도 최서단의 신비로운 비경과 낚시꾼들이 사랑하는 해안",
    stay: "1박 2일 추천",
    topSpots: "울도 절벽 탐방로, 선착장 해안, 당산 산책로",
    tags: ["#덕적최서단", "#바다낚시성지", "#원시자연", "#고요한비경"],
    carFerry: "여객 전용 (도보 승선)",
    departure: "인천항 연안여객터미널 (덕적도 환승)"
  },
  "자월도": {
    backpacking: true,
    trekking: true,
    desc: "붉은 달빛의 장골 해변과 조용히 은빛 물결이 부서지는 휴식처",
    stay: "당일치기 또는 1박 2일",
    topSpots: "장골 해수욕장, 국사봉 벚꽃길, 목섬 구름다리",
    tags: ["#장골해수욕장", "#국사봉전망", "#구름다리", "#해루질체험"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  },
  "지도": {
    backpacking: true,
    trekking: true,
    desc: "개발되지 않아 때 묻지 않은 순수한 서해안의 보물 같은 작은 섬",
    stay: "1박 2일 추천",
    topSpots: "청정 어촌 마을길, 서해 갯벌, 호젓한 해안선",
    tags: ["#미개발청정섬", "#어촌체험", "#조용한비박", "#자연그대로"],
    carFerry: "여객 전용 (도보 승선)",
    departure: "인천항 연안여객터미널 (덕적도 환승)"
  },
  "소야도": {
    backpacking: true,
    trekking: true,
    desc: "덕적도와 다리로 이어진 조용하고 한적한 떼뿌리 캠핑 천국",
    stay: "당일치기 또는 1박 2일",
    topSpots: "떼뿌리 해변, 갓섬·간뎃섬 모세의기적, 소야연도교",
    tags: ["#떼뿌리캠핑", "#소야연도교", "#모세의기적", "#트레킹코스"],
    carFerry: "차도선 운항 (차량 선적 가능)",
    departure: "인천항 / 대부도 방아머리항"
  }
};

const islandFerrySchedules: Record<string, { frequency: string; times: string; note?: string }> = {
  "굴업도": {
    frequency: "1일 1~2회 운항",
    times: "인천항 08:30, 11:20 (덕적도 나래호 환승 11:20, 13:40)",
    note: "덕적도 진리항에서 굴업도행 나래호로 환승합니다."
  },
  "덕적도": {
    frequency: "1일 4~5회 운항",
    times: "인천항(쾌속) 08:30, 09:10, 11:00, 14:30 · 대부도(차도) 09:00, 12:30",
    note: "인천항 쾌속선과 대부도 방아머리 차도선이 수시 운항됩니다."
  },
  "대이작도": {
    frequency: "1일 2~3회 운항",
    times: "인천항 08:30, 14:00 · 대부도 09:00, 13:00",
    note: "쾌속선과 차도선이 교차 운항됩니다."
  },
  "대청도": {
    frequency: "1일 3회 운항",
    times: "인천항 07:00, 08:30, 12:30 (코리아프라이드 등)"
  },
  "대연평": {
    frequency: "1일 2회 운항",
    times: "인천항 08:00, 13:00 (플라잉카페리 등)"
  },
  "문갑도": {
    frequency: "1일 1회 운항",
    times: "인천항 08:30 (덕적도 환승 나래호 11:20)"
  },
  "백령도": {
    frequency: "1일 3회 운항",
    times: "인천항 07:00, 08:30, 12:30 (코리아프라이드 등)"
  },
  "백아도": {
    frequency: "1일 1회 운항",
    times: "인천항 08:30 (덕적도 환승 나래호 11:20)"
  },
  "소연평": {
    frequency: "1일 2회 운항",
    times: "인천항 08:00, 13:00"
  },
  "소이작도": {
    frequency: "1일 2~3회 운항",
    times: "인천항 08:30, 14:00 · 대부도 09:00, 13:00"
  },
  "소청도": {
    frequency: "1일 3회 운항",
    times: "인천항 07:00, 08:30, 12:30"
  },
  "승봉도": {
    frequency: "1일 3회 운항",
    times: "인천항 08:30, 11:00, 14:00 · 대부도 09:00"
  },
  "울도": {
    frequency: "1일 1회 운항",
    times: "인천항 08:30 (덕적도 환승 나래호 11:20)"
  },
  "자월도": {
    frequency: "1일 3회 운항",
    times: "인천항 08:30, 11:00, 14:00 · 대부도 09:00, 12:30"
  },
  "지도": {
    frequency: "1일 1회 운항",
    times: "인천항 08:30 (덕적도 환승 나래호 11:20)"
  },
  "소야도": {
    frequency: "1일 4~5회 운항",
    times: "인천항 08:30, 11:00, 14:30 (덕적도 연도교 경유)"
  }
};

const matchRules: Record<string, (addr: string) => boolean> = {
  "굴업도": (addr) => addr.includes("굴업"),
  "대연평": (addr) => addr.includes("연평") && !addr.includes("소연평"),
  "대이작도": (addr) => addr.includes("이작") && !addr.includes("소이작"),
  "대청도": (addr) => addr.includes("대청") && !addr.includes("소청"),
  "덕적도": (addr) => (addr.includes("덕적") || addr.includes("진리")) &&
    !["굴업", "문갑", "백아", "울도", "지도", "소야", "북도"].some(x => addr.includes(x)),
  "문갑도": (addr) => addr.includes("문갑"),
  "백령도": (addr) => addr.includes("백령"),
  "백아도": (addr) => addr.includes("백아"),
  "소연평": (addr) => addr.includes("소연평"),
  "소이작도": (addr) => addr.includes("소이작"),
  "소청도": (addr) => addr.includes("소청"),
  "승봉도": (addr) => addr.includes("승봉"),
  "울도": (addr) => addr.includes("울도"),
  "자월도": (addr) => addr.includes("자월") && !["이작", "승봉"].some(x => addr.includes(x)),
  "지도": (addr) => addr.includes("지도리") || (addr.includes("지도") && addr.includes("덕적")),
  "소야도": (addr) => addr.includes("소야")
};

const defaultIslandImages: Record<string, string> = {
  "굴업도": "/images/island/gureopdo/1.jpg",
  "대연평": "/images/default_island.png",
  "대이작도": "/images/island/daeijakdo/1.jpg",
  "대청도": "/images/island/daecheongdo/1.jpg",
  "덕적도": "/images/island/deokjeokdo/1.jpg",
  "문갑도": "/images/island/mungapdo/1.jpg",
  "백령도": "/images/island/baengnyeongdo/1.jpg",
  "백아도": "/images/island/baegado/1.jpg",
  "소연평": "/images/default_island.png",
  "소이작도": "/images/island/soijakdo/1.jpg",
  "소청도": "/images/island/socheongdo/1.jpg",
  "승봉도": "/images/island/seungbongdo/1.jpg",
  "울도": "/images/default_island.png",
  "자월도": "/images/island/jawoldo/1.jpg",
  "지도": "/images/default_island.png",
  "소야도": "/images/island/soyado/1.jpg"
};

const islandCoordinates: Record<string, { lat: number; lng: number }> = {
  "굴업도": { lat: 37.1947, lng: 125.9389 },
  "대연평": { lat: 37.6698, lng: 125.6967 },
  "대이작도": { lat: 37.1912, lng: 126.2415 },
  "대청도": { lat: 37.8286, lng: 124.7075 },
  "덕적도": { lat: 37.2289, lng: 126.1558 },
  "문갑도": { lat: 37.2267, lng: 126.0278 },
  "백령도": { lat: 37.9547, lng: 124.6736 },
  "백아도": { lat: 37.1356, lng: 125.9989 },
  "소연평": { lat: 37.6067, lng: 125.7489 },
  "소이작도": { lat: 37.1856, lng: 126.2731 },
  "소청도": { lat: 37.7656, lng: 124.7431 },
  "승봉도": { lat: 37.1706, lng: 126.3125 },
  "울도": { lat: 37.0392, lng: 125.9967 },
  "자월도": { lat: 37.2536, lng: 126.3283 },
  "지도": { lat: 37.1089, lng: 126.0467 },
  "소야도": { lat: 37.2028, lng: 126.1778 }
};

const getFerryRouteDetail = (island: string, ferry: IslandFerry, idx: number, total: number) => {
  if (["덕적도", "대이작도", "자월도", "승봉도", "소이작도", "소야도"].includes(island)) {
    if (ferry.fare.includes("27,300") || ferry.fare.includes("25,200") || ferry.fare.includes("39,500")) {
      return {
        port: "대부도 방아머리항",
        shipType: "차도선 (차량 선적 가능)",
        shipSummary: "차도선 (차량선적)",
        departures: "09:00, 12:30",
        frequency: "1일 2회 운항",
        tag: "대부도 출발 · 최저가"
      };
    } else {
      return {
        port: "인천항 연안여객터미널",
        shipType: "쾌속선 (여객 전용 고속)",
        shipSummary: "쾌속선 (고속운항)",
        departures: island === "덕적도" ? "08:30, 09:10, 11:00, 14:30" : "08:30, 14:00",
        frequency: island === "덕적도" ? "1일 4~5회 운항" : (["자월도", "승봉도", "소야도"].includes(island) ? "1일 3회 운항" : "1일 2회 운항"),
        tag: "인천항 출발 · 빠른이동"
      };
    }
  }

  if (["굴업도", "문갑도", "백아도", "울도", "지도"].includes(island)) {
    return {
      port: "인천항 연안여객터미널",
      shipType: "덕적도 환승선 (나래호)",
      shipSummary: "덕적도 환승 (나래호)",
      departures: "인천항 08:30, 11:20 (덕적도 환승 11:20, 13:40)",
      frequency: "1일 1~2회 운항",
      tag: "덕적도 환승"
    };
  }

  if (["백령도", "대청도", "소청도"].includes(island)) {
    return {
      port: "인천항 연안여객터미널",
      shipType: "대형 쾌속선 (코리아프라이드)",
      shipSummary: "대형 쾌속선",
      departures: "07:00, 08:30, 12:30",
      frequency: "1일 3회 운항",
      tag: "인천항 직항 쾌속선"
    };
  }

  if (["대연평", "소연평"].includes(island)) {
    return {
      port: "인천항 연안여객터미널",
      shipType: "쾌속선 (플라잉카페리)",
      shipSummary: "쾌속선",
      departures: "08:00, 13:00",
      frequency: "1일 2회 운항",
      tag: "인천항 직항 쾌속선"
    };
  }

  return {
    port: "인천항 연안여객터미널",
    shipType: "정기 여객선",
    shipSummary: "정기 여객선",
    departures: "08:30, 11:00, 14:00",
    frequency: "1일 3회 운항",
    tag: "인천항 출발"
  };
};

const getGalleryPhotos = (islandName: string): string[] => {
  const key = islandIdMap[islandName];
  const item = key ? (imageData as Record<string, { name: string; images: string[] }>)[key] : null;

  if (item && item.images && item.images.length > 0) {
    return item.images.slice(0, 4);
  }

  return [];
};

const cleanText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'");
};

const formatDate = (dateStr: string) => {
  if (dateStr && dateStr.length === 8) {
    const y = dateStr.substring(0, 4);
    const m = parseInt(dateStr.substring(4, 6), 10);
    const d = parseInt(dateStr.substring(6, 8), 10);
    return `${y}.${m}.${d}`;
  }
  return dateStr;
};

const getPlaceCategory = (item: any, defaultSource: "camp" | "rest" | "lodge") => {
  const name = item.facltNm || item.bsshNm || "";
  const rawType = item.induty || item.type || "";

  // 1. Camping
  if (defaultSource === "camp" || name.includes("캠핑") || name.includes("야영") || rawType.includes("캠핑") || rawType.includes("야영")) {
    return {
      icon: "⛺",
      label: rawType || "캠핑장",
      badgeClass: "bg-[#E6FDE5] text-[#0F3E17] border-[#BBF7D0]"
    };
  }

  // 2. Lodge / Stay (펜션, 민박, 게스트하우스, 모텔, 호텔, 스테이)
  if (
    defaultSource === "lodge" ||
    name.includes("펜션") ||
    name.includes("민박") ||
    name.includes("게스트하우스") ||
    name.includes("모텔") ||
    name.includes("호텔") ||
    name.includes("스테이") ||
    name.includes("리조트") ||
    rawType.includes("펜션") ||
    rawType.includes("민박") ||
    rawType.includes("숙박")
  ) {
    const label = name.includes("펜션") ? "펜션" : name.includes("민박") ? "민박" : "숙박/펜션";
    return {
      icon: "🏡",
      label,
      badgeClass: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
    };
  }

  // 3. Restaurant / Food
  const label = rawType && !rawType.includes("식당") && !rawType.includes("펜션") && !rawType.includes("민박")
    ? rawType
    : (name.includes("회") ? "활어회" : name.includes("카페") ? "카페" : "한식·음식점");

  return {
    icon: "🍽️",
    label,
    badgeClass: "bg-[#FFF4E5] text-[#B45309] border-[#FDE68A]"
  };
};

interface IslandDetailProps {
  islandName: string;
}

export default function IslandDetailClient({ islandName }: IslandDetailProps) {
  const router = useRouter();
  const [island, setIsland] = useState<IslandData | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [lodges, setLodges] = useState<any[]>([]);
  const [campsites, setCampsites] = useState<any[]>([]);
  const [spots, setSpots] = useState<any[]>([]);
  const [tides, setTides] = useState<any[]>([]);
  const [weather, setWeather] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [modalPhotos, setModalPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTideIndex, setActiveTideIndex] = useState(0);
  const tideScrollRef = useRef<HTMLDivElement>(null);

  const handleTideScroll = () => {
    if (tideScrollRef.current) {
      const { scrollLeft, clientWidth } = tideScrollRef.current;
      const cardWidth = clientWidth * 0.86;
      const index = Math.round(scrollLeft / (cardWidth + 16));
      setActiveTideIndex(Math.min(Math.max(0, index), Math.max(0, tides.length - 1)));
    }
  };

  const [spotOverviews, setSpotOverviews] = useState<Record<string, { overview: string; homepage: string; tel: string; loading: boolean }>>({});

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ferry: true,
    restaurant: true,
    lodge: true,
    camping: true,
    trek: true,
    backpack: true,
    tide: true,
    spot: true,
    blog: true,
    youtube: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const found = (islandsData as IslandData[]).find((i) => i.island === islandName);
    setIsland(found || null);

    const rule = matchRules[islandName];

    const fetchAllData = async () => {
      try {
        const [restResult, lodgeResult, campResult, spotResult, tideResult, weatherResult, blogResult, youtubeResult] =
          await Promise.allSettled([
            fetch("/api/restaurant"),
            fetch("/api/lodge"),
            fetch(`/api/camping?query=${encodeURIComponent(islandName)}`),
            fetch("/api/spot"),
            fetch(`/api/tide?island=${encodeURIComponent(islandName)}`),
            fetch(`/api/weather?island=${encodeURIComponent(islandName)}`),
            fetch(`/api/blog?query=${encodeURIComponent(islandName + " 여행")}&display=6`),
            fetch(`/api/youtube?query=${encodeURIComponent(islandName + " 여행")}`)
          ]);

        if (restResult.status === "fulfilled" && restResult.value.ok) {
          const data = await restResult.value.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) =>
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setRestaurants(filtered);
          }
        }

        if (lodgeResult.status === "fulfilled" && lodgeResult.value.ok) {
          const data = await lodgeResult.value.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) =>
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setLodges(filtered);
          }
        }

        if (campResult.status === "fulfilled" && campResult.value.ok) {
          const data = await campResult.value.json();
          if (data.success && data.items) {
            setCampsites(data.items);
          }
        }

        let fetchedSpots: any[] = [];
        if (spotResult.status === "fulfilled" && spotResult.value.ok) {
          const data = await spotResult.value.json();
          if (data.success && data.items) {
            fetchedSpots = data.items.filter((item: any) =>
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
          }
        }

        // TourAPI에 명소 데이터가 없는 섬의 경우, 메타데이터의 대표 비경(topSpots)과 공공데이터 사진(image.json)을 연결
        if (fetchedSpots.length === 0 && meta?.topSpots) {
          const spotTitles = meta.topSpots.split(",").map((s: string) => s.trim()).filter(Boolean);
          const gallery = getGalleryPhotos(islandName);
          fetchedSpots = spotTitles.map((title: string, idx: number) => ({
            contentId: `custom-spot-${idx}`,
            title: title,
            addr: found?.address || `인천광역시 옹진군 ${islandName}`,
            firstImage: gallery[idx] || gallery[0] || "",
            overview: ""
          }));
        }

        setSpots(fetchedSpots);

        if (tideResult.status === "fulfilled" && tideResult.value.ok) {
          const data = await tideResult.value.json();
          if (data.success && data.tides) {
            setTides(data.tides);
          }
        }

        if (weatherResult.status === "fulfilled" && weatherResult.value.ok) {
          const data = await weatherResult.value.json();
          if (data.success && data.weather) {
            setWeather(data.weather);
          }
        }

        if (blogResult.status === "fulfilled" && blogResult.value.ok) {
          const data = await blogResult.value.json();
          if (data.success && data.items) {
            setBlogs(data.items.slice(0, 6));
          }
        }

        if (youtubeResult.status === "fulfilled" && youtubeResult.value.ok) {
          const data = await youtubeResult.value.json();
          const rawVideos = data.videos || data.items || [];
          if (data.success && rawVideos.length > 0) {
            const formatted = rawVideos.map((v: any) => ({
              id: v.videoId,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: `${v.ownerText || ""} · ${v.viewCountText || ""}`,
              embedUrl: `https://www.youtube.com/embed/${v.videoId}`
            }));
            setVideos(formatted.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error loading island details:", err);
      }
    };

    fetchAllData();
  }, [islandName]);

  const meta = islandMeta[islandName] || { backpacking: false, trekking: false, desc: "아름다운 인천 서해의 섬" };
  const photos = getGalleryPhotos(islandName);
  const defaultImage = defaultIslandImages[islandName] || "/images/default_island.png";

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto py-16 px-4 sm:px-6 md:px-10">
        <div className="w-full h-80 rounded-2xl bg-[#F6F6F6] animate-pulse mb-8" />
        <div className="flex flex-col gap-6">
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
        </div>
      </div>
    );
  }

  const parseFare = (fareStr: string) => {
    const num = parseInt(fareStr?.replace(/[^0-9]/g, "") || "0", 10);
    return isNaN(num) ? 0 : num;
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 84;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Sort ferries ascending by fare so lowest price comes first
  const sortedFerries = [...(island?.ferries || [])].sort((a, b) => parseFare(a.fare) - parseFare(b.fare));
  const lowestFerry = sortedFerries[0] || { time: "시간 확인", fare: "운임 확인" };
  const hasMultipleFerries = sortedFerries.length > 1;
  const ferrySchedule = islandFerrySchedules[islandName] || {
    frequency: "1일 1~3회 운항",
    times: "출항 시각 현장/전산망 확인"
  };

  const mainFerry = lowestFerry;

  // Keyboard navigation for image modal
  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhotoIndex(null);
      if (e.key === "ArrowLeft") {
        setActivePhotoIndex(prev => prev !== null ? (prev === 0 ? modalPhotos.length - 1 : prev - 1) : null);
      }
      if (e.key === "ArrowRight") {
        setActivePhotoIndex(prev => prev !== null ? (prev === modalPhotos.length - 1 ? 0 : prev + 1) : null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, modalPhotos]);

  const openGalleryModal = (photoList: string[], index: number) => {
    setModalPhotos(photoList);
    setActivePhotoIndex(index);
  };

  return (
    <div id="island-detail-container" className="pt-8 sm:pt-12 md:pt-16 pb-28 md:pb-36 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 text-[#282828]">

      {/* 1. Visual Area: Photo Gallery at the Very Top (Full Width) */}
      {photos.length > 0 ? (
        <section id="island-hero-gallery" className="mb-[40px]">
          {/* Pure Image Container Frame */}
          <div className="relative">
            {/* Mobile View (< md): 100% Width Horizontal Swipe Carousel with Snap Scrolling */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none h-[280px] sm:h-[340px] rounded-2xl border border-[#D4D4D4] bg-[#EDEDED]">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => openGalleryModal(photos, idx)}
                  className="w-full h-full shrink-0 snap-center relative cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${islandName} 사진 ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                  {/* Mobile Slide Counter Badge */}
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs backdrop-blur-md font-medium pointer-events-none">
                    <span>📷</span> {idx + 1} / {photos.length}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop View (md+): Multi-Photo Grid */}
            {photos.length >= 4 ? (
              <div id="island-gallery-grid" className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2.5 h-[420px] rounded-2xl overflow-hidden border border-[#D4D4D4]">
                {/* Main Hero Photo (Independent Hover Zoom) */}
                <div
                  onClick={() => openGalleryModal(photos, 0)}
                  className="md:col-span-2 md:row-span-2 relative h-full w-full bg-[#EDEDED] overflow-hidden cursor-pointer group/item"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[0]}
                    alt={`${islandName} 대표 풍경`}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Sub Photos (Each has Independent Hover Zoom) */}
                {photos.slice(1, 4).map((url, index) => (
                  <div
                    key={index}
                    onClick={() => openGalleryModal(photos, index + 1)}
                    className={`relative w-full h-full bg-[#EDEDED] overflow-hidden cursor-pointer group/item ${index === 0 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"
                      }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${islandName} 사진 ${index + 2}`}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/0 transition-colors pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => openGalleryModal(photos, 0)}
                className="hidden md:block relative w-full h-[380px] rounded-2xl overflow-hidden border border-[#D4D4D4] bg-[#EDEDED] cursor-pointer group/item"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[0]}
                  alt={`${islandName} 대표 사진`}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/0 transition-colors pointer-events-none" />
              </div>
            )}

            {/* Top-Left Floating Circular Back to Explore List Link */}
            <Link
              id="island-top-back-link"
              href="/explore"
              className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-[#2A3036]/80 hover:bg-[#0F3E17] text-white backdrop-blur-md shadow-md border border-white/20 flex items-center justify-center transition-all duration-150 cursor-pointer group/back"
              title="전체 섬 목록으로 이동"
              aria-label="전체 섬 목록으로 이동"
            >
              <svg
                className="w-5 h-5 text-white group-hover/back:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>

            {/* Gallery Expand Button (Bottom-Right, Fixed 32px Area, No Size Jitter) */}
            <button
              type="button"
              aria-label="사진 전체화면 확대"
              onClick={() => openGalleryModal(photos, 0)}
              className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-lg bg-black/65 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-md border border-white/20"
              title="사진 전체화면 확대"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>

          {/* Public License Tag */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#717171]">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-bold text-[10px]">
                공공누리 제1유형
              </span>
              <span>인천광역시 공공저작물 출처표시 적용</span>
            </div>
          </div>
        </section>
      ) : (
        /* When No Photos: Naver Map View (Naver Map SDK Ready) */
        <section id="island-map-hero" className="mb-[40px]">
          {(() => {
            const coords = islandCoordinates[islandName] || { lat: 37.2289, lng: 126.1558 };
            const bbox = `${coords.lng - 0.04}%2C${coords.lat - 0.025}%2C${coords.lng + 0.04}%2C${coords.lat + 0.025}`;
            const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

            return (
              <div className="flex flex-col gap-3">
                <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-[#D4D4D4] bg-[#F8F9FA] shadow-2xs">
                  {/* Naver Map Container */}
                  <div id="naver-map-element" className="w-full h-full">
                    <iframe
                      title={`${islandName} 네이버 위치 지도`}
                      src={osmUrl}
                      className="w-full h-full border-none"
                      loading="lazy"
                    />
                  </div>

                  {/* Back to Explore List Button on Map Hero */}
                  <Link
                    id="island-map-top-back-link"
                    href="/explore"
                    className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-[#2A3036]/80 hover:bg-[#0F3E17] text-white backdrop-blur-md shadow-md border border-white/20 flex items-center justify-center transition-all duration-150 cursor-pointer group/back"
                    title="전체 섬 목록으로 이동"
                    aria-label="전체 섬 목록으로 이동"
                  >
                    <svg
                      className="w-5 h-5 text-white group-hover/back:-translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </Link>

                  {/* Naver Map UI Header Badge */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#03C75A]/40 shadow-sm text-xs font-bold text-[#1E1E1E]">
                    <span className="w-4 h-4 rounded-full bg-[#03C75A] text-white flex items-center justify-center font-black text-[10px]">
                      N
                    </span>
                    <span>{islandName} 네이버 위치 지도</span>
                    <span className="text-xs text-[#717171] font-normal hidden sm:inline">(좌표: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* 2. Main Content Flow (Full Width Vertical Stack) */}
      <div className="flex flex-col gap-[80px]">

        {/* Section 01: Island Header & Overview Story + Stayfolio-Style Booking Card (2-Column Grid) */}
        <section id="section-story">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">

            {/* Left Column: [Island Title & Location] + [Story] + [Spec Table] (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col gap-6 pt-1">

              {/* 1) Island Title & Location */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 id="island-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#282828] leading-tight">
                    <span className="text-[#0F3E17]">{islandName}</span>
                  </h1>
                  <p className="text-sm text-[#848484] mt-1.5 flex items-center gap-2">
                    <span>📍 위치: {island?.address}</span>
                  </p>
                </div>
              </div>

              {/* 2) Story Title & Description */}
              <div className="flex flex-col gap-3">
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#282828] leading-snug tracking-tight">
                  {meta.desc}
                </h2>
                <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
                  인천 서해의 청정한 바다와 시원한 해송 숲길, 썰물 때 드러나는 신비로운 해안 절경이 일상의 번잡함을 잊고 온전한 쉼을 선물하는 <strong>{islandName}</strong>입니다.
                </p>
              </div>

              {/* 3) Island Comprehensive Specification (Stayfolio Clean Horizontal Row Style - 14px) */}
              <div className="border-t border-b border-[#EDEDED] divide-y divide-[#EDEDED] my-2 text-sm">

                {/* Row 1: 추천 일정 (Static) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    추천 일정
                  </span>
                  <div className="flex items-baseline gap-2 flex-wrap text-[#404040]">
                    <span className="font-semibold text-[#0F3E17]">{meta.stay}</span>
                    <span className="text-xs text-[#848484]">(편도 {lowestFerry.time} 소요)</span>
                  </div>
                </div>

                {/* Row 2: 대표 비경 (Clickable -> #section-spots, Only when spots exist) */}
                {spots.length > 0 && (
                  <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                    <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                      대표 비경
                    </span>
                    <span
                      onClick={() => scrollToSection("section-spots")}
                      className="text-[#404040] underline underline-offset-4 decoration-[#D4D4D4] hover:decoration-[#0F3E17] hover:text-[#0F3E17] hover:font-bold cursor-pointer transition-all leading-relaxed"
                      title="클릭하여 대표 비경 목록으로 이동"
                    >
                      {/* 데스크톱: 공간이 여유로우므로 전체 명소 다 표시 */}
                      <span className="hidden sm:inline">
                        {spots.map((s: any) => s.title).join(", ")}
                      </span>
                      {/* 모바일: 2줄 내로 떨어지도록 3개 이상일 때 '+' 표기 */}
                      <span className="sm:hidden inline">
                        {spots.slice(0, 2).map((s: any) => s.title).join(", ")}
                        {spots.length > 2 && (
                          <span className="text-[#0F3E17] font-semibold ml-1 inline-block">+</span>
                        )}
                      </span>
                    </span>
                  </div>
                )}

                {/* Row 3: 인기 테마 (Static / Tag list - Main Card Pill Badge Style) */}
                {meta.tags && meta.tags.length > 0 && (
                  <div className="py-3.5 sm:py-4 flex items-center gap-6 sm:gap-10">
                    <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                      인기 테마
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {meta.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="h-[26px] inline-flex items-center px-2.5 rounded-full text-xs font-normal border border-[#EDEDED] bg-white text-[#6A6A6A]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Row 4: 액티비티 (Static) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    액티비티
                  </span>
                  <span className="text-[#404040] leading-relaxed">
                    {meta.backpacking ? "백패킹 가능" : "백패킹 불가"} · {meta.trekking ? "해안 둘레길 트레킹" : "트레킹 코스 없음"}
                  </span>
                </div>

                {/* Row 5: 주변 편의 (Clickable -> #section-places, Only when data exists) */}
                {(restaurants.length > 0 || lodges.length > 0 || campsites.length > 0) && (
                  <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                    <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                      주변 편의
                    </span>
                    <span
                      onClick={() => scrollToSection("section-places")}
                      className="text-[#404040] underline underline-offset-4 decoration-[#D4D4D4] hover:decoration-[#0F3E17] hover:text-[#0F3E17] hover:font-bold cursor-pointer transition-all leading-relaxed"
                      title="클릭하여 식당·숙소·캠핑 목록으로 이동"
                    >
                      {[
                        restaurants.length > 0 ? `식당 ${restaurants.length}개소` : null,
                        lodges.length > 0 ? `숙소 ${lodges.length}곳` : null,
                        campsites.length > 0 ? `캠핑장 ${campsites.length}곳` : null
                      ].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                )}

                {/* Row 6: 교통 · 선적 (Static) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    교통 · 선적
                  </span>
                  <span className="text-[#404040] leading-relaxed">
                    {meta.carFerry} <span className="text-xs text-[#848484]">({meta.departure})</span>
                  </span>
                </div>

              </div>
            </div>

            {/* Right Column: Stayfolio-Style Clean & Intuitive Ferry Booking Card (md:col-span-5 md:sticky md:top-24 self-start) */}
            <div className="md:col-span-5 md:sticky md:top-24 self-start p-5 sm:p-6 rounded-[16px] border border-[#D4D4D4] bg-white shadow-sm flex flex-col gap-4">

              {/* 1. Pricing Header */}
              <div className="flex flex-col gap-1 pb-3.5 border-b border-[#EDEDED]">
                <div className="flex justify-between items-center text-xs text-[#848484]">
                  <span>{hasMultipleFerries ? "최저 왕복 승선 운임" : "대표 왕복 승선 운임"}</span>
                  <span className="text-xs text-[#E5484D] font-medium bg-[#FFF1F0] px-2 py-0.5 rounded">인천시민 할인 가능</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0F3E17]">
                  {lowestFerry.fare}{hasMultipleFerries ? "~" : ""} <span className="text-sm font-normal text-[#848484]">/ 1인 왕복</span>
                </div>
              </div>

              {/* 2. Clean & Unified Ferry Route List */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-bold text-[#282828]">
                  <span>여객선 운항 노선 및 요금</span>
                </div>

                {/* Ferry Routes List (Repeating [Grey Box] + [주요 출항 & 운항 횟수] for each route) */}
                <div className="flex flex-col gap-[20px]">
                  {sortedFerries.map((ferry, idx) => {
                    const routeInfo = getFerryRouteDetail(islandName, ferry, idx, sortedFerries.length);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-2"
                      >
                        {/* 1) Grey Rounded Box: Port Name + Fare */}
                        <div className="p-4 sm:p-5 rounded-[14px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-between gap-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[#282828] text-sm sm:text-base">
                              {routeInfo.port}
                            </span>
                            <span className="text-sm text-[#6A6A6A]">
                              {routeInfo.shipSummary} · 편도 {ferry.time}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg sm:text-xl font-extrabold text-[#0F3E17] block leading-tight">
                              {ferry.fare}
                            </span>
                            <span className="text-xs text-[#848484]">왕복 운임</span>
                          </div>
                        </div>

                        {/* 2) Below Box: Departure Times & Frequency (Clean Plain 14px Text) */}
                        <div className="px-1 text-sm flex items-baseline justify-between gap-2 text-[#6A6A6A]">
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="text-[#848484] shrink-0">🕒 주요 출항:</span>
                            <span className="text-[#282828] font-medium leading-relaxed">{routeInfo.departures}</span>
                          </div>
                          <span className="text-sm text-[#848484] shrink-0 font-normal whitespace-nowrap">
                            {routeInfo.frequency}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. CTA Button (Modern Travel Platform High-Conversion Style) */}
              <a
                id="story-ferry-booking-btn"
                href="https://island.theksa.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-[12px] bg-[#0F3E17] hover:bg-[#0A2D10] text-white font-bold text-[15px] sm:text-base text-center transition-all shadow-[0_4px_14px_rgba(15,62,23,0.25)] hover:shadow-[0_6px_20px_rgba(15,62,23,0.35)] flex items-center justify-between group cursor-pointer mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-sm">🚢</span>
                  <span>실시간 승선권 예매하기</span>
                </div>
                <svg className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Safe Booking Notice */}
              <p className="text-xs text-[#848484] leading-relaxed text-center m-0">
                한국해운조합 공식 전산망 연동 · 기상에 따라 출항 변동 가능
              </p>
            </div>

          </div>
        </section>

        {/* Section 02: 실시간 3일 물때(조석) */}
        <section id="section-tide">
          <div className="flex flex-col gap-3 mb-6">
            <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight text-[#1E1E1E] leading-tight">
              실시간 3일 물때 (조석 예보)
            </h3>
            <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
              갯벌체험 및 해안 탐방 시 간조(물 빠짐) 시간을 반드시 확인하세요. 국립해양조사원 기준 해양 조석 시뮬레이션
            </p>
          </div>

          {tides.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* 3 Separate Day Cards Grid (Mobile Horizontal Swipe Slider + Desktop 3-Col Grid) */}
              <div
                ref={tideScrollRef}
                onScroll={handleTideScroll}
                className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-3 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
              >
                {tides.map((tide, index) => {
                  const heights = tide.tideTime.map((e: any) => parseInt(e.height.replace(/[^0-9]/g, "")) || 0);
                  const minH = Math.min(...heights);
                  const maxH = Math.max(...heights);

                  const getDayLabel = (dateStr: string, idx: number) => {
                    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                    const d = new Date(dateStr);
                    const dayName = days[d.getDay()] || "";
                    const prefix = idx === 0 ? "오늘" : idx === 1 ? "내일" : "모레";
                    const parts = dateStr.split("-");
                    return `${prefix} ${parseInt(parts[1])}월 ${parseInt(parts[2])}일 ${dayName}`;
                  };

                  const dayWeather = weather[index];

                  return (
                    <div
                      key={index}
                      className="w-[86vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center rounded-[14px] border border-[#EDEDED] bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm"
                    >
                      {/* Card Header: Weather Condition Block */}
                      <div className="flex flex-col gap-3 pb-3.5 border-b border-[#EDEDED]">
                        {/* Top Row: Day of Week & Date */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="font-bold text-base text-[#282828] tracking-tight">
                              {getDayLabel(tide.date, index)}
                            </div>
                            <span className="text-xs text-[#848484] font-normal pt-[1px]">({tide.lunarDate})</span>
                          </div>
                        </div>

                        {/* Bottom Row: [Large Weather Icon + Temp & Status + Temp Bar below] on Left / Right Key-Value Stats */}
                        <div className="flex justify-between items-center pt-0.5">
                          <div className="flex items-center gap-3">
                            {/* Big Weather Icon on Left */}
                            <span className="text-4xl sm:text-5xl leading-none shrink-0 drop-shadow-2xs select-none">
                              {dayWeather?.icon || "🌤️"}
                            </span>

                            <div className="flex flex-col gap-1">
                              {/* Temp + Weather Status Inline */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl sm:text-4xl font-extrabold text-[#282828] leading-none tracking-tight">
                                  {dayWeather?.tempCurrent || dayWeather?.tempMax || "30°"}
                                </span>
                                <span className="text-sm font-medium text-[#6A6A6A]">
                                  {dayWeather?.weather || "맑음"}
                                </span>
                              </div>

                              {/* Temperature Range Gauge Bar below Temp */}
                              <div className="flex items-center gap-1.5 text-xs text-[#848484]">
                                <span>{dayWeather?.tempMin || "23°"}</span>
                                <div className="w-14 sm:w-16 h-1.5 rounded-full bg-[#EDEDED] overflow-hidden relative">
                                  <div className="absolute left-[15%] right-[10%] top-0 bottom-0 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#E5484D]" />
                                </div>
                                <span>{dayWeather?.tempMax || "30°"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Text Key-Value Stats (일출, 일몰, 강수 - Regular weight) */}
                          <div className="flex flex-col gap-1 text-xs text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#848484] font-normal text-xs">일출</span>
                              <span className="text-[#333333] text-xs sm:text-[13px]">{dayWeather?.sunrise || "5:50 am"}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#848484] font-normal text-xs">일몰</span>
                              <span className="text-[#333333] text-xs sm:text-[13px]">{dayWeather?.sunset || "7:21 pm"}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#848484] font-normal text-xs">강수</span>
                              <span className="text-[#0284C7] text-xs sm:text-[13px]">{dayWeather?.pop || "0%"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tide Section Group */}
                      <div className="flex flex-col gap-2">
                        {/* Tide State Status (Above Tide List) */}
                        <div className="text-[14px] text-[#282828] tracking-tight">
                          <span className="font-bold">오늘의 물때 : </span>
                          <span className="font-normal">{tide.waterLevel}</span>
                        </div>

                        <div className="flex flex-col">
                          {tide.tideTime.map((event: any, idx: number) => {
                            const isNegative = event.height.startsWith('-');
                            const absHeight = event.height.replace(/^[+-]/, '');
                            return (
                              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-[#F0F0F0] last:border-0">
                                {/* Column 1: Type (Icon and Text unified color) */}
                                <div className={`w-[85px] shrink-0 flex items-center gap-1.5 text-base font-medium ${event.type === '고조' ? 'text-[#E5484D]' : 'text-[#0284C7]'}`}>
                                  {event.type === '고조' ? (
                                    <svg className="w-[18px] h-[18px] currentColor" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-[18px] h-[18px] currentColor" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
                                    </svg>
                                  )}
                                  <span>{event.type === '고조' ? '만조' : '간조'}</span>
                                </div>

                                {/* Column 2: Time */}
                                <div className="flex-1 flex items-center">
                                  <span className="font-bold text-[16px] text-[#282828]">
                                    {event.time}
                                  </span>
                                </div>

                                {/* Column 3: Height (Icon sign + Number + Unit) */}
                                <div className="text-right flex items-center justify-end gap-[1px] text-[#848484]">
                                  {isNegative ? (
                                    <svg className="w-[13px] h-[13px] currentColor opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19 13H5v-2h14v2z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-[13px] h-[13px] currentColor opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                  )}
                                  <div className="flex items-baseline gap-[1px] ml-[1px]">
                                    <span className="font-medium text-base">{absHeight}</span>
                                    <span className="text-[13px] font-normal">cm</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile 3-Circle Page Indicator (원 세 개에서 몇 번째인지 색상으로 표시) */}
              <div className="flex md:hidden items-center justify-center gap-2 -mt-1 mb-2">
                {tides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => {
                      if (tideScrollRef.current) {
                        const cards = tideScrollRef.current.children;
                        const targetCard = cards[dotIdx] as HTMLElement;
                        targetCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        setActiveTideIndex(dotIdx);
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${activeTideIndex === dotIdx
                        ? "bg-[#0F3E17] scale-125"
                        : "bg-[#D4D4D4] hover:bg-[#A0A0A0]"
                      }`}
                    aria-label={`물때 ${dotIdx + 1}일차 카드로 이동`}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {/* Safety Alert Pill */}
                <div className="p-4 sm:px-5 sm:py-4 rounded-[8px] bg-[#F2F4F7] text-sm text-[#282828] flex items-start gap-2.5">
                  <div className="flex items-center h-[22.4px]"> {/* Match text line-height (14px * 1.6) */}
                    <svg className="w-[18px] h-[18px] text-[#FA5252] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="leading-[1.6] break-keep">
                    <strong className="font-bold">해안 탐방 안전 수칙 : </strong>갯벌 체험 및 해안 절경 탐방은 저조(물빠짐) 전후 2시간이 가장 안전하며, 만조 2시간 전에는 반드시 안전한 육지로 이동하세요.
                  </span>
                </div>

                {/* Data Source Notice */}
                <div className="text-right">
                  <span className="text-xs text-[#848484]">* 국립해양조사원 기준 해양 조석 시뮬레이션</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#848484] bg-[#F8F9FA] rounded-xl border border-[#EDEDED]">물때 정보를 불러오는 중입니다.</div>
          )}
        </section>

        {/* Section 04: 대표 비경 & 관광 명소 */}
        {spots.length > 0 && (
          <section id="section-spots" className="pb-[60px] border-b border-[#EDEDED]">
            <div className="flex flex-col gap-3 mb-6">
              <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight text-[#1E1E1E] leading-tight">
                대표 비경 & 추천 관광 명소
              </h3>
              <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
                {islandName}의 숨겨진 보물 같은 명소와 해안 산책로
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {spots.map((spot: any, idx: number) => {
                const rawOverview = spot.overview || spotOverviews[spot.contentId]?.overview || "";
                const summary = cleanText(rawOverview);
                const hasImage = Boolean(spot.firstImage);

                return (
                  <div key={idx} className="flex flex-col group cursor-pointer">
                    {/* 1. Clean Thumbnail Container (No Icon / No Badge) */}
                    <div
                      onClick={() => {
                        if (hasImage) {
                          const spotPhotos = spots.filter((s: any) => s.firstImage).map((s: any) => s.firstImage);
                          const currentIdx = spotPhotos.indexOf(spot.firstImage);
                          openGalleryModal(spotPhotos, currentIdx >= 0 ? currentIdx : 0);
                        }
                      }}
                      className={`relative w-full aspect-[4/4.2] rounded-[12px] sm:rounded-[16px] overflow-hidden bg-[#F3F4F6] ${hasImage ? "cursor-pointer" : "cursor-default"} shadow-2xs`}
                    >
                      {hasImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={spot.firstImage}
                            alt={spot.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF] bg-[#F5F5F5]">
                          <span className="text-2xl sm:text-3xl mb-1 opacity-60">📷</span>
                          <span className="text-xs font-medium text-[#848484]">이미지 준비중</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Card Content (Clean API Information - Consistent with Section 05) */}
                    <div className="mt-2 sm:mt-2.5 flex flex-col flex-1">
                      {/* Title (Bold 2-line clamp) */}
                      <h4 className="text-[15px] sm:text-[18px] font-bold text-[#1E1E1E] leading-[140%] tracking-tight line-clamp-2 group-hover:text-[#0F3E17] transition-colors">
                        {spot.title}
                      </h4>

                      {/* Real Address with Pinpoint Icon -> Links to Naver Map */}
                      {spot.addr && (
                        <a
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(spot.addr)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#717171] hover:text-[#0F3E17] hover:underline transition-colors mt-1 sm:mt-1.5 group/addr"
                          onClick={(e) => e.stopPropagation()}
                          title="네이버 지도로 위치 보기"
                        >
                          <svg className="w-3.5 h-3.5 text-[#717171] group-hover/addr:text-[#0F3E17] shrink-0 mt-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span className="leading-snug line-clamp-2">{spot.addr}</span>
                        </a>
                      )}

                      {/* Overview Summary if available */}
                      {summary && (
                        <p className="text-xs text-[#848484] leading-relaxed line-clamp-2 mt-1 m-0">
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 05: 주변 식당 & 숙박 정보 (Stayfolio Minimal Card Design - No Inner Divider) */}
        <section id="section-places">
          <div className="flex flex-col gap-3 mb-6">
            <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight text-[#1E1E1E] leading-tight">
              주변 먹거리 & 머물곳
            </h3>
            <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
              {islandName} 인근의 추천 식당, 숙소 및 캠핑 편의 시설
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Campsites */}
            {campsites.map((camp: any, idx: number) => {
              const cat = getPlaceCategory(camp, "camp");
              return (
                <a
                  key={`camp-${idx}`}
                  href={`https://map.naver.com/index.naver?query=${encodeURIComponent(camp.addr1 || camp.facltNm)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 sm:p-6 rounded-[10px] bg-white border border-[#E5E5E5] hover:border-[#1E1E1E] transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
                >
                  <div>
                    {/* Top Row: Pinpoint + Name on Left / Category Badge on Right */}
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1E1E1E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <h4 className="font-bold text-base sm:text-[17px] text-[#1E1E1E] group-hover:text-[#0F3E17] transition-colors truncate">
                          {camp.facltNm}
                        </h4>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${cat.badgeClass}`}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>

                    {/* Description / Address (No Divider Line) */}
                    <p className="text-sm text-[#717171] leading-relaxed line-clamp-2 mt-2.5 m-0">
                      {camp.addr1 || `${islandName} 자연 속 힐링 캠핑장`}
                    </p>
                  </div>

                  {camp.tel && (
                    <span className="text-xs text-[#848484] mt-2 block">
                      📞 {camp.tel}
                    </span>
                  )}
                </a>
              );
            })}

            {/* Restaurants */}
            {restaurants.slice(0, 6).map((rest: any, idx: number) => {
              const cat = getPlaceCategory(rest, "rest");
              return (
                <a
                  key={`rest-${idx}`}
                  href={`https://map.naver.com/index.naver?query=${encodeURIComponent(rest.addr || rest.bsshNm)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 sm:p-6 rounded-[10px] bg-white border border-[#E5E5E5] hover:border-[#1E1E1E] transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
                >
                  <div>
                    {/* Top Row: Pinpoint + Name on Left / Category Badge on Right */}
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1E1E1E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <h4 className="font-bold text-base sm:text-[17px] text-[#1E1E1E] group-hover:text-[#0F3E17] transition-colors truncate">
                          {rest.bsshNm}
                        </h4>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${cat.badgeClass}`}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>

                    {/* Description / Address (No Divider Line) */}
                    <p className="text-sm text-[#717171] leading-relaxed line-clamp-2 mt-2.5 m-0">
                      {rest.addr || `${islandName} 대표 향토 먹거리 식당`}
                    </p>
                  </div>

                  {rest.tel && (
                    <span className="text-xs text-[#848484] mt-2 block">
                      📞 {rest.tel}
                    </span>
                  )}
                </a>
              );
            })}

            {/* Lodges */}
            {lodges.slice(0, 6).map((lodge: any, idx: number) => {
              const cat = getPlaceCategory(lodge, "lodge");
              return (
                <a
                  key={`lodge-${idx}`}
                  href={`https://map.naver.com/index.naver?query=${encodeURIComponent(lodge.addr || lodge.bsshNm)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 sm:p-6 rounded-[10px] bg-white border border-[#E5E5E5] hover:border-[#1E1E1E] transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
                >
                  <div>
                    {/* Top Row: Pinpoint + Name on Left / Category Badge on Right */}
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1E1E1E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <h4 className="font-bold text-base sm:text-[17px] text-[#1E1E1E] group-hover:text-[#0F3E17] transition-colors truncate">
                          {lodge.bsshNm}
                        </h4>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${cat.badgeClass}`}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>

                    {/* Description / Address (No Divider Line) */}
                    <p className="text-sm text-[#717171] leading-relaxed line-clamp-2 mt-2.5 m-0">
                      {lodge.addr || `${islandName} 편안한 휴식을 선사하는 숙소`}
                    </p>
                  </div>

                  {lodge.tel && (
                    <span className="text-xs text-[#848484] mt-2 block">
                      📞 {lodge.tel}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </section>

        {/* Section 06: 블로그 생생 여행기 (LongBlack Style 4 Pastel Cards) */}
        {blogs.length > 0 && (
          <section id="section-media" className="pb-8">
            <div className="flex flex-col gap-3 mb-6">
              <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight text-[#1E1E1E] leading-tight">
                블로그 생생 여행기
              </h3>
              <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
                실제 다녀온 여행자들의 생생한 후기와 솔직 리뷰
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {blogs.slice(0, 4).map((blog: any, bIdx: number) => {
                // 10 Distinct Non-Green Curated Pastel Colors (Guaranteed No Duplicates)
                const pastel10Colors = [
                  "bg-[#FFE8E2]", // 0. Coral Peach (warm coral)
                  "bg-[#EBF3FE]", // 1. Soft Sky Blue (cool blue)
                  "bg-[#FFF4D6]", // 2. Warm Butter Cream (warm yellow)
                  "bg-[#F3E8FF]", // 3. Lavender Lilac (soft purple)
                  "bg-[#F5EBE1]", // 4. Warm Sand Latte (warm beige)
                  "bg-[#FCE7F3]", // 5. Pastel Rose Pink (soft pink)
                  "bg-[#E0F2FE]", // 6. Cool Ice Mist (fresh cyan-blue)
                  "bg-[#FFEDD5]", // 7. Warm Apricot Biscuit (warm apricot)
                  "bg-[#EDE9FE]", // 8. Soft Mauve Fog (gentle violet)
                  "bg-[#F8F1E7]", // 9. Warm Oat Linen (calm linen)
                ];

                // Collision-free offset: guarantees all 4 cards get completely unique colors
                const islandSeed = islandName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const colorBg = pastel10Colors[(islandSeed + bIdx * 2) % pastel10Colors.length];

                // Dynamic Line Clamping: 1-line title gets 4~5 lines preview, 2~3 line titles get 3~4 lines cleanly
                const titleText = cleanText(blog.title);
                const descClamp = titleText.length < 24 ? "line-clamp-5" : titleText.length < 45 ? "line-clamp-4" : "line-clamp-3";

                return (
                  <a
                    key={bIdx}
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-5 sm:p-6 rounded-[12px] ${colorBg} hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-start overflow-hidden group cursor-pointer`}
                  >
                    {/* 1. Full Card Title (Shows in full up to 3 lines) */}
                    <h4
                      className="text-[18px] sm:text-[20px] font-bold text-[#1E1E1E] leading-[140%] tracking-tight line-clamp-3 group-hover:text-black transition-colors"
                      title={titleText}
                    >
                      {titleText}
                    </h4>

                    {/* 2. Middle Meta: Blogger (Strict 1-Line Truncated with ...) + Date (Right) */}
                    <div className="text-sm font-medium text-[#1E1E1E]/60 mt-3 flex items-center justify-between gap-2 min-w-0 w-full">
                      <span
                        className="block truncate min-w-0 flex-1 font-semibold text-[#1E1E1E]/75 whitespace-nowrap overflow-hidden text-ellipsis"
                        title={cleanText(blog.bloggername)}
                      >
                        {cleanText(blog.bloggername)}
                      </span>
                      <span className="shrink-0 text-xs text-[#1E1E1E]/50 whitespace-nowrap">
                        {formatDate(blog.postdate)}
                      </span>
                    </div>

                    {/* 3. Bottom Preview Description (Dynamically 3~5 lines based on title length, no half-cut lines) */}
                    <p className={`text-base text-[#1E1E1E]/80 leading-[170%] ${descClamp} mt-3.5 pt-3 border-t border-black/5 m-0 break-keep overflow-hidden`}>
                      {cleanText(blog.description)}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 07: YouTube Videos */}
        {videos.length > 0 && (
          <section id="section-videos">
            <div className="flex flex-col gap-3 mb-6">
              <h3 className="text-[24px] sm:text-[28px] font-black tracking-tight text-[#1E1E1E] leading-tight">
                영상으로 보는 {islandName} 후기
              </h3>
              <p className="text-base text-[#6A6A6A] leading-[180%] break-keep m-0">
                유튜브 검색 파싱 데이터 · 조회수 상위 영상 · 카드에서 바로 재생
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {videos.slice(0, 3).map((video: any, vIdx: number) => (
                <div
                  key={vIdx}
                  id={`island-youtube-card-${vIdx}`}
                  onClick={() => setActiveVideo(video.embedUrl || video.url)}
                  className="flex flex-col gap-3.5 group cursor-pointer"
                >
                  {/* Video Thumbnail Box (Identical to Main Page) */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#EDEDED] shadow-sm group-hover:shadow-md transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.img || video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Duration badge if available */}
                    {video.dur && (
                      <span className="absolute right-3.5 bottom-3.5 inline-flex items-center h-6 px-2 rounded bg-black/75 text-white text-xs font-medium backdrop-blur-xs">
                        {video.dur}
                      </span>
                    )}

                    {/* Punched Hole White Circular Play Button (Main Page SVG) */}
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                    >
                      <svg
                        className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                        viewBox="0 0 56 56"
                      >
                        <mask id={`island-play-mask-${vIdx}`}>
                          <rect width="56" height="56" rx="28" fill="white" />
                          <polygon points="23,17 39,28 23,39" fill="black" />
                        </mask>
                        <rect
                          width="56"
                          height="56"
                          rx="28"
                          fill="rgba(255, 255, 255, 0.95)"
                          mask={`url(#island-play-mask-${vIdx})`}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Text Info Below Thumbnail */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-base sm:text-lg font-bold tracking-tight text-[#282828] leading-snug group-hover:text-[#0F3E17] transition-colors line-clamp-2 m-0">
                      {cleanText(video.title)}
                    </h4>
                    <span className="text-xs sm:text-sm text-[#6A6A6A] leading-relaxed">
                      {video.channelName || video.meta || `${islandName} 여행 가이드`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Back to List Button (Clean & Minimal Style) */}
        <div className="pt-4 sm:pt-6 pb-2 flex justify-center">
          <Link
            id="island-bottom-back-link"
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#D4D4D4] hover:border-[#0F3E17] text-[#1E1E1E] hover:text-[#0F3E17] transition-all duration-200 font-bold text-sm shadow-2xs group cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#717171] group-hover:text-[#0F3E17] group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>전체 섬 목록으로 돌아가기</span>
          </Link>
        </div>

      </div>

      {/* Mobile Floating Booking Bar (Triple / Klook Sleek Glassmorphism Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] p-3 px-5 flex justify-between items-center md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <span className="text-xs text-[#717171] font-medium">{islandName} · 왕복 운임</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#0F3E17]">
              {lowestFerry.fare}
            </span>
            {hasMultipleFerries && <span className="text-xs text-[#717171]">~</span>}
          </div>
        </div>
        <a
          href="https://island.theksa.co.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-5 rounded-[10px] bg-[#0F3E17] hover:bg-[#093712] active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <span>실시간 예매</span>
          <span>➔</span>
        </a>
      </div>

      {/* YouTube Video Modal */}
      {activeVideo && (
        <div
          id="island-youtube-modal"
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="island-youtube-modal-close-btn"
              type="button"
              aria-label="닫기"
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>
            <iframe
              src={activeVideo}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Image Slider Modal with 60% Dimmed Backdrop and < > Arrows */}
      {activePhotoIndex !== null && modalPhotos[activePhotoIndex] && (
        <div
          id="island-photo-modal"
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Close Button */}
          <button
            id="island-photo-modal-close-btn"
            type="button"
            aria-label="닫기"
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#1E1E1E] shadow-lg flex items-center justify-center text-lg font-bold transition-transform hover:scale-110 cursor-pointer"
          >
            ✕
          </button>

          {/* Left Arrow Button (<) */}
          {modalPhotos.length > 1 && (
            <button
              id="island-photo-modal-prev-btn"
              type="button"
              aria-label="이전 사진"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(prev => prev !== null ? (prev === 0 ? modalPhotos.length - 1 : prev - 1) : 0);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/85 hover:bg-white text-[#1E1E1E] shadow-xl flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 cursor-pointer"
            >
              ‹
            </button>
          )}

          {/* Right Arrow Button (>) */}
          {modalPhotos.length > 1 && (
            <button
              id="island-photo-modal-next-btn"
              type="button"
              aria-label="다음 사진"
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex(prev => prev !== null ? (prev === modalPhotos.length - 1 ? 0 : prev + 1) : 0);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/85 hover:bg-white text-[#1E1E1E] shadow-xl flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 cursor-pointer"
            >
              ›
            </button>
          )}

          {/* Main Image Container */}
          <div
            className="relative max-w-full max-h-full flex flex-col items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modalPhotos[activePhotoIndex]}
              alt="확대 이미지"
              className="max-w-[90vw] max-h-[82vh] object-contain rounded-none shadow-2xl transition-all"
            />

            {/* Counter Badge */}
            {modalPhotos.length > 1 && (
              <div className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold shadow-md">
                {activePhotoIndex + 1} / {modalPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

