"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface Campsite {
  contentId: string;
  facltNm: string;
  intro: string;
  addr1: string;
  addr2: string;
  mapX: string;
  mapY: string;
  tel: string;
  homepage: string;
  firstImageUrl: string;
  induty: string;
  resveUrl: string;
  resveCl: string;
  sbrsCl: string;
}

interface IslandCampsiteStatus {
  island: string;
  campsites: Campsite[];
}

export default function CampingList() {
  const [campsiteStatuses, setCampsiteStatuses] = useState<IslandCampsiteStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const islands: IslandData[] = islandsData as IslandData[];

  const fetchCampingForAll = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    const statuses: IslandCampsiteStatus[] = [];

    try {
      for (let i = 0; i < islands.length; i++) {
        const item = islands[i];
        
        try {
          // Staggered delay of 80ms to avoid API rate limit blocks
          await new Promise((resolve) => setTimeout(resolve, 80));

          const response = await fetch(`/api/camping?query=${encodeURIComponent(item.island)}`);
          if (!response.ok) {
            throw new Error(`API fetch failed for ${item.island}`);
          }
          const data = await response.json();
          const items = data.items || [];

          // KTO API might return matching campsites by keyword, let's make sure they are in the correct sigungu or island area
          const matchedCampsites = items.filter((camp: any) => {
            const matchesIsland = camp.addr1.includes(item.island) || camp.facltNm.includes(item.island);
            return matchesIsland;
          });

          statuses.push({
            island: item.island,
            campsites: matchedCampsites,
          });
        } catch (err) {
          console.error(`Error fetching campsites for ${item.island}:`, err);
          statuses.push({
            island: item.island,
            campsites: [],
          });
        }
        
        setProgress(i + 1);
      }
      setCampsiteStatuses(statuses);
    } catch (err: any) {
      setError(err.message || "캠핑장 데이터 검증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch once when component mounts
    fetchCampingForAll();
  }, []);

  const filteredStatuses = campsiteStatuses.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.campsites.some(c => c.facltNm.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full">
      {/* Loading progress bar */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 야영장 데이터 수집 중... ({progress} / {islands.length})
          </p>
          <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-300"
              style={{ width: `${(progress / islands.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[0.7rem] text-text-muted mt-2">
            한국관광공사 고캠핑 API에서 공식 캠핑장 정보를 조회 중입니다.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-[12px] border border-red-500/20 bg-red-500/5 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-400 mb-1">검증 오류</h4>
          <p className="text-[0.75rem] text-text-secondary leading-normal mb-3">{error}</p>
          <button
            onClick={fetchCampingForAll}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Campsites Listing */}
      {!loading && !error && campsiteStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 또는 야영장 이름을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                야영장 보유 섬:{" "}
                <span className="text-primary font-bold">
                  {campsiteStatuses.filter((s) => s.campsites.length > 0).length}
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
                const hasCampsites = status.campsites.length > 0;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasCampsites) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between ${
                      hasCampsites ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-secondary/40 shadow-[0_4px_20px_rgba(6,182,212,0.15)] col-span-1 md:col-span-2 row-span-1" 
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
                            hasCampsites
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/2 text-text-muted border-white/5"
                          }`}
                        >
                          {hasCampsites ? `야영장 ${status.campsites.length}곳` : "공식 야영장 없음"}
                        </span>
                      </div>

                      {/* Details */}
                      {hasCampsites && !isExpanded && (
                        <div className="text-[0.7rem] text-text-secondary flex flex-col gap-1 mt-2">
                          {status.campsites.map((c, idx) => (
                            <div key={idx} className="truncate text-text-primary">
                              ⛺ {c.facltNm}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expanded campsite information */}
                      {isExpanded && hasCampsites && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-4 animate-fadeIn">
                          {status.campsites.map((camp) => (
                            <div key={camp.contentId} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                              {/* Thumbnail Image */}
                              {camp.firstImageUrl && (
                                <div className="relative w-full h-[150px] rounded-lg overflow-hidden border border-white/5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={camp.firstImageUrl} 
                                    alt={camp.facltNm} 
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              
                              <div>
                                <h5 className="text-[0.8rem] font-bold text-secondary mb-1">
                                  {camp.facltNm}
                                </h5>
                                <span className="text-[0.6rem] text-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {camp.induty || "일반야영장"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1.5 text-[0.7rem] text-text-secondary">
                                <div className="flex justify-between">
                                  <span>📍 주소</span>
                                  <span className="text-text-primary text-right max-w-[70%] truncate-2">{camp.addr1}</span>
                                </div>
                                {camp.tel && (
                                  <div className="flex justify-between">
                                    <span>📞 연락처</span>
                                    <span className="text-text-primary">{camp.tel}</span>
                                  </div>
                                )}
                                {camp.sbrsCl && (
                                  <div className="flex flex-col gap-0.5 mt-1">
                                    <span className="text-[0.6rem] text-text-muted">시설 및 서비스</span>
                                    <span className="text-text-primary text-[0.65rem] truncate">{camp.sbrsCl}</span>
                                  </div>
                                )}
                              </div>

                              {/* Homepage link */}
                              {camp.homepage && (
                                <a
                                  href={camp.homepage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-2 text-center text-[0.65rem] py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-secondary transition duration-300 font-semibold"
                                >
                                  공식 홈페이지 방문 ↗
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expand helper */}
                    {hasCampsites && !isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 야영장 정보 보기 ▾
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
                검색 조건에 맞는 야영장 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
