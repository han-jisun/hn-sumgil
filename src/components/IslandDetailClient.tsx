"use client";

import React, { useState, useEffect } from "react";
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
  "굴업도": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  "대연평": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
  "대이작도": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80",
  "대청도": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=80",
  "덕적도": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
  "문갑도": "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800&auto=format&fit=crop&q=80",
  "백령도": "https://images.unsplash.com/photo-1473116763269-25544899376c?w=800&auto=format&fit=crop&q=80",
  "백아도": "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=800&auto=format&fit=crop&q=80",
  "소연평": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&auto=format&fit=crop&q=80",
  "소이작도": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80",
  "소청도": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  "승봉도": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&auto=format&fit=crop&q=80",
  "울도": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
  "자월도": "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&auto=format&fit=crop&q=80",
  "지도": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
  "소야도": "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f?w=800&auto=format&fit=crop&q=80"
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

const presetIslandSpots: Record<string, any[]> = {
  "굴업도": [
    { contentId: "preset-gulup-1", title: "개머리언덕", addr: "인천 옹진군 덕적면 굴업리", overview: "백패커들의 성지이자 붉은 일몰과 드넓은 수평선, 사슴들이 노니는 굴업도 최고의 언덕입니다.", firstImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-gulup-2", title: "코끼리바위", addr: "인천 옹진군 덕적면 굴업리", overview: "오랜 세월 파도와 바람에 깎여 코끼리 형상을 한 거대한 웅장한 해식아치 바위입니다.", firstImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-gulup-3", title: "목기해변", addr: "인천 옹진군 덕적면 굴업리", overview: "덕물도와 굴업도를 잇는 고요하고 맑은 백사장이 인상적인 모래 해변입니다.", firstImage: "https://images.unsplash.com/photo-1473116763269-25544899376c?w=500&auto=format&fit=crop&q=80" }
  ],
  "대연평": [
    { contentId: "preset-yeonpyeong-1", title: "연평평화안보수련원", addr: "인천 옹진군 연평면 연평리", overview: "서해 최북단 연평도의 평화와 안보의 중요성을 느끼고 안보 체험을 할 수 있는 공간입니다.", firstImage: "" },
    { contentId: "preset-yeonpyeong-2", title: "조기역사관", addr: "인천 옹진군 연평면 연평리", overview: "과거 조기 파시로 성황을 이루었던 연평도의 화려한 역사와 전망을 함께 품은 곳입니다.", firstImage: "" },
    { contentId: "preset-yeonpyeong-3", title: "망향전망대", addr: "인천 옹진군 연평면 연평리", overview: "황해도 땅이 시원하게 바라다보이는 연평도 북단의 아련하고 평화로운 조망 스팟입니다.", firstImage: "" }
  ],
  "대이작도": [
    { contentId: "preset-ijak-1", title: "풀등 (신비의 모래섬)", addr: "인천 옹진군 자월면 이작리", overview: "썰물 때만 바다 한가운데에 3~4시간 맑은 모래섬으로 솟아오르는 동양 유일의 신비로운 해상 모래사구입니다.", firstImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-ijak-2", title: "부아산 구름다리", addr: "인천 옹진군 자월면 이작리", overview: "정상 부아산에서 붉은 아치형 구름다리를 건너며 이작도 다도해 전경을 한눈에 담을 수 있습니다.", firstImage: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-ijak-3", title: "작은풀안 해수욕장", addr: "인천 옹진군 자월면 이작리", overview: "수심이 얕고 백사장이 고와 가족 단위 피서객과 백패커들이 휴식을 취하기 최적인 대표 해변입니다.", firstImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=80" }
  ],
  "자월도": [
    { contentId: "preset-jawol-1", title: "장골 해수욕장", addr: "인천 옹진군 자월면 자월리", overview: "완만한 백사장과 붉은 달빛 정취가 아름다운 자월도의 으뜸 대표 해수욕장입니다.", firstImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-jawol-2", title: "국사봉 전망대", addr: "인천 옹진군 자월면 자월리", overview: "봄철 벚꽃길과 함께 자월도 전체 해안선과 주변 섬 풍경이 한눈에 내려다보이는 시원한 정황입니다.", firstImage: "" },
    { contentId: "preset-jawol-3", title: "목섬 구름다리", addr: "인천 옹진군 자월면 자월리", overview: "푸른 바다 위를 가로질러 자월도 본섬과 아담한 목섬을 이어주는 빨간 아치형 구름다리입니다.", firstImage: "" }
  ],
  "문갑도": [
    { contentId: "preset-mungap-1", title: "깃대봉 등산 코스", addr: "인천 옹진군 덕적면 문갑리", overview: "사람의 손길이 많이 닿지 않아 때 묻지 않은 원시 숲길과 아기자기한 다도해 조망을 선사합니다.", firstImage: "" },
    { contentId: "preset-mungap-2", title: "한월리 해수욕장", addr: "인천 옹진군 덕적면 문갑리", overview: "고요한 자갈과 맑은 바닷물이 인상적인 고즈넉하고 순수한 청정 해변입니다.", firstImage: "" }
  ],
  "백아도": [
    { contentId: "preset-baega-1", title: "남조봉 기차바위", addr: "인천 옹진군 덕적면 백아리", overview: "공룡의 등뼈를 닮은 날카로운 암릉 구역으로 만과 섬 풍경이 360도로 터지는 명품 능선입니다.", firstImage: "" },
    { contentId: "preset-baega-2", title: "발전소 마을 선착장", addr: "인천 옹진군 덕적면 백아리", overview: "고요한 어촌 마을 정취와 백패커, 낚시꾼들이 사랑하는 호젓한 바다 조망 스팟입니다.", firstImage: "" }
  ],
  "소연평": [
    { contentId: "preset-soyeon-1", title: "얼굴바위", addr: "인천 옹진군 연평면 소연평리", overview: "사람의 오똑한 옆얼굴 형상을 정교하게 닮은 신비로운 서해의 대표 해식 기암입니다.", firstImage: "" },
    { contentId: "preset-soyeon-2", title: "소연평도 등대길", addr: "인천 옹진군 연평면 소연평리", overview: "어촌 마을 포구와 등대를 따라 한적하게 걸을 수 있는 호젓한 섬 산책로입니다.", firstImage: "" }
  ],
  "소이작도": [
    { contentId: "preset-soijak-1", title: "손가락바위", addr: "인천 옹진군 자월면 이작리", overview: "하늘을 향해 세 번째 손가락을 우뚝 찌르고 있는 듯한 소이작도의 신기하고 유쾌한 기암입니다.", firstImage: "" },
    { contentId: "preset-soijak-2", title: "갯티길 데크 산책로", addr: "인천 옹진군 자월면 이작리", overview: "바다 냄새를 물씬 맡으며 소이작도 해안 절경을 따라 안전하게 걸을 수 있는 해안 데크길입니다.", firstImage: "" }
  ],
  "울도": [
    { contentId: "preset-uldo-1", title: "울도 해안 절벽 탐방로", addr: "인천 옹진군 덕적면 울도리", overview: "덕적군도 최서단 외딴 섬으로 기암절벽과 깊고 푸른 서해 해양 생태계를 마주할 수 있습니다.", firstImage: "" }
  ],
  "지도": [
    { contentId: "preset-jido-1", title: "지도리 청정 어촌 정취", addr: "인천 옹진군 덕적면 지도리", overview: "인공적인 개발이 되지 않아 아늑하고 순수한 자연 그대로의 섬 정취를 느낄 수 있습니다.", firstImage: "" }
  ]
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

        if (fetchedSpots.length === 0 && presetIslandSpots[islandName]) {
          fetchedSpots = presetIslandSpots[islandName];
          const presetOverviews: Record<string, any> = {};
          for (const s of fetchedSpots) {
            presetOverviews[s.contentId] = {
              overview: s.overview,
              homepage: "",
              tel: "",
              loading: false
            };
          }
          setSpotOverviews(prev => ({ ...prev, ...presetOverviews }));
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
  const defaultImage = defaultIslandImages[islandName] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80";

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
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-md font-medium pointer-events-none">
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
                    className={`relative w-full h-full bg-[#EDEDED] overflow-hidden cursor-pointer group/item ${
                      index === 0 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-16 right-5 text-white">
                  <span className="text-xs uppercase tracking-wider text-[#E6FDE5] font-bold mb-1 block">Incheon Island Archive</span>
                  <h2 className="text-xl sm:text-2xl font-bold">{islandName}의 푸른 바다와 비경</h2>
                </div>
              </div>
            )}

            {/* Top-Left Floating Circular Back Button (Fixed 40px Area, No Size Jitter) */}
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-[#2A3036]/80 hover:bg-[#1A1F24] text-white backdrop-blur-md shadow-md border border-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer"
              title="이전 페이지로 돌아가기"
              aria-label="이전 페이지로 돌아가기"
            >
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Gallery Expand Button (Bottom-Right, Fixed 32px Area, No Size Jitter) */}
            <button 
              type="button"
              aria-label="사진 전체화면 확대"
              onClick={() => openGalleryModal(photos, 0)}
              className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-lg bg-black/65 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-colors duration-150 cursor-pointer shadow-md border border-white/20"
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

                  {/* Naver Map UI Header Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#03C75A]/40 shadow-sm text-xs font-bold text-[#1E1E1E]">
                    <span className="w-4 h-4 rounded-full bg-[#03C75A] text-white flex items-center justify-center font-black text-[10px]">
                      N
                    </span>
                    <span>{islandName} 네이버 위치 지도</span>
                    <span className="text-[11px] text-[#717171] font-normal hidden sm:inline">(좌표: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</span>
                  </div>
                </div>

                {/* Map Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[#717171] font-medium">📍 {island?.address}</span>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`https://map.naver.com/index.naver?query=${encodeURIComponent(islandName + " " + (island?.address || ""))}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#03C75A] text-white hover:bg-[#02b350] transition-colors font-bold inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="font-black text-[11px]">N</span>
                      <span>네이버 지도에서 보기 ↗</span>
                    </a>
                    <a 
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(islandName)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#FEE500] text-[#3C1E1E] hover:bg-[#ebd300] transition-colors font-bold inline-flex items-center gap-1"
                    >
                      <span>카카오맵 ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* 2. Main Content Flow (Full Width Vertical Stack) */}
      <div className="flex flex-col gap-[60px]">
        
        {/* Section 01: Island Header & Overview Story + Stayfolio-Style Booking Card (2-Column Grid) */}
        <section id="section-story" className="pb-[60px] border-b border-[#EDEDED]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
            
            {/* Left Column: [Island Title & Location] + [Story] + [Spec Table] (md:col-span-7) */}
            <div className="md:col-span-7 flex flex-col gap-6 pt-1">
              
              {/* 1) Island Title & Location */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 id="island-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-[#282828] leading-tight">
                    <span className="relative inline-block text-[#0F3E17]">
                      <span className="absolute left-[-4px] right-[-4px] bottom-1 h-3 rounded-full bg-[#E6FDE5] -z-10" />
                      {islandName}
                    </span>
                  </h1>
                  <p className="text-sm text-[#848484] mt-1.5 flex items-center gap-2">
                    <span>📍 위치: {island?.address}</span>
                  </p>
                </div>
              </div>

              {/* 2) Story Title & Description */}
              <div className="flex flex-col gap-3">
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[#282828] leading-snug tracking-tight">
                  {meta.desc}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#6A6A6A] leading-[180%] break-keep m-0">
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

                {/* Row 2: 대표 비경 (Clickable -> #section-spots) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    대표 비경
                  </span>
                  <span 
                    onClick={() => scrollToSection("section-spots")}
                    className="text-[#404040] underline underline-offset-4 decoration-[#D4D4D4] hover:decoration-[#0F3E17] hover:text-[#0F3E17] hover:font-bold cursor-pointer transition-all leading-relaxed"
                    title="클릭하여 대표 비경 목록으로 이동"
                  >
                    명소 {spots.length || presetIslandSpots[islandName]?.length || 3}곳 ({meta.topSpots})
                  </span>
                </div>

                {/* Row 3: 인기 테마 (Static / Tag list) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    인기 테마
                  </span>
                  <div className="flex items-center gap-2 flex-wrap text-[#404040]">
                    {meta.tags.map((tag, i) => (
                      <span key={i} className="text-[#0F3E17] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Row 4: 액티비티 (Static) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    액티비티
                  </span>
                  <span className="text-[#404040] leading-relaxed">
                    {meta.backpacking ? "백패킹 가능" : "백패킹 불가"} · {meta.trekking ? "해안 둘레길 트레킹" : "트레킹 코스 없음"}
                  </span>
                </div>

                {/* Row 5: 주변 편의 (Clickable -> #section-places) */}
                <div className="py-3.5 sm:py-4 flex items-baseline gap-6 sm:gap-10">
                  <span className="w-20 sm:w-24 shrink-0 font-bold text-[#1E1E1E]">
                    주변 편의
                  </span>
                  <span 
                    onClick={() => scrollToSection("section-places")}
                    className="text-[#404040] underline underline-offset-4 decoration-[#D4D4D4] hover:decoration-[#0F3E17] hover:text-[#0F3E17] hover:font-bold cursor-pointer transition-all leading-relaxed"
                    title="클릭하여 식당·숙소·캠핑 목록으로 이동"
                  >
                    식당 {restaurants.length}개소 · 숙소 {lodges.length}곳 {campsites.length > 0 ? `· 캠핑장 ${campsites.length}곳` : ""}
                  </span>
                </div>

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
                  <span>🚢 여객선 운항 노선 및 요금</span>
                </div>

                {/* Ferry Routes List (Repeating [Grey Box] + [주요 출항 & 운항 횟수] for each route) */}
                <div className="flex flex-col divide-y divide-[#EDEDED]">
                  {sortedFerries.map((ferry, idx) => {
                    const routeInfo = getFerryRouteDetail(islandName, ferry, idx, sortedFerries.length);
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col gap-2 ${
                          idx === 0 
                            ? (sortedFerries.length > 1 ? "pb-5" : "") 
                            : "pt-5"
                        }`}
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

              {/* 3. CTA Button */}
              <a 
                id="story-ferry-booking-btn"
                href="https://island.theksa.co.kr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3.5 rounded-[10px] bg-[#0F3E17] hover:bg-[#093712] text-white font-bold text-sm sm:text-base text-center transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] mt-1"
              >
                <span>🚢 실시간 잔여석 조회 & 예매하기 ➔</span>
              </a>

              {/* Safe Booking Notice */}
              <p className="text-xs text-[#848484] leading-relaxed text-center m-0">
                한국해운조합 공식 전산망 연동 · 기상에 따라 출항 변동 가능
              </p>
            </div>

          </div>
        </section>

        {/* Section 02: 실시간 3일 물때(조석) - 3 Separate Cards with Conditions Style */}
        <section id="section-tide" className="pb-[60px] border-b border-[#EDEDED]">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#282828] flex items-center gap-2">
                <span>🌊</span> 실시간 3일 물때 (조석 예보)
              </h3>
              <p className="text-xs text-[#848484] mt-1">* 갯벌체험 및 해안 탐방 시 간조(물 빠짐) 시간을 반드시 확인하세요.</p>
            </div>
            <span className="text-xs text-[#848484] hidden sm:block">* 국립해양조사원 기준 해양 조석 시뮬레이션</span>
          </div>

          {tides.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* 3 Separate Day Cards Grid (Mobile Horizontal Swipe Slider + Desktop 3-Col Grid) */}
              <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-3 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
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
                    return `${prefix} (${dayName} · ${parseInt(parts[1])}월 ${parseInt(parts[2])}일)`;
                  };

                  const dayWeather = weather[index];

                  return (
                    <div 
                      key={index} 
                      className={`w-[86vw] sm:w-[360px] md:w-auto shrink-0 md:shrink snap-center rounded-[14px] border bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md ${
                        index === 0 ? "border-[#0F3E17]/40 ring-1 ring-[#0F3E17]/10" : "border-[#D4D4D4] hover:border-[#0F3E17]"
                      }`}
                    >
                      {/* Card Header: Weather Condition Block */}
                      <div className="flex flex-col gap-3 pb-3.5 border-b border-[#EDEDED]">
                        {/* Top Row: Day of Week & Date on Left, Lunar Date on Right */}
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <div className="font-bold text-[15px] text-[#282828] tracking-tight">
                            {getDayLabel(tide.date, index)}
                          </div>
                          <span className="text-xs text-[#848484] font-normal">{tide.lunarDate}</span>
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
                              <div className="flex items-center gap-1.5 text-[11px] text-[#848484]">
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
                              <span className="text-[#848484] font-normal text-[11px]">일출</span>
                              <span className="text-[#333333] text-xs sm:text-[13px]">{dayWeather?.sunrise || "5:50 am"}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#848484] font-normal text-[11px]">일몰</span>
                              <span className="text-[#333333] text-xs sm:text-[13px]">{dayWeather?.sunset || "7:21 pm"}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#848484] font-normal text-[11px]">강수</span>
                              <span className="text-[#0284C7] text-xs sm:text-[13px]">{dayWeather?.pop || "0%"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4 Tide Events List (고조/만조 & 저조/간조) */}
                      <div className="flex flex-col gap-2">
                        {tide.tideTime.map((event: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center px-3 py-2 rounded-[8px] bg-[#F8F9FA] border border-[#EDEDED] text-xs">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              event.type === '고조' ? 'bg-[#FFF1F0] text-[#E5484D]' : 'bg-[#E6FDE5] text-[#0F3E17]'
                            }`}>
                              {event.type === '고조' ? '⬆️ 만조(고조)' : '⬇️ 간조(저조)'}
                            </span>
                            <span className="font-bold text-sm text-[#282828]">{event.time}</span>
                            <span className="text-[#848484] font-medium">{event.height}cm</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer: Tide State Status */}
                      <div className="pt-3 border-t border-[#EDEDED] text-xs font-bold text-[#0F3E17] text-center bg-[#E6FDE5]/40 py-2 rounded-[8px]">
                        {tide.waterLevel}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Safety Alert Pill */}
              <div className="p-4 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] text-xs text-[#6A6A6A] flex items-start gap-2.5">
                <span className="text-base leading-none">⚠️</span>
                <span className="leading-relaxed">
                  <strong>해안 탐방 안전 수칙</strong>: 갯벌 체험 및 해안 절경 탐방은 <strong>저조(물빠짐) 전후 2시간</strong>이 가장 안전하며, 만조 2시간 전에는 반드시 안전한 육지로 이동하세요.
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#848484] bg-[#F8F9FA] rounded-xl border border-[#EDEDED]">물때 정보를 불러오는 중입니다.</div>
          )}
        </section>

        {/* Section 04: 대표 비경 & 관광 명소 */}
        {spots.length > 0 && (
          <section id="section-spots" className="pb-[60px] border-b border-[#EDEDED]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#282828] flex items-center gap-2">
                <span>📸</span> 대표 비경 & 추천 관광 명소 ({spots.length}선)
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {spots.map((spot: any, idx: number) => {
                const spotImage = spot.firstImage || defaultImage;
                const rawOverview = spot.overview || spotOverviews[spot.contentId]?.overview || "아름다운 인천 섬의 대표적인 명소입니다.";
                const summary = cleanText(rawOverview);
                return (
                  <div key={idx} className="p-4 rounded-[12px] border border-[#D4D4D4] bg-white hover:border-[#0F3E17] hover:shadow-[0_8px_24px_rgba(21,29,31,0.08)] transition-all duration-300 flex flex-col gap-3 group">
                    <div 
                      onClick={() => {
                        const spotPhotos = spots.map((s: any) => s.firstImage || defaultImage);
                        openGalleryModal(spotPhotos, idx);
                      }}
                      className="relative w-full aspect-video rounded-[8px] overflow-hidden shrink-0 bg-[#EDEDED] cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={spotImage} 
                        alt={spot.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="font-bold text-[15px] text-[#282828] group-hover:text-[#0F3E17] transition-colors truncate">{spot.title}</span>
                      <p className="text-xs text-[#6A6A6A] leading-relaxed line-clamp-2">{summary}</p>
                      {spot.addr && (
                        <a 
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(spot.addr)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[11px] text-[#848484] hover:text-[#0F3E17] hover:underline truncate mt-auto pt-1 block"
                        >
                          📍 {spot.addr} ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 05: 주변 식당 & 숙박 정보 (Clean Tab Switching) */}
        <section id="section-places" className="pb-[60px] border-b border-[#EDEDED]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#282828] flex items-center gap-2">
              <span>🍽️</span> 주변 먹거리 & 머물곳
            </h3>
            <span className="text-xs text-[#848484]">총 {restaurants.length + lodges.length + campsites.length}개소 등록</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Campsites */}
            {campsites.map((camp: any, idx: number) => (
              <div key={`camp-${idx}`} className="p-4 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#0F3E17] transition-all flex flex-col justify-between gap-2 text-xs shadow-2xs">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-[#0F3E17] truncate">{camp.facltNm}</span>
                    <span className="text-[11px] bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded font-medium shrink-0">
                      ⛺ {camp.induty || "캠핑장"}
                    </span>
                  </div>
                  {camp.addr1 && (
                    <a 
                      href={`https://map.naver.com/index.naver?query=${encodeURIComponent(camp.addr1)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline truncate block"
                    >
                      📍 {camp.addr1} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Restaurants */}
            {restaurants.slice(0, 6).map((rest: any, idx: number) => (
              <div key={`rest-${idx}`} className="p-4 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#0F3E17] transition-all flex flex-col justify-between gap-2 text-xs shadow-2xs">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-[#282828] truncate max-w-[70%]">{rest.bsshNm}</span>
                    <span className="text-[11px] bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded font-medium shrink-0">
                      🍽️ {rest.type || "식당"}
                    </span>
                  </div>
                  <a 
                    href={`https://map.naver.com/index.naver?query=${encodeURIComponent(rest.addr)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline truncate block"
                  >
                    📍 {rest.addr} ↗
                  </a>
                </div>
                {rest.tel && <span className="text-[#848484] text-[11px]">📞 {rest.tel}</span>}
              </div>
            ))}

            {/* Lodges */}
            {lodges.slice(0, 3).map((lodge: any, idx: number) => (
              <div key={`lodge-${idx}`} className="p-4 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#0F3E17] transition-all flex flex-col justify-between gap-2 text-xs shadow-2xs">
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-[#282828] truncate">{lodge.bsshNm}</span>
                    <span className="text-[11px] bg-[#F6F6F6] text-[#525252] px-2 py-0.5 rounded font-medium shrink-0">
                      🏡 민박/펜션
                    </span>
                  </div>
                  <a 
                    href={`https://map.naver.com/index.naver?query=${encodeURIComponent(lodge.addr)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline truncate block"
                  >
                    📍 {lodge.addr} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 06: 여행자 후기 및 미디어 가이드 */}
        <section id="section-media" className="pb-8">
          <div className="flex flex-col gap-8">
            
            {/* Blogs Section (Stayfolio 2-Column Responsive Grid Layout) */}
            {blogs.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] flex items-center gap-2">
                    <span>📖</span> 블로그 생생 여행기
                  </h3>
                  <span className="text-xs sm:text-sm text-[#848484]">
                    실제 다녀온 여행자들의 최신 리뷰
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 sm:gap-y-8 pt-4 border-t border-[#EDEDED]">
                  {blogs.map((blog: any, bIdx: number) => {
                    const blogImg = blog.thumbnail || (photos && photos.length > 0 ? photos[bIdx % photos.length] : defaultImage);
                    return (
                      <a
                        key={bIdx}
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 sm:gap-5 group cursor-pointer pb-5 border-b border-[#EDEDED] md:border-b-0 md:pb-0"
                      >
                        {/* Square Thumbnail */}
                        <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-[12px] overflow-hidden shrink-0 bg-[#EDEDED]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blogImg}
                            alt={cleanText(blog.title)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Right Content Column */}
                        <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5 h-full">
                          <div>
                            <h4 className="text-[15px] sm:text-base font-bold text-[#1E1E1E] group-hover:text-[#0F3E17] line-clamp-1 leading-snug transition-colors">
                              {cleanText(blog.title)}
                            </h4>
                            <p className="text-sm text-[#525252] line-clamp-2 leading-relaxed mt-1.5 break-keep">
                              {cleanText(blog.description)}
                            </p>
                          </div>

                          {/* Bottom Meta: Author · Date */}
                          <div className="text-xs sm:text-[13px] text-[#848484] mt-2.5 flex items-center gap-1.5">
                            <span className="font-medium text-[#6A6A6A] truncate max-w-[120px] sm:max-w-none">
                              {cleanText(blog.bloggername)}
                            </span>
                            <span>·</span>
                            <span className="shrink-0">
                              {formatDate(blog.postdate)}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YouTube */}
            {videos.length > 0 && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] flex items-center gap-2">
                    <span>📺</span> 영상으로 보는 {islandName} 후기
                  </h3>
                  <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
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
              </div>
            )}

          </div>
        </section>

        {/* Bottom Back to Explore Link */}
        <div className="pt-2 sm:pt-4 flex justify-center">
          <Link 
            id="island-bottom-back-link"
            href="/explore" 
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#D4D4D4] hover:border-[#0F3E17] text-[#1E1E1E] hover:text-[#0F3E17] transition-all font-bold text-xs sm:text-sm shadow-2xs group cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-[#F6F6F6] border border-[#D4D4D4] flex items-center justify-center group-hover:border-[#0F3E17] transition-colors text-xs">
              ←
            </span>
            <span>전체 섬 목록으로 돌아가기</span>
          </Link>
        </div>

      </div>

      {/* Mobile Floating Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDEDED] p-3 px-4 flex justify-between items-center md:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#717171] font-medium">{islandName} · 왕복 운임</span>
          <span className="text-sm font-bold text-[#0F3E17]">
            {lowestFerry.fare}{hasMultipleFerries ? "~" : ""}
          </span>
        </div>
        <a 
          href="https://island.theksa.co.kr/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="py-2 px-4 rounded-lg bg-[#0F3E17] text-white font-bold text-xs hover:bg-[#093712] transition-colors"
        >
          승선권 예매 ➔
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
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
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
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
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
              <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-md">
                {activePhotoIndex + 1} / {modalPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

