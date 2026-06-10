"use client";

import { useState, useEffect } from "react";

interface BlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export default function DataPage() {
  const [query, setQuery] = useState("섬길 여행");
  const [searchInput, setSearchInput] = useState("섬길 여행");
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickTags = ["섬길 여행", "제주도 올레길", "남해 여행", "울릉도 트레킹", "신안 섬길"];

  const fetchBlogs = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/blog?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("네이버 블로그 검색 결과를 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      if (data.items) {
        setBlogs(data.items);
      } else {
        setBlogs([]);
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchInput(tag);
    setQuery(tag);
  };

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

  return (
    <div className="py-12 px-6 container m-auto min-h-[80vh] relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>

      {/* Header Section */}
      <section className="text-center max-w-[700px] m-auto mb-12">
        <h1 className="text-[2.2rem] font-bold tracking-tight mb-4 text-text-primary">
          실시간 네이버 블로그 <span className="bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent">데이터 확인</span>
        </h1>
        <p className="text-text-secondary leading-relaxed text-[0.95rem] mb-8">
          네이버 검색 OpenAPI를 통해 최신 블로그 포스트 데이터를 실시간으로 가져옵니다.<br />
          검색어를 입력하거나 추천 태그를 클릭하여 다양한 섬 여행 관련 기록을 확인해 보세요.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-[500px] m-auto mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-full bg-white/3 border border-card-border hover:border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none rounded-full py-3.5 pl-11 pr-5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-br from-secondary to-primary text-black font-semibold px-6 rounded-full text-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            검색
          </button>
        </form>

        {/* Quick Tags */}
        <div className="flex gap-2 justify-center flex-wrap">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                query === tag
                  ? "bg-secondary/10 text-secondary border-secondary/30"
                  : "bg-white/3 text-text-secondary border-card-border hover:bg-white/8 hover:text-text-primary"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section>
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-text-secondary">네이버 블로그 데이터를 로딩 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="max-w-[500px] m-auto p-6 rounded-[16px] border border-red-500/20 bg-red-500/5 text-center mb-10">
            <span className="text-2xl mb-2 block">⚠️</span>
            <h3 className="font-semibold text-red-400 mb-1">데이터 로딩 오류</h3>
            <p className="text-xs text-text-secondary leading-normal">{error}</p>
            <button
              onClick={() => fetchBlogs(query)}
              className="mt-4 text-xs font-semibold text-secondary hover:underline cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20 glass-panel border border-card-border max-w-[500px] m-auto">
            <span className="text-3xl mb-3 block">📭</span>
            <p className="text-text-secondary text-sm">검색 결과가 없습니다.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, idx) => (
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                className="flex flex-col rounded-[20px] border border-card-border bg-card-bg hover:-translate-y-1.5 hover:border-card-hover-border hover:shadow-[0_15px_30px_rgba(0,0,0,0.3),0_0_15px_rgba(6,182,212,0.05)] group transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Blogger Name & Post Date */}
                  <div className="flex justify-between items-center text-xs text-text-muted mb-3.5">
                    <span className="font-medium text-secondary group-hover:underline">
                      ✍️ {cleanText(blog.bloggername)}
                    </span>
                    <span>{formatDate(blog.postdate)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[1.1rem] font-semibold mb-3 leading-snug text-text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                    {cleanText(blog.title)}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-text-secondary leading-relaxed mb-6 line-clamp-3">
                    {cleanText(blog.description)}
                  </p>

                  {/* Read More Link */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                    <span>블로그 원문 보기</span>
                    <span className="text-secondary group-hover:translate-x-1 transition-transform duration-300">
                      ➔
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
