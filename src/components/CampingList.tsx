"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface CampsiteItem {
  contentId: string;
  facltNm: string;
  lineIntro: string;
  intro: string;
  induty: string;
  lctCl: string;
  addr1: string;
  addr2: string;
  mapX: string;
  mapY: string;
  tel: string;
  homepage: string;
  firstImageUrl: string;
  sbrsCl: string;
  posblFcltyCl: string;
  operPdCl: string;
  operDeCl: string;
  trlerAcmpnyAt: string;
  caravAcmpnyAt: string;
}

interface IslandCampingStatus {
  island: string;
  campsites: CampsiteItem[];
  count: number;
}

const islands: IslandData[] = islandsData as IslandData[];

export default function CampingList() {
  const [campsiteStatuses, setCampsiteStatuses] = useState<IslandCampingStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<CampsiteItem | null>(null);

  const fetchCampingForAll = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    const statuses: IslandCampingStatus[] = [];

    try {
      for (let i = 0; i < islands.length; i++) {
        const item = islands[i];

        try {
          const res = await fetch(`/api/camping?query=${encodeURIComponent(item.island)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.items) {
              statuses.push({
                island: item.island,
                campsites: data.items,
                count: data.items.length,
              });
            } else {
              statuses.push({
                island: item.island,
                campsites: [],
                count: 0,
              });
            }
          } else {
            statuses.push({
              island: item.island,
              campsites: [],
              count: 0,
            });
          }
        } catch (e) {
          console.error(`Error checking camping data for ${item.island}:`, e);
          statuses.push({
            island: item.island,
            campsites: [],
            count: 0,
          });
        }

        setProgress(i + 1);
      }
      setCampsiteStatuses(statuses);
    } catch (err: any) {
      setError(err.message || "야영장 데이터 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampingForAll();
  }, []);

  const filteredStatuses = campsiteStatuses.filter((item) => {
    const islandMatch = item.island.toLowerCase().includes(searchQuery.toLowerCase());
    const campMatch = item.campsites.some((c) =>
      c.facltNm.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return islandMatch || campMatch;
  });

  const totalCampsitesCount = campsiteStatuses.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full">
      {/* Loading progress bar */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#F6F6F6] border border-[#D4D4D4] rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-[#0F3E17]/20 border-t-[#0F3E17] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-[#282828] mb-2">
            섬 별 야영장 데이터 수집 중... ({progress} / {islands.length})
          </p>
          <div className="w-full max-w-xs bg-[#D4D4D4] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#0F3E17] h-full transition-all duration-300"
              style={{ width: `${(progress / islands.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#848484] mt-2">
            한국관광공사 고캠핑 API에서 공식 캠핑장 정보를 조회 중입니다.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-lg border border-red-200 bg-red-50 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-600 mb-1">검증 오류</h4>
          <p className="text-xs text-[#6A6A6A] leading-normal mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchCampingForAll}
            className="text-xs font-semibold text-[#0F3E17] hover:underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Campsites Listing */}
      {!loading && !error && campsiteStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848484] text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 또는 야영장 이름을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F6] border border-[#D4D4D4] focus:border-[#0F3E17] focus:ring-1 focus:ring-[#0F3E17]/20 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-[#282828] placeholder:text-[#848484] transition-all"
              />
            </div>

            <div className="flex gap-4 text-xs text-[#848484] justify-end">
              <div>
                등록 야영장 보유 섬:{" "}
                <span className="text-[#0F3E17] font-bold">
                  {campsiteStatuses.filter((s) => s.count > 0).length}
                </span>{" "}
                / {campsiteStatuses.length}
              </div>
              <div>
                총 정식 야영장:{" "}
                <span className="text-[#0F3E17] font-bold">{totalCampsitesCount}곳</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => {
                const isExpanded = expandedIsland === status.island;
                const hasCamps = status.count > 0;

                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasCamps) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-xl border transition-all bg-[#F6F6F6] flex flex-col justify-between ${
                      hasCamps ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-[#0F3E17] bg-white shadow-md col-span-1 md:col-span-2" 
                        : "border-[#D4D4D4] hover:border-[#0F3E17]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-[#282828]">
                          ⛺ {status.island}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            hasCamps
                              ? "bg-[#E6FDE5] text-[#0F3E17] border-[#0F3E17]"
                              : "bg-[#F6F6F6] text-[#848484] border-[#D4D4D4]"
                          }`}
                        >
                          {hasCamps ? `정식 야영장 ${status.count}곳` : "공식 야영장 없음"}
                        </span>
                      </div>

                      {hasCamps && isExpanded && (
                        <div className="mt-4 pt-3 border-t border-[#EDEDED] flex flex-col gap-3">
                          <span className="text-xs text-[#0F3E17] font-semibold block">
                            야영장 목록 ({status.count}개)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {status.campsites.map((camp) => (
                              <div
                                key={camp.contentId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCamp(camp);
                                }}
                                className="bg-white hover:bg-[#E6FDE5]/40 border border-[#D4D4D4] rounded-lg p-3.5 flex flex-col justify-between gap-2 transition-colors cursor-pointer"
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-[#282828] line-clamp-1">
                                      {camp.facltNm}
                                    </span>
                                    <span className="text-[10px] bg-[#E6FDE5] text-[#0F3E17] px-1.5 py-0.5 rounded font-medium shrink-0">
                                      {camp.induty || "야영장"}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#848484] line-clamp-1">
                                    📍 {camp.addr1}
                                  </p>
                                </div>

                                <div className="text-[11px] text-[#0F3E17] font-medium text-right pt-1 border-t border-[#EDEDED]">
                                  상세보기 ↗
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isExpanded && hasCamps && (
                      <div className="mt-2 text-[11px] text-[#848484] text-right hover:text-[#0F3E17]">
                        클릭하여 야영장 목록 보기 ▾
                      </div>
                    )}
                    {isExpanded && hasCamps && (
                      <div className="mt-4 text-[11px] text-[#848484] text-right">
                        클릭하여 접기 ▴
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 bg-[#F6F6F6] border border-dashed border-[#D4D4D4] rounded-xl text-[#848484] text-xs">
                검색 조건에 맞는 섬 또는 야영장이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campsite Detail Lightbox Modal */}
      {selectedCamp && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCamp(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white text-[#282828] rounded-xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCamp(null)}
              className="absolute top-4 right-4 text-[#848484] hover:text-[#282828] text-lg font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-xs text-[#0F3E17] font-semibold bg-[#E6FDE5] px-2.5 py-1 rounded-full">
                {selectedCamp.induty || "일반야영장"}
              </span>
              <h3 className="text-xl font-bold text-[#282828] mt-2">
                {selectedCamp.facltNm}
              </h3>
              {selectedCamp.lineIntro && (
                <p className="text-xs text-[#6A6A6A] mt-1">{selectedCamp.lineIntro}</p>
              )}
            </div>

            {selectedCamp.firstImageUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden border border-[#D4D4D4] bg-[#EDEDED]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCamp.firstImageUrl}
                  alt={selectedCamp.facltNm}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 text-xs border-t border-[#EDEDED] pt-3 text-[#525252]">
              <p>📍 주소: {selectedCamp.addr1} {selectedCamp.addr2}</p>
              {selectedCamp.tel && <p>📞 대표 전화: {selectedCamp.tel}</p>}
              {selectedCamp.sbrsCl && <p>⚡ 부대 시설: {selectedCamp.sbrsCl}</p>}
            </div>

            {selectedCamp.homepage && (
              <a
                href={selectedCamp.homepage.startsWith("http") ? selectedCamp.homepage : `http://${selectedCamp.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-lg bg-[#0F3E17] text-white text-xs font-medium hover:bg-[#093712] transition-colors mt-2"
              >
                공식 홈페이지/예약 바로가기 ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
