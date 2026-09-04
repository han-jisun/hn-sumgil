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

const islandMeta: Record<string, { backpacking: boolean; trekking: boolean; healing: boolean; desc: string }> = {
  "굴업도": { backpacking: true, trekking: true, healing: false, desc: "한국의 갈라파고스라 불리는 백패킹의 성지 개머리언덕과 해안 절벽" },
  "대연평": { backpacking: false, trekking: true, healing: true, desc: "평화기념관과 조기역사관이 있는 서해 최북단의 평화로운 섬" },
  "대이작도": { backpacking: true, trekking: true, healing: true, desc: "썰물 때만 나타나는 신비의 모래섬 풀등과 울창한 해송 숲길" },
  "대청도": { backpacking: true, trekking: true, healing: false, desc: "옥빛 바다와 한국 유일의 활동성 모래사막이 어우러진 비경" },
  "덕적도": { backpacking: true, trekking: true, healing: true, desc: "해송 숲과 드넓은 백사장이 어우러진 캠핑과 휴양의 대표 섬" },
  "문갑도": { backpacking: true, trekking: true, healing: true, desc: "한적하고 때 묻지 않은 깃대봉 등산로와 독특한 돌담 골목길" },
  "백령도": { backpacking: false, trekking: true, healing: false, desc: "심청이의 설화와 천연기념물 사곶사빈, 비경의 두무진 절벽" },
  "백아도": { backpacking: true, trekking: true, healing: true, desc: "발전소 마을 앞 절경과 남조봉 기차바위가 있는 고요한 비박지" },
  "소연평": { backpacking: false, trekking: true, healing: true, desc: "얼굴바위와 깨끗한 포구가 맞이하는 때 묻지 않은 소박한 섬" },
  "소이작도": { backpacking: true, trekking: true, healing: true, desc: "해안을 따라 이어진 갯티길과 손가락 바위의 신비로운 형상" },
  "소청도": { backpacking: true, trekking: true, healing: true, desc: "분바위와 푸른 하늘 아래 우뚝 솟은 등대가 지키는 고요의 섬" },
  "승봉도": { backpacking: true, trekking: true, healing: true, desc: "울창한 산림과 이일레 해수욕장, 촛대바위 등 기암괴석의 향연" },
  "울도": { backpacking: true, trekking: true, healing: false, desc: "덕적 군도 최서단의 신비로운 비경과 낚시꾼들이 사랑하는 해안" },
  "자월도": { backpacking: true, trekking: true, healing: true, desc: "붉은 달빛의 장골 해변과 조용히 은빛 물결이 부서지는 휴식처" },
  "지도": { backpacking: true, trekking: true, healing: true, desc: "개발되지 않아 때 묻지 않은 순수한 서해안의 보물 같은 작은 섬" },
  "소야도": { backpacking: true, trekking: true, healing: true, desc: "덕적도와 다리로 이어진 조용하고 한적한 떼뿌리 캠핑 천국" }
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

const getMinFareFerry = (ferries: { time: string; fare: string }[]) => {
  if (!ferries || ferries.length === 0) return { time: "정보 없음", fare: "정보 없음", fareNum: 0 };
  let minFerry = ferries[0];
  let minFareNum = parseFareToNumber(ferries[0].fare);

  for (let i = 1; i < ferries.length; i++) {
    const fareNum = parseFareToNumber(ferries[i].fare);
    if (fareNum > 0 && (minFareNum === 0 || fareNum < minFareNum)) {
      minFareNum = fareNum;
      minFerry = ferries[i];
    }
  }

  return { time: minFerry.time, fare: minFerry.fare, fareNum: minFareNum };
};

const islands: IslandData[] = islandsData as IslandData[];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "1to2h" | "2to4h" | "over4h">("all");
  const [purposeFilter, setPurposeFilter] = useState<"all" | "backpacking" | "trekking" | "camping">("all");
  const [fareFilter, setFareFilter] = useState<"all" | "under50k" | "50kto100k" | "over100k">("all");
  const [sortBy, setSortBy] = useState<"popular" | "default" | "time" | "fare" | "lodge" | "restaurant" | "clicks">("popular");
  const [clicks, setClicks] = useState<Record<string, number>>({});

  const [activeDropdown, setActiveDropdown] = useState<"time" | "purpose" | "fare" | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<"time" | "purpose" | "fare" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [lodges, setLodges] = useState<any[]>([]);
  const [loadingLodges, setLoadingLodges] = useState(true);
  const [campsites, setCampsites] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, []);

  useEffect(() => {
    const qParam = searchParams.get("q") || searchParams.get("search");
    const timeParam = searchParams.get("time");
    const purposeParam = searchParams.get("purpose");
    const fareParam = searchParams.get("fare");
    const sortParam = searchParams.get("sort");

    if (qParam !== null) {
      setSearchQuery(qParam);
    }

    if (timeParam === "1to2h" || timeParam === "2to4h" || timeParam === "over4h") {
      setTimeFilter(timeParam);
    } else {
      setTimeFilter("all");
    }

    if (purposeParam === "backpacking" || purposeParam === "trekking" || purposeParam === "camping") {
      setPurposeFilter(purposeParam);
    } else {
      setPurposeFilter("all");
    }

    if (fareParam === "under50k" || fareParam === "50kto100k" || fareParam === "over100k") {
      setFareFilter(fareParam);
    } else {
      setFareFilter("all");
    }

    if (sortParam === "time" || sortParam === "fare" || sortParam === "lodge" || sortParam === "restaurant" || sortParam === "clicks" || sortParam === "popular") {
      setSortBy(sortParam as any);
    } else {
      setSortBy("popular");
    }
  }, [searchParams]);

  const updateParams = (
    newTime: string,
    newPurpose: string,
    newFare: string,
    newSort: string,
    newQuery: string = searchQuery
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newQuery && newQuery.trim()) {
      params.set("q", newQuery.trim());
    } else {
      params.delete("q");
      params.delete("search");
    }

    if (newTime === "all") {
      params.delete("time");
    } else {
      params.set("time", newTime);
    }

    if (newPurpose === "all") {
      params.delete("purpose");
    } else {
      params.set("purpose", newPurpose);
    }

    if (newFare === "all") {
      params.delete("fare");
    } else {
      params.set("fare", newFare);
    }

    if (newSort === "popular" || newSort === "default") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    const queryStr = params.toString();
    const newUrl = queryStr ? `/explore?${queryStr}` : "/explore";
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateParams(timeFilter, purposeFilter, fareFilter, sortBy, val);
  };

  const handleTimeChange = (val: "all" | "1to2h" | "2to4h" | "over4h") => {
    setTimeFilter(val);
    updateParams(val, purposeFilter, fareFilter, sortBy);
  };

  const handlePurposeChange = (val: "all" | "backpacking" | "trekking" | "camping") => {
    setPurposeFilter(val);
    updateParams(timeFilter, val, fareFilter, sortBy);
  };

  const handleFareChange = (val: "all" | "under50k" | "50kto100k" | "over100k") => {
    setFareFilter(val);
    updateParams(timeFilter, purposeFilter, val, sortBy);
  };

  const handleSortChange = (sort: "popular" | "default" | "time" | "fare" | "lodge" | "restaurant" | "clicks") => {
    setSortBy(sort);
    updateParams(timeFilter, purposeFilter, fareFilter, sort);
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
    const meta = islandMeta[item.island] || { backpacking: false, trekking: false, healing: false };
    const matchesSearch = item.island.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 1. Time Filter
    if (timeFilter !== "all") {
      const mins = parseTimeToMinutes(item.ferries[0]?.time || "999시간");
      if (timeFilter === "1to2h" && (mins < 60 || mins >= 120)) return false;
      if (timeFilter === "2to4h" && (mins < 120 || mins >= 240)) return false;
      if (timeFilter === "over4h" && mins < 240) return false;
    }

    // 2. Purpose Filter
    if (purposeFilter !== "all") {
      if (purposeFilter === "backpacking" && !meta.backpacking) return false;
      if (purposeFilter === "trekking" && !meta.trekking) return false;
      if (purposeFilter === "camping") {
        const campList = campsites[item.island] || [];
        const hasCampingMeta = Boolean(meta.backpacking || meta.desc.includes("캠핑") || meta.desc.includes("야영"));
        if (campList.length === 0 && !hasCampingMeta) return false;
      }
    }

    // 3. Fare Filter
    if (fareFilter !== "all") {
      const fare = getMinFareFerry(item.ferries).fareNum;
      if (fareFilter === "under50k" && fare > 50000) return false;
      if (fareFilter === "50kto100k" && (fare <= 50000 || fare > 100000)) return false;
      if (fareFilter === "over100k" && fare <= 100000) return false;
    }

    return true;
  });

  const sortedIslands = [...filteredIslands].sort((a, b) => {
    if (sortBy === "popular" || sortBy === "default" || sortBy === "clicks") {
      const clicksA = clicks[a.island] || 0;
      const clicksB = clicks[b.island] || 0;
      if (clicksB !== clicksA) {
        return clicksB - clicksA;
      }
      return 0;
    }
    if (sortBy === "time") {
      const timeA = parseTimeToMinutes(a.ferries[0]?.time || "99시간");
      const timeB = parseTimeToMinutes(b.ferries[0]?.time || "99시간");
      return timeA - timeB;
    }
    if (sortBy === "fare") {
      const fareA = getMinFareFerry(a.ferries).fareNum;
      const fareB = getMinFareFerry(b.ferries).fareNum;
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
    return 0;
  });

  return (
    <div id="explore-page-container" className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 text-[#282828]">
      {/* Exploration Header & Search */}
      <section id="explore-header-section" data-screen-label="SCR_001 탐색 헤더" className="pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-10 text-center max-w-[800px] mx-auto">
        <span className="text-xs sm:text-sm font-medium tracking-wider text-[#626E71] uppercase mb-2 sm:mb-3 block">
          INCHEON ISLAND EXPLORE
        </span>
        <h1 id="explore-header-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-[#282828] mb-3 sm:mb-4 leading-tight">
          나에게 딱 맞는 <span className="text-[#0F3E17]">인천 섬 찾기</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6A6A6A] leading-relaxed mb-6 sm:mb-8 px-2">
          뱃길 시간부터 백패킹·물때 조건까지 — 16개 섬을 조건별로 명쾌하게 탐색하세요.
        </p>

        {/* Search Bar */}
        <div id="explore-search-bar" className="max-w-[640px] mx-auto relative flex items-center w-full">
          <input
            id="explore-search-input"
            type="text"
            placeholder="섬 이름 또는 주소로 검색해보세요... (예: 굴업도, 대청면)"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-16 sm:pr-20 text-sm sm:text-base bg-white border border-[#D4D4D4] text-[#282828] rounded-full font-sans transition-colors hover:border-[#848484] focus:outline-none focus:border-[#0F3E17] placeholder:text-[#848484]"
          />
          <svg className="absolute left-3.5 sm:left-4 text-[#848484] pointer-events-none w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 sm:right-4 text-xs sm:text-sm bg-[#E8E8E8] text-[#525252] hover:bg-[#D4D4D4] px-2.5 py-1 rounded-full transition-colors"
            >
              지우기
            </button>
          )}
        </div>
      </section>

      {/* Divider line between Search and Filters */}
      <div className="w-full border-b border-[#EDEDED] mb-6 sm:mb-8" />

      {/* Filters Navigation Bar (1-row dropdown filter) */}
      {(() => {
        const totalCount = islands.length;
        const time1to2hCount = islands.filter(i => {
          const mins = parseTimeToMinutes(i.ferries[0]?.time || "");
          return mins >= 60 && mins < 120;
        }).length;
        const time2to4hCount = islands.filter(i => {
          const mins = parseTimeToMinutes(i.ferries[0]?.time || "");
          return mins >= 120 && mins < 240;
        }).length;
        const timeOver4hCount = islands.filter(i => {
          const mins = parseTimeToMinutes(i.ferries[0]?.time || "");
          return mins >= 240;
        }).length;

        const backpackingCount = islands.filter(i => islandMeta[i.island]?.backpacking).length;
        const trekkingCount = islands.filter(i => islandMeta[i.island]?.trekking).length;
        const campingCount = islands.filter(i => {
          const meta = islandMeta[i.island];
          const campList = campsites[i.island] || [];
          const hasCampingMeta = Boolean(meta?.backpacking || meta?.desc?.includes("캠핑") || meta?.desc?.includes("야영"));
          return campList.length > 0 || hasCampingMeta;
        }).length;

        const fareUnder50kCount = islands.filter(i => getMinFareFerry(i.ferries).fareNum <= 50000).length;
        const fare50kto100kCount = islands.filter(i => {
          const fare = getMinFareFerry(i.ferries).fareNum;
          return fare > 50000 && fare <= 100000;
        }).length;
        const fareOver100kCount = islands.filter(i => getMinFareFerry(i.ferries).fareNum > 100000).length;

        const timeOptions = [
          { value: "all", label: "⏱️ 이동시간 전체", chipLabel: "⏱️ 이동시간" },
          { value: "1to2h", label: "⏱️ 1시간~2시간 미만", chipLabel: "⏱️ 1~2시간 미만" },
          { value: "2to4h", label: "🚢 2시간~4시간 미만", chipLabel: "🚢 2~4시간 미만" },
          { value: "over4h", label: "⚓ 4시간 이상", chipLabel: "⚓ 4시간 이상" }
        ] as const;

        const purposeOptions = [
          { value: "all", label: "🎒 여행목적 전체", chipLabel: "🎒 여행목적" },
          { value: "backpacking", label: "🎒 백패킹 가능", chipLabel: "🎒 백패킹 가능" },
          { value: "trekking", label: "🪵 트레킹 코스", chipLabel: "🪵 트레킹 코스" },
          { value: "camping", label: "🏕️ 야영장/캠핑", chipLabel: "🏕️ 야영장/캠핑" }
        ] as const;

        const fareOptions = [
          { value: "all", label: "💵 왕복비용 전체", chipLabel: "💵 왕복비용" },
          { value: "under50k", label: "💵 5만원 이하", chipLabel: "💵 5만원 이하" },
          { value: "50kto100k", label: "💳 5만원~10만원", chipLabel: "💳 5만원~10만원" },
          { value: "over100k", label: "💰 10만원 이상", chipLabel: "💰 10만원 이상" }
        ] as const;

        const getTimeCount = (val: string) => {
          if (val === "all") return totalCount;
          if (val === "1to2h") return time1to2hCount;
          if (val === "2to4h") return time2to4hCount;
          if (val === "over4h") return timeOver4hCount;
          return 0;
        };

        const getPurposeCount = (val: string) => {
          if (val === "all") return totalCount;
          if (val === "backpacking") return backpackingCount;
          if (val === "trekking") return trekkingCount;
          if (val === "camping") return campingCount;
          return 0;
        };

        const getFareCount = (val: string) => {
          if (val === "all") return totalCount;
          if (val === "under50k") return fareUnder50kCount;
          if (val === "50kto100k") return fare50kto100kCount;
          if (val === "over100k") return fareOver100kCount;
          return 0;
        };

        const isAllActive = timeFilter === "all" && purposeFilter === "all" && fareFilter === "all" && !searchQuery;

        const handleResetAll = () => {
          setSearchQuery("");
          setTimeFilter("all");
          setPurposeFilter("all");
          setFareFilter("all");
          updateParams("all", "all", "all", sortBy, "");
          setActiveDropdown(null);
          setIsMobileFilterOpen(false);
          setMobileSubMenu(null);
        };

        return (
          <>
            {/* Click Outside Backdrop for Desktop */}
            {activeDropdown && !isMobile && (
              <div
                id="dropdown-backdrop"
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setActiveDropdown(null)}
              />
            )}

            <div id="explore-controls-container" className="mb-6 sm:mb-8 w-full flex items-center justify-between gap-3 sm:gap-4 relative z-30 overflow-visible">
              {/* LEFT: Category Filters (Desktop Chips & Mobile Filter Button) */}
              <div className="flex items-center gap-2 overflow-visible">
                {/* Mobile/Tablet (< lg): Single Filter Icon Button [ ☰ ] + Reset Button */}
                <div className="flex items-center gap-2 lg:hidden shrink-0">
                  <div className="relative shrink-0">
                    <button
                      id="mobile-filter-toggle-btn"
                      type="button"
                      onClick={() => {
                        setIsMobileFilterOpen(prev => !prev);
                        setMobileSubMenu(null);
                      }}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative ${!isAllActive || isMobileFilterOpen
                        ? "bg-[#0F3E17] text-white border-[#0F3E17] shadow-xs"
                        : "bg-white border-[#D4D4D4] text-[#282828] hover:border-[#0F3E17]"
                        }`}
                      aria-label="필터 메뉴 열기"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12M9 17.25h6" />
                      </svg>
                      {!isAllActive && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                      )}
                    </button>

                    {/* Mobile Filter Popover Menu (Light Theme with Transparent Backdrop) */}
                    {isMobileFilterOpen && (
                      <>
                        <div
                          id="mobile-popover-backdrop"
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => {
                            setIsMobileFilterOpen(false);
                            setMobileSubMenu(null);
                          }}
                        />
                        <div className="absolute left-0 top-full mt-2 z-50 bg-white text-[#282828] rounded-2xl shadow-xl p-2 w-[240px] border border-[#D4D4D4] animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
                          {/* Top Level Category List */}
                          {mobileSubMenu === null ? (
                            <>
                              <div className="px-2.5 py-1.5 text-xs font-semibold text-[#848484] border-b border-[#EDEDED] flex items-center justify-between">
                                <span>필터 조건</span>
                                {!isAllActive && (
                                  <button
                                    type="button"
                                    onClick={handleResetAll}
                                    className="text-[11px] text-[#848484] hover:text-[#0F3E17] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>초기화</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* 1. 이동시간 Category */}
                              <button
                                type="button"
                                onClick={() => setMobileSubMenu("time")}
                                className="w-full px-2.5 py-2.5 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-between text-xs text-left transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <span>⏱️</span>
                                  <span className="font-medium text-[#282828]">이동시간</span>
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-[#848484]">
                                  <span className={timeFilter !== "all" ? "text-[#0F3E17] font-semibold" : ""}>
                                    {timeFilter === "all" ? "전체" : timeOptions.find(o => o.value === timeFilter)?.chipLabel.replace("⏱️ ", "").replace("🚢 ", "").replace("⚓ ", "")}
                                  </span>
                                  <svg className="w-3.5 h-3.5 text-[#848484]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </span>
                              </button>

                              {/* 2. 여행목적 Category */}
                              <button
                                type="button"
                                onClick={() => setMobileSubMenu("purpose")}
                                className="w-full px-2.5 py-2.5 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-between text-xs text-left transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <span>🎒</span>
                                  <span className="font-medium text-[#282828]">여행목적</span>
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-[#848484]">
                                  <span className={purposeFilter !== "all" ? "text-[#0F3E17] font-semibold" : ""}>
                                    {purposeFilter === "all" ? "전체" : purposeOptions.find(o => o.value === purposeFilter)?.chipLabel.replace("🎒 ", "").replace("🪵 ", "").replace("🏕️ ", "")}
                                  </span>
                                  <svg className="w-3.5 h-3.5 text-[#848484]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </span>
                              </button>

                              {/* 3. 왕복비용 Category */}
                              <button
                                type="button"
                                onClick={() => setMobileSubMenu("fare")}
                                className="w-full px-2.5 py-2.5 rounded-xl hover:bg-[#F5F5F5] flex items-center justify-between text-xs text-left transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <span>💵</span>
                                  <span className="font-medium text-[#282828]">왕복비용</span>
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-[#848484]">
                                  <span className={fareFilter !== "all" ? "text-[#0F3E17] font-semibold" : ""}>
                                    {fareFilter === "all" ? "전체" : fareOptions.find(o => o.value === fareFilter)?.chipLabel.replace("💵 ", "").replace("💳 ", "").replace("💰 ", "")}
                                  </span>
                                  <svg className="w-3.5 h-3.5 text-[#848484]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                  </svg>
                                </span>
                              </button>
                            </>
                          ) : (
                            /* SubMenu Option List */
                            <>
                              <div className="px-2 py-1.5 border-b border-[#EDEDED] flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setMobileSubMenu(null)}
                                  className="flex items-center gap-1 text-xs font-semibold text-[#525252] hover:text-[#0F3E17] py-0.5 px-1 rounded cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                  </svg>
                                  <span>뒤로</span>
                                </button>
                                <span className="text-xs font-bold text-[#282828]">
                                  {mobileSubMenu === "time" && "이동시간"}
                                  {mobileSubMenu === "purpose" && "여행목적"}
                                  {mobileSubMenu === "fare" && "왕복비용"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-0.5 mt-1">
                                {(() => {
                                  const options = mobileSubMenu === "time" ? timeOptions
                                    : mobileSubMenu === "purpose" ? purposeOptions
                                      : fareOptions;
                                  const currentVal = mobileSubMenu === "time" ? timeFilter
                                    : mobileSubMenu === "purpose" ? purposeFilter
                                      : fareFilter;
                                  const handleChange = mobileSubMenu === "time" ? handleTimeChange
                                    : mobileSubMenu === "purpose" ? handlePurposeChange
                                      : handleFareChange;
                                  const getCount = mobileSubMenu === "time" ? getTimeCount
                                    : mobileSubMenu === "purpose" ? getPurposeCount
                                      : getFareCount;

                                  return options.map(option => {
                                    const isSelected = option.value === currentVal;
                                    return (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                          (handleChange as (val: string) => void)(option.value);
                                          setMobileSubMenu(null);
                                        }}
                                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected ? "bg-[#E6FDE5]/50 text-[#0F3E17] font-bold" : "text-[#525252] hover:bg-[#F5F5F5]"
                                          }`}
                                      >
                                        <span className="flex items-center gap-1.5">
                                          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                                            {isSelected && (
                                              <svg className="w-3.5 h-3.5 text-[#0F3E17]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                              </svg>
                                            )}
                                          </span>
                                          <span>{option.label}</span>
                                        </span>
                                        <span className={`text-[10px] ${isSelected ? "text-[#0F3E17] font-bold" : "text-[#848484]"}`}>
                                          {(getCount as (val: string) => number)(option.value)}
                                        </span>
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Reset Button beside Filter icon */}
                  {!isAllActive && (
                    <button
                      id="mobile-filter-reset-btn"
                      type="button"
                      onClick={handleResetAll}
                      className="flex items-center gap-1 text-xs font-semibold text-[#848484] hover:text-[#0F3E17] transition-colors cursor-pointer py-1 px-1.5 shrink-0"
                    >
                      <span>초기화</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Desktop Category Dropdown Filters (>= lg) */}
                <div className="hidden lg:flex items-center gap-2 overflow-visible">
                  {/* 1. [⏱️ 이동시간 ▾] Dropdown Chip */}
                  <div className="relative shrink-0">
                    <button
                      id="filter-time-dropdown-btn"
                      type="button"
                      onClick={() => setActiveDropdown(prev => prev === "time" ? null : "time")}
                      className={`h-10 px-4 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus:ring-0 select-none ${timeFilter !== "all"
                        ? "bg-[#0F3E17] text-white border-[#0F3E17] shadow-xs z-30 relative"
                        : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                        }`}
                    >
                      <span>{timeOptions.find(o => o.value === timeFilter)?.chipLabel}</span>
                      <svg className="w-3.5 h-3.5 text-current shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Desktop Dropdown for Time */}
                    {activeDropdown === "time" && (
                      <div className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#D4D4D4] rounded-2xl shadow-xl py-2 min-w-[210px] w-max flex flex-col gap-0.5">
                        {timeOptions.map(option => {
                          const isSelected = option.value === timeFilter;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handleTimeChange(option.value);
                                setActiveDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-0 select-none ${isSelected ? "font-bold text-[#0F3E17] bg-[#E6FDE5]/40" : "text-[#525252]"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-[#0F3E17]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </span>
                                <span>{option.label}</span>
                              </span>
                              <span className={`text-xs ${isSelected ? "text-[#0F3E17] font-bold" : "text-[#848484]"}`}>
                                {getTimeCount(option.value)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. [🎒 여행목적 ▾] Dropdown Chip */}
                  <div className="relative shrink-0">
                    <button
                      id="filter-purpose-dropdown-btn"
                      type="button"
                      onClick={() => setActiveDropdown(prev => prev === "purpose" ? null : "purpose")}
                      className={`h-10 px-4 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus:ring-0 select-none ${purposeFilter !== "all"
                        ? "bg-[#0F3E17] text-white border-[#0F3E17] shadow-xs z-30 relative"
                        : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                        }`}
                    >
                      <span>{purposeOptions.find(o => o.value === purposeFilter)?.chipLabel}</span>
                      <svg className="w-3.5 h-3.5 text-current shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Desktop Dropdown for Purpose */}
                    {activeDropdown === "purpose" && (
                      <div className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#D4D4D4] rounded-2xl shadow-xl py-2 min-w-[210px] w-max flex flex-col gap-0.5">
                        {purposeOptions.map(option => {
                          const isSelected = option.value === purposeFilter;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handlePurposeChange(option.value);
                                setActiveDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-0 select-none ${isSelected ? "font-bold text-[#0F3E17] bg-[#E6FDE5]/40" : "text-[#525252]"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-[#0F3E17]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </span>
                                <span>{option.label}</span>
                              </span>
                              <span className={`text-xs ${isSelected ? "text-[#0F3E17] font-bold" : "text-[#848484]"}`}>
                                {getPurposeCount(option.value)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. [💵 왕복비용 ▾] Dropdown Chip */}
                  <div className="relative shrink-0">
                    <button
                      id="filter-fare-dropdown-btn"
                      type="button"
                      onClick={() => setActiveDropdown(prev => prev === "fare" ? null : "fare")}
                      className={`h-10 px-4 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus:ring-0 select-none ${fareFilter !== "all"
                        ? "bg-[#0F3E17] text-white border-[#0F3E17] shadow-xs z-30 relative"
                        : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                        }`}
                    >
                      <span>{fareOptions.find(o => o.value === fareFilter)?.chipLabel}</span>
                      <svg className="w-3.5 h-3.5 text-current shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Desktop Dropdown for Fare */}
                    {activeDropdown === "fare" && (
                      <div className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#D4D4D4] rounded-2xl shadow-xl py-2 min-w-[210px] w-max flex flex-col gap-0.5">
                        {fareOptions.map(option => {
                          const isSelected = option.value === fareFilter;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handleFareChange(option.value);
                                setActiveDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors text-sm flex items-center justify-between cursor-pointer focus:outline-none focus:ring-0 select-none ${isSelected ? "font-bold text-[#0F3E17] bg-[#E6FDE5]/40" : "text-[#525252]"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {isSelected && (
                                    <svg className="w-4 h-4 text-[#0F3E17]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </span>
                                <span>{option.label}</span>
                              </span>
                              <span className={`text-xs ${isSelected ? "text-[#0F3E17] font-bold" : "text-[#848484]"}`}>
                                {getFareCount(option.value)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. [초기화 ↺] Text Button */}
                  {!isAllActive && (
                    <button
                      id="filter-reset-all-btn"
                      type="button"
                      onClick={handleResetAll}
                      className="flex items-center gap-1 text-sm font-semibold text-[#848484] hover:text-[#0F3E17] transition-colors shrink-0 cursor-pointer pl-1.5 h-10"
                    >
                      <span>초기화</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT: Text-Based Sort Tabs (Active Item Has Round Pill Border) */}
              <div id="explore-sort-tabs" className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
                {[
                  { value: "popular", label: "인기순" },
                  { value: "time", label: "시간순" },
                  { value: "fare", label: "비용순" },
                ].map((tab) => {
                  const isActive =
                    sortBy === tab.value ||
                    (tab.value === "popular" && (sortBy === "default" || sortBy === "clicks"));
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleSortChange(tab.value as any)}
                      className={`text-xs sm:text-sm rounded-full px-3.5 sm:px-4 py-1.5 cursor-pointer inline-flex items-center justify-center font-medium select-none focus:outline-none focus:ring-0 ${isActive
                        ? "bg-white border border-[#D4D4D4] text-[#282828]"
                        : "bg-transparent border border-transparent text-[#848484] hover:text-[#282828]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}

      {/* Islands Grid Listing */}
      <section id="explore-islands-section" className="mb-16 md:mb-28">
        {sortedIslands.length > 0 ? (
          <div id="explore-islands-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {sortedIslands.map((item) => {
              const meta = islandMeta[item.island] || { backpacking: false, trekking: false, desc: "아름다운 섬 정보" };
              const key = islandIdMap[item.island];
              const itemImgData = key ? (imageData as Record<string, { name: string; images: string[] }>)[key] : null;
              const hasImage = Boolean(itemImgData && itemImgData.images && itemImgData.images.length > 0);
              const image = hasImage ? itemImgData!.images[0] : null;
              const coords = islandCoordinates[item.island];
              const bbox = coords ? `${coords.lng - 0.04}%2C${coords.lat - 0.025}%2C${coords.lng + 0.04}%2C${coords.lat + 0.025}` : "";
              const osmUrl = coords ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}` : null;
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
                    {image ? (
                      <Image
                        src={image}
                        alt={item.island}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : osmUrl ? (
                      <div className="relative w-full h-full overflow-hidden pointer-events-none bg-[#D4E6EC]">
                        <iframe
                          title={`${item.island} 위치 지도`}
                          src={osmUrl}
                          className="absolute -top-14 -left-12 w-[calc(100%+96px)] h-[calc(100%+100px)] border-none pointer-events-none"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1.5 right-2 z-10 px-1.5 py-0.5 rounded bg-black/60 text-white/90 text-[10px] font-sans pointer-events-none backdrop-blur-xs select-none">
                          © OpenStreetMap
                        </span>
                      </div>
                    ) : (
                      <Image
                        src="/images/default_island.png"
                        alt={item.island}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-[#848484] font-medium mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.address.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-2 tracking-tight group-hover:text-[#0F3E17] transition-colors leading-snug">
                        {item.island}
                      </h3>
                      <p className="text-sm sm:text-base text-[#6A6A6A] leading-relaxed line-clamp-2 mb-4">
                        {meta.desc}
                      </p>

                      {/* Left-Aligned Stats Row */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-[#EDEDED] text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">⏱️ 시간</span>
                          <span className="text-[#282828] whitespace-nowrap">{item.ferries[0]?.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">💵 왕복</span>
                          <span className="text-[#282828] whitespace-nowrap">{getMinFareFerry(item.ferries).fare}</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">🍽️ 식당</span>
                          <span className="text-[#282828] whitespace-nowrap">
                            {loadingRestaurants ? "로딩중..." : `${getRestaurantCount(item.island)}개`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[#848484] shrink-0">🏡 숙박</span>
                          <span className="text-[#282828] whitespace-nowrap">
                            {loadingLodges ? "로딩중..." : `${getLodgeCount(item.island)}개`}
                          </span>
                        </div>
                        {/* 1-Line Fixed Badges Row (NEVER Wraps to 2 Lines) */}
                        <div className="flex items-center gap-1.5 col-span-2 mt-2 pt-2 border-t border-[#EDEDED] flex-nowrap whitespace-nowrap overflow-hidden">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap shrink-0 ${meta.backpacking
                            ? "bg-[#E6FDE5] text-[#0F3E17]"
                            : "bg-[#FFF1F0] text-[#E5484D]"
                            }`}>
                            🎒 백패킹 {meta.backpacking ? "가능" : "불가"}
                          </span>
                          <span className="bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap shrink-0">
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
            <h3 className="text-base sm:text-lg font-bold text-[#282828] mb-1">검색 결과가 없습니다</h3>
            <p className="text-sm text-[#848484]">다른 섬 이름 또는 카테고리를 검색해 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] m-auto flex justify-center items-center min-h-[50vh] text-[#6A6A6A] text-base">
        로딩 중...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
