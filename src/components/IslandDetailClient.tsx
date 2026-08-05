"use client";

import React, { useState, useEffect } from "react";
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

  return basePhotos[islandName] || [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=80"
  ];
};

const cleanText = (text: string) => {
  if (!text) return "";
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

interface IslandDetailProps {
  islandName: string;
}

export default function IslandDetailClient({ islandName }: IslandDetailProps) {
  const [island, setIsland] = useState<IslandData | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [lodges, setLodges] = useState<any[]>([]);
  const [campsites, setCampsites] = useState<any[]>([]);
  const [spots, setSpots] = useState<any[]>([]);
  const [tides, setTides] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  const [spotOverviews, setSpotOverviews] = useState<Record<string, { overview: string; homepage: string; tel: string; loading: boolean }>>({});

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ferry: true,
    restaurant: true,
    lodge: true,
    camping: true,
    trek: true,
    backpack: true,
    tide: true,
    spot: true,
    blog: true,
    youtube: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const found = (islandsData as IslandData[]).find((i) => i.island === islandName);
    setIsland(found || null);

    const rule = matchRules[islandName];

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const restRes = await fetch("/api/restaurant");
        if (restRes.ok) {
          const data = await restRes.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setRestaurants(filtered);
          }
        }

        const lodgeRes = await fetch("/api/lodge");
        if (lodgeRes.ok) {
          const data = await lodgeRes.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setLodges(filtered);
          }
        }

        const campRes = await fetch(`/api/camping?query=${encodeURIComponent(islandName)}`);
        if (campRes.ok) {
          const data = await campRes.json();
          if (data.success && data.items) {
            setCampsites(data.items);
          }
        }

        const spotRes = await fetch("/api/spot");
        if (spotRes.ok) {
          const data = await spotRes.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setSpots(filtered);
          }
        }

        const tideRes = await fetch(`/api/tide?island=${encodeURIComponent(islandName)}`);
        if (tideRes.ok) {
          const data = await tideRes.json();
          if (data.success && data.tides) {
            setTides(data.tides);
          }
        }

        const blogRes = await fetch(`/api/blog?query=${encodeURIComponent(islandName + " 여행")}&display=5`);
        if (blogRes.ok) {
          const data = await blogRes.json();
          if (data.success && data.items) {
            setBlogs(data.items.slice(0, 5));
          }
        }

        const youtubeRes = await fetch(`/api/youtube?query=${encodeURIComponent(islandName + " 여행")}&display=3`);
        if (youtubeRes.ok) {
          const data = await youtubeRes.json();
          if (data.success && data.items) {
            setVideos(data.items.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error loading island details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [islandName]);

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
          }
        }
      } catch (err) {
        console.error(`Failed to fetch spot detail for ${contentId}:`, err);
        setSpotOverviews(prev => ({
          ...prev,
          [contentId]: { overview: "상세 정보를 가져오는데 실패했습니다.", homepage: "", tel: "", loading: false }
        }));
      }
    }
  };

  const meta = islandMeta[islandName] || { backpacking: false, trekking: false, desc: "아름다운 인천 서해의 섬" };
  const photos = getGalleryPhotos(islandName);

  if (loading) {
    return (
      <div className="max-w-[900px] m-auto py-16 px-6">
        <div className="w-full h-80 rounded-2xl bg-[#F6F6F6] animate-pulse mb-8" />
        <div className="flex flex-col gap-6">
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
          <div className="h-20 rounded-xl bg-[#F6F6F6] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 pb-24 max-w-[900px] m-auto px-4 sm:px-6 text-[#282828]">
      
      {/* Back Button */}
      <Link 
        href="/explore" 
        className="inline-flex items-center gap-2 text-[#525252] text-xs mb-6 py-2 px-4 bg-white border border-[#D4D4D4] rounded-full hover:text-[#0F3E17] hover:border-[#0F3E17] transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        목록으로 돌아가기
      </Link>

      {/* Intro Header Card */}
      <section className="p-6 sm:p-8 rounded-2xl border border-[#D4D4D4] bg-white shadow-sm mb-8 flex flex-col gap-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {meta.backpacking && (
              <span className="py-1 px-3 rounded-full text-xs font-medium bg-[#E6FDE5] text-[#0F3E17]">
                🎒 백패킹 가능
              </span>
            )}
            {meta.trekking && (
              <span className="py-1 px-3 rounded-full text-xs font-medium bg-[#E7FAFF] text-[#0F3E17]">
                🥾 트레킹 가능
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-[#282828]">{islandName}</h1>
          <p className="text-base text-[#6A6A6A] leading-relaxed mb-4">{meta.desc}</p>
          <a 
            href={`https://map.naver.com/index.naver?query=${encodeURIComponent(island?.address || "")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-[#848484] inline-flex items-center gap-1 hover:text-[#0F3E17] hover:underline"
          >
            📍 주소: {island?.address} ↗
          </a>
        </div>

        {/* 4 Sample Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {photos.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square w-full rounded-lg overflow-hidden border border-[#D4D4D4] bg-[#EDEDED] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={`${islandName} 이미지 ${index + 1}`} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Collapsible Sections */}
      <div className="flex flex-col gap-6 w-full">

        {/* Ferry Route Info */}
        <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            type="button"
            onClick={() => toggleSection("ferry")}
            className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
          >
            <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
              ⚓ 여객선 운항 및 운임 정보
            </h3>
            <span className={`text-[#848484] transition-transform duration-300 ${openSections.ferry ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          
          {openSections.ferry && (
            <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {island?.ferries.map((ferry, idx) => (
                  <div key={idx} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-[#D4D4D4] pb-2">
                      <span className="text-xs text-[#282828] font-bold">{idx + 1}번 노선</span>
                      <span className="text-[11px] text-[#848484]">왕복 기준</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-[#6A6A6A]">⏱️ 소요 시간</span>
                      <span className="text-[#282828] font-bold">{ferry.time}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6A6A6A]">💵 여객 운임</span>
                      <span className="text-[#0F3E17] font-bold">{ferry.fare}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-2">
                <a 
                  href="https://island.theksa.co.kr/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto text-center px-8 py-3 rounded-lg bg-[#0F3E17] text-white font-medium text-sm hover:bg-[#093712] transition-all shadow"
                >
                  🚢 여객 실시간 예매하러 가기 ➔
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Restaurants Info */}
        {restaurants.length > 0 && (
          <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              type="button"
              onClick={() => toggleSection("restaurant")}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
                🍽️ 주변 식당 정보 ({restaurants.length}개)
              </h3>
              <span className={`text-[#848484] transition-transform duration-300 ${openSections.restaurant ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            
            {openSections.restaurant && (
              <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {restaurants.map((rest: any, idx: number) => (
                    <div key={idx} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#282828] text-sm truncate max-w-[70%]">{rest.bsshNm}</span>
                        <span className="text-[11px] bg-[#E6FDE5] text-[#0F3E17] px-2 py-0.5 rounded font-medium">
                          {rest.type || "일반음식점"}
                        </span>
                      </div>
                      <a 
                        href={`https://map.naver.com/index.naver?query=${encodeURIComponent(rest.addr)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📍 주소: {rest.addr} ↗
                      </a>
                      {rest.tel && <span className="text-[#848484]">📞 전화번호: {rest.tel}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lodges Info */}
        {lodges.length > 0 && (
          <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              type="button"
              onClick={() => toggleSection("lodge")}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
                🏡 주변 숙박업소 현황 ({lodges.length}개)
              </h3>
              <span className={`text-[#848484] transition-transform duration-300 ${openSections.lodge ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            
            {openSections.lodge && (
              <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {lodges.map((lodge: any, idx: number) => (
                    <div key={idx} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-1 text-xs">
                      <span className="font-bold text-[#282828] text-sm">{lodge.bsshNm}</span>
                      <a 
                        href={`https://map.naver.com/index.naver?query=${encodeURIComponent(lodge.addr)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📍 주소: {lodge.addr} ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campsites Info */}
        {campsites.length > 0 && (
          <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              type="button"
              onClick={() => toggleSection("camping")}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
                ⛺ 야영장 정보 ({campsites.length}개)
              </h3>
              <span className={`text-[#848484] transition-transform duration-300 ${openSections.camping ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            
            {openSections.camping && (
              <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campsites.map((camp: any, idx: number) => (
                    <div key={idx} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#0F3E17] text-sm">{camp.facltNm}</span>
                        <span className="text-[11px] bg-white text-[#525252] px-2 py-0.5 rounded border border-[#D4D4D4]">
                          {camp.induty || "일반야영장"}
                        </span>
                      </div>
                      {camp.addr1 && (
                        <a 
                          href={`https://map.naver.com/index.naver?query=${encodeURIComponent(camp.addr1)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#6A6A6A] hover:text-[#0F3E17] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 {camp.addr1} ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tide Info */}
        <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            type="button"
            onClick={() => toggleSection("tide")}
            className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
          >
            <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
              🌊 실시간 3일 조석(물때) 정보
            </h3>
            <span className={`text-[#848484] transition-transform duration-300 ${openSections.tide ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          
          {openSections.tide && (
            <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              <p className="text-xs text-[#848484] mb-4">
                * 갯벌체험 및 해안 탐방 시 간조(물 빠짐) 시간을 반드시 참고하세요.
              </p>
              {tides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tides.map((tide, index) => (
                    <div key={index} className="p-4 rounded-lg border border-[#D4D4D4] bg-[#F6F6F6] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#D4D4D4]">
                          <span className="text-xs font-bold text-[#282828]">{tide.date}</span>
                          <span className="text-[11px] text-[#848484]">{tide.lunarDate}</span>
                        </div>
                        <div className="flex flex-col gap-2 text-xs">
                          {tide.tideTime.map((event: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                event.type === '고조' ? 'bg-[#FFF1F0] text-[#E5484D]' : 'bg-[#E7FAFF] text-[#0F3E17]'
                              }`}>{event.type}</span>
                              <span className="font-semibold text-[#282828]">{event.time}</span>
                              <span className="text-[#848484]">{event.height}cm</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#D4D4D4] text-xs font-bold text-[#0F3E17] text-center">
                        {tide.waterLevel}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#848484]">물때 정보를 불러오지 못했습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* Spots Info */}
        {spots.length > 0 && (
          <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              type="button"
              onClick={() => toggleSection("spot")}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
                📸 섬내 추천 관광 명소 ({spots.length}개)
              </h3>
              <span className={`text-[#848484] transition-transform duration-300 ${openSections.spot ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            
            {openSections.spot && (
              <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spots.map((spot: any) => {
                    const isExpanded = expandedSpotId === spot.contentId;
                    const details = spotOverviews[spot.contentId];
                    return (
                      <div 
                        key={spot.contentId} 
                        onClick={() => handleSpotClick(spot.contentId)}
                        className={`border rounded-lg overflow-hidden bg-[#F6F6F6] cursor-pointer hover:border-[#0F3E17] transition-all flex flex-col ${
                          isExpanded ? "border-[#0F3E17] bg-white shadow-md col-span-1 sm:col-span-2" : "border-[#D4D4D4]"
                        }`}
                      >
                        <div className="flex gap-4 p-4 items-center">
                          {spot.firstImage ? (
                            <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 border border-[#D4D4D4]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={spot.firstImage} 
                                alt={spot.title} 
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded bg-white flex items-center justify-center shrink-0 border border-[#D4D4D4] text-xl">
                              🏞️
                            </div>
                          )}
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="font-bold text-[#282828] text-sm truncate">{spot.title}</span>
                            <a 
                              href={`https://map.naver.com/index.naver?query=${encodeURIComponent(spot.addr)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-[#848484] truncate hover:text-[#0F3E17] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📍 {spot.addr} ↗
                            </a>
                          </div>
                          <span className={`text-[#848484] transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`}>
                            ▼
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-[#EDEDED] pt-3 bg-white text-xs text-[#525252] leading-relaxed">
                            {details?.loading ? (
                              <div className="flex items-center gap-2 text-[#848484] py-2">
                                상세 설명 정보 불러오는 중...
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2.5">
                                <p className="whitespace-pre-line text-xs">{details?.overview}</p>
                                {(details?.homepage || details?.tel) && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-[#EDEDED] text-xs text-[#848484]">
                                    {details.tel && <span>📞 문의: {details.tel}</span>}
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

        {/* Blog Reviews Section (5건) */}
        <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            type="button"
            onClick={() => toggleSection("blog")}
            className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
          >
            <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
              📚 네이버 블로그 최신 후기 ({blogs.length}건)
            </h3>
            <span className={`text-[#848484] transition-transform duration-300 ${openSections.blog ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          
          {openSections.blog && (
            <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              {blogs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {blogs.map((blog: any, bIdx: number) => (
                    <a
                      key={bIdx}
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border border-[#D4D4D4] bg-[#F6F6F6] hover:bg-[#E6FDE5]/40 hover:border-[#0F3E17] transition-all flex flex-col gap-1.5"
                    >
                      <h4 className="text-sm font-bold text-[#282828] hover:text-[#0F3E17] line-clamp-1">
                        {cleanText(blog.title)}
                      </h4>
                      <p className="text-xs text-[#6A6A6A] line-clamp-2 leading-relaxed">
                        {cleanText(blog.description)}
                      </p>
                      <div className="flex justify-between items-center text-[11px] text-[#848484] pt-1">
                        <span>✍️ {cleanText(blog.bloggername)}</span>
                        <span>{formatDate(blog.postdate)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#848484]">불러올 블로그 글이 없습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* YouTube Video Section (3건) */}
        <div className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            type="button"
            onClick={() => toggleSection("youtube")}
            className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
          >
            <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
              📺 생생 유튜브 영상 가이드 ({videos.length}건)
            </h3>
            <span className={`text-[#848484] transition-transform duration-300 ${openSections.youtube ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          
          {openSections.youtube && (
            <div className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {videos.map((video: any, vIdx: number) => (
                    <div
                      key={video.id || vIdx}
                      onClick={() => setActiveVideo(video.embedUrl || video.url)}
                      className="group cursor-pointer border border-[#D4D4D4] rounded-xl overflow-hidden bg-[#F6F6F6] hover:border-[#0F3E17] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.img || video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#0F3E17]/90 text-white flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform">
                            ▶
                          </div>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1">
                        <h4 className="text-xs font-bold text-[#282828] group-hover:text-[#0F3E17] line-clamp-2 leading-snug">
                          {cleanText(video.title)}
                        </h4>
                        <span className="text-[11px] text-[#848484]">{video.channelName || video.meta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#848484]">불러올 유튜브 영상이 없습니다.</div>
              )}
            </div>
          )}
        </div>

        {/* YouTube Video Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                ✕
              </button>
              <iframe
                src={activeVideo}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
