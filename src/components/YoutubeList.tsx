"use client";

import React, { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  viewCountText: string;
  publishedTimeText: string;
  lengthText: string;
  ownerText: string;
  url: string;
}

interface IslandYouTubeStatus {
  island: string;
  videos: YouTubeVideo[];
}

export default function YoutubeList() {
  const [youtubeStatuses, setYoutubeStatuses] = useState<IslandYouTubeStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  const islands: IslandData[] = islandsData as IslandData[];

  const fetchYoutubeForAll = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    const statuses: IslandYouTubeStatus[] = [];

    try {
      for (let i = 0; i < islands.length; i++) {
        const item = islands[i];
        
        try {
          // Staggered delay to avoid rate limit blocks
          await new Promise((resolve) => setTimeout(resolve, 80));

          const response = await fetch(`/api/youtube?query=${encodeURIComponent(item.island)}`);
          if (!response.ok) {
            throw new Error(`API fetch failed for ${item.island}`);
          }
          const data = await response.json();
          const videos = data.videos || [];

          statuses.push({
            island: item.island,
            videos: videos.slice(0, 3) // Ensure exactly up to 3 videos
          });
        } catch (err) {
          console.error(`Error fetching YouTube videos for ${item.island}:`, err);
          statuses.push({
            island: item.island,
            videos: []
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

  const filteredStatuses = youtubeStatuses.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.videos.some(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full">
      {/* Loading progress bar */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 유튜브 인기 영상 검색 중... ({progress} / {islands.length})
          </p>
          <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${(progress / islands.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[0.7rem] text-text-muted mt-2">
            유튜브 웹 검색을 통해 관련이 깊은 인기 동영상을 추출 중입니다.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-[12px] border border-red-500/20 bg-red-500/5 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-400 mb-1">검색 오류</h4>
          <p className="text-[0.75rem] text-text-secondary leading-normal mb-3">{error}</p>
          <button
            onClick={fetchYoutubeForAll}
            className="text-xs font-semibold text-red-400 hover:underline cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* YouTube Listing */}
      {!loading && !error && youtubeStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 이름 또는 비디오 제목을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                총 영상 수:{" "}
                <span className="text-red-500 font-bold">
                  {youtubeStatuses.reduce((acc, curr) => acc + curr.videos.length, 0)}
                </span>{" "}
                개
              </div>
              <div>
                영상 보유 섬:{" "}
                <span className="text-red-500 font-bold">
                  {youtubeStatuses.filter((s) => s.videos.length > 0).length}
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
                const hasVideos = status.videos.length > 0;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (hasVideos) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between ${
                      hasVideos ? "cursor-pointer" : "opacity-80"
                    } ${
                      isExpanded 
                        ? "border-red-500/40 shadow-[0_4px_20px_rgba(239,68,68,0.15)] col-span-1 md:col-span-2 row-span-1" 
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
                            hasVideos
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-white/2 text-text-muted border-white/5"
                          }`}
                        >
                          {hasVideos ? `인기 영상 ${status.videos.length}개` : "영상 정보 없음"}
                        </span>
                      </div>

                      {/* Snippet list (collapsed) */}
                      {hasVideos && !isExpanded && (
                        <div className="text-[0.7rem] text-text-secondary flex flex-col gap-2.5 mt-3">
                          {status.videos.slice(0, 2).map((video, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <div className="relative w-12 h-8 rounded overflow-hidden border border-white/5 shrink-0">
                                <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full" />
                              </div>
                              <div className="truncate flex-1">
                                <p className="truncate text-text-primary text-[0.7rem] font-medium">{video.title}</p>
                                <p className="text-[0.6rem] text-text-muted">{video.ownerText} • {video.viewCountText}</p>
                              </div>
                            </div>
                          ))}
                          {status.videos.length > 2 && (
                            <div className="text-[0.65rem] text-red-400 font-semibold mt-1">
                              외 {status.videos.length - 2}개 영상 더보기...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expanded video list */}
                      {isExpanded && hasVideos && (
                        <div 
                          className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-4 animate-fadeIn"
                          onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing the island card
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {status.videos.map((video) => (
                              <div key={video.videoId} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-3 flex flex-col gap-3.5 hover:border-white/10 transition-all duration-300">
                                {/* Video Thumbnail / Player */}
                                {activePlayerId === video.videoId ? (
                                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/5">
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                                      title={video.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => setActivePlayerId(video.videoId)}
                                    className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/5 cursor-pointer group/video"
                                  >
                                    <img 
                                      src={video.thumbnail} 
                                      alt={video.title} 
                                      className="object-cover w-full h-full group-hover/video:scale-105 transition-transform duration-500"
                                    />
                                    {/* Video duration badge */}
                                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[0.55rem] font-bold px-1.5 py-0.5 rounded text-white tracking-wide">
                                      {video.lengthText}
                                    </span>
                                    {/* Play icon overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/video:bg-black/20 transition-all duration-300">
                                      <div className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-sm shadow-lg group-hover/video:scale-110 transition-transform duration-300">
                                        ▶
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Video Info */}
                                <div className="flex flex-col flex-1 justify-between gap-2">
                                  <div>
                                    <h5 className="text-[0.75rem] font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition duration-300">
                                      {video.title}
                                    </h5>
                                    <p className="text-[0.65rem] text-text-muted mt-1 font-medium">{video.ownerText}</p>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[0.6rem] text-text-muted mt-auto">
                                    <span>{video.viewCountText}</span>
                                    <span>{video.publishedTimeText}</span>
                                  </div>
                                  
                                  <a 
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-2 text-center text-[0.65rem] font-semibold bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 rounded-lg py-1.5 transition-all duration-300"
                                  >
                                    YouTube에서 보기 ↗
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand helper */}
                    {hasVideos && !isExpanded && (
                      <div className="mt-4 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 인기 영상 보기 ▾
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
                검색 조건에 맞는 유튜브 영상이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
