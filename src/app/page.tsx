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
      <section className="relative flex flex-col justify-center items-center text-center min-h-[75vh] py-16 md:py-28 px-4 sm:px-6 overflow-hidden">
        <span className="bg-primary/10 text-primary border border-primary/20 py-1.5 px-4 rounded-full text-[0.65rem] sm:text-xs font-bold mb-5 tracking-wide uppercase shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          인천 섬 정보의 모든 조각을 하나로
        </span>
        <h1 className="text-[clamp(1.7rem,5.5vw,4.5rem)] font-extrabold leading-[1.2] mb-6 tracking-[-1.5px] whitespace-pre-line sm:whitespace-normal">
          따로따로 찾지 말고,<br />
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent glow-text-primary">
            한눈에 쉽고 빠르게, 한눈섬길
          </span>
        </h1>
        <p className="text-[0.78rem] sm:text-[0.9rem] md:text-[1.05rem] text-text-secondary max-w-[720px] leading-relaxed mb-10 px-2">
          여객선 요금은 항만공사에서, 백패킹 가능 규제는 최근 블로그 리뷰에서, 정말 밥 먹을 식당이 영업 중인지는 지자체 인허가 대장에서... <span className="text-text-primary font-semibold block sm:inline">따로 헤매지 마세요!</span> 한눈섬길이 이 모든 핵심 정보를 한 대시보드에 모아 검증해 드립니다.
        </p>

        <div className="flex gap-4 flex-wrap justify-center w-full max-w-xs sm:max-w-none px-4">
          <Link 
            href="/explore" 
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-3.5 px-8 rounded-full font-bold text-sm sm:text-base shadow-[0_4px_24px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)] transition-all duration-300"
          >
            🏝️ 인천 16개 섬 탐색하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>


      {/* Real-time Popular Islands Top 3 */}
      <section className="py-12 border-t border-white/5 bg-[#050917]/30">
        <div className="container m-auto px-5">
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
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-[4px] py-1 px-2.5 rounded-full text-[0.6rem] font-bold text-point border border-point/20 shadow-sm">
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
                          <span>💵 왕복운임:</span>
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
    </div>
  );
}
