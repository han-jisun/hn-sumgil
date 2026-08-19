"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface YoutubeVideo {
  videoId: string;
  url: string;
  title: string;
  thumbnail: string;
  ownerText: string;
  viewCountText: string;
  publishedTimeText: string;
  lengthText: string;
}

interface IslandYoutubeStatus {
  island: string;
  videos: YoutubeVideo[];
  count: number;
}

const islands: IslandData[] = islandsData as IslandData[];

export default function YoutubeList() {
  const [youtubeStatuses, setYoutubeStatuses] = useState<IslandYoutubeStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const fetchYoutubeForAll = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    const statuses: IslandYoutubeStatus[] = [];

    try {
      for (let i = 0; i < islands.length; i++) {
        const item = islands[i];

        try {
          const res = await fetch(`/api/youtube?query=${encodeURIComponent(item.island + " 여행")}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.videos) {
              statuses.push({
                island: item.island,
                videos: data.videos,
                count: data.videos.length,
              });
            } else {
              statuses.push({
                island: item.island,
                videos: [],
                count: 0,
              });
            }
          } else {
            statuses.push({
              island: item.island,
              videos: [],
              count: 0,
            });
          }
        } catch (e) {
          console.error(`Error fetching YouTube videos for ${item.island}:`, e);
          statuses.push({
            island: item.island,
            videos: [],
            count: 0,
          });
        }

        setProgress(i + 1);
      }
      setYoutubeStatuses(statuses);
    } catch (err: any) {
      setError(err.message || "유튜브 데이터 수집 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYoutubeForAll();
  }, []);

  const filteredStatuses = youtubeStatuses.filter((item) => {
    const islandMatch = item.island.toLowerCase().includes(searchQuery.toLowerCase());
    const videoMatch = item.videos.some((v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return islandMatch || videoMatch;
  });

  const totalVideosCount = youtubeStatuses.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#F6F6F6] border border-[#D4D4D4] rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-[#0F3E17]/20 border-t-[#0F3E17] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-[#282828] mb-2">
            섬 별 실시간 인기 유튜브 영상 탐색 중... ({progress} / {islands.length})
          </p>
          <div className="w-full max-w-xs bg-[#D4D4D4] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#0F3E17] h-full transition-all duration-300"
              style={{ width: `${(progress / islands.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#848484] mt-2">
            유튜브 검색 메타 데이터를 통해 조회수 상위 3건의 리뷰 영상을 연동하고 있습니다.
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
            onClick={fetchYoutubeForAll}
            className="text-xs font-semibold text-[#0F3E17] hover:underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && youtubeStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848484] text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 또는 영상 제목을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F6] border border-[#D4D4D4] focus:border-[#0F3E17] focus:ring-1 focus:ring-[#0F3E17]/20 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-[#282828] placeholder:text-[#848484] transition-all"
              />
            </div>

            <div className="flex gap-4 text-xs text-[#848484] justify-end">
              <div>
                영상 수집 섬:{" "}
                <span className="text-[#0F3E17] font-bold">
                  {youtubeStatuses.filter((s) => s.count > 0).length}
                </span>{" "}
                / {youtubeStatuses.length}
              </div>
              <div>
                총 추천 영상:{" "}
                <span className="text-[#0F3E17] font-bold">{totalVideosCount}개</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => {
                const isExpanded = expandedIsland === status.island;
                const hasVideos = status.count > 0;

                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasVideos) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-xl border transition-all bg-[#F6F6F6] flex flex-col justify-between ${
                      hasVideos ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-[#0F3E17] bg-white shadow-md col-span-1 md:col-span-2" 
                        : "border-[#D4D4D4] hover:border-[#0F3E17]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-[#282828]">
                          📺 {status.island}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            hasVideos
                              ? "bg-[#E6FDE5] text-[#0F3E17] border-[#0F3E17]"
                              : "bg-[#F6F6F6] text-[#848484] border-[#D4D4D4]"
                          }`}
                        >
                          {hasVideos ? `추천 영상 ${status.count}개` : "영상 없음"}
                        </span>
                      </div>

                      {hasVideos && isExpanded && (
                        <div className="mt-4 pt-3 border-t border-[#EDEDED] flex flex-col gap-3">
                          <span className="text-xs text-[#0F3E17] font-semibold block">
                            인기 리뷰 영상 (상위 3건)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {status.videos.map((vid) => (
                              <div
                                key={vid.videoId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVideoUrl(`https://www.youtube.com/embed/${vid.videoId}?autoplay=1`);
                                }}
                                className="group flex flex-col rounded-lg overflow-hidden border border-[#D4D4D4] bg-white hover:border-[#0F3E17] transition-all cursor-pointer"
                              >
                                <div className="relative aspect-video w-full overflow-hidden bg-[#EDEDED]">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={vid.thumbnail} 
                                    alt={vid.title} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                  />
                                  <span className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-white">
                                    {vid.lengthText}
                                  </span>
                                </div>
                                <div className="p-3 flex flex-col gap-1">
                                  <h5 className="text-xs font-bold text-[#282828] group-hover:text-[#0F3E17] line-clamp-2 leading-snug">
                                    {vid.title}
                                  </h5>
                                  <div className="flex justify-between items-center text-[10px] text-[#848484] mt-1">
                                    <span className="truncate">{vid.ownerText}</span>
                                    <span>{vid.viewCountText}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isExpanded && hasVideos && (
                      <div className="mt-2 text-[11px] text-[#848484] text-right hover:text-[#0F3E17]">
                        클릭하여 영상 목록 보기 ▾
                      </div>
                    )}
                    {isExpanded && hasVideos && (
                      <div className="mt-4 text-[11px] text-[#848484] text-right">
                        클릭하여 접기 ▴
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 bg-[#F6F6F6] border border-dashed border-[#D4D4D4] rounded-xl text-[#848484] text-xs">
                검색 조건에 맞는 섬 또는 영상이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoUrl && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 text-white font-bold flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>
            <iframe
              src={activeVideoUrl}
              title="YouTube video player"
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
