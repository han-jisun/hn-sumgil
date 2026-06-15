"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
  address: string;
}

interface Restaurant {
  bsshNm: string;
  addr: string;
  tel: string;
  type: string;
  bizArea: string;
}

interface IslandRestaurantStatus {
  island: string;
  restaurants: Restaurant[];
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [islandStatuses, setIslandStatuses] = useState<IslandRestaurantStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const islands: IslandData[] = islandsData as IslandData[];

  const getIslandForRestaurant = (addr: string): string | null => {
    // Determine island based on address keywords
    if (addr.includes("굴업")) return "굴업도";
    if (addr.includes("소야")) return "소야도";
    if (addr.includes("백아")) return "백아도";
    if (addr.includes("울도")) return "울도";
    if (addr.includes("지도")) return "지도";
    if (addr.includes("문갑")) return "문갑도";
    
    if (addr.includes("소이작")) return "소이작도";
    if (addr.includes("대이작")) return "대이작도";
    if (addr.includes("승봉")) return "승봉도";
    
    if (addr.includes("소연평")) return "소연평";
    if (addr.includes("대연평")) return "대연평";
    
    if (addr.includes("소청")) return "소청도";
    if (addr.includes("대청")) return "대청도";
    
    if (addr.includes("백령")) return "백령도";
    
    if (addr.includes("자월")) return "자월도";
    
    if (addr.includes("덕적")) return "덕적도";
    
    if (addr.includes("연평")) return "대연평";
    
    return null;
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/restaurant");
      if (!response.ok) {
        throw new Error("음식점 데이터를 가져오지 못했습니다.");
      }
      
      const data = await response.json();
      const items = data.items || [];
      setRestaurants(items);

      // Group restaurants by island
      const statuses: IslandRestaurantStatus[] = islands.map(item => {
        const matched = items.filter((rest: Restaurant) => {
          const matchedIsland = getIslandForRestaurant(rest.addr) || getIslandForRestaurant(rest.bsshNm);
          return matchedIsland === item.island;
        });
        return {
          island: item.island,
          restaurants: matched
        };
      });

      setIslandStatuses(statuses);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "음식점 데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredStatuses = islandStatuses.filter((status) => {
    const matchesIsland = status.island.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingRestaurant = status.restaurants.some(
      (r) =>
        r.bsshNm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesIsland || hasMatchingRestaurant;
  });

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 주변 음식점 정보 조회 중...
          </p>
          <p className="text-[0.7rem] text-text-muted mt-2">
            공공데이터포털 일반음식점 현황 API에서 정보를 수집하고 있습니다.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-[12px] border border-red-500/20 bg-red-500/5 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-400 mb-1">조회 오류</h4>
          <p className="text-[0.75rem] text-text-secondary leading-normal mb-3">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && islandStatuses.length > 0 && (
        <div className="flex flex-col gap-4">


          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 이름, 음식점 명, 또는 업태(한식, 회 등)를 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                등록된 음식점 수:{" "}
                <span className="text-primary font-bold">
                  {restaurants.length}
                </span>{" "}
                개
              </div>
              <div>
                음식점 보유 섬:{" "}
                <span className="text-primary font-bold">
                  {islandStatuses.filter((s) => s.restaurants.length > 0).length}
                </span>{" "}
                / {islands.length}
              </div>
            </div>
          </div>

          {/* Grid list of islands */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => {
                const isExpanded = expandedIsland === status.island;
                const hasRestaurants = status.restaurants.length > 0;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasRestaurants) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between ${
                      hasRestaurants ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-primary/40 shadow-[0_4px_20px_rgba(16,185,129,0.15)] col-span-1 md:col-span-2 row-span-1" 
                        : "border-card-border hover:border-card-hover-border hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-text-primary">
                          🏝️ {status.island}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold tracking-wide border ${
                            hasRestaurants
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-white/2 text-text-muted border-white/5"
                          }`}
                        >
                          {hasRestaurants ? `음식점 ${status.restaurants.length}곳` : "주변 음식점 정보 없음"}
                        </span>
                      </div>

                      {/* Snippet list (collapsed) */}
                      {hasRestaurants && !isExpanded && (
                        <div className="text-[0.7rem] text-text-secondary flex flex-col gap-1 mt-2">
                          {status.restaurants.slice(0, 3).map((r, idx) => (
                            <div key={idx} className="truncate text-text-primary flex justify-between">
                              <span>🍽️ {r.bsshNm}</span>
                              <span className="text-text-muted text-[0.65rem]">{r.type}</span>
                            </div>
                          ))}
                          {status.restaurants.length > 3 && (
                            <div className="text-[0.65rem] text-primary/70 font-semibold mt-1">
                              외 {status.restaurants.length - 3}곳 더보기...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded restaurant list */}
                      {isExpanded && hasRestaurants && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-4 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {status.restaurants.map((rest, idx) => (
                              <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <h5 className="text-[0.8rem] font-bold text-primary">
                                    {rest.bsshNm}
                                  </h5>
                                  <span className="text-[0.6rem] text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                    {rest.type || "일반음식점"}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 text-[0.7rem] text-text-secondary mt-1">
                                  <div className="flex justify-between">
                                    <span className="min-w-[40px]">📍 주소</span>
                                    <span className="text-text-primary text-right max-w-[80%] truncate-2">{rest.addr}</span>
                                  </div>
                                  {rest.tel && (
                                    <div className="flex justify-between">
                                      <span>📞 연락처</span>
                                      <span className="text-text-primary">{rest.tel}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand helper */}
                    {hasRestaurants && !isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 주변 음식점 보기 ▾
                      </div>
                    )}
                    {isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right transition duration-300">
                        클릭하여 접기 ▴
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 bg-white/1 border border-card-border rounded-xl text-text-muted text-xs">
                검색 조건에 맞는 음식점 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
