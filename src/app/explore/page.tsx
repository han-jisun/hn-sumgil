"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import islandsData from "@/app/data/islands.json";
import imageData from "@/app/data/image.json";

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

const parseFareToNumber = (fareStr: string): number => {
  const clean = fareStr.replace(/[^0-9]/g, "");
  return parseInt(clean) || 0;
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "backpacking" | "trekking" | "camping">("all");
  const [sortBy, setSortBy] = useState<"default" | "time" | "fare" | "lodge" | "restaurant" | "clicks">("default");
  const [clicks, setClicks] = useState<Record<string, number>>({});
  
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [lodges, setLodges] = useState<any[]>([]);
  const [loadingLodges, setLoadingLodges] = useState(true);
  const [campsites, setCampsites] = useState<Record<string, any[]>>({});

  const islands: IslandData[] = islandsData as IslandData[];

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

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/restaurant");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            setRestaurants(data.items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchLodges = async () => {
      try {
        const res = await fetch("/api/lodge");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            setLodges(data.items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch lodges:", err);
      } finally {
        setLoadingLodges(false);
      }
    };
    fetchLodges();
  }, []);

  useEffect(() => {
    const fetchCampsites = async () => {
      const results: Record<string, any[]> = {};
      try {
        await Promise.all(
          islands.map(async (item) => {
            try {
              const res = await fetch(`/api/camping?query=${encodeURIComponent(item.island)}`);
              if (res.ok) {
                const data = await res.json();
                results[item.island] = data.success && data.items ? data.items : [];
              } else {
                results[item.island] = [];
              }
            } catch (e) {
              console.error(`Failed to fetch campsite for ${item.island}:`, e);
              results[item.island] = [];
            }
          })
        );
        setCampsites(results);
      } catch (err) {
        console.error("Failed to load campsites:", err);
      }
    };
    fetchCampsites();
  }, [islands]);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    const sortParam = searchParams.get("sort");
    
    if (filterParam === "backpacking" || filterParam === "trekking" || filterParam === "camping") {
      setFilterType(filterParam);
    } else {
      setFilterType("all");
    }

    if (sortParam === "time" || sortParam === "fare" || sortParam === "lodge" || sortParam === "restaurant" || sortParam === "clicks") {
      setSortBy(sortParam as any);
    } else {
      setSortBy("default");
    }
  }, [searchParams]);

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

  const handleFilterChange = (filter: "all" | "backpacking" | "trekking" | "camping") => {
    setFilterType(filter);
    updateParams(filter, sortBy);
  };

  const handleSortChange = (sort: "default" | "time" | "fare" | "lodge" | "restaurant" | "clicks") => {
    setSortBy(sort);
    updateParams(filterType, sort);
  };

  const incrementClick = async (islandName: string) => {
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
    incrementClick(islandName);
    const safeId = islandIdMap[islandName] || encodeURIComponent(islandName);
    router.push(`/explore/${safeId}`);
  };

  const getRestaurantCount = (islandName: string): number => {
    const rule = matchRules[islandName];
    return restaurants.filter((item: any) => 
      rule ? rule(item.addr) : item.addr.includes(islandName)
    ).length;
  };

  const getLodgeCount = (islandName: string): number => {
    const rule = matchRules[islandName];
    return lodges.filter((item: any) => 
      rule ? rule(item.addr) : item.addr.includes(islandName)
    ).length;
  };

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
    if (filterType === "camping") {
      const campList = campsites[item.island] || [];
      return matchesSearch && campList.length > 0;
    }
    return matchesSearch;
  });

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
    if (sortBy === "lodge") {
      const lodgeA = getLodgeCount(a.island);
      const lodgeB = getLodgeCount(b.island);
      return lodgeB - lodgeA;
    }
    if (sortBy === "restaurant") {
      const restA = getRestaurantCount(a.island);
      const restB = getRestaurantCount(b.island);
      return restB - restA;
    }
    if (sortBy === "clicks") {
      const clicksA = clicks[a.island] || 0;
      const clicksB = clicks[b.island] || 0;
      return clicksB - clicksA;
    }
    return 0;
  });

  return (
    <div id="explore-page-container" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 text-[#282828]">
      {/* Exploration Header & Search */}
      <section id="explore-header-section" data-screen-label="SCR_001 탐색 헤더" className="pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-10 text-center max-w-[800px] mx-auto">
        <span className="text-[11px] sm:text-xs font-medium tracking-wider text-[#626E71] uppercase mb-2 sm:mb-3 block">
          SCR_001 · INCHEON ISLAND EXPLORE
        </span>
        <h1 id="explore-header-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-[#282828] mb-3 sm:mb-4 leading-tight">
          나에게 딱 맞는 <span className="text-[#0F3E17]">인천 섬 찾기</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#6A6A6A] leading-relaxed mb-6 sm:mb-8 px-2">
          뱃길 시간부터 백패킹·물때 조건까지 — 16개 섬을 조건별로 명쾌하게 탐색하세요.
        </p>

        {/* Search Bar */}
        <div id="explore-search-bar" className="max-w-[640px] mx-auto relative flex items-center w-full">
          <input 
            id="explore-search-input"
            type="text" 
            placeholder="섬 이름 또는 주소로 검색해보세요... (예: 굴업도, 대청면)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-16 sm:pr-20 text-xs sm:text-sm md:text-[15px] bg-white border border-[#D4D4D4] text-[#282828] rounded-full font-sans transition-colors hover:border-[#848484] focus:outline-none focus:border-[#0F3E17] placeholder:text-[#848484]"
          />
          <svg className="absolute left-3.5 sm:left-4 text-[#848484] pointer-events-none w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 sm:right-4 text-[11px] sm:text-xs bg-[#E8E8E8] text-[#525252] hover:bg-[#D4D4D4] px-2.5 py-1 rounded-full transition-colors"
            >
              지우기
            </button>
          )}
        </div>
      </section>

      {/* Filters Navigation Bar (Centered & Enlarged Volume) */}
      <div id="explore-controls-container" className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#EDEDED] w-full">
        {/* Filter Type Tabs (Mobile Horizontal Touch Scroll & Center Aligned) */}
        <nav id="explore-filter-nav" aria-label="Island filter" className="w-full flex justify-start md:justify-center overflow-x-auto scrollbar-none pb-1 -mb-1">
          <ul className="flex gap-2.5 sm:gap-3.5 list-none py-0.5 whitespace-nowrap flex-nowrap items-center mx-auto">
            <li className="shrink-0">
              <button
                id="explore-filter-all"
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-medium border transition-colors inline-flex items-center gap-2 shrink-0 whitespace-nowrap flex-nowrap ${
                  filterType === "all" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                <span className="whitespace-nowrap leading-none">🏝️ 전체 섬</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 leading-none ${filterType === "all" ? "bg-white/20 text-white" : "bg-[#F6F6F6] text-[#848484]"}`}>
                  {islands.length}
                </span>
              </button>
            </li>
            <li className="shrink-0">
              <button
                id="explore-filter-backpacking"
                type="button"
                onClick={() => handleFilterChange("backpacking")}
                className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-medium border transition-colors inline-flex items-center gap-2 shrink-0 whitespace-nowrap flex-nowrap ${
                  filterType === "backpacking" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                <span className="whitespace-nowrap leading-none">🎒 백패킹 가능</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 leading-none ${filterType === "backpacking" ? "bg-white/20 text-white" : "bg-[#F6F6F6] text-[#848484]"}`}>
                  {islands.filter(i => islandMeta[i.island]?.backpacking).length}
                </span>
              </button>
            </li>
            <li className="shrink-0">
              <button
                id="explore-filter-trekking"
                type="button"
                onClick={() => handleFilterChange("trekking")}
                className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-medium border transition-colors inline-flex items-center gap-2 shrink-0 whitespace-nowrap flex-nowrap ${
                  filterType === "trekking" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                <span className="whitespace-nowrap leading-none">🥾 트레킹 코스</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 leading-none ${filterType === "trekking" ? "bg-white/20 text-white" : "bg-[#F6F6F6] text-[#848484]"}`}>
                  {islands.filter(i => islandMeta[i.island]?.trekking).length}
                </span>
              </button>
            </li>
            <li className="shrink-0">
              <button
                id="explore-filter-camping"
                type="button"
                onClick={() => handleFilterChange("camping")}
                className={`h-11 sm:h-12 px-5 sm:px-6 rounded-full text-sm sm:text-[15px] font-medium border transition-colors inline-flex items-center gap-2 shrink-0 whitespace-nowrap flex-nowrap ${
                  filterType === "camping" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                <span className="whitespace-nowrap leading-none">⛺ 야영장/캠핑</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 leading-none ${filterType === "camping" ? "bg-white/20 text-white" : "bg-[#F6F6F6] text-[#848484]"}`}>
                  {islands.filter(i => (campsites[i.island] || []).length > 0).length}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sort Controls (Always Right-Aligned on Mobile & Desktop) */}
      <div id="explore-sort-container" className="flex justify-end items-center w-full mb-6 sm:mb-8">
        <div className="relative">
          <select
            id="explore-sort-select"
            aria-label="정렬 기준 선택"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as "default" | "time" | "fare" | "lodge" | "restaurant")}
            className="h-10 pl-3.5 pr-8 bg-white border border-[#D4D4D4] rounded-lg text-xs sm:text-sm font-medium text-[#282828] appearance-none cursor-pointer hover:border-[#848484] focus:outline-none focus:border-[#6A6A6A] transition-colors"
          >
            <option value="default">✨ 추천 기본순</option>
            <option value="time">⏱️ 소요시간 빠른순</option>
            <option value="fare">💵 왕복운임 낮은순</option>
            <option value="lodge">🏡 숙박 많은순</option>
            <option value="restaurant">🍽️ 식당 많은순</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#848484]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Islands Grid Listing */}
      <section id="explore-islands-section" className="mb-16 md:mb-28">
        {sortedIslands.length > 0 ? (
          <div id="explore-islands-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {sortedIslands.map((item) => {
              const meta = islandMeta[item.island] || { backpacking: false, trekking: false, desc: "아름다운 섬 정보" };
              const key = islandIdMap[item.island];
              const itemImgData = key ? (imageData as Record<string, { name: string; images: string[] }>)[key] : null;
              const image = (itemImgData && itemImgData.images && itemImgData.images.length > 0) 
                ? itemImgData.images[0] 
                : "/images/default_island.png";
              const safeId = islandIdMap[item.island] || encodeURIComponent(item.island);
              
              return (
                <Link 
                  key={item.island} 
                  id={`explore-island-card-${safeId}`}
                  href={`/explore/${safeId}`}
                  onClick={() => incrementClick(item.island)}
                  className="flex flex-col rounded-xl overflow-hidden border border-[#D4D4D4] bg-white hover:border-[#0F3E17] hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden shrink-0 bg-[#EDEDED]">
                    <Image 
                      src={image} 
                      alt={item.island} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Floating Island Badge */}
                    <span className="absolute top-3 left-3 bg-[#0F3E17] text-white py-1 px-3 rounded-full text-xs font-medium shadow whitespace-nowrap shrink-0">
                      🏝️ {item.island}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#848484] font-medium mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.address.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <h3 className="text-xl font-bold text-[#282828] mb-2 tracking-tight group-hover:text-[#0F3E17] transition-colors leading-snug">
                        {item.island}
                      </h3>
                      <p className="text-sm text-[#6A6A6A] leading-relaxed line-clamp-2 mb-4">
                        {meta.desc}
                      </p>

                      {/* Left-Aligned Stats Row */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-[#EDEDED] text-xs">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">⏱️ 시간</span>
                          <span className="text-[#282828] font-semibold whitespace-nowrap">{item.ferries[0]?.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">💵 왕복</span>
                          <span className="text-[#282828] font-semibold whitespace-nowrap">{item.ferries[0]?.fare}</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">🍽️ 식당</span>
                          <span className="text-[#282828] font-semibold whitespace-nowrap">
                            {loadingRestaurants ? "로딩중..." : `${getRestaurantCount(item.island)}개`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">🏡 숙박</span>
                          <span className="text-[#282828] font-semibold whitespace-nowrap">
                            {loadingLodges ? "로딩중..." : `${getLodgeCount(item.island)}개`}
                          </span>
                        </div>
                        {/* 1-Line Fixed Badges Row (NEVER Wraps to 2 Lines) */}
                        <div className="flex items-center gap-1.5 col-span-2 mt-2 pt-2 border-t border-[#EDEDED] flex-nowrap whitespace-nowrap overflow-hidden">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shrink-0 ${
                            meta.backpacking 
                              ? "bg-[#E6FDE5] text-[#0F3E17]" 
                              : "bg-[#FFF1F0] text-[#E5484D]"
                          }`}>
                            🎒 백패킹 {meta.backpacking ? "가능" : "불가"}
                          </span>
                          <span className="bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shrink-0">
                            🥾 트레킹 {meta.trekking ? "가능" : "불가"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div id="explore-no-results-box" className="text-center py-16 sm:py-20 px-4 rounded-xl border border-dashed border-[#D4D4D4] bg-white text-[#6A6A6A]">
            <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">🔍</span>
            <h3 className="text-sm sm:text-base font-bold text-[#282828] mb-1">검색 결과가 없습니다</h3>
            <p className="text-xs text-[#848484]">다른 섬 이름 또는 카테고리를 검색해 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] m-auto flex justify-center items-center min-h-[50vh] text-[#6A6A6A] text-sm">
        로딩 중...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
