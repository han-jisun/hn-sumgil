"use client";

import { useState, useEffect } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandData {
  island: string;
}

interface BlogPost {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  postdate: string;
}

interface IslandStatus {
  island: string;
  eligible: boolean;
  count: number;
  blogs: BlogPost[];
}

const islands: IslandData[] = islandsData as IslandData[];

const cleanText = (text: string) => {
  return text
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'");
};

const formatDate = (dateStr: string) => {
  if (dateStr && dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
  }
  return dateStr;
};

export default function BackpackingCheck() {
  const [islandStatuses, setIslandStatuses] = useState<IslandStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);

  const checkBackpackingForAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        islands.map(async (item) => {
          const keyword = `${item.island} 백패킹`;
          try {
            const res = await fetch(`/api/blog?query=${encodeURIComponent(keyword)}&display=30`);
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.items) {
                const allBlogs: BlogPost[] = data.items;

                const matchedBlogs = allBlogs.filter((blog) => {
                  const plainTitle = cleanText(blog.title).toLowerCase();
                  const plainDesc = cleanText(blog.description).toLowerCase();
                  const targetIsland = item.island.toLowerCase();

                  const matchesIsland = plainTitle.includes(targetIsland) || plainDesc.includes(targetIsland);
                  const matchesBackpack = plainTitle.includes("백패킹") || plainDesc.includes("백패킹") || plainTitle.includes("캠핑") || plainDesc.includes("캠핑");
                  return matchesIsland && matchesBackpack;
                });

                const isEligible = matchedBlogs.length >= 3;
                return {
                  island: item.island,
                  eligible: isEligible,
                  count: matchedBlogs.length,
                  blogs: matchedBlogs.slice(0, 3),
                };
              }
            }
          } catch (e) {
            console.error(`Error checking backpacking status for ${item.island}:`, e);
          }
          return {
            island: item.island,
            eligible: false,
            count: 0,
            blogs: [],
          };
        })
      );

      setIslandStatuses(results);
    } catch (err: any) {
      setError(err.message || "블로그 데이터 검증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackpackingForAll();
  }, []);

  const filteredStatuses = islandStatuses.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-[#F6F6F6] border border-[#D4D4D4] rounded-2xl p-8">
          <div className="w-10 h-10 border-4 border-[#0F3E17]/20 border-t-[#0F3E17] rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-[#282828] mb-2">
            섬 별 백패킹 실시간 소셜 데이터 분석 중...
          </p>
          <p className="text-xs text-[#848484]">
            네이버 검색 API를 통해 최신 백패킹 후기를 병렬 처리로 수집하고 있습니다.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-[500px] m-auto p-5 rounded-lg border border-red-200 bg-red-50 text-center mb-6">
          <span className="text-xl mb-1 block">⚠️</span>
          <h4 className="text-sm font-semibold text-red-600 mb-1">검증 오류</h4>
          <p className="text-xs text-[#6A6A6A] leading-normal mb-3">{error}</p>
          <button
            type="button"
            onClick={checkBackpackingForAll}
            className="text-xs font-semibold text-[#0F3E17] hover:underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Result Display */}
      {!loading && !error && islandStatuses.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848484] text-sm">🔍</span>
              <input
                type="text"
                placeholder="섬 이름을 검색해 보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F6] border border-[#D4D4D4] focus:border-[#0F3E17] focus:ring-1 focus:ring-[#0F3E17]/20 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-[#282828] placeholder:text-[#848484] transition-all"
              />
            </div>

            <div className="flex gap-4 text-xs text-[#848484] justify-end">
              <div>
                백패킹 추천 섬:{" "}
                <span className="text-[#0F3E17] font-bold">
                  {islandStatuses.filter((s) => s.eligible).length}
                </span>{" "}
                / {islandStatuses.length}
              </div>
            </div>
          </div>

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
                    className={`p-5 rounded-xl border transition-all bg-[#F6F6F6] flex flex-col justify-between cursor-pointer ${
                      isExpanded 
                        ? "border-[#0F3E17] bg-white shadow-md col-span-1 md:col-span-2" 
                        : "border-[#D4D4D4] hover:border-[#0F3E17]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-[#282828]">
                          🏝️ {status.island}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            status.eligible
                              ? "bg-[#E6FDE5] text-[#0F3E17] border-[#0F3E17]"
                              : "bg-[#FFF1F0] text-[#E5484D] border-[#E5484D]/30"
                          }`}
                        >
                          {status.eligible ? "백패킹 가능" : "정보 부족"}
                        </span>
                      </div>

                      <div className="text-xs text-[#6A6A6A] mb-2 flex items-center justify-between">
                        <span>매칭 블로그 수</span>
                        <span className={`font-semibold ${status.eligible ? 'text-[#0F3E17]' : 'text-[#848484]'}`}>
                          {status.count}건
                        </span>
                      </div>

                      {isExpanded && status.blogs.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#EDEDED] flex flex-col gap-2.5">
                          <span className="text-xs text-[#0F3E17] font-semibold block">
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
                                className="bg-white hover:bg-[#E6FDE5]/40 rounded-lg p-3 border border-[#D4D4D4] flex flex-col gap-1 transition-colors"
                              >
                                <span className="text-xs font-medium text-[#282828] hover:text-[#0F3E17] line-clamp-1">
                                  {cleanText(blog.title)}
                                </span>
                                <div className="flex justify-between items-center text-[11px] text-[#848484]">
                                  <span>✍️ {cleanText(blog.bloggername)}</span>
                                  <span>{formatDate(blog.postdate)}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isExpanded && status.blogs.length > 0 && (
                      <div className="mt-2 text-[11px] text-[#848484] text-right hover:text-[#0F3E17]">
                        클릭하여 최근 블로그 글 보기 ▾
                      </div>
                    )}
                    {isExpanded && (
                      <div className="mt-4 text-[11px] text-[#848484] text-right">
                        클릭하여 접기 ▴
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 bg-[#F6F6F6] border border-dashed border-[#D4D4D4] rounded-xl text-[#848484] text-xs">
                검색 조건에 맞는 섬이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
