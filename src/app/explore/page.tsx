"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import islandsData from "@/app/data/islands.json";

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
  "승봉도": { backpacking: true, trekking: true, desc: "울창한 산림과 이일레 해수욕장, 촛대바위 등 기암괴석의 향연" },
  "울도": { backpacking: true, trekking: true, desc: "덕적 군도 최서단의 신비로운 비경과 낚시꾼들이 사랑하는 해안" },
  "자월도": { backpacking: true, trekking: true, desc: "붉은 달빛의 장골 해변과 조용히 은빛 물결이 부서지는 휴식처" },
  "지도": { backpacking: true, trekking: true, desc: "개발되지 않아 때 묻지 않은 순수한 서해안의 보물 같은 작은 섬" },
  "소야도": { backpacking: true, trekking: true, desc: "덕적도와 다리로 이어진 조용하고 한적한 떼뿌리 캠핑 천국" }
};

// Convert "2시간 30분", "1시간" etc. to total minutes
const parseTimeToMinutes = (timeStr: string): number => {
  let minutes = 0;
  const hourMatch = timeStr.match(/(\d+)시간/);
  const minMatch = timeStr.match(/(\d+)분/);
  
  if (hourMatch) {
    minutes += parseInt(hourMatch[1]) * 60;
  }
  if (minMatch) {
    minutes += parseInt(minMatch[1]);
  } else if (!hourMatch && timeStr.includes("분")) {
    minutes += parseInt(timeStr);
  }
  return minutes;
};

// Convert "59,500원" to integer
const parseFareToNumber = (fareStr: string): number => {
  const clean = fareStr.replace(/[^0-9]/g, "");
  return parseInt(clean) || 0;
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "backpacking" | "trekking">("all");
  const [sortBy, setSortBy] = useState<"default" | "time" | "fare" | "clicks">("default");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [clicks, setClicks] = useState<Record<string, number>>({});

  const islands: IslandData[] = islandsData as IslandData[];

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
        console.error("Failed to load click counts:", err);
      }
    };
    fetchClicks();
  }, []);

  // Read URL parameters on load
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    const sortParam = searchParams.get("sort");
    
    if (filterParam === "backpacking" || filterParam === "trekking") {
      setFilterType(filterParam);
    } else {
      setFilterType("all");
    }

    if (sortParam === "time" || sortParam === "fare" || sortParam === "clicks") {
      setSortBy(sortParam as any);
    } else {
      setSortBy("default");
    }
  }, [searchParams]);

  // Update URL parameters
  const updateParams = (newFilter: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", newFilter);
    }

    if (newSort === "default") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    router.push(`/explore?${params.toString()}`);
  };

  const handleFilterChange = (filter: "all" | "backpacking" | "trekking") => {
    setFilterType(filter);
    updateParams(filter, sortBy);
  };

  const handleSortChange = (sort: "default" | "time" | "fare" | "clicks") => {
    setSortBy(sort);
    updateParams(filterType, sort);
  };

  const incrementClick = async (islandName: string) => {
    // Optimistically update client state immediately for responsiveness
    setClicks((prev) => ({
      ...prev,
      [islandName]: (prev[islandName] || 0) + 1,
    }));

    try {
      const res = await fetch("/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ island: islandName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.clicks) {
          setClicks(data.clicks);
        }
      }
    } catch (err) {
      console.error("Failed to increment click count on server:", err);
    }
  };

  const handleIslandClick = (islandName: string) => {
    const isExpanded = expandedIsland === islandName;
    if (!isExpanded) {
      setExpandedIsland(islandName);
      incrementClick(islandName);
    } else {
      setExpandedIsland(null);
    }
  };

  // Filter & Search Islands
  const filteredIslands = islands.filter((item) => {
    const meta = islandMeta[item.island] || { backpacking: false, trekking: false };
    const matchesSearch = item.island.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "backpacking") {
      return matchesSearch && meta.backpacking;
    }
    if (filterType === "trekking") {
      return matchesSearch && meta.trekking;
    }
    return matchesSearch;
  });

  // Sort Islands
  const sortedIslands = [...filteredIslands].sort((a, b) => {
    if (sortBy === "time") {
      const timeA = parseTimeToMinutes(a.ferries[0]?.time || "99시간");
      const timeB = parseTimeToMinutes(b.ferries[0]?.time || "99시간");
      return timeA - timeB;
    }
    if (sortBy === "fare") {
      const fareA = parseFareToNumber(a.ferries[0]?.fare || "999,999원");
      const fareB = parseFareToNumber(b.ferries[0]?.fare || "999,999원");
      return fareA - fareB;
    }
    if (sortBy === "clicks") {
      // Keep click sort in memory if queried via code, but disabled in main UI controls
      const clicksA = clicks[a.island] || 0;
      const clicksB = clicks[b.island] || 0;
      return clicksB - clicksA;
    }
    return 0; // Default order
  });

  return (
    <div className="container m-auto px-6">
      {/* Exploration Header & Search */}
      <section className="pt-[60px] pb-[40px] text-center">
        <h1 className="text-[2.2rem] font-bold mb-3 tracking-tight">아름다운 섬 탐색하기</h1>
        <p className="text-base text-text-secondary max-w-[550px] mx-auto mb-8 leading-normal">
          인천 옹진군의 매력적인 16개 섬의 정보를 한눈에 비교해보세요. <br />
          이동 시간, 여객운임비, 아웃도어 가능 여부별 필터 및 정렬을 지원합니다.
        </p>

        {/* Search Bar */}
        <div className="max-w-[600px] mx-auto relative flex items-center w-full">
          <input 
            type="text" 
            placeholder="섬 이름 또는 면/리 주소로 검색해보세요... (예: 굴업도, 대청면)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="peer w-full py-4 pl-[52px] pr-5 text-sm bg-card-bg border border-card-border text-text-primary rounded-full font-sans transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(14,165,233,0.15)] focus:bg-[#121826]/80"
          />
          <svg className="absolute left-5 text-text-muted pointer-events-none transition-colors duration-300 peer-focus:text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </section>

      {/* Filters & Ordering Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 pb-4 border-b border-white/5">
        {/* Filter Type Tabs */}
        <nav aria-label="Island filter">
          <ul className="flex gap-2 list-none overflow-x-auto py-1">
            <li>
              <button
                onClick={() => handleFilterChange("all")}
                className={`py-2 px-5 border rounded-full text-[0.8rem] font-semibold transition-all duration-300 ${
                  filterType === "all" 
                    ? "bg-primary/10 text-primary border-primary/30" 
                    : "bg-white/3 border-card-border text-text-secondary hover:bg-white/8 hover:text-text-primary"
                }`}
              >
                🏝️ 전체 섬 ({islands.length})
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilterChange("backpacking")}
                className={`py-2 px-5 border rounded-full text-[0.8rem] font-semibold transition-all duration-300 ${
                  filterType === "backpacking" 
                    ? "bg-primary/10 text-primary border-primary/30" 
                    : "bg-white/3 border-card-border text-text-secondary hover:bg-white/8 hover:text-text-primary"
                }`}
              >
                🎒 백패킹 가능 ({islands.filter(i => islandMeta[i.island]?.backpacking).length})
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilterChange("trekking")}
                className={`py-2 px-5 border rounded-full text-[0.8rem] font-semibold transition-all duration-300 ${
                  filterType === "trekking" 
                    ? "bg-primary/10 text-primary border-primary/30" 
                    : "bg-white/3 border-card-border text-text-secondary hover:bg-white/8 hover:text-text-primary"
                }`}
              >
                🥾 트레킹 가능 ({islands.filter(i => islandMeta[i.island]?.trekking).length})
              </button>
            </li>
          </ul>
        </nav>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted">정렬 기준:</span>
          <div className="flex border border-card-border rounded-lg overflow-hidden bg-white/2">
            <button
              onClick={() => handleSortChange("default")}
              className={`px-3 py-1.5 font-medium border-r border-card-border transition-colors duration-200 ${
                sortBy === "default" ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-white/5"
              }`}
            >
              기본순
            </button>
            <button
              onClick={() => handleSortChange("time")}
              className={`px-3 py-1.5 font-medium border-r border-card-border transition-colors duration-200 ${
                sortBy === "time" ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-white/5"
              }`}
            >
              ⏱️ 시간 짧은순
            </button>
            <button
              onClick={() => handleSortChange("fare")}
              className={`px-3 py-1.5 font-medium transition-colors duration-200 ${
                sortBy === "fare" ? "bg-primary/15 text-primary" : "text-text-secondary hover:bg-white/5"
              }`}
            >
              💵 운임비 저렴한순
            </button>
          </div>
        </div>
      </div>

      {/* Islands Grid Listing */}
      <section className="pb-[100px]">
        {sortedIslands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedIslands.map((item) => {
              const meta = islandMeta[item.island] || { backpacking: false, trekking: false, desc: "아름다운 섬 정보" };
              const image = islandImages[item.island] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80";
              const isExpanded = expandedIsland === item.island;
              
              return (
                <div 
                  key={item.island} 
                  onClick={() => handleIslandClick(item.island)}
                  className={`flex flex-col rounded-[20px] overflow-hidden border transition-all duration-300 bg-card-bg cursor-pointer group ${
                    isExpanded 
                      ? "border-primary/40 shadow-[0_12px_36px_rgba(14,165,233,0.15)] md:col-span-2 row-span-1" 
                      : "border-card-border hover:-translate-y-1.5 hover:border-card-hover-border hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  {/* Card Thumbnail */}
                  <div className={`relative w-full overflow-hidden transition-all duration-300 shrink-0 ${
                    isExpanded ? "h-[180px] md:h-[220px]" : "h-[160px]"
                  }`}>
                    <Image 
                      src={image} 
                      alt={item.island} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    {/* Floating Island Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-[#030712]/75 backdrop-blur-[4px] py-1 px-2.5 rounded-full text-[0.65rem] font-bold text-primary border border-primary/20">
                      🏝️ {item.island}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      {/* Subtitle / Description */}
                      <p className="text-[0.7rem] text-text-muted font-semibold tracking-wide uppercase mb-1">
                        {item.address.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <h3 className="text-[1.05rem] font-bold text-text-primary mb-2 tracking-tight group-hover:text-primary transition-colors duration-200">
                        {item.island}
                      </h3>
                      <p className="text-[0.75rem] text-text-secondary leading-relaxed line-clamp-2 mb-3">
                        {meta.desc}
                      </p>

                      {/* Brief Stats Row */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-white/5 text-[0.7rem]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted">⏱️ 시간</span>
                          <span className="text-text-primary font-bold">{item.ferries[0]?.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted">💵 운임</span>
                          <span className="text-text-primary font-bold">{item.ferries[0]?.fare}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted">🎒 백패킹</span>
                          <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold border ${
                            meta.backpacking 
                              ? "bg-primary/10 text-primary border-primary/20" 
                              : "bg-red-500/5 text-red-400 border-red-500/10"
                          }`}>
                            {meta.backpacking ? "가능" : "불가"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-muted">🥾 트레킹</span>
                          <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[0.6rem] font-bold">
                            {meta.trekking ? "가능" : "불가"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed info expand drawer */}
                    {isExpanded && (
                      <div 
                        className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4 animate-fadeIn text-[0.75rem]"
                        onClick={(e) => e.stopPropagation()} // Stop propagation to keep card open
                      >
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-primary">⚓ 여객선 운항 노선 상세</span>
                          <div className="flex flex-col gap-1.5">
                            {item.ferries.map((ferry, idx) => (
                              <div key={idx} className="bg-white/2 border border-white/5 rounded-lg p-2.5 flex justify-between items-center">
                                <span className="text-text-secondary font-medium">{idx + 1}번 항로</span>
                                <div className="flex gap-4">
                                  <span className="text-text-primary">⏱️ {ferry.time}</span>
                                  <span className="text-primary font-bold">💵 {ferry.fare}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-primary">📍 상세 주소</span>
                          <span className="text-text-secondary">{item.address}</span>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <Link 
                            href="/data" 
                            className="bg-primary hover:bg-primary/95 text-white font-bold py-2 px-4 rounded-xl text-[0.65rem] transition shadow-[0_4px_12px_rgba(14,165,233,0.2)]"
                          >
                            실시간 검증 정보 보러가기 ➔
                          </Link>
                          <button 
                            onClick={() => setExpandedIsland(null)}
                            className="bg-white/5 hover:bg-white/10 text-text-primary font-semibold py-2 px-3.5 rounded-xl text-[0.65rem] border border-white/10 transition"
                          >
                            닫기 ▴
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Card Footer toggle helper */}
                    {!isExpanded && (
                      <div className="text-[0.65rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 노선 상세 정보 보기 ▾
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-5 rounded-[20px] border border-dashed border-card-border text-text-secondary">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-sm font-bold mb-1">검색 결과가 없습니다</h3>
            <p className="text-xs text-text-muted">다른 섬 이름 또는 카테고리를 검색해 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="container m-auto flex justify-center items-center min-h-[50vh] text-text-secondary text-sm">
        로딩 중...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
