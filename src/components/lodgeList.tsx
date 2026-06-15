"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
  address: string;
}

interface Lodge {
  bsshNm: string;
  addr: string;
  rooms: number;
  ceo: string;
  bizArea: string;
}

interface IslandLodgeStatus {
  island: string;
  lodges: Lodge[];
}

export default function LodgeList() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [islandStatuses, setIslandStatuses] = useState<IslandLodgeStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const islands: IslandData[] = islandsData as IslandData[];

  const getIslandForLodge = (addr: string): string | null => {
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

  const fetchLodges = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lodge");
      if (!response.ok) {
        throw new Error("숙박업소 데이터를 가져오지 못했습니다.");
      }
      
      const data = await response.json();
      const items = data.items || [];
      setLodges(items);

      // Group lodges by island
      const statuses: IslandLodgeStatus[] = islands.map(item => {
        const matched = items.filter((lodge: Lodge) => {
          const matchedIsland = getIslandForLodge(lodge.addr) || getIslandForLodge(lodge.bsshNm);
          return matchedIsland === item.island;
        });
        return {
          island: item.island,
          lodges: matched
        };
      });

      setIslandStatuses(statuses);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "숙박업소 데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLodges();
  }, []);

  const filteredStatuses = islandStatuses.filter((status) => {
    const matchesIsland = status.island.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingLodge = status.lodges.some(
      (l) =>
        l.bsshNm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ceo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesIsland || hasMatchingLodge;
  });

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 숙박업소 정보 조회 중...
          </p>
          <p className="text-[0.7rem] text-text-muted mt-2">
            공공데이터포털 숙박업소 현황 API에서 정보를 수집하고 있습니다.
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
            onClick={fetchLodges}
            className="text-xs font-semibold text-[#8b5cf6] hover:underline cursor-pointer"
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
                placeholder="섬 이름, 숙박업소 상호명, 또는 대표자명을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                등록된 숙박업소 수:{" "}
                <span className="text-[#8b5cf6] font-bold">
                  {lodges.length}
                </span>{" "}
                개
              </div>
              <div>
                숙박시설 보유 섬:{" "}
                <span className="text-[#8b5cf6] font-bold">
                  {islandStatuses.filter((s) => s.lodges.length > 0).length}
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
                const hasLodges = status.lodges.length > 0;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasLodges) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between ${
                      hasLodges ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-[#8b5cf6]/40 shadow-[0_4px_20px_rgba(139,92,246,0.15)] col-span-1 md:col-span-2 row-span-1" 
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
                            hasLodges
                              ? "bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20"
                              : "bg-white/2 text-text-muted border-white/5"
                          }`}
                        >
                          {hasLodges ? `숙박시설 ${status.lodges.length}곳` : "숙박 정보 없음"}
                        </span>
                      </div>

                      {/* Snippet list (collapsed) */}
                      {hasLodges && !isExpanded && (
                        <div className="text-[0.7rem] text-text-secondary flex flex-col gap-1 mt-2">
                          {status.lodges.slice(0, 3).map((l, idx) => (
                            <div key={idx} className="truncate text-text-primary flex justify-between">
                              <span>🏡 {l.bsshNm}</span>
                              <span className="text-text-muted text-[0.65rem]">{l.rooms}객실</span>
                            </div>
                          ))}
                          {status.lodges.length > 3 && (
                            <div className="text-[0.65rem] text-[#a78bfa]/70 font-semibold mt-1">
                              외 {status.lodges.length - 3}곳 더보기...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded lodge list */}
                      {isExpanded && hasLodges && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-4 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {status.lodges.map((lodge, idx) => (
                              <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                  <h5 className="text-[0.8rem] font-bold text-[#a78bfa]">
                                    {lodge.bsshNm}
                                  </h5>
                                  <span className="text-[0.6rem] text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                    {lodge.rooms}객실
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 text-[0.7rem] text-text-secondary mt-1">
                                  <div className="flex justify-between">
                                    <span className="min-w-[40px]">📍 주소</span>
                                    <span className="text-text-primary text-right max-w-[80%] truncate-2">{lodge.addr}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>👤 대표자</span>
                                    <span className="text-text-primary">{lodge.ceo || "미지정"}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand helper */}
                    {hasLodges && !isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 숙박시설 보기 ▾
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
                검색 조건에 맞는 숙박업소 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
