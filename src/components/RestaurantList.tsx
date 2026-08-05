"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface RestaurantItem {
  bsshNm: string;
  addr: string;
  tel: string;
  type: string;
}

interface IslandRestaurantStatus {
  island: string;
  restaurants: RestaurantItem[];
  count: number;
}

const islands: IslandData[] = islandsData as IslandData[];

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

export default function RestaurantList() {
  const [restaurantStatuses, setRestaurantStatuses] = useState<IslandRestaurantStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/restaurant");
      if (!res.ok) {
        throw new Error("음식점 데이터를 불러오는 데 실패했습니다.");
      }

      const data = await res.json();
      if (data.success && data.items) {
        const statuses: IslandRestaurantStatus[] = islands.map((item) => {
          const rule = matchRules[item.island];
          const matched = data.items.filter((r: RestaurantItem) => {
            if (rule) return rule(r.addr);
            return r.addr.includes(item.island);
          });

          return {
            island: item.island,
            restaurants: matched,
            count: matched.length,
          };
        });

        setRestaurantStatuses(statuses);
      } else {
        throw new Error(data.error || "음식점 정보를 찾을 수 없습니다.");
      }
    } catch (err: any) {
      console.error("Error fetching restaurants:", err);
      setError(err.message || "음식점 목록 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredStatuses = restaurantStatuses.filter((item) => {
    const islandMatch = item.island.toLowerCase().includes(searchQuery.toLowerCase());
    const restaurantMatch = item.restaurants.some((r) =>
      r.bsshNm.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return islandMatch || restaurantMatch;
  });

  const totalRestaurantCount = restaurantStatuses.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#F6F6F6] border border-[#D4D4D4] rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-[#0F3E17]/20 border-t-[#0F3E17] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-[#282828] mb-2">
            음식점 데이터 수집 및 가공 중...
          </p>
          <p className="text-xs text-[#848484]">
            네이버 검색 API 캐시 및 공공데이터포털 현황 API를 조합하고 있습니다.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-lg border border-red-200 bg-red-50 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-600 mb-1">검증 오류</h4>
          <p className="text-xs text-[#6A6A6A] leading-normal mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchRestaurants}
            className="text-xs font-semibold text-[#0F3E17] hover:underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && restaurantStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848484] text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 또는 식당 상호명을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F6] border border-[#D4D4D4] focus:border-[#0F3E17] focus:ring-1 focus:ring-[#0F3E17]/20 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-[#282828] placeholder:text-[#848484] transition-all"
              />
            </div>

            <div className="flex gap-4 text-xs text-[#848484] justify-end">
              <div>
                식당 보유 섬:{" "}
                <span className="text-[#0F3E17] font-bold">
                  {restaurantStatuses.filter((s) => s.count > 0).length}
                </span>{" "}
                / {restaurantStatuses.length}
              </div>
              <div>
                총 수집 식당:{" "}
                <span className="text-[#0F3E17] font-bold">{totalRestaurantCount}곳</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => {
                const isExpanded = expandedIsland === status.island;
                const hasRestaurants = status.count > 0;

                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasRestaurants) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-xl border transition-all bg-[#F6F6F6] flex flex-col justify-between ${
                      hasRestaurants ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-[#0F3E17] bg-white shadow-md col-span-1 md:col-span-2" 
                        : "border-[#D4D4D4] hover:border-[#0F3E17]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-[#282828]">
                          🍽️ {status.island}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            hasRestaurants
                              ? "bg-[#E6FDE5] text-[#0F3E17] border-[#0F3E17]"
                              : "bg-[#F6F6F6] text-[#848484] border-[#D4D4D4]"
                          }`}
                        >
                          {hasRestaurants ? `음식점 ${status.count}곳` : "등록 식당 없음"}
                        </span>
                      </div>

                      {hasRestaurants && isExpanded && (
                        <div className="mt-4 pt-3 border-t border-[#EDEDED] flex flex-col gap-3">
                          <span className="text-xs text-[#0F3E17] font-semibold block">
                            음식점 목록 ({status.count}개)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                            {status.restaurants.map((rest, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-[#D4D4D4] rounded-lg p-3 flex flex-col gap-1 text-xs"
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-[#282828] text-xs truncate max-w-[70%]">
                                    {rest.bsshNm}
                                  </span>
                                  <span className="text-[10px] bg-[#E6FDE5] text-[#0F3E17] px-1.5 py-0.5 rounded font-medium">
                                    {rest.type || "일반음식점"}
                                  </span>
                                </div>
                                <a
                                  href={`https://map.naver.com/index.naver?query=${encodeURIComponent(rest.addr)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#6A6A6A] hover:text-[#0F3E17] hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  📍 주소: {rest.addr} ↗
                                </a>
                                {rest.tel && (
                                  <span className="text-[11px] text-[#848484]">📞 전화번호: {rest.tel}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isExpanded && hasRestaurants && (
                      <div className="mt-2 text-[11px] text-[#848484] text-right hover:text-[#0F3E17]">
                        클릭하여 식당 목록 보기 ▾
                      </div>
                    )}
                    {isExpanded && hasRestaurants && (
                      <div className="mt-4 text-[11px] text-[#848484] text-right">
                        클릭하여 접기 ▴
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 bg-[#F6F6F6] border border-dashed border-[#D4D4D4] rounded-xl text-[#848484] text-xs">
                검색 조건에 맞는 섬 또는 음식점이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
