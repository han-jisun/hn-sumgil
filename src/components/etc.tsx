import React, { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
  address: string;
}

interface Spot {
  contentId: string;
  title: string;
  addr: string;
  firstImage: string;
  contentTypeId: string;
  mapX: string;
  mapY: string;
}

interface IslandSpotStatus {
  island: string;
  spots: Spot[];
}

interface SpotDetail {
  contentId: string;
  overview: string;
  homepage: string;
  tel: string;
  telname: string;
}

export default function EtcList() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [islandStatuses, setIslandStatuses] = useState<IslandSpotStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const [spotDetails, setSpotDetails] = useState<Record<string, SpotDetail>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);

  const handleToggleSpotDetail = async (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (expandedSpotId === contentId) {
      setExpandedSpotId(null);
      return;
    }

    setExpandedSpotId(contentId);

    if (spotDetails[contentId]) {
      return;
    }

    setLoadingDetails(prev => ({ ...prev, [contentId]: true }));
    try {
      const response = await fetch(`/api/spot?contentId=${contentId}`);
      if (!response.ok) throw new Error("상세 정보를 가져오지 못했습니다.");
      const data = await response.json();
      if (data.success && data.detail) {
        setSpotDetails(prev => ({ ...prev, [contentId]: data.detail }));
      }
    } catch (err) {
      console.error("Error fetching spot detail:", err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [contentId]: false }));
    }
  };

  const islands: IslandData[] = islandsData as IslandData[];

  const getIslandForSpot = (addr: string, title: string): string | null => {
    const combined = (addr + " " + title);
    if (combined.includes("굴업")) return "굴업도";
    if (combined.includes("소야")) return "소야도";
    if (combined.includes("백아")) return "백아도";
    if (combined.includes("울도")) return "울도";
    if (combined.includes("지도")) return "지도";
    if (combined.includes("문갑")) return "문갑도";
    
    if (combined.includes("소이작")) return "소이작도";
    if (combined.includes("대이작")) return "대이작도";
    if (combined.includes("승봉")) return "승봉도";
    
    if (combined.includes("소연평")) return "소연평";
    if (combined.includes("대연평")) return "대연평";
    
    if (combined.includes("소청")) return "소청도";
    if (combined.includes("대청")) return "대청도";
    
    if (combined.includes("백령")) return "백령도";
    if (combined.includes("자월")) return "자월도";
    if (combined.includes("덕적")) return "덕적도";
    if (combined.includes("연평")) return "대연평";
    
    return null;
  };

  const fetchSpots = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/spot");
      if (!response.ok) {
        throw new Error("관광지 데이터를 가져오지 못했습니다.");
      }
      
      const data = await response.json();
      const items = data.items || [];
      setSpots(items);

      // Group spots by island
      const statuses: IslandSpotStatus[] = islands.map(item => {
        const matched = items.filter((spot: Spot) => {
          const matchedIsland = getIslandForSpot(spot.addr, spot.title);
          return matchedIsland === item.island;
        });
        return {
          island: item.island,
          spots: matched
        };
      });

      setIslandStatuses(statuses);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "관광 데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const getContentTypeName = (typeId: string) => {
    switch (typeId) {
      case "12":
        return "🌲 관광명소";
      case "14":
        return "🏛️ 문화시설";
      case "28":
        return "🛶 레포츠/해변";
      default:
        return "📍 관광지";
    }
  };

  const getContentTypeStyle = (typeId: string) => {
    switch (typeId) {
      case "12":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "14":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "28":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-white/5 text-text-secondary border-white/5";
    }
  };

  const filteredStatuses = islandStatuses.filter((status) => {
    const matchesIsland = status.island.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingSpot = status.spots.some(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.addr.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesIsland || hasMatchingSpot;
  });

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 관광 명소 정보 조회 중...
          </p>
          <p className="text-[0.7rem] text-text-muted mt-2">
            한국관광공사 국문 관광정보 서비스(KorService2) API에서 자료를 수집하고 있습니다.
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
            onClick={fetchSpots}
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
                placeholder="섬 이름, 관광지 명, 주소를 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                등록된 명소 수:{" "}
                <span className="text-primary font-bold">
                  {spots.length}
                </span>{" "}
                곳
              </div>
              <div>
                관광지 보유 섬:{" "}
                <span className="text-primary font-bold">
                  {islandStatuses.filter((s) => s.spots.length > 0).length}
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
                const hasSpots = status.spots.length > 0;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasSpots) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between ${
                      hasSpots ? "cursor-pointer" : "opacity-80"
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
                            hasSpots
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-white/2 text-text-muted border-white/5"
                          }`}
                        >
                          {hasSpots ? `가볼 만한 곳 ${status.spots.length}곳` : "공식 정보 등록 없음"}
                        </span>
                      </div>

                      {/* Snippet list (collapsed) */}
                      {hasSpots && !isExpanded && (
                        <div className="text-[0.7rem] text-text-secondary flex flex-col gap-1 mt-2">
                          {status.spots.slice(0, 3).map((s, idx) => (
                            <div key={idx} className="truncate text-text-primary flex justify-between">
                              <span>📍 {s.title}</span>
                              <span className="text-text-muted text-[0.65rem] truncate max-w-[40%]">
                                {s.contentTypeId === "12" ? "관광" : s.contentTypeId === "14" ? "문화" : "레포츠"}
                              </span>
                            </div>
                          ))}
                          {status.spots.length > 3 && (
                            <div className="text-[0.65rem] text-primary/70 font-semibold mt-1">
                              외 {status.spots.length - 3}곳 더보기...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded spot list */}
                      {isExpanded && hasSpots && (
                        <div 
                          className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-4 animate-fadeIn"
                          onClick={(e) => e.stopPropagation()} // Prevent closing the island card when interacting with spots
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {status.spots.map((spot, idx) => {
                              const isSpotExpanded = expandedSpotId === spot.contentId;
                              return (
                                <div 
                                  key={idx} 
                                  className={`bg-[#12121e]/80 border rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 ${
                                    isSpotExpanded 
                                      ? "border-primary/30 shadow-[0_4px_12px_rgba(16,185,129,0.08)] col-span-full" 
                                      : "border-white/5 hover:border-white/10"
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Spot Thumbnail */}
                                    {spot.firstImage && (
                                      <div className={`relative rounded-lg overflow-hidden border border-white/5 shrink-0 ${
                                        isSpotExpanded 
                                          ? "w-full sm:w-[200px] h-[130px]" 
                                          : "w-full h-[120px]"
                                      }`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                          src={spot.firstImage} 
                                          alt={spot.title} 
                                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                        />
                                      </div>
                                    )}
                                    
                                    <div className="flex-1 flex flex-col justify-between">
                                      <div>
                                        <div className="flex justify-between items-start gap-2 mb-1.5">
                                          <h5 className="text-[0.8rem] font-bold text-primary">
                                            {spot.title}
                                          </h5>
                                          <span className={`text-[0.55rem] px-2 py-0.5 rounded border shrink-0 ${getContentTypeStyle(spot.contentTypeId)}`}>
                                            {getContentTypeName(spot.contentTypeId)}
                                          </span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1 text-[0.7rem] text-text-secondary">
                                          <div className="flex justify-between items-start">
                                            <span className="min-w-[40px] text-text-muted">📍 주소</span>
                                            <span className="text-text-primary text-right max-w-[85%] truncate">{spot.addr}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Action button */}
                                      <div className="mt-3 flex justify-end">
                                        <button
                                          onClick={(e) => handleToggleSpotDetail(spot.contentId, e)}
                                          className="text-[0.65rem] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-text-primary px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200"
                                        >
                                          {loadingDetails[spot.contentId] ? (
                                            <>
                                              <div className="w-2.5 h-2.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                              불러오는 중...
                                            </>
                                          ) : isSpotExpanded ? (
                                            <>설명 접기 ▴</>
                                          ) : (
                                            <>📄 설명 보기 ▾</>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Expanded detail view */}
                                  {isSpotExpanded && (
                                    <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-3 animate-fadeIn">
                                      {loadingDetails[spot.contentId] ? (
                                        <div className="flex flex-col items-center justify-center py-6">
                                          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-2"></div>
                                          <p className="text-[0.65rem] text-text-muted">설명 정보를 조회하고 있습니다...</p>
                                        </div>
                                      ) : spotDetails[spot.contentId] ? (
                                        <div className="flex flex-col gap-2.5 text-[0.7rem]">
                                          <div className="bg-[#08080d]/60 border border-white/5 rounded-lg p-3">
                                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                              {spotDetails[spot.contentId].overview}
                                            </p>
                                          </div>
                                          
                                          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[0.65rem] text-text-muted px-1">
                                            {spotDetails[spot.contentId].tel && (
                                              <div className="flex gap-1.5">
                                                <span>📞 문의처:</span>
                                                <span className="text-text-secondary font-medium">
                                                  {spotDetails[spot.contentId].tel}
                                                  {spotDetails[spot.contentId].telname && ` (${spotDetails[spot.contentId].telname})`}
                                                </span>
                                              </div>
                                            )}
                                            {spotDetails[spot.contentId].homepage && (
                                              <div className="flex gap-1.5 items-center">
                                                <span>🌐 웹사이트:</span>
                                                <span 
                                                  className="text-primary hover:underline [&_a]:text-primary [&_a]:hover:underline [&_a]:font-semibold [&_a]:transition-all"
                                                  dangerouslySetInnerHTML={{ __html: spotDetails[spot.contentId].homepage }}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-[0.65rem] text-center text-text-muted py-2">상세 정보를 불러올 수 없습니다.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand helper */}
                    {hasSpots && !isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 가볼 만한 곳 보기 ▾
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
                검색 조건에 맞는 관광 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
