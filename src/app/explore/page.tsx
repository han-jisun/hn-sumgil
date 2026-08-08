"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
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
    <div id="explore-page-container" className="max-w-[1440px] m-auto px-6 sm:px-10 text-[#282828]">
      {/* Exploration Header & Search */}
      <section id="explore-header-section" className="pt-12 pb-10 text-center max-w-[800px] m-auto">
        <span className="text-xs font-medium tracking-wider text-[#626E71] uppercase mb-2 block">
          INCHEON ISLAND EXPLORE
        </span>
        <h1 id="explore-header-title" className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-[#282828]">
          나에게 딱 맞는 인천 섬 찾기
        </h1>
        <p className="text-base text-[#6A6A6A] leading-relaxed mb-8">
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
            className="w-full py-4 pl-12 pr-6 text-sm bg-white border border-[#D4D4D4] text-[#282828] rounded-full shadow-sm font-sans transition-all focus:outline-none focus:border-[#0F3E17] focus:ring-2 focus:ring-[#0F3E17]/20"
          />
          <svg className="absolute left-4 text-[#848484] pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </section>

      {/* Filters & Ordering Controls */}
      <div id="explore-controls-container" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-[#EDEDED] w-full">
        {/* Filter Type Tabs */}
        <nav id="explore-filter-nav" aria-label="Island filter" className="w-full md:w-auto overflow-hidden">
          <ul className="flex gap-2.5 list-none overflow-x-auto py-1 w-full scrollbar-none whitespace-nowrap flex-nowrap">
            <li>
              <button
                id="explore-filter-all"
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`py-2 px-4 rounded-full text-sm font-medium border transition-colors ${
                  filterType === "all" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                🏝️ 전체 섬 ({islands.length})
              </button>
            </li>
            <li>
              <button
                id="explore-filter-backpacking"
                type="button"
                onClick={() => handleFilterChange("backpacking")}
                className={`py-2 px-4 rounded-full text-sm font-medium border transition-colors ${
                  filterType === "backpacking" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                🎒 백패킹 가능 ({islands.filter(i => islandMeta[i.island]?.backpacking).length})
              </button>
            </li>
            <li>
              <button
                id="explore-filter-trekking"
                type="button"
                onClick={() => handleFilterChange("trekking")}
                className={`py-2 px-4 rounded-full text-sm font-medium border transition-colors ${
                  filterType === "trekking" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                🥾 트레킹 가능 ({islands.filter(i => islandMeta[i.island]?.trekking).length})
              </button>
            </li>
            <li>
              <button
                id="explore-filter-camping"
                type="button"
                onClick={() => handleFilterChange("camping")}
                className={`py-2 px-4 rounded-full text-sm font-medium border transition-colors ${
                  filterType === "camping" 
                    ? "bg-[#0F3E17] text-white border-[#0F3E17]" 
                    : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                }`}
              >
                ⛺ 야영장 있음 ({islands.filter(i => (campsites[i.island] || []).length > 0).length})
              </button>
            </li>
          </ul>
        </nav>

        {/* Sort Controls */}
        <div id="explore-sort-container" className="flex items-center gap-2 text-xs w-full md:w-auto overflow-hidden">
          <span className="text-[#848484] shrink-0 font-medium">정렬:</span>
          <div id="explore-sort-controls" className="flex border border-[#D4D4D4] rounded-lg overflow-hidden whitespace-nowrap bg-white">
            <button
              id="explore-sort-default"
              type="button"
              onClick={() => handleSortChange("default")}
              className={`px-3 py-1.5 font-medium border-r border-[#D4D4D4] transition-colors ${
                sortBy === "default" ? "bg-[#E6FDE5] text-[#0F3E17]" : "text-[#525252] hover:bg-[#F6F6F6]"
              }`}
            >
              기본순
            </button>
            <button
              id="explore-sort-time"
              type="button"
              onClick={() => handleSortChange("time")}
              className={`px-3 py-1.5 font-medium border-r border-[#D4D4D4] transition-colors ${
                sortBy === "time" ? "bg-[#E6FDE5] text-[#0F3E17]" : "text-[#525252] hover:bg-[#F6F6F6]"
              }`}
            >
              ⏱️ 시간 짧은순
            </button>
            <button
              id="explore-sort-fare"
              type="button"
              onClick={() => handleSortChange("fare")}
              className={`px-3 py-1.5 font-medium border-r border-[#D4D4D4] transition-colors ${
                sortBy === "fare" ? "bg-[#E6FDE5] text-[#0F3E17]" : "text-[#525252] hover:bg-[#F6F6F6]"
              }`}
            >
              💵 왕복운임 저렴한순
            </button>
            <button
              id="explore-sort-lodge"
              type="button"
              onClick={() => handleSortChange("lodge")}
              className={`px-3 py-1.5 font-medium border-r border-[#D4D4D4] transition-colors ${
                sortBy === "lodge" ? "bg-[#E6FDE5] text-[#0F3E17]" : "text-[#525252] hover:bg-[#F6F6F6]"
              }`}
            >
              🏡 숙박 수
            </button>
            <button
              id="explore-sort-restaurant"
              type="button"
              onClick={() => handleSortChange("restaurant")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                sortBy === "restaurant" ? "bg-[#E6FDE5] text-[#0F3E17]" : "text-[#525252] hover:bg-[#F6F6F6]"
              }`}
            >
              🍽️ 식당 수
            </button>
          </div>
        </div>
      </div>

      {/* Islands Grid Listing */}
      <section id="explore-islands-section" className="pb-24">
        {sortedIslands.length > 0 ? (
          <div id="explore-islands-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedIslands.map((item) => {
              const meta = islandMeta[item.island] || { backpacking: false, trekking: false, desc: "아름다운 섬 정보" };
              const image = islandImages[item.island] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80";
              const safeId = islandIdMap[item.island] || encodeURIComponent(item.island);
              
              return (
                <div 
                  key={item.island} 
                  id={`explore-island-card-${safeId}`}
                  onClick={() => handleIslandClick(item.island)}
                  className="flex flex-col rounded-lg overflow-hidden border border-[#D4D4D4] bg-white hover:border-[#0F3E17] hover:shadow-lg transition-all duration-300 cursor-pointer group"
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
                    <span className="absolute top-3 left-3 bg-[#0F3E17] text-white py-1 px-3 rounded-full text-xs font-medium shadow">
                      🏝️ {item.island}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#848484] font-medium mb-1">
                        {item.address.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <h3 className="text-xl font-bold text-[#282828] mb-2 tracking-tight group-hover:text-[#0F3E17] transition-colors">
                        {item.island}
                      </h3>
                      <p className="text-sm text-[#6A6A6A] leading-relaxed line-clamp-2 mb-4">
                        {meta.desc}
                      </p>

                      {/* Brief Stats Row */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-[#EDEDED] text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-[#848484]">⏱️ 시간</span>
                          <span className="text-[#282828] font-semibold">{item.ferries[0]?.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#848484]">💵 왕복</span>
                          <span className="text-[#282828] font-semibold">{item.ferries[0]?.fare}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#848484]">🍽️ 식당</span>
                          <span className="text-[#282828] font-semibold">
                            {loadingRestaurants ? "로딩중..." : `${getRestaurantCount(item.island)}개`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#848484]">🏡 숙박</span>
                          <span className="text-[#282828] font-semibold">
                            {loadingLodges ? "로딩중..." : `${getLodgeCount(item.island)}개`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 mt-2 pt-2 border-t border-[#EDEDED] flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            meta.backpacking 
                              ? "bg-[#E6FDE5] text-[#0F3E17]" 
                              : "bg-[#FFF1F0] text-[#E5484D]"
                          }`}>
                            🎒 백패킹 {meta.backpacking ? "가능" : "불가"}
                          </span>
                          <span className="bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded text-[11px] font-medium">
                            🥾 트레킹 {meta.trekking ? "가능" : "불가"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="text-xs text-[#0F3E17] text-right font-medium group-hover:underline pt-1">
                      상세 정보 보러가기 ➔
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div id="explore-no-results-box" className="text-center py-20 px-5 rounded-lg border border-dashed border-[#D4D4D4] bg-white text-[#6A6A6A]">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-base font-bold text-[#282828] mb-1">검색 결과가 없습니다</h3>
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
