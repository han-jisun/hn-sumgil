"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Structure for the Interactive Preview Widget
interface MockIslandData {
  island: string;
  tagline: string;
  desc: string;
  image: string;
  ferry: {
    route: string[];
    time: string;
    fare: string;
    tip: string;
  };
  backpacking: {
    status: "eligible" | "restricted";
    matchedBlogs: number;
    safetyLevel: string;
    tip: string;
    blogs: { title: string; blogger: string; date: string }[];
  };
  foodAndLodge: {
    restaurants: { name: string; menu: string; contact: string }[];
    lodges: { name: string; type: string; contact: string }[];
  };
  trekking: {
    course: string;
    dist: string;
    time: string;
    points: string[];
  };
}

const mockIslandsPreview: Record<string, MockIslandData> = {
  "굴업도": {
    island: "굴업도",
    tagline: "백패킹성지 · 한국의 갈라파고스",
    desc: "끝없이 펼쳐진 개머리언덕과 푸른 해안 절벽의 경이로운 대자연을 품고 있는 섬입니다.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    ferry: {
      route: ["인천항 연안터미널 (쾌속선)", "덕적도 진리선착장 (나래호 환승)", "굴업도 선착장"],
      time: "2시간 30분 (대기 시간 제외)",
      fare: "59,500원 (왕복 기준 약 119,000원)",
      tip: "덕적도 출발 홀수일/짝수일 순환 방향에 따라 소요 시간이 1시간가량 차이 나니 일정을 꼭 맞추어 계획하세요!"
    },
    backpacking: {
      status: "eligible",
      matchedBlogs: 148,
      safetyLevel: "매우 권장 (LNT 필수)",
      tip: "개머리언덕 정상은 사유지이므로 LNT(흔적 남기지 않기)를 철저히 지켜야 하며, 바람이 강해 팩다운이 필수적입니다. 화기 사용은 전면 금지되어 있습니다.",
      blogs: [
        { title: "백패커의 버킷리스트 굴업도 개머리언덕 2박3일 완벽 가이드", blogger: "캠프러버", date: "2026.06.12" },
        { title: "화기 없이 백패킹하기: 굴업도 비박 꿀팁과 준수사항", blogger: "아웃도어매니아", date: "2026.06.01" },
        { title: "덕적도 환승으로 나래호 타고 굴업도 들어가는 법 정리", blogger: "보헤미안", date: "2026.05.15" }
      ]
    },
    foodAndLodge: {
      restaurants: [
        { name: "장할머니 식당 (큰마을)", menu: "가정식 백반, 꽃게탕, 꽃게무침", contact: "032-831-7277" },
        { name: "고씨네 민박 식당", menu: "가정식 백반, 갱깽이국", contact: "032-831-7212" }
      ],
      lodges: [
        { name: "서해 민박", type: "재래식 민박 / 야외 마당 텐트 연계", contact: "032-831-7211" },
        { name: "굴업 펜션", type: "현대식 온돌 펜션 / 선착장 픽업", contact: "032-831-1250" }
      ]
    },
    trekking: {
      course: "개머리언덕 능선 트레킹",
      dist: "3.2 km",
      time: "왕복 약 1시간 40분",
      points: ["큰마을해변", "솔밭숲길", "개머리언덕 정상", "낭개머리 해안절벽"]
    }
  },
  "대청도": {
    island: "대청도",
    tagline: "모래사막 · 해안 절경의 신비",
    desc: "한국 유일의 활동성 모래사막(대청사구)과 거대한 기암벽 서풍받이를 만날 수 있는 섬입니다.",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80",
    ferry: {
      route: ["인천항 연안터미널 (코리아프라이드호 / 하모니플라워호)", "대청도 선진포항 직항"],
      time: "3시간 40분 (직항)",
      fare: "134,700원 (인천 시민 할인 적용 시 약 3~4만원대)",
      tip: "기상 상황에 따라 선박 통제가 잦은 최북단 구역입니다. 출발 전 반드시 선박 운항 현황 조회가 필수적입니다."
    },
    backpacking: {
      status: "eligible",
      matchedBlogs: 52,
      safetyLevel: "지정 야영지 권장",
      tip: "대청사구 인근 등 보호구역 내 야영은 불법입니다. 선진포항 부근 인도교 주변이나 농여해변 공원 야영지를 이용하는 것을 적극 추천합니다.",
      blogs: [
        { title: "바람의 섬 대청도 백패킹: 서풍받이 기암절벽 해안 뷰", blogger: "바람아래", date: "2026.06.10" },
        { title: "대청사구와 농여해변 풀등, 숨겨진 트레킹 코스 리뷰", blogger: "로드트립", date: "2026.05.28" },
        { title: "대청도 삼각산 정상 백패킹 야영 여건과 전망", blogger: "산과바다", date: "2026.04.20" }
      ]
    },
    foodAndLodge: {
      restaurants: [
        { name: "선진포 횟집", menu: "자연산 활어회, 꽃게탕, 회덮밥", contact: "032-836-2345" },
        { name: "동해 식당", menu: "홍합초 비빔밥, 해물짜장면", contact: "032-836-1140" },
        { name: "풍만 식당", menu: "백반 정식, 갈치조림", contact: "032-836-2525" }
      ],
      lodges: [
        { name: "엘림 콘도텔", type: "콘도식 숙소 / 바비큐 가능", contact: "032-836-2244" },
        { name: "아일랜드 뷰 펜션", type: "해안 조망 목조 펜션", contact: "032-836-1234" }
      ]
    },
    trekking: {
      course: "서풍받이 해안 갯티길 코스",
      dist: "4.5 km",
      time: "편도 약 2시간 15분",
      points: ["광난두 정자", "서풍받이 언덕", "하늘전망대", "조각바위 갈림길"]
    }
  },
  "대이작도": {
    island: "대이작도",
    tagline: "신비의 은빛 모래섬 풀등",
    desc: "썰물 때만 수평선 위로 모습을 드러내는 신비로운 모래섬 '풀등'과 울창한 솔밭길을 간직한 섬입니다.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80",
    ferry: {
      route: ["인천항 연안터미널 (쾌속선)", "자월도 경유", "대이작도 선착장 (or 방아머리 페리 자차 선적 가능)"],
      time: "1시간 40분 (쾌속선 기준)",
      fare: "43,700원 (차량 선적 시 추가 비용 발생)",
      tip: "대부도 방아머리 선착장에서 차량을 싣고(차도선) 들어올 수도 있어 편리한 자차 캠핑도 가능합니다."
    },
    backpacking: {
      status: "eligible",
      matchedBlogs: 76,
      safetyLevel: "매우 편리 (화장실/개수대 완비)",
      tip: "작은풀안 해수욕장 내부 솔밭 야영지는 화장실, 식수대, 개수대가 아주 잘 관리되어 있어 초보 백패커에게 최적화되어 있습니다.",
      blogs: [
        { title: "솔밭 아래서 캠핑하기: 대이작도 작은풀안 솔밭 백패킹", blogger: "솔캠퍼", date: "2026.06.05" },
        { title: "하루 단 두 번 열리는 신비의 은빛 모래섬 풀등 보트 탑승기", blogger: "바다요정", date: "2026.05.29" },
        { title: "대이작도 부아산 하트전망대 구름다리 가벼운 하이킹", blogger: "하이킹라이프", date: "2026.05.10" }
      ]
    },
    foodAndLodge: {
      restaurants: [
        { name: "이조 한식당 (선착장 부근)", menu: "바지락 칼국수, 회무침 백반", contact: "032-834-9090" },
        { name: "풀등 아일랜드 식당", menu: "가정식 뷔페, 해물 칼국수", contact: "032-834-8845" }
      ],
      lodges: [
        { name: "풀등 펜션", type: "해안가 단독 펜션", contact: "032-834-8080" },
        { name: "이작도 해림 민박", type: "친절한 사장님 / 낚시 연계 민박", contact: "032-834-7732" }
      ]
    },
    trekking: {
      course: "부아산 해송숲길 & 하트전망대",
      dist: "3.8 km",
      time: "왕복 약 2시간",
      points: ["이작선착장", "오형제 바위", "부아산 구름다리", "하트전망대"]
    }
  }
};

export default function HomePage() {
  const [selectedIsland, setSelectedIsland] = useState<string>("굴업도");
  const [activeTab, setActiveTab] = useState<"ferry" | "backpacking" | "foodAndLodge" | "trekking">("ferry");

  const currentData = mockIslandsPreview[selectedIsland];

  return (
    <div className="w-full relative">
      {/* Background Decorative Sea Glows */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(14,165,233,0.07)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>
      <div className="absolute top-[45%] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] -z-10 pointer-events-none blur-[50px]"></div>

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center min-h-[80vh] py-28 px-6 overflow-hidden">
        <span className="bg-primary/10 text-primary border border-primary/20 py-1.5 px-4 rounded-full text-xs font-bold mb-6 tracking-wide uppercase shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          인천 섬 정보의 모든 조각을 하나로
        </span>
        <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold leading-[1.15] mb-8 tracking-[-1.5px]">
          따로따로 찾지 말고,<br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent glow-text-primary">
            한눈에 쉽고 빠르게, 한눈섬길
          </span>
        </h1>
        <p className="text-[clamp(0.95rem,1.8vw,1.15rem)] text-text-secondary max-w-[720px] leading-relaxed mb-12">
          여객선 요금은 항만공사에서, 백패킹 가능 규제는 최근 블로그 리뷰에서,<br />
          정말 밥 먹을 식당이 영업 중인지는 지자체 인허가 대장에서...<br />
          <span className="text-text-primary font-medium">따로 헤매지 마세요!</span> 한눈섬길이 이 모든 핵심 정보를 한 대시보드에 모아 검증해 드립니다.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link 
            href="/explore" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-4 px-9 rounded-full font-bold text-base shadow-[0_4px_24px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)] transition-all duration-300"
          >
            🏝️ 인천 16개 섬 탐색하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
