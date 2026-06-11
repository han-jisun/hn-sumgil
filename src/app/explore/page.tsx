"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { trails } from "@/data";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Read URL params on load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL query parameters
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/explore?${params.toString()}`);
  };

  // Filter mock trails list based on category and search query
  const filteredTrails = trails.filter((trail) => {
    const matchesCategory = selectedCategory === "all" || trail.category === selectedCategory;
    const matchesSearch = 
      trail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: "all", label: "전체" },
    { value: "nature", label: "🌲 숲/자연" },
    { value: "ocean", label: "🌊 바다" },
    { value: "alley", label: "🧱 숨은 골목" },
    { value: "culture", label: "📚 문화/예술" },
  ];

  return (
    <div className="container m-auto">
      {/* Exploration Header & Search */}
      <section className="pt-[60px] pb-[40px] text-center">
        <h1 className="text-[2.2rem] font-bold mb-3 tracking-tight">한눈섬길 탐색하기</h1>
        <p className="text-base text-text-secondary max-w-[500px] mx-auto mb-8 leading-normal">
          당신만을 위해 준비된 섬들의 발걸음. 카테고리별 검색과 태그 매칭으로 마음에 쏙 드는 한눈섬길을 발견해보세요.
        </p>

        <div className="max-w-[600px] mx-auto relative flex items-center w-full">
          <input 
            type="text" 
            placeholder="길 이름, 지역, 키워드로 검색해보세요..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="peer w-full py-4 pl-[52px] pr-5 text-base bg-card-bg border border-card-border text-text-primary rounded-full font-sans transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] focus:bg-[#141423]/80"
          />
          <svg className="absolute left-5 text-text-muted pointer-events-none transition-colors duration-300 peer-focus:text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </section>

      {/* Category Tabs */}
      <nav aria-label="Category filter">
        <ul className="flex justify-center gap-3 mb-12 overflow-x-auto py-2 px-1 list-none [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() => handleCategoryChange(cat.value)}
                className={`py-2.5 px-5 border rounded-full text-[0.9rem] font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.value 
                    ? "bg-primary/10 text-primary border-primary/40 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                    : "bg-white/3 border-card-border text-text-secondary hover:bg-white/8 hover:text-text-primary"
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Trails Grid Listing */}
      <section className="pb-[100px]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
          {filteredTrails.length > 0 ? (
            filteredTrails.map((trail) => (
              <Link href={`/explore/${trail.id}`} key={trail.id} className="flex flex-col rounded-[20px] overflow-hidden border border-card-border bg-card-bg hover:-translate-y-1.5 hover:border-card-hover-border hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-300 h-full group">
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image 
                    src={trail.image} 
                    alt={trail.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-[#030307]/70 backdrop-blur-[4px] py-1 px-2.5 rounded-full text-[0.7rem] font-medium text-primary border border-primary/20">{trail.categoryLabel}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[1.2rem] font-semibold mb-1.5 text-text-primary">{trail.title}</h3>
                  <p className="text-[0.85rem] text-text-secondary leading-normal mb-4 line-clamp-2">{trail.description}</p>
                  
                  <div className="flex justify-between items-center pt-3.5 mt-auto border-t border-white/5 text-[0.75rem]">
                    <div className="flex gap-3">
                      <span className="text-text-secondary">⏱️ {trail.duration}</span>
                      <span className="text-text-secondary">📏 {trail.distance}</span>
                    </div>
                    <div className="flex items-center text-text-secondary group-hover:text-primary transition-colors duration-300">
                      <span className={`badge ${
                        trail.difficulty === "쉬움" ? "badge-easy" : 
                        trail.difficulty === "보통" ? "badge-medium" : "badge-hard"
                      }`}>
                        {trail.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 px-5 rounded-[20px] border border-dashed border-card-border text-text-secondary">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3>검색 결과가 없습니다</h3>
              <p>다른 키워드나 테마 카테고리를 선택해 보세요.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="container m-auto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-secondary)' }}>
        로딩 중...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
