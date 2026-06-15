"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import islandsData from "@/app/data/islands.json";

// Data mapping for all 16 islands to display dynamic content in the Top 3 section
const islandImages: Record<string, string> = {
  "굴업도": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
  "대연평": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
  "대이작도": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80",
  "대청도": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80",
  "덕적도": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
  "문갑도": "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=600&auto=format&fit=crop&q=80",
  "백령도": "https://images.unsplash.com/photo-1473116763269-25544899376c?w=600&auto=format&fit=crop&q=80",
  "백아도": "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=600&auto=format&fit=crop&q=80",
  "소연평": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&auto=format&fit=crop&q=80",
  "소이작도": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop&q=80",
  "소청도": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
  "승봉도": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&auto=format&fit=crop&q=80",
  "울도": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80",
  "자월도": "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&auto=format&fit=crop&q=80",
  "지도": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "소야도": "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f?w=600&auto=format&fit=crop&q=80"
};

const islandMeta: Record<string, { backpacking: boolean; trekking: boolean; desc: string }> = {
  "굴업도": { backpacking: true, trekking: true, desc: "한국의 갈라파고스라 불리는 백패킹의 성지 개머리언덕과 해안 절벽" },
  "대연평": { backpacking: false, trekking: true, desc: "평화기념관과 조기역사관이 있는 서해 최북단의 평화로운 섬" },
  "대이작도": { backpacking: true, trekking: true, desc: "썰물 때만 나타나는 신비의 모래섬 풀등과 울창한 해송 숲길" },
  "대청도": { backpacking: true, trekking: true, desc: "옥빛 바다와 한국 유일의 활동성 모래사막이 어우러진 비경" },
  "덕적도": { backpacking: true, trekking: true, desc: "해송 숲과 드넓은 백사장이 어우러진 캠핑과 휴양의 대표 섬" },
  "문갑도": { backpacking: true, trekking: true, desc: "한적하고 때 묻지 않은 깃대봉 등산로와 독특한 돌담 골목길" },
  "백령도": { backpacking: false, trekking: true, desc: "심청이의 설화와 천연기념물 사곶사빈, 비경의 두무진 절벽" },
  "백아도": { backpacking: true, trekking: true, desc: "발전소 마을 앞 절경과 남조봉 기차바위가 있는 고요한 비박지" },
  "소연평": { backpacking: false, trekking: true, desc: "얼굴바위와 깨끗한 포구가 맞이하는 때 묻지 않은 소박한 섬" },
  "소이작도": { backpacking: true, trekking: true, desc: "해안을 따라 이어진 갯티길과 손가락 바위의 신비로운 형상" },
  "소청도": { backpacking: true, trekking: true, desc: "분바위와 푸른 하늘 아래 우뚝 솟은 등대가 지키는 고요의 섬" },
  "승봉도": { backpacking: true, trekking: true, desc: "공기가 맑고 울창한 산림과 이일레 해수욕장, 촛대바위 등 기암괴석의 향연" },
  "울도": { backpacking: true, trekking: true, desc: "덕적 군도 최서단의 신비로운 비경과 낚시꾼들이 사랑하는 해안" },
  "자월도": { backpacking: true, trekking: true, desc: "붉은 달빛의 장골 해변과 조용히 은빛 물결이 부서지는 휴식처" },
  "지도": { backpacking: true, trekking: true, desc: "개발되지 않아 때 묻지 않은 순수한 서해안의 보물 같은 작은 섬" },
  "소야도": { backpacking: true, trekking: true, desc: "덕적도와 다리로 이어진 조용하고 한적한 떼뿌리 캠핑 천국" }
};

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
  const [clicks, setClicks] = useState<Record<string, number>>({});

  const currentData = mockIslandsPreview[selectedIsland];

  // Fetch click counts from API on load
  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const res = await fetch("/api/clicks");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.clicks) {
            setClicks(data.clicks);
          }
        }
      } catch (err) {
        console.error("Failed to load click counts on homepage:", err);
      }
    };
    fetchClicks();
  }, []);

  // Compute live popular islands Top 3 from the 16 islands dataset
  const popularIslands = [...islandsData]
    .map((item) => {
      const count = clicks[item.island] || 0;
      return { ...item, clicksCount: count };
    })
    .sort((a, b) => b.clicksCount - a.clicksCount)
    .slice(0, 3);

  // Helper rank badge decorator
  const getRankDecoration = (index: number) => {
    switch (index) {
      case 0:
        return { badge: "🏆 인기 1위", color: "from-amber-400 to-amber-600 text-amber-950 border-amber-400/30" };
      case 1:
        return { badge: "🥈 인기 2위", color: "from-slate-300 to-slate-400 text-slate-950 border-slate-300/30" };
      case 2:
        return { badge: "🥉 인기 3위", color: "from-amber-700 to-amber-900 text-amber-100 border-amber-800/30" };
      default:
        return { badge: "", color: "" };
    }
  };

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
          <Link 
            href="/explore?filter=backpacking" 
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary border border-white/10 hover:border-white/20 py-4 px-9 rounded-full font-bold text-base transition-all duration-300"
          >
            🎒 백패킹 가능 섬 검색
          </Link>
        </div>
      </section>

      {/* Philosophy & Target Section - Explaining the CORE intent */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-[#040816]/30">
        <div className="container m-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="text-[2rem] font-bold mb-4 tracking-tight">우리가 이 서비스를 만든 이유</h2>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed">
              섬 여행 계획의 가장 큰 장벽은 <span className="text-text-primary font-semibold">"정보의 단절"</span>이었습니다.<br />
              일반 지도 앱이나 한두 개의 사이트만 보고 떠났다가는 배편이 없거나, 야영이 불법이거나, 밥 먹을 곳이 없는 낭패를 보기 쉽습니다. 한눈섬길은 이 파편화된 탐색 과정을 한눈에 모았습니다.
            </p>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* The Old Way */}
            <div className="lg:col-span-5 p-8 rounded-3xl border border-red-500/10 bg-red-950/5 flex flex-col justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
              <div>
                <div className="flex items-center gap-2 mb-6 text-red-400 font-bold text-sm tracking-wide uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  기존의 번거로운 섬 여행 준비
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-6">최소 4개 이상의 흩어진 사이트 검색</h3>
                
                <ul className="flex flex-col gap-4 text-xs text-text-secondary">
                  <li className="flex gap-3 items-start bg-white/2 p-3.5 rounded-xl border border-white/5">
                    <span className="text-lg leading-none">⛴️</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">여객선 요금 & 배편</strong>
                      인천항 여객 터미널 혹은 개별 선사 예약 홈페이지를 일일이 찾아 운임 요금표와 배편 시간 조율
                    </div>
                  </li>
                  <li className="flex gap-3 items-start bg-white/2 p-3.5 rounded-xl border border-white/5">
                    <span className="text-lg leading-none">🎒</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">백패킹 & 비박 가능 여부</strong>
                      군사 접경 법적 제한구역인지, 해안 텐트가 허용되는지 최근 네이버 블로그/카페 글 수십 개를 직접 탐색
                    </div>
                  </li>
                  <li className="flex gap-3 items-start bg-white/2 p-3.5 rounded-xl border border-white/5">
                    <span className="text-lg leading-none">🍽️</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">식당 & 숙소 부대시설</strong>
                      작은 섬 안의 맛집이 지도 서비스와 달리 폐업했거나 예약제 운영은 아닌지 공사/전화로 확인
                    </div>
                  </li>
                </ul>
              </div>
              <p className="text-[0.7rem] text-red-400/75 italic bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-center font-medium">
                ⚠️ 계획 과정만 수 시간이 소요되며 정보의 정합성이 낮음
              </p>
            </div>

            {/* Middle Vector Connector for larger screens */}
            <div className="hidden lg:flex lg:col-span-2 flex-col justify-center items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                ➔
              </div>
              <div className="h-24 w-[1px] bg-gradient-to-b from-primary/30 to-secondary/30 my-2"></div>
            </div>

            {/* The Hn-Sumgil Way */}
            <div className="lg:col-span-5 p-8 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div>
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm tracking-wide uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-glow"></span>
                  편리한 한눈섬길 하나로
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-6">검증된 통합 대시보드 1초 매칭</h3>

                <ul className="flex flex-col gap-4 text-xs text-text-secondary">
                  <li className="flex gap-3 items-start bg-primary/10 p-3.5 rounded-xl border border-primary/15">
                    <span className="text-lg leading-none">⚡</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">한눈에 다 보여주는 레이아웃</strong>
                      섬 하나만 선택하면 배편 가격, 이동 시간, 야영 조건, 식당 현황이 깔끔하게 정렬된 한 페이지로 표출
                    </div>
                  </li>
                  <li className="flex gap-3 items-start bg-primary/10 p-3.5 rounded-xl border border-primary/15">
                    <span className="text-lg leading-none">🛡️</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">실시간 소셜 크로스 검증</strong>
                      단순 고정 데이터가 아닌, 최근 3년 블로그 인덱스를 파싱하여 진짜 야영이 가능한지 지수화 제공
                    </div>
                  </li>
                  <li className="flex gap-3 items-start bg-primary/10 p-3.5 rounded-xl border border-primary/15">
                    <span className="text-lg leading-none">📋</span>
                    <div>
                      <strong className="text-text-primary font-semibold block mb-0.5">옹진군 지자체 인허가 대장 필터링</strong>
                      포털 지도에 없는 소규모 현지 한식당과 민박집의 행정등록 내역 및 전화번호를 실제 검증하여 매칭
                    </div>
                  </li>
                </ul>
              </div>
              <p className="text-[0.7rem] text-primary bg-primary/10 p-3 rounded-lg border border-primary/25 text-center font-bold">
                ✨ 복잡한 준비를 마우스 클릭 몇 번으로 해결!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Real-time Popular Islands Top 3 */}
      <section className="py-24 border-t border-white/5 bg-[#050917]/30">
        <div className="container m-auto px-6">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">실시간 통계</span>
            <h2 className="text-[2rem] font-bold mb-4 tracking-tight">🔥 인기 있는 섬 Top 3</h2>
            <p className="text-[0.9rem] text-text-secondary">
              한눈섬길을 이용하는 여행자들이 가장 많이 조회하고 클릭한 섬 순위입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {popularIslands.map((island, index) => {
              const image = islandImages[island.island] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80";
              const meta = islandMeta[island.island] || { backpacking: false, trekking: false, desc: "비경의 서해 섬" };
              const decoration = getRankDecoration(index);
              
              return (
                <div 
                  key={island.island} 
                  className="flex flex-col rounded-[24px] overflow-hidden border border-card-border bg-card-bg hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative w-full h-[180px] overflow-hidden shrink-0">
                    <Image 
                      src={image} 
                      alt={island.island} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                    />
                    {/* Rank Badge */}
                    <span className={`absolute top-4 left-4 bg-gradient-to-r ${decoration.color} py-1.5 px-3.5 rounded-full text-[0.7rem] font-black border tracking-wide uppercase shadow-md`}>
                      {decoration.badge}
                    </span>
                    {/* Live Clicks Badge */}
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-[4px] py-1 px-2.5 rounded-full text-[0.6rem] font-bold text-orange-400 border border-orange-500/20 shadow-sm">
                      조회수 {island.clicksCount}회
                    </span>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <div className="text-[0.65rem] text-text-muted font-bold tracking-wider mb-1 uppercase">
                        {island.address.split(" ").slice(0, 3).join(" ")}
                      </div>
                      <h3 className="text-[1.15rem] font-extrabold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
                        {island.island}
                      </h3>
                      <p className="text-[0.75rem] text-text-secondary leading-relaxed line-clamp-2">
                        {meta.desc}
                      </p>

                      {/* Info Row */}
                      <div className="grid grid-cols-2 gap-2.5 pt-4 mt-4 border-t border-white/5 text-[0.68rem] text-text-secondary">
                        <div className="flex items-center gap-1">
                          <span>⏱️ 소요시간:</span>
                          <span className="text-text-primary font-bold">{island.ferries[0]?.time || "확인중"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💵 편도운임:</span>
                          <span className="text-text-primary font-bold">{island.ferries[0]?.fare || "확인중"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🎒 백패킹:</span>
                          <span className={`font-bold ${meta.backpacking ? "text-primary" : "text-text-muted"}`}>
                            {meta.backpacking ? "가능" : "불가"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🥾 트레킹:</span>
                          <span className="text-primary font-bold">{meta.trekking ? "가능" : "불가"}</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/explore?search=${encodeURIComponent(island.island)}`}
                      className="text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[0.7rem] font-bold text-text-primary py-2.5 rounded-xl transition duration-300"
                    >
                      상세 노선 및 실시간 정보 확인 ➔
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Consolidation Mock Dashboard - WOW FACTOR */}
      <section className="py-24 border-t border-white/5 bg-[#030712]">
        <div className="container m-auto px-6">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">시뮬레이션 체험</span>
            <h2 className="text-[2rem] font-bold mb-4 tracking-tight">한눈섬길 통합 정보 미리보기</h2>
            <p className="text-[0.9rem] text-text-secondary">
              아래 대표 섬들을 클릭하고 탭을 변경하며 한눈섬길이 어떻게 정보를 하나로 모아 제공하는지 체험해보세요.
            </p>
          </div>

          <div className="max-w-5xl mx-auto glass-panel overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {/* Widget Top Bar - Island Selectors */}
            <div className="flex border-b border-white/5 bg-[#0a0f1d] px-6 py-4 flex-wrap justify-between items-center gap-4">
              <div className="flex gap-2.5">
                {Object.keys(mockIslandsPreview).map((islandName) => (
                  <button
                    key={islandName}
                    onClick={() => {
                      setSelectedIsland(islandName);
                      setActiveTab("ferry");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      selectedIsland === islandName
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_2px_10px_rgba(14,165,233,0.2)]"
                        : "bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    🏝️ {islandName}
                  </button>
                ))}
              </div>
              <span className="text-[0.7rem] text-text-muted hidden sm:inline-block font-mono">
                HN-SUMGIL LIVE MOCKUP DB
              </span>
            </div>

            {/* Widget Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              {/* Left Column: Island Thumbnail & Tagline */}
              <div className="md:col-span-4 bg-[#070b16] p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between gap-8">
                <div className="flex flex-col gap-4">
                  <div className="relative w-full h-[160px] rounded-xl overflow-hidden border border-white/10">
                    <Image
                      src={currentData.image}
                      alt={currentData.island}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[0.65rem] font-bold text-primary tracking-wide block mb-1">
                      {currentData.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-text-primary">{currentData.island}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mt-2">
                      {currentData.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/explore`}
                  className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-[0.7rem] font-bold py-2.5 rounded-xl transition duration-300"
                >
                  실시간 여객 예약 및 전체 보기
                </Link>
              </div>

              {/* Right Column: Tab View Area */}
              <div className="md:col-span-8 flex flex-col bg-card-bg/40">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-white/5 bg-[#090d18]/40">
                  <button
                    onClick={() => setActiveTab("ferry")}
                    className={`flex-1 min-w-[95px] text-center py-3.5 px-2 text-[0.75rem] font-bold border-b-2 transition duration-300 ${
                      activeTab === "ferry"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-white/2"
                    }`}
                  >
                    ⛴️ 여객선 정보
                  </button>
                  <button
                    onClick={() => setActiveTab("backpacking")}
                    className={`flex-1 min-w-[95px] text-center py-3.5 px-2 text-[0.75rem] font-bold border-b-2 transition duration-300 ${
                      activeTab === "backpacking"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-white/2"
                    }`}
                  >
                    🎒 백패킹 검증
                  </button>
                  <button
                    onClick={() => setActiveTab("foodAndLodge")}
                    className={`flex-1 min-w-[95px] text-center py-3.5 px-2 text-[0.75rem] font-bold border-b-2 transition duration-300 ${
                      activeTab === "foodAndLodge"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-white/2"
                    }`}
                  >
                    🍽️ 식당 & 숙소
                  </button>
                  <button
                    onClick={() => setActiveTab("trekking")}
                    className={`flex-1 min-w-[95px] text-center py-3.5 px-2 text-[0.75rem] font-bold border-b-2 transition duration-300 ${
                      activeTab === "trekking"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-white/2"
                    }`}
                  >
                    🥾 트레킹 & 가이드
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  {/* Ferry Tab */}
                  {activeTab === "ferry" && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        연결 여객 항로 및 운임
                      </h4>
                      <div className="flex flex-col gap-2.5">
                        <div className="bg-white/2 p-3.5 rounded-xl border border-white/5 flex flex-col gap-2">
                          <span className="text-[0.65rem] text-text-muted font-semibold">운항 경로</span>
                          <div className="flex items-center gap-2 text-xs text-text-primary font-medium flex-wrap">
                            {currentData.ferry.route.map((p, idx) => (
                              <React.Fragment key={p}>
                                <span>{p}</span>
                                {idx < currentData.ferry.route.length - 1 && (
                                  <span className="text-text-muted">➔</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/2 p-3.5 rounded-xl border border-white/5">
                            <span className="text-[0.65rem] text-text-muted block mb-1">소요 시간</span>
                            <span className="text-xs text-text-primary font-bold">{currentData.ferry.time}</span>
                          </div>
                          <div className="bg-white/2 p-3.5 rounded-xl border border-white/5">
                            <span className="text-[0.65rem] text-text-muted block mb-1">성인 일반 운임 (편도)</span>
                            <span className="text-xs text-primary font-bold">{currentData.ferry.fare}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5 text-[0.7rem] text-text-secondary leading-relaxed flex gap-2 items-start">
                        <span>💡</span>
                        <div>
                          <strong className="text-text-primary block font-bold mb-0.5">운항 팁</strong>
                          {currentData.ferry.tip}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backpacking Tab */}
                  {activeTab === "backpacking" && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          백패킹 가능성 검증 지표
                        </h4>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold">
                          {currentData.backpacking.safetyLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/2 p-3.5 rounded-xl border border-white/5 flex flex-col">
                          <span className="text-[0.65rem] text-text-muted mb-1">최근 3년 매칭 블로그</span>
                          <span className="text-base text-text-primary font-extrabold">{currentData.backpacking.matchedBlogs}건 검출</span>
                        </div>
                        <div className="bg-white/2 p-3.5 rounded-xl border border-white/5 flex flex-col">
                          <span className="text-[0.65rem] text-text-muted mb-1">야영 가부 상태</span>
                          <span className="text-base text-emerald-400 font-extrabold">가능 (규제 통과)</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[0.65rem] text-text-muted font-bold block">검증에 참여한 소셜 지표 (최근 블로그)</span>
                        <div className="flex flex-col gap-1.5">
                          {currentData.backpacking.blogs.map((b, idx) => (
                            <div key={idx} className="bg-white/2 hover:bg-white/5 p-2 px-3 rounded-lg border border-white/5 flex justify-between text-[0.7rem] text-text-secondary transition-colors duration-200">
                              <span className="truncate max-w-[70%] font-medium text-text-primary">{b.title}</span>
                              <span className="text-[0.65rem] text-text-muted font-mono">{b.blogger} · {b.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3.5 text-[0.7rem] text-text-secondary leading-relaxed flex gap-2 items-start">
                        <span>⛺</span>
                        <div>
                          <strong className="text-emerald-400 block font-bold mb-0.5">야영 안전 수칙</strong>
                          {currentData.backpacking.tip}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Food & Lodge Tab */}
                  {activeTab === "foodAndLodge" && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        관내 등록 일반음식점 및 민박/숙박 현황
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Restaurants */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[0.65rem] text-secondary font-bold flex items-center gap-1">
                            🍽️ 맛집/음식점 ({currentData.foodAndLodge.restaurants.length}곳 매칭)
                          </span>
                          <div className="flex flex-col gap-2">
                            {currentData.foodAndLodge.restaurants.map((r, idx) => (
                              <div key={idx} className="bg-white/2 p-2.5 rounded-xl border border-white/5 text-[0.7rem] flex flex-col gap-0.5">
                                <span className="font-bold text-text-primary">{r.name}</span>
                                <span className="text-text-secondary text-[0.65rem]">{r.menu}</span>
                                <span className="text-text-muted text-[0.65rem] font-mono">📞 {r.contact}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lodges */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[0.65rem] text-secondary font-bold flex items-center gap-1">
                            🛌 펜션/민박 ({currentData.foodAndLodge.lodges.length}곳 매칭)
                          </span>
                          <div className="flex flex-col gap-2">
                            {currentData.foodAndLodge.lodges.map((l, idx) => (
                              <div key={idx} className="bg-white/2 p-2.5 rounded-xl border border-white/5 text-[0.7rem] flex flex-col gap-0.5">
                                <span className="font-bold text-text-primary">{l.name}</span>
                                <span className="text-text-secondary text-[0.65rem]">{l.type}</span>
                                <span className="text-text-muted text-[0.65rem] font-mono">📞 {l.contact}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trekking Tab */}
                  {activeTab === "trekking" && (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        섬 걷기길 및 랜드마크 경유지
                      </h4>

                      <div className="bg-white/2 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        <div className="flex justify-between items-center flex-wrap gap-2 pb-2.5 border-b border-white/5">
                          <span className="text-xs text-text-primary font-bold">🗺️ {currentData.trekking.course}</span>
                          <span className="text-[0.65rem] text-accent font-semibold">
                            거리: {currentData.trekking.dist} · 소요시간: {currentData.trekking.time}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="text-[0.65rem] text-text-muted font-bold">주요 거점 랜드마크</span>
                          <div className="flex items-center gap-2 text-[0.7rem] text-text-secondary flex-wrap">
                            {currentData.trekking.points.map((p, idx) => (
                              <React.Fragment key={idx}>
                                <span className="bg-white/3 px-2.5 py-1 rounded-md border border-white/5">{p}</span>
                                {idx < currentData.trekking.points.length - 1 && (
                                  <span className="text-text-muted">➔</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-accent/5 border border-accent/15 rounded-xl p-3.5 text-[0.7rem] text-text-secondary leading-relaxed flex gap-2 items-start">
                        <span>📺</span>
                        <div>
                          <strong className="text-accent block font-bold mb-0.5">유튜브 연동 비디오 가이드</strong>
                          실제 섬 여행자들이 기록한 인기 브이로그 및 등대 코스 걷기 안내 영상이 상세 보기 페이지에서 즉시 제공됩니다.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Link below tab contents */}
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-text-muted">
                    <span>* 위 데이터는 정기적인 배치 분석 및 공공 포털 실시간 크롤링에 기반합니다.</span>
                    <Link
                      href={`/explore`}
                      className="font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      전체 16개 섬의 실시간 데이터 검증 하러가기 ➔
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of All Sources/Modules - Explaining the technical integration */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#030712] to-[#040816]">
        <div className="container m-auto px-6">
          <div className="text-center max-w-[650px] mx-auto mb-20">
            <h2 className="text-[2rem] font-bold mb-4 tracking-tight">수집 및 교차 검증 정보원</h2>
            <p className="text-[0.9rem] text-text-secondary leading-relaxed">
              한눈섬길은 흩어진 데이터의 유실을 막고 신뢰할 수 있는 여행 플랜을 완성하기 위해<br />
              다음 공공 API 및 웹 크롤링 소스들을 실시간으로 분석하여 매핑합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">⛴️</span>
              <span className="text-xs font-bold text-text-primary">여객 크롤러 모듈</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">인천항만공사 및 대부 해운 사이트 연동을 통한 여객 실시간 운임비 파싱</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🎒</span>
              <span className="text-xs font-bold text-text-primary">소셜 백패킹 인덱서</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">네이버 검색 API 연계 및 최근 3개년 백패킹 비박 관련 블로그 통계 자동 지수화</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🏕️</span>
              <span className="text-xs font-bold text-text-primary">고캠핑 야영지 API</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">한국관광공사 Open API에 정식 인허가된 캠핑장 시설 위치 및 인프라 매핑</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🍔</span>
              <span className="text-xs font-bold text-text-primary">행정음식점 DB</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">지자체(인천 옹진군) 관내 등록된 최신 일반음식점 통계 인허가 데이터 연동</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🛌</span>
              <span className="text-xs font-bold text-text-primary">행정숙박업소 DB</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">현지 펜션 및 등록 농어촌민박 현황 데이터를 행정 대장에서 추출 매칭</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🌲</span>
              <span className="text-xs font-bold text-text-primary">국문 관광명소 API</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">한국관광공사 국문 관광정보 서비스(KTO)와 연계한 역사/레포츠 관광지</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">📺</span>
              <span className="text-xs font-bold text-text-primary">유튜브 리뷰 엔진</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">유튜브 V3 API를 매칭하여 섬 이름 기반의 실시간 최신 숏츠 및 인기 영상 수집</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 flex flex-col gap-3 hover:border-primary/20 transition-all duration-300 hover:bg-white/3">
              <span className="text-3xl">🗺️</span>
              <span className="text-xs font-bold text-text-primary">지도 마커 경로</span>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">관광공사 및 국토지리정보 연동을 통한 섬 좌표의 위치 시각화 및 마커 맵 매핑</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final push for exploration */}
      <section className="py-28 px-6 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-[#040816]/50">
        <div className="max-w-[700px] mx-auto flex flex-col items-center">
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold mb-6 tracking-tight">
            지금 바로 당신만의 인천 섬 여행을 설계해 보세요.
          </h2>
          <p className="text-sm text-text-secondary mb-10 leading-relaxed max-w-[500px]">
            더 이상 선사 사이트와 블로그를 오가며 시간 낭비하지 마세요.<br />
            배편, 백패킹 가능 여부, 맛집까지 단 1초 만에 확인해 드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-3.5 px-8 rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(14,165,233,0.25)] hover:-translate-y-0.5 transition-all duration-300"
            >
              🧭 실시간 섬 탐색 시작하기
            </Link>
            <Link
              href="/explore?filter=backpacking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary border border-white/10 py-3.5 px-8 rounded-full font-bold text-sm transition-all duration-300"
            >
              🎒 백패킹 가능 섬 필터링
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
