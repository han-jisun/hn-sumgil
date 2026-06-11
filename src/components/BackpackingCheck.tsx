"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface BlogItem {
  title: string;
  link: string;
  bloggername: string;
  postdate: string;
}

interface BackpackingStatus {
  island: string;
  eligible: boolean;
  count: number;
  blogs: BlogItem[];
}

export default function BackpackingCheck() {
  const [islandStatuses, setIslandStatuses] = useState<BackpackingStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const islands: IslandData[] = islandsData as IslandData[];

  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}.${month}.${day}`;
  };

  const getThreeYearsAgoLimit = () => {
    const limitDate = new Date();
    limitDate.setFullYear(limitDate.getFullYear() - 3);
    const yyyy = limitDate.getFullYear();
    const mm = String(limitDate.getMonth() + 1).padStart(2, "0");
    const dd = String(limitDate.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  };

  const checkBackpackingForAll = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    const statuses: BackpackingStatus[] = [];
    const limitDateStr = getThreeYearsAgoLimit();

    try {
      for (let i = 0; i < islands.length; i++) {
        const item = islands[i];
        const queryStr = `${item.island} 백패킹`;
        
        try {
          // Staggered delay of 85ms to avoid API rate limit blocks
          await new Promise((resolve) => setTimeout(resolve, 85));

          const response = await fetch(`/api/blog?query=${encodeURIComponent(queryStr)}&display=100`);
          if (!response.ok) {
            throw new Error(`API fetch failed for ${item.island}`);
          }
          const data = await response.json();
          const items = data.items || [];

          const filtered = items.filter((blog: any) => {
            const cleanTitle = cleanText(blog.title).toLowerCase();
            const titleMatches = 
              cleanTitle.includes(item.island.toLowerCase()) && 
              cleanTitle.includes("백패킹");
            const dateMatches = blog.postdate >= limitDateStr;
            return titleMatches && dateMatches;
          });

          // Sort by post date descending
          const sortedBlogs = [...filtered].sort((a: any, b: any) => 
            b.postdate.localeCompare(a.postdate)
          );

          statuses.push({
            island: item.island,
            eligible: filtered.length >= 10,
            count: filtered.length,
            blogs: sortedBlogs.slice(0, 3), 
          });
        } catch (err) {
          console.error(`Error fetching for ${item.island}:`, err);
          statuses.push({
            island: item.island,
            eligible: false,
            count: 0,
            blogs: [],
          });
        }
        
        setProgress(i + 1);
      }
      setIslandStatuses(statuses);
    } catch (err: any) {
      setError(err.message || "블로그 데이터 검증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once when the component is mounted
    checkBackpackingForAll();
  }, []);

  const filteredStatuses = islandStatuses.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Loading state with progress bar */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#0a0a0f]/40 border border-card-border rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            섬 별 백패킹 데이터 수집 중... ({progress} / {islands.length})
          </p>
          <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-300"
              style={{ width: `${(progress / islands.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[0.7rem] text-text-muted mt-2">
            네이버 검색 API를 통해 최신 백패킹 정보를 확인하고 있습니다.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-[12px] border border-red-500/20 bg-red-500/5 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-400 mb-1">검증 오류</h4>
          <p className="text-[0.75rem] text-text-secondary leading-normal mb-3">{error}</p>
          <button
            onClick={checkBackpackingForAll}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Result Display */}
      {!loading && !error && islandStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 이름을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
              />
            </div>

            {/* Summary statistics */}
            <div className="flex gap-4 text-[0.7rem] text-text-muted justify-end">
              <div>
                백패킹 가능 섬:{" "}
                <span className="text-primary font-bold">
                  {islandStatuses.filter((s) => s.eligible).length}
                </span>{" "}
                / {islandStatuses.length}
              </div>
            </div>
          </div>

          {/* Grid Layout of Checked Islands */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => {
                const isExpanded = expandedIsland === status.island;
                return (
                  <div
                    key={status.island}
                    onClick={() => {
                      if (status.blogs.length > 0) {
                        setExpandedIsland(isExpanded ? null : status.island);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0a0a0f]/60 group flex flex-col justify-between cursor-pointer ${
                      isExpanded 
                        ? "border-secondary/40 shadow-[0_4px_20px_rgba(6,182,212,0.15)] col-span-1 md:col-span-2 row-span-1" 
                        : "border-card-border hover:border-card-hover-border hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    <div>
                      {/* Header row: Island name and badge */}
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-text-primary">
                          🏝️ {status.island}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold tracking-wide border ${
                            status.eligible
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {status.eligible ? "백패킹 가능" : "정보 부족"}
                        </span>
                      </div>

                      {/* Info row */}
                      <div className="text-[0.7rem] text-text-secondary mb-2 flex items-center justify-between">
                        <span>최근 3년 매칭 블로그 수</span>
                        <span className={`font-semibold ${status.eligible ? 'text-primary' : 'text-text-muted'}`}>
                          {status.count}건
                        </span>
                      </div>

                      {/* Expanded View: Blog posts preview */}
                      {isExpanded && status.blogs.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2.5 animate-fadeIn">
                          <span className="text-[0.65rem] text-secondary font-semibold block">
                            대표 검색 결과 (최근 3건)
                          </span>
                          <div className="flex flex-col gap-2">
                            {status.blogs.map((blog, bIdx) => (
                              <a
                                key={bIdx}
                                href={blog.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()} 
                                className="bg-[#12121e]/80 hover:bg-[#1a1a2e] rounded-xl p-3 border border-white/5 flex flex-col gap-1 transition duration-300 group/link"
                              >
                                <span className="text-[0.75rem] font-medium text-text-primary group-hover/link:text-secondary line-clamp-1">
                                  {cleanText(blog.title)}
                                </span>
                                <div className="flex justify-between items-center text-[0.6rem] text-text-muted">
                                  <span>✍️ {cleanText(blog.bloggername)}</span>
                                  <span>{formatDate(blog.postdate)}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand indicator helper */}
                    {!isExpanded && status.blogs.length > 0 && (
                      <div className="mt-2 text-[0.6rem] text-text-muted text-right group-hover:text-text-secondary transition duration-300">
                        클릭하여 최근 블로그 글 보기 ▾
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
                검색 조건에 맞는 섬이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
