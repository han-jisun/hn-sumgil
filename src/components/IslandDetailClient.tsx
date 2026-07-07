"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import islandsData from "@/app/data/islands.json";

interface IslandFerry {
  time: string;
  fare: string;
}

interface IslandData {
  island: string;
  address: string;
  areaCode: number;
  sigunguCode: number;
  ferries: IslandFerry[];
}

const islandImages: Record<string, string> = {
  "굴업도": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
  "대연평": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
  "대이작도": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80",
  "대청도": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80",
  "덕적도": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
  "문갑도": "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=600&auto=format&fit=crop&q=80",
  "백령도": "https://images.unsplash.com/photo-1473116763269-25544899376c?w=600&auto=format&fit=crop&q=80",
  "백아도": "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=600&auto=format&fit=crop&q=80",
  "소연평": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&auto=format&fit=crop&q=80",
  "소이작도": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&auto=format&fit=crop&q=80",
  "소청도": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
  "승봉도": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&auto=format&fit=crop&q=80",
  "울도": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80",
  "자월도": "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&auto=format&fit=crop&q=80",
  "지도": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
  "소야도": "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f?w=600&auto=format&fit=crop&q=80"
};

const islandMeta: Record<string, { backpacking: boolean; trekking: boolean; desc: string }> = {
  "굴업도": { backpacking: true, trekking: true, desc: "한국의 갈라파고스라 불리는 백패킹의 성지 개머리언덕과 해안 절벽" },
  "대연평": { backpacking: false, trekking: true, desc: "평화기념관과 조기역사관이 있는 서해 최북단의 평화로운 섬" },
  "대이작도": { backpacking: true, trekking: true, desc: "썰물 때만 나타나는 신비의 모래섬 풀등과 울창한 해송 숲길" },
  "대청도": { backpacking: true, trekking: true, desc: "옥빛 바다와 한국 유일의 활동성 모래사막이 어우러진 비경" },
  "덕적도": { backpacking: true, trekking: true, desc: "해송 숲과 드넓은 백사장이 어우러진 캠핑과 휴양의 대표 섬" },
  "문갑도": { backpacking: true, trekking: true, desc: "한적하고 때 묻지 않은 깃대봉 등산로와 독특한 돌담 골목길" },
  "백령도": { backpacking: false, trekking: true, desc: "심청이의 설화와 천연기념물 사곶사빈, 비경의 두무진 절벽" },
  "백아도": { backpacking: true, trekking: true, desc: "발전소 마을 앞 절경과 남조봉 기차바위가 있는 고요한 비박지" },
  "소연평": { backpacking: false, trekking: true, desc: "얼굴바위와 깨끗한 포구가 맞이하는 때 묻지 않은 소박한 섬" },
  "소이작도": { backpacking: true, trekking: true, desc: "해안을 따라 이어진 갯티길과 손가락 바위의 신비로운 형상" },
  "소청도": { backpacking: true, trekking: true, desc: "분바위와 푸른 하늘 아래 우뚝 솟은 등대가 지키는 고요의 섬" },
  "승봉도": { backpacking: true, trekking: true, desc: "울창한 산림과 이일레 해수욕장, 촛대바위 등 기암괴석의 향연" },
  "울도": { backpacking: true, trekking: true, desc: "덕적 군도 최서단의 신비로운 비경과 낚시꾼들이 사랑하는 해안" },
  "자월도": { backpacking: true, trekking: true, desc: "붉은 달빛의 장골 해변과 조용히 은빛 물결이 부서지는 휴식처" },
  "지도": { backpacking: true, trekking: true, desc: "개발되지 않아 때 묻지 않은 순수한 서해안의 보물 같은 작은 섬" },
  "소야도": { backpacking: true, trekking: true, desc: "덕적도와 다리로 이어진 조용하고 한적한 떼뿌리 캠핑 천국" }
};

const matchRules: Record<string, (addr: string) => boolean> = {
  "굴업도": (addr) => addr.includes("굴업"),
  "대연평": (addr) => addr.includes("연평") && !addr.includes("소연평"),
  "대이작도": (addr) => addr.includes("이작") && !addr.includes("소이작"),
  "대청도": (addr) => addr.includes("대청") && !addr.includes("소청"),
  "덕적도": (addr) => (addr.includes("덕적") || addr.includes("진리")) && 
                      !["굴업", "문갑", "백아", "울도", "지도", "소야", "북도"].some(x => addr.includes(x)),
  "문갑도": (addr) => addr.includes("문갑"),
  "백령도": (addr) => addr.includes("백령"),
  "백아도": (addr) => addr.includes("백아"),
  "소연평": (addr) => addr.includes("소연평"),
  "소이작도": (addr) => addr.includes("소이작"),
  "소청도": (addr) => addr.includes("소청"),
  "승봉도": (addr) => addr.includes("승봉"),
  "울도": (addr) => addr.includes("울도"),
  "자월도": (addr) => addr.includes("자월") && !["이작", "승봉"].some(x => addr.includes(x)),
  "지도": (addr) => addr.includes("지도리") || (addr.includes("지도") && addr.includes("덕적")),
  "소야도": (addr) => addr.includes("소야")
};

// Returns 4 unique coastal/island sample photos based on name seeding
const getGalleryPhotos = (islandName: string): string[] => {
  const basePhotos: Record<string, string[]> = {
    "굴업도": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473116763269-25544899376c?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&auto=format&fit=crop&q=80"
    ],
    "대이작도": [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=500&auto=format&fit=crop&q=80"
    ],
    "덕적도": [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f?w=500&auto=format&fit=crop&q=80"
    ]
  };

  if (basePhotos[islandName]) {
    return basePhotos[islandName];
  }

  const hashes = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    "https://images.unsplash.com/photo-1473116763269-25544899376c",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
    "https://images.unsplash.com/photo-1520121401995-928cd50d4e27",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1468413253725-0d5181091126",
    "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401"
  ];

  const seed = islandName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const picked = [];
  for (let i = 0; i < 4; i++) {
    const idx = (seed + i * 3) % hashes.length;
    picked.push(`${hashes[idx]}?w=500&auto=format&fit=crop&q=80`);
  }
  return picked;
};

interface IslandDetailClientProps {
  islandName: string;
}

export default function IslandDetailClient({ islandName }: IslandDetailClientProps) {
  const island = (islandsData as IslandData[]).find(i => i.island === islandName);
  const meta = islandMeta[islandName] || { backpacking: false, trekking: false, desc: "아름다운 인천의 섬" };
  const photos = getGalleryPhotos(islandName);

  const [lodges, setLodges] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [campsites, setCampsites] = useState<any[]>([]);
  const [tides, setTides] = useState<any[]>([]);
  const [spots, setSpots] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [trekBlogs, setTrekBlogs] = useState<any[]>([]);
  const [backpackBlogs, setBackpackBlogs] = useState<any[]>([]);

  const [spotOverviews, setSpotOverviews] = useState<Record<string, { overview: string; homepage: string; tel: string; loading: boolean }>>({});
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ferry: true,
    restaurant: false,
    lodge: false,
    camping: false,
    trek: false,
    backpack: false,
    tide: true,
    spot: false,
    blog: false,
    youtube: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSpotClick = async (contentId: string) => {
    if (expandedSpotId === contentId) {
      setExpandedSpotId(null);
      return;
    }
    setExpandedSpotId(contentId);
    
    if (!spotOverviews[contentId]) {
      setSpotOverviews(prev => ({
        ...prev,
        [contentId]: { overview: "", homepage: "", tel: "", loading: true }
      }));
      
      try {
        const res = await fetch(`/api/spot?contentId=${contentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.detail) {
            setSpotOverviews(prev => ({
              ...prev,
              [contentId]: { 
                overview: data.detail.overview, 
                homepage: data.detail.homepage, 
                tel: data.detail.tel, 
                loading: false 
              }
            }));
            return;
          }
        }
        throw new Error("Failed to load details");
      } catch (err) {
        setSpotOverviews(prev => ({
          ...prev,
          [contentId]: { 
            overview: "설명 정보를 불러오지 못했습니다.", 
            homepage: "", 
            tel: "", 
            loading: false 
          }
        }));
      }
    }
  };

  useEffect(() => {
    if (!island) {
      setError("섬 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [lodgeRes, restRes, spotRes, campRes, tideRes, blogRes, youtubeRes, trekBlogRes, backpackBlogRes] = await Promise.all([
          fetch("/api/lodge").then(r => r.json()).catch(() => ({ success: false, items: [] })),
          fetch("/api/restaurant").then(r => r.json()).catch(() => ({ success: false, items: [] })),
          fetch("/api/spot").then(r => r.json()).catch(() => ({ success: false, items: [] })),
          fetch(`/api/camping?query=${encodeURIComponent(islandName)}`).then(r => r.json()).catch(() => ({ success: false, items: [] })),
          fetch(`/api/tide?island=${encodeURIComponent(islandName)}`).then(r => r.json()).catch(() => ({ success: false, tides: [] })),
          fetch(`/api/blog?query=${encodeURIComponent(islandName + " 여행")}`).then(r => r.json()).catch(() => ({ success: false, items: [] })),
          fetch(`/api/youtube?query=${encodeURIComponent(islandName + " 여행")}`).then(r => r.json()).catch(() => ({ success: false, videos: [] })),
          meta.trekking ? fetch(`/api/blog?query=${encodeURIComponent(islandName + " 트레킹")}&display=50`).then(r => r.json()).catch(() => ({ success: false, items: [] })) : Promise.resolve({ success: false, items: [] }),
          meta.backpacking ? fetch(`/api/blog?query=${encodeURIComponent(islandName + " 백패킹")}&display=50`).then(r => r.json()).catch(() => ({ success: false, items: [] })) : Promise.resolve({ success: false, items: [] })
        ]);

        // 1. Lodges
        if (lodgeRes.success && Array.isArray(lodgeRes.items)) {
          const rule = matchRules[islandName];
          const matched = lodgeRes.items.filter((item: any) => 
            rule ? rule(item.addr) : item.addr.includes(islandName)
          );
          setLodges(matched);
        }

        // 2. Restaurants
        if (restRes.success && Array.isArray(restRes.items)) {
          const rule = matchRules[islandName];
          const matched = restRes.items.filter((item: any) => 
            rule ? rule(item.addr) : item.addr.includes(islandName)
          );
          setRestaurants(matched);
        }

        // 3. Spots
        if (spotRes.success && Array.isArray(spotRes.items)) {
          const rule = matchRules[islandName];
          const matched = spotRes.items.filter((item: any) => 
            rule ? rule(item.addr) : item.addr.includes(islandName)
          );
          setSpots(matched);
        }

        // 4. Campsites
        if (campRes.success && Array.isArray(campRes.items)) {
          setCampsites(campRes.items);
        }

        // 5. Tides
        if (tideRes.success && Array.isArray(tideRes.tides)) {
          setTides(tideRes.tides);
        }

        // 6. Blog reviews (Top 4)
        if (blogRes.items && Array.isArray(blogRes.items)) {
          setBlogs(blogRes.items.slice(0, 4));
        }

        // 7. Youtube (Top 3)
        if (youtubeRes.videos && Array.isArray(youtubeRes.videos)) {
          setVideos(youtubeRes.videos.slice(0, 3));
        }

        // 8. Trekking blogs (Top 3 recent)
        if (trekBlogRes.items && Array.isArray(trekBlogRes.items)) {
          const sorted = [...trekBlogRes.items].sort((a: any, b: any) => b.postdate.localeCompare(a.postdate));
          setTrekBlogs(sorted.slice(0, 3));
        }

        // 9. Backpacking blogs (Top 3 recent)
        if (backpackBlogRes.items && Array.isArray(backpackBlogRes.items)) {
          const sorted = [...backpackBlogRes.items].sort((a: any, b: any) => b.postdate.localeCompare(a.postdate));
          setBackpackBlogs(sorted.slice(0, 3));
        }

      } catch (err: any) {
        console.error(err);
        setError("데이터를 로드하는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [islandName, island]);

  if (error) {
    return (
      <div className="container m-auto py-24 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">{error}</h2>
        <Link href="/explore" className="text-primary hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container m-auto py-16 px-6 max-w-[900px]">
        <div className="w-full h-[350px] rounded-[24px] bg-white/5 animate-pulse mb-8"></div>
        <div className="flex flex-col gap-6">
          <div className="h-[80px] rounded-[16px] bg-white/5 animate-pulse"></div>
          <div className="h-[80px] rounded-[16px] bg-white/5 animate-pulse"></div>
          <div className="h-[80px] rounded-[16px] bg-white/5 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 pb-[100px] container m-auto px-4 sm:px-6 max-w-[900px]">
      
      {/* Back Button */}
      <Link 
        href="/explore" 
        className="inline-flex items-center gap-2 text-text-secondary text-[0.8rem] mb-6 py-1.5 px-4 bg-white/3 border border-card-border rounded-full hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        목록으로 돌아가기
      </Link>

      {/* 1) 섬정보 Card (Intro block with address, desc, 4 photos) */}
      <section className="p-5 md:p-8 rounded-[24px] border border-card-border bg-[#0a0a0f]/80 glass-panel shadow-2xl mb-8 flex flex-col gap-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {meta.backpacking && (
              <span className="py-1 px-3 rounded-full text-[0.65rem] font-bold bg-primary/10 text-primary border border-primary/20">
                🎒 백패킹 가능
              </span>
            )}
            {meta.trekking && (
              <span className="py-1 px-3 rounded-full text-[0.65rem] font-bold bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20">
                🥾 트레킹 가능
              </span>
            )}
          </div>
          <h1 className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.8rem] font-bold mb-2 tracking-tight text-white">{islandName}</h1>
          <p className="text-[0.9rem] md:text-[1rem] text-text-secondary leading-relaxed mb-4">{meta.desc}</p>
          <a 
            href={`https://map.naver.com/index.naver?query=${encodeURIComponent(island?.address || "")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[0.75rem] text-text-muted flex items-center gap-1 hover:text-primary hover:underline transition-colors duration-200"
          >
            📍 주소: {island?.address} ↗
          </a>
        </div>

        {/* 4 Sample Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {photos.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/5 bg-[#12121e] group"
            >
              <img 
                src={url} 
                alt={`${islandName} 갤러리 이미지 ${index + 1}`} 
                className="object-cover w-full h-full transition duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Collapsible Sections (Structured Vertical Layout) */}
      <div className="flex flex-col gap-6 w-full">

        {/* 2) 여객 운임 정보 */}
        <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection("ferry")}
            className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
          >
            <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
              ⚓ 여객선 운항 및 운임 정보
            </h3>
            <span className={`text-text-muted transition-transform duration-300 ${openSections.ferry ? "rotate-180" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          
          {openSections.ferry && (
            <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {island?.ferries.map((ferry, idx) => (
                  <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs text-text-primary font-bold">{idx + 1}번 노선</span>
                      <span className="text-[0.65rem] text-text-muted">왕복 기준</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-text-secondary">⏱️ 소요 시간</span>
                      <span className="text-text-primary font-bold">{ferry.time}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-secondary">💵 여객 운임</span>
                      <span className="text-primary font-bold">{ferry.fare}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <a 
                  href="https://island.theksa.co.kr/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto text-center px-8 py-3 rounded-xl bg-primary text-black font-extrabold text-xs transition duration-300 hover:bg-primary/90 hover:scale-[1.02] shadow-[0_4px_16px_rgba(14,165,233,0.3)]"
                >
                  🚢 여객 실시간 예매하러 가기 ➔
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 3) 식당 정보 (식당이 있을 때만 탭 생성) */}
        {restaurants.length > 0 && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("restaurant")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                🍽️ 주변 식당 정보 ({restaurants.length}개)
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.restaurant ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.restaurant && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {restaurants.map((rest: any, idx: number) => (
                    <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-text-primary text-[0.8rem] truncate max-w-[70%]">{rest.bsshNm}</span>
                        <span className="text-[0.6rem] bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                          {rest.type || "일반음식점"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-[0.65rem] text-text-secondary">
                        <a 
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(rest.addr)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 주소: {rest.addr} ↗
                        </a>
                        {rest.tel && <span>📞 전화번호: {rest.tel}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4) 숙박 정보 (숙박이 있을 때만 탭 생성) */}
        {lodges.length > 0 && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("lodge")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                🏡 주변 숙박업소 현황 ({lodges.length}개)
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.lodge ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.lodge && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {lodges.map((lodge: any, idx: number) => (
                    <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-text-primary text-[0.8rem]">{lodge.bsshNm}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-[0.65rem] text-text-secondary">
                        <a 
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(lodge.addr)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 주소: {lodge.addr} ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5) 야영장 정보 (야영장 정보가 있을 때만 탭 생성) */}
        {campsites.length > 0 && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("camping")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                ⛺ 야영장 정보 ({campsites.length}개)
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.camping ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.camping && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {campsites.map((camp: any, idx: number) => (
                    <div key={idx} className="bg-[#12121e]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-primary">{camp.facltNm}</span>
                        <span className="text-[0.6rem] bg-white/5 text-text-muted px-2 py-0.5 rounded border border-white/5">
                          {camp.induty || "일반야영장"}
                        </span>
                      </div>
                      {camp.addr1 && (
                        <a 
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(camp.addr1)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-text-muted text-[0.65rem] truncate hover:text-primary hover:underline transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 {camp.addr1} ↗
                        </a>
                      )}
                      {camp.sbrsCl && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {camp.sbrsCl.split(",").slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-[0.55rem] bg-white/3 text-text-secondary px-1.5 py-0.5 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6) 트레킹 정보 (트레킹 유무가 "유" 일때만 탭 생성, 최근 3건 여행기) */}
        {meta.trekking && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("trek")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                🥾 트레킹 정보
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.trek ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.trek && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                {trekBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {trekBlogs.map((blog, idx) => (
                      <a 
                        key={idx} 
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-[#12121e]/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between gap-3 group cursor-pointer"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h4 
                              className="text-[0.725rem] font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                              dangerouslySetInnerHTML={{ __html: blog.title }}
                            />
                          </div>
                          <p 
                            className="text-[0.65rem] text-text-secondary line-clamp-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[0.6rem] text-text-muted mt-2 pt-2 border-t border-white/5 gap-2 min-w-0">
                          <span className="truncate">👤 {blog.bloggername}</span>
                          <span className="shrink-0">{blog.postdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-text-muted">최근 트레킹 여행기 정보가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 7) 백패킹 정보 (백패킹 유무가 "유" 일때만 탭 생성, 최근 3건 여행기) */}
        {meta.backpacking && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("backpack")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                🎒 백패킹 정보
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.backpack ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.backpack && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                {backpackBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {backpackBlogs.map((blog, idx) => (
                      <a 
                        key={idx} 
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-[#12121e]/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between gap-3 group cursor-pointer"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h4 
                              className="text-[0.725rem] font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                              dangerouslySetInnerHTML={{ __html: blog.title }}
                            />
                          </div>
                          <p 
                            className="text-[0.65rem] text-text-secondary line-clamp-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[0.6rem] text-text-muted mt-2 pt-2 border-t border-white/5 gap-2 min-w-0">
                          <span className="truncate">👤 {blog.bloggername}</span>
                          <span className="shrink-0">{blog.postdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-text-muted">최근 백패킹 여행기 정보가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 8) 물때 정보 (항상 표시) */}
        <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection("tide")}
            className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
          >
            <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
              🌊 실시간 3일 조석(물때) 정보
            </h3>
            <span className={`text-text-muted transition-transform duration-300 ${openSections.tide ? "rotate-180" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          
          {openSections.tide && (
            <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
              <p className="text-[0.7rem] text-text-muted mb-4">
                * 본 데이터는 천문학적 주기에 근거하여 시뮬레이션 계산된 정보입니다. 갯벌체험 및 해안 탐방 시 간조(물 빠짐) 시간을 반드시 참고하세요.
              </p>
              {tides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tides.map((tide, index) => (
                    <div key={index} className="p-4 rounded-xl border border-white/5 bg-[#12121e]/80 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                          <span className="text-xs font-bold text-text-primary">{tide.date}</span>
                          <span className="text-[0.6rem] text-text-muted font-medium">{tide.lunarDate}</span>
                        </div>
                        <div className="flex flex-col gap-2 text-[0.7rem]">
                          {tide.tideTime.map((event: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className={`px-1.5 py-0.5 rounded text-[0.55rem] font-bold ${
                                event.type === '고조' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                              }`}>{event.type}</span>
                              <span className="font-semibold text-text-primary">{event.time}</span>
                              <span className="text-text-muted">{event.height}cm</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/5 text-[0.6rem] font-bold text-secondary text-center">
                        {tide.waterLevel}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-text-muted">물때 정보를 불러오지 못했습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* 9) 섬내 가볼만한 관광지 (관광지가 있을때만 탭 생성, 설명/주소/사진 포함) */}
        {spots.length > 0 && (
          <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggleSection("spot")}
              className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
            >
              <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                📸 섬내 추천 관광 명소 ({spots.length}개)
              </h3>
              <span className={`text-text-muted transition-transform duration-300 ${openSections.spot ? "rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </button>
            
            {openSections.spot && (
              <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spots.map((spot: any) => {
                    const isExpanded = expandedSpotId === spot.contentId;
                    const details = spotOverviews[spot.contentId];
                    return (
                      <div 
                        key={spot.contentId} 
                        onClick={() => handleSpotClick(spot.contentId)}
                        className={`border rounded-xl overflow-hidden bg-[#12121e]/80 cursor-pointer hover:border-primary/40 transition-all duration-300 flex flex-col ${
                          isExpanded ? "border-primary/40 shadow-[0_4px_20px_rgba(14,165,233,0.15)] col-span-1 sm:col-span-2" : "border-white/5"
                        }`}
                      >
                        <div className="flex gap-4 p-4 items-center">
                          {spot.firstImage ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
                              <img 
                                src={spot.firstImage} 
                                alt={spot.title} 
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 text-[1.2rem]">
                              🏞️
                            </div>
                          )}
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <span className="font-bold text-text-primary text-[0.8rem] truncate">{spot.title}</span>
                            <a 
                              href={`https://map.naver.com/index.naver?query=${encodeURIComponent(spot.addr)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[0.65rem] text-text-muted truncate hover:text-primary hover:underline transition-colors duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📍 {spot.addr} ↗
                            </a>
                          </div>
                          <span className={`text-text-muted transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-white/5 pt-3 bg-[#0a0a0f]/40 text-xs text-text-secondary leading-relaxed animate-fadeIn">
                            {details?.loading ? (
                              <div className="flex items-center gap-2 text-text-muted py-2">
                                <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                                상세 설명 정보 불러오는 중...
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2.5">
                                <p className="whitespace-pre-line text-[0.7rem]">{details?.overview}</p>
                                {(details?.homepage || details?.tel) && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2.5 border-t border-white/5 text-[0.65rem] text-text-muted">
                                    {details.tel && <span>📞 문의: {details.tel}</span>}
                                    {details.homepage && (
                                      <div 
                                        dangerouslySetInnerHTML={{ __html: details.homepage }}
                                        className="text-primary hover:underline flex items-center gap-1 [&_a]:text-primary [&_a]:hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
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
        )}

        {/* 10) 블로그 리뷰 (정확도/인기순 4건) */}
        <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection("blog")}
            className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
          >
            <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
              📚 네이버 블로그 리뷰
            </h3>
            <span className={`text-text-muted transition-transform duration-300 ${openSections.blog ? "rotate-180" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          
          {openSections.blog && (
            <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
              {blogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blogs.map((blog, idx) => (
                    <a 
                      key={idx} 
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border border-white/5 bg-[#12121e]/60 hover:border-primary/30 transition-all duration-300 flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <h4 
                          className="text-[0.75rem] font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 leading-snug"
                          dangerouslySetInnerHTML={{ __html: blog.title }}
                        />
                        <span className="text-[0.6rem] text-text-muted shrink-0">
                          {blog.postdate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                        </span>
                      </div>
                      <p 
                        className="text-[0.65rem] text-text-secondary line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />
                      <span className="text-[0.6rem] text-text-muted font-semibold truncate block">
                        👤 {blog.bloggername}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-text-muted">블로그 리뷰 정보를 로드할 수 없습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* 11) 유튜브 영상 (정확도/인기순 3건) */}
        <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection("youtube")}
            className="w-full p-5 md:p-8 flex justify-between items-center text-left hover:bg-white/2 transition duration-200 cursor-pointer outline-none border-none"
          >
            <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
              📺 생생 유튜브 인기 영상 (3건)
            </h3>
            <span className={`text-text-muted transition-transform duration-300 ${openSections.youtube ? "rotate-180" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          
          {openSections.youtube && (
            <div className="px-5 pb-5 md:px-8 md:pb-8 border-t border-white/5 pt-6 animate-fadeIn">
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <a 
                      key={video.videoId} 
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col rounded-xl overflow-hidden border border-white/5 bg-[#12121e]/60 hover:border-primary/30 transition duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="object-cover w-full h-full transition duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[0.55rem] font-bold text-white">
                          {video.lengthText}
                        </span>
                      </div>
                      <div className="p-3.5 flex flex-col gap-1">
                        <h4 className="text-[0.7rem] font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {video.title}
                        </h4>
                        <div className="flex justify-between items-center text-[0.55rem] text-text-muted mt-1">
                          <span className="font-semibold">{video.ownerText}</span>
                          <div className="flex gap-1.5">
                            <span>{video.viewCountText}</span>
                            <span>{video.publishedTimeText}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-text-muted">유튜브 영상을 로드할 수 없습니다.</div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
