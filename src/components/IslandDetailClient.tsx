"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import islandsData from "@/app/data/islands.json";
import imageData from "@/app/data/image.json";

const islandIdMap: Record<string, string> = {
  "굴업도": "gureopdo",
  "대연평": "daeyeonpyeong",
  "대이작도": "daeijakdo",
  "대청도": "daecheongdo",
  "덕적도": "deokjeokdo",
  "문갑도": "mungapdo",
  "백령도": "baengnyeongdo",
  "백아도": "baegado",
  "소연평": "soyeonpyeong",
  "소이작도": "soijakdo",
  "소청도": "socheongdo",
  "승봉도": "seungbongdo",
  "울도": "uldo",
  "자월도": "jawoldo",
  "지도": "jido",
  "소야도": "soyado"
};

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

const defaultIslandImages: Record<string, string> = {
  "굴업도": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  "대연평": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
  "대이작도": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80",
  "대청도": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=80",
  "덕적도": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
  "문갑도": "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800&auto=format&fit=crop&q=80",
  "백령도": "https://images.unsplash.com/photo-1473116763269-25544899376c?w=800&auto=format&fit=crop&q=80",
  "백아도": "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?w=800&auto=format&fit=crop&q=80",
  "소연평": "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&auto=format&fit=crop&q=80",
  "소이작도": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80",
  "소청도": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  "승봉도": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&auto=format&fit=crop&q=80",
  "울도": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
  "자월도": "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&auto=format&fit=crop&q=80",
  "지도": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
  "소야도": "https://images.unsplash.com/photo-1469620790379-48bc1fc8d99f?w=800&auto=format&fit=crop&q=80"
};

const getGalleryPhotos = (islandName: string): string[] => {
  const key = islandIdMap[islandName];
  const item = key ? (imageData as Record<string, { name: string; images: string[] }>)[key] : null;

  if (item && item.images && item.images.length > 0) {
    return item.images.slice(0, 4);
  }

  return [];
};

const presetIslandSpots: Record<string, any[]> = {
  "굴업도": [
    { contentId: "preset-gulup-1", title: "개머리언덕", addr: "인천 옹진군 덕적면 굴업리", overview: "백패커들의 성지이자 붉은 일몰과 드넓은 수평선, 사슴들이 노니는 굴업도 최고의 언덕입니다.", firstImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-gulup-2", title: "코끼리바위", addr: "인천 옹진군 덕적면 굴업리", overview: "오랜 세월 파도와 바람에 깎여 코끼리 형상을 한 거대한 웅장한 해식아치 바위입니다.", firstImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-gulup-3", title: "목기해변", addr: "인천 옹진군 덕적면 굴업리", overview: "덕물도와 굴업도를 잇는 고요하고 맑은 백사장이 인상적인 모래 해변입니다.", firstImage: "https://images.unsplash.com/photo-1473116763269-25544899376c?w=500&auto=format&fit=crop&q=80" }
  ],
  "대연평": [
    { contentId: "preset-yeonpyeong-1", title: "연평평화안보수련원", addr: "인천 옹진군 연평면 연평리", overview: "서해 최북단 연평도의 평화와 안보의 중요성을 느끼고 안보 체험을 할 수 있는 공간입니다.", firstImage: "" },
    { contentId: "preset-yeonpyeong-2", title: "조기역사관", addr: "인천 옹진군 연평면 연평리", overview: "과거 조기 파시로 성황을 이루었던 연평도의 화려한 역사와 전망을 함께 품은 곳입니다.", firstImage: "" },
    { contentId: "preset-yeonpyeong-3", title: "망향전망대", addr: "인천 옹진군 연평면 연평리", overview: "황해도 땅이 시원하게 바라다보이는 연평도 북단의 아련하고 평화로운 조망 스팟입니다.", firstImage: "" }
  ],
  "대이작도": [
    { contentId: "preset-ijak-1", title: "풀등 (신비의 모래섬)", addr: "인천 옹진군 자월면 이작리", overview: "썰물 때만 바다 한가운데에 3~4시간 맑은 모래섬으로 솟아오르는 동양 유일의 신비로운 해상 모래사구입니다.", firstImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-ijak-2", title: "부아산 구름다리", addr: "인천 옹진군 자월면 이작리", overview: "정상 부아산에서 붉은 아치형 구름다리를 건너며 이작도 다도해 전경을 한눈에 담을 수 있습니다.", firstImage: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-ijak-3", title: "작은풀안 해수욕장", addr: "인천 옹진군 자월면 이작리", overview: "수심이 얕고 백사장이 고와 가족 단위 피서객과 백패커들이 휴식을 취하기 최적인 대표 해변입니다.", firstImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=80" }
  ],
  "자월도": [
    { contentId: "preset-jawol-1", title: "장골 해수욕장", addr: "인천 옹진군 자월면 자월리", overview: "완만한 백사장과 붉은 달빛 정취가 아름다운 자월도의 으뜸 대표 해수욕장입니다.", firstImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80" },
    { contentId: "preset-jawol-2", title: "국사봉 전망대", addr: "인천 옹진군 자월면 자월리", overview: "봄철 벚꽃길과 함께 자월도 전체 해안선과 주변 섬 풍경이 한눈에 내려다보이는 시원한 정황입니다.", firstImage: "" },
    { contentId: "preset-jawol-3", title: "목섬 구름다리", addr: "인천 옹진군 자월면 자월리", overview: "푸른 바다 위를 가로질러 자월도 본섬과 아담한 목섬을 이어주는 빨간 아치형 구름다리입니다.", firstImage: "" }
  ],
  "문갑도": [
    { contentId: "preset-mungap-1", title: "깃대봉 등산 코스", addr: "인천 옹진군 덕적면 문갑리", overview: "사람의 손길이 많이 닿지 않아 때 묻지 않은 원시 숲길과 아기자기한 다도해 조망을 선사합니다.", firstImage: "" },
    { contentId: "preset-mungap-2", title: "한월리 해수욕장", addr: "인천 옹진군 덕적면 문갑리", overview: "고요한 자갈과 맑은 바닷물이 인상적인 고즈넉하고 순수한 청정 해변입니다.", firstImage: "" }
  ],
  "백아도": [
    { contentId: "preset-baega-1", title: "남조봉 기차바위", addr: "인천 옹진군 덕적면 백아리", overview: "공룡의 등뼈를 닮은 날카로운 암릉 구역으로 만과 섬 풍경이 360도로 터지는 명품 능선입니다.", firstImage: "" },
    { contentId: "preset-baega-2", title: "발전소 마을 선착장", addr: "인천 옹진군 덕적면 백아리", overview: "고요한 어촌 마을 정취와 백패커, 낚시꾼들이 사랑하는 호젓한 바다 조망 스팟입니다.", firstImage: "" }
  ],
  "소연평": [
    { contentId: "preset-soyeon-1", title: "얼굴바위", addr: "인천 옹진군 연평면 소연평리", overview: "사람의 오똑한 옆얼굴 형상을 정교하게 닮은 신비로운 서해의 대표 해식 기암입니다.", firstImage: "" },
    { contentId: "preset-soyeon-2", title: "소연평도 등대길", addr: "인천 옹진군 연평면 소연평리", overview: "어촌 마을 포구와 등대를 따라 한적하게 걸을 수 있는 호젓한 섬 산책로입니다.", firstImage: "" }
  ],
  "소이작도": [
    { contentId: "preset-soijak-1", title: "손가락바위", addr: "인천 옹진군 자월면 이작리", overview: "하늘을 향해 세 번째 손가락을 우뚝 찌르고 있는 듯한 소이작도의 신기하고 유쾌한 기암입니다.", firstImage: "" },
    { contentId: "preset-soijak-2", title: "갯티길 데크 산책로", addr: "인천 옹진군 자월면 이작리", overview: "바다 냄새를 물씬 맡으며 소이작도 해안 절경을 따라 안전하게 걸을 수 있는 해안 데크길입니다.", firstImage: "" }
  ],
  "울도": [
    { contentId: "preset-uldo-1", title: "울도 해안 절벽 탐방로", addr: "인천 옹진군 덕적면 울도리", overview: "덕적군도 최서단 외딴 섬으로 기암절벽과 깊고 푸른 서해 해양 생태계를 마주할 수 있습니다.", firstImage: "" }
  ],
  "지도": [
    { contentId: "preset-jido-1", title: "지도리 청정 어촌 정취", addr: "인천 옹진군 덕적면 지도리", overview: "인공적인 개발이 되지 않아 아늑하고 순수한 자연 그대로의 섬 정취를 느낄 수 있습니다.", firstImage: "" }
  ]
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
  const [loading, setLoading] = useState(false);

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
      try {
        const [restResult, lodgeResult, campResult, spotResult, tideResult, blogResult, youtubeResult] = 
          await Promise.allSettled([
            fetch("/api/restaurant"),
            fetch("/api/lodge"),
            fetch(`/api/camping?query=${encodeURIComponent(islandName)}`),
            fetch("/api/spot"),
            fetch(`/api/tide?island=${encodeURIComponent(islandName)}`),
            fetch(`/api/blog?query=${encodeURIComponent(islandName + " 여행")}&display=3`),
            fetch(`/api/youtube?query=${encodeURIComponent(islandName + " 여행")}`)
          ]);

        if (restResult.status === "fulfilled" && restResult.value.ok) {
          const data = await restResult.value.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setRestaurants(filtered);
          }
        }

        if (lodgeResult.status === "fulfilled" && lodgeResult.value.ok) {
          const data = await lodgeResult.value.json();
          if (data.success && data.items) {
            const filtered = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
            setLodges(filtered);
          }
        }

        if (campResult.status === "fulfilled" && campResult.value.ok) {
          const data = await campResult.value.json();
          if (data.success && data.items) {
            setCampsites(data.items);
          }
        }

        let fetchedSpots: any[] = [];
        if (spotResult.status === "fulfilled" && spotResult.value.ok) {
          const data = await spotResult.value.json();
          if (data.success && data.items) {
            fetchedSpots = data.items.filter((item: any) => 
              rule ? rule(item.addr) : item.addr.includes(islandName)
            );
          }
        }

        if (fetchedSpots.length === 0 && presetIslandSpots[islandName]) {
          fetchedSpots = presetIslandSpots[islandName];
          const presetOverviews: Record<string, any> = {};
          for (const s of fetchedSpots) {
            presetOverviews[s.contentId] = {
              overview: s.overview,
              homepage: "",
              tel: "",
              loading: false
            };
          }
          setSpotOverviews(prev => ({ ...prev, ...presetOverviews }));
        }
        setSpots(fetchedSpots);

        if (tideResult.status === "fulfilled" && tideResult.value.ok) {
          const data = await tideResult.value.json();
          if (data.success && data.tides) {
            setTides(data.tides);
          }
        }

        if (blogResult.status === "fulfilled" && blogResult.value.ok) {
          const data = await blogResult.value.json();
          if (data.success && data.items) {
            setBlogs(data.items.slice(0, 3));
          }
        }

        if (youtubeResult.status === "fulfilled" && youtubeResult.value.ok) {
          const data = await youtubeResult.value.json();
          const rawVideos = data.videos || data.items || [];
          if (data.success && rawVideos.length > 0) {
            const formatted = rawVideos.map((v: any) => ({
              id: v.videoId,
              title: v.title,
              thumbnail: v.thumbnail,
              channelName: `${v.ownerText || ""} · ${v.viewCountText || ""}`,
              embedUrl: `https://www.youtube.com/embed/${v.videoId}`
            }));
            setVideos(formatted.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error loading island details:", err);
      }
    };

    fetchAllData();
  }, [islandName]);

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
    <div id="island-detail-container" className="py-10 pb-24 max-w-[900px] m-auto px-4 sm:px-6 text-[#282828]">
      
      {/* Back Button */}
      <Link 
        id="island-back-link"
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
      <section id="island-intro-card" className="p-6 sm:p-8 rounded-2xl border border-[#D4D4D4] bg-white shadow-sm mb-8 flex flex-col gap-6">
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
          <h1 id="island-title" className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-[#282828]">{islandName}</h1>
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

        {/* Sample Photos Grid */}
        {photos.length > 0 && (
          <div>
            <div id="island-gallery-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {photos.map((url, index) => (
                <div 
                  key={index} 
                  id={`island-gallery-item-${index}`}
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
            {/* 공공누리 제1유형 출처 표기 안내 */}
            <div className="mt-3 pt-2.5 border-t border-[#EDEDED] flex flex-wrap items-center gap-2 text-[11px] text-[#6A6A6A]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-semibold text-[10px] shrink-0">
                공공누리 제1유형
              </span>
              <span>인천광역시이(가) 보유한 본 저작물은 &quot;공공누리&quot; 제1유형:출처표시 조건에 따라 이용 할 수 있습니다.</span>
            </div>
          </div>
        )}
      </section>

      {/* Collapsible Sections */}
      <div id="island-sections-container" className="flex flex-col gap-6 w-full">

        {/* Ferry Route Info */}
        <div id="section-ferry" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            id="section-toggle-ferry"
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
            <div id="section-content-ferry" className="px-6 pb-6 border-t border-[#EDEDED] pt-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {island?.ferries.map((ferry, idx) => (
                  <div key={idx} id={`ferry-route-item-${idx}`} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-2">
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
                  id="ferry-booking-link"
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
          <div id="section-restaurant" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              id="section-toggle-restaurant"
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
              <div id="section-content-restaurant" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {restaurants.map((rest: any, idx: number) => (
                    <div key={idx} id={`restaurant-item-${idx}`} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-1.5 text-xs">
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
          <div id="section-lodge" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              id="section-toggle-lodge"
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
              <div id="section-content-lodge" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {lodges.map((lodge: any, idx: number) => (
                    <div key={idx} id={`lodge-item-${idx}`} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-1 text-xs">
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
          <div id="section-camping" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              id="section-toggle-camping"
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
              <div id="section-content-camping" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campsites.map((camp: any, idx: number) => (
                    <div key={idx} id={`camping-item-${idx}`} className="bg-[#F6F6F6] border border-[#D4D4D4] rounded-lg p-4 flex flex-col gap-2 text-xs">
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
        <div id="section-tide" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            id="section-toggle-tide"
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
            <div id="section-content-tide" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              <p className="text-xs text-[#848484] mb-4">
                * 갯벌체험 및 해안 탐방 시 간조(물 빠짐) 시간을 반드시 참고하세요.
              </p>
              {tides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tides.map((tide, index) => (
                    <div key={index} id={`tide-item-${index}`} className="p-4 rounded-lg border border-[#D4D4D4] bg-[#F6F6F6] flex flex-col justify-between">
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
          <div id="section-spot" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
            <button 
              id="section-toggle-spot"
              type="button"
              onClick={() => toggleSection("spot")}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-[#F6F6F6] transition-colors"
            >
              <h3 className="text-lg font-bold text-[#282828] flex items-center gap-2">
                📸 섬내 추천 관광 명소
              </h3>
              <span className={`text-[#848484] transition-transform duration-300 ${openSections.spot ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            
            {openSections.spot && (
              <div id="section-content-spot" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spots.map((spot: any, idx: number) => {
                    const spotImage = spot.firstImage || "/images/default_island.png";
                    const rawOverview = spot.overview || spotOverviews[spot.contentId]?.overview || "인천 섬의 대표적인 가볼 만한 추천 명소입니다.";
                    const summary = cleanText(rawOverview);
                    return (
                      <div 
                        key={spot.contentId || idx}
                        id={`spot-item-${idx}`}
                        className="p-4 rounded-xl border border-[#D4D4D4] bg-[#F6F6F6] hover:border-[#0F3E17] hover:bg-white hover:shadow-sm transition-all flex gap-4 items-center"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#D4D4D4] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={spotImage} 
                            alt={spot.title} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/default_island.png";
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="font-bold text-[#282828] text-sm truncate">{spot.title}</span>
                          <p className="text-xs text-[#6A6A6A] leading-relaxed">
                            {summary}
                          </p>
                          {spot.addr && (
                            <a 
                              href={`https://map.naver.com/index.naver?query=${encodeURIComponent(spot.addr)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#848484] hover:text-[#0F3E17] hover:underline truncate mt-0.5 inline-block"
                            >
                              📍 {spot.addr} ↗
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blog Reviews Section (5건) */}
        <div id="section-blog" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            id="section-toggle-blog"
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
            <div id="section-content-blog" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              {blogs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {blogs.map((blog: any, bIdx: number) => (
                    <a
                      key={bIdx}
                      id={`blog-item-${bIdx}`}
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
        <div id="section-youtube" className="rounded-2xl border border-[#D4D4D4] bg-white shadow-sm overflow-hidden">
          <button 
            id="section-toggle-youtube"
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
            <div id="section-content-youtube" className="px-6 pb-6 border-t border-[#EDEDED] pt-6">
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {videos.map((video: any, vIdx: number) => (
                    <div
                      key={video.id || vIdx}
                      id={`youtube-video-item-${vIdx}`}
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
            id="island-youtube-modal"
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="island-youtube-modal-close-btn"
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
