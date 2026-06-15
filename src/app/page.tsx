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

export default function HomePage() {
  const [clicks, setClicks] = useState<Record<string, number>>({});

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

      {/* Real-time Popular Islands Top 3 */}
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
