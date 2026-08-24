"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { heroSlidesData, rollingSubtitles } from "@/data/main";

interface FerryRoute {
  island: string;
  pier: string;
  line: string;
  one: number;
  min: number;
}

const ferryRawData: FerryRoute[][] = [
  // 0: 인천 연안여객
  [
    { island: "덕적도", pier: "인천 연안여객터미널 → 진리항", line: "고려고속훼리", one: 23900, min: 70 },
    { island: "자월도", pier: "인천 연안여객터미널 → 달바위선착장", line: "대부해운", one: 16500, min: 85 },
    { island: "승봉도", pier: "인천 연안여객터미널 → 승봉선착장", line: "고려고속훼리", one: 22400, min: 100 },
    { island: "연평도", pier: "인천 연안여객터미널 → 연평항", line: "에이치해운", one: 44500, min: 120 },
  ],
  // 1: 대부도 방아머리
  [
    { island: "자월도", pier: "대부도 방아머리 → 달바위선착장", line: "대부해운", one: 8500, min: 45 },
    { island: "승봉도", pier: "대부도 방아머리 → 승봉선착장", line: "대부해운", one: 11000, min: 60 },
    { island: "대이작도", pier: "대부도 방아머리 → 이작선착장", line: "대부해운", one: 12500, min: 75 },
  ],
  // 2: 삼목선착장
  [
    { island: "신도·시도·모도", pier: "삼목선착장 → 신도선착장", line: "세종해운", one: 3000, min: 10 },
    { island: "장봉도", pier: "삼목선착장 → 옹암선착장", line: "세종해운", one: 4000, min: 40 },
    { island: "신도(차량 동반)", pier: "삼목선착장 → 신도선착장", line: "세종해운", one: 6500, min: 10 },
  ],
];

const heroSlides = heroSlidesData;

const youtubeVideos = [
  {
    id: "scr3-video-1",
    title: "굴업도 백패킹 1박 2일 | 개머리언덕 일몰까지 걸어서",
    badgeTitle: "굴업도 1박 2일",
    badgeSub: "개머리언덕 일몰",
    dur: "18:42",
    meta: "섬생활 · 조회수 24만회 · 2026.06.14",
    img: "https://i.ytimg.com/vi/TDWH5QmtluY/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/TDWH5QmtluY?autoplay=1",
  },
  {
    id: "scr3-video-2",
    title: "무의도 호룡곡산 종주 후 하나개해변 노지 캠핑",
    badgeTitle: "호룡곡산 종주",
    badgeSub: "하나개 노지캠핑",
    dur: "12:07",
    meta: "주말섬로그 · 조회수 11만회 · 2026.05.30",
    img: "https://i.ytimg.com/vi/6JMyWWkSwNo/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/6JMyWWkSwNo?autoplay=1",
  },
  {
    id: "scr3-video-3",
    title: "초보 섬백패킹은 승봉도 | 배 시간·물때 정리",
    badgeTitle: "초보 섬백패킹",
    badgeSub: "배시간·물때 정리",
    dur: "09:51",
    meta: "백패킹하는남자 · 조회수 8.7만회 · 2026.07.05",
    img: "https://i.ytimg.com/vi/XLUADWwa6wc/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/XLUADWwa6wc?autoplay=1",
  },
];



// 10 Color Palettes for Island Badges (Distinct Colorful Pastel BG + Text + Border, No White/Gray)
const sampleBadgeColors = [
  { bg: "bg-[#FFF8E7]", text: "text-[#B45309]", border: "border-[#FCD34D]" }, // 1. Warm Gold
  { bg: "bg-[#E6FDE5]", text: "text-[#0F3E17]", border: "border-[#86EFAC]" }, // 2. Sage Green
  { bg: "bg-[#E7FAFF]", text: "text-[#0284C7]", border: "border-[#93C5FD]" }, // 3. Ocean Blue
  { bg: "bg-[#D1FAE5]", text: "text-[#065F46]", border: "border-[#6EE7B7]" }, // 4. Mint Green
  { bg: "bg-[#FFE4E6]", text: "text-[#9F1239]", border: "border-[#FDA4AF]" }, // 5. Rose Coral
  { bg: "bg-[#EDE9FE]", text: "text-[#5B21B6]", border: "border-[#C4B5FD]" }, // 6. Lavender Violet
  { bg: "bg-[#E0E7FF]", text: "text-[#3730A3]", border: "border-[#A5B4FC]" }, // 7. Indigo Blue
  { bg: "bg-[#FFEDD5]", text: "text-[#9A3412]", border: "border-[#FDBA74]" }, // 8. Peach Tangerine
  { bg: "bg-[#CCFBF1]", text: "text-[#115E59]", border: "border-[#5EEAD4]" }, // 9. Turquoise Teal
  { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]", border: "border-[#FDE047]" }, // 10. Lemon Amber
];

function getIslandColor(name: string, index: number) {
  let hash = index;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % sampleBadgeColors.length;
  }
  return sampleBadgeColors[hash];
}

export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedOri, setSelectedOri] = useState(0);
  const [activeCurationTab, setActiveCurationTab] = useState<"popular" | "recent">("popular");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [subIdx, setSubIdx] = useState(0);
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);
  const [curationVisible, setCurationVisible] = useState(false);
  const curationGridRef = useRef<HTMLDivElement>(null);
  const [youtubeVisible, setYoutubeVisible] = useState(false);
  const youtubeGridRef = useRef<HTMLDivElement>(null);

  // Prototype benchmark options states
  const [optAStep, setOptAStep] = useState(0);
  const [optDChecked, setOptDChecked] = useState<number[]>([0, 1]);
  const toggleOptD = (idx: number) => {
    setOptDChecked(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  useEffect(() => {
    const el = curationGridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurationVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([
    {
      id: "TDWH5QmtluY",
      title: "여자 혼자 굴업도 백패킹⛺️ 뚜벅이 솔로캠핑",
      badgeTitle: "굴업도 백패킹",
      badgeSub: "임쁨임",
      dur: "18:42",
      meta: "임쁨임 · 조회수 2.1만회 · 11개월 전",
      img: "https://i.ytimg.com/vi/TDWH5QmtluY/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/TDWH5QmtluY?autoplay=1",
    },
    {
      id: "6JMyWWkSwNo",
      title: "혼자 캠핑중 험한것이 나왔다ㅣ승봉도 백패킹",
      badgeTitle: "승봉도 백패킹",
      badgeSub: "미지 Now mizi",
      dur: "12:07",
      meta: "미지 Now mizi · 조회수 9천회 · 1년 전",
      img: "https://i.ytimg.com/vi/6JMyWWkSwNo/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/6JMyWWkSwNo?autoplay=1",
    },
    {
      id: "XLUADWwa6wc",
      title: "인천 자월도 나홀로 백패킹ㅣ배타는법ㅣ맛집",
      badgeTitle: "자월도 백패킹",
      badgeSub: "임쁨임",
      dur: "16:20",
      meta: "임쁨임 · 조회수 1.6만회 · 1년 전",
      img: "https://i.ytimg.com/vi/XLUADWwa6wc/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/XLUADWwa6wc?autoplay=1",
    },
  ]);

  useEffect(() => {
    const fetchHomeVideos = async () => {
      const CACHE_KEY = "hn_home_youtube_videos_v1";
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7일 (밀리초)

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < SEVEN_DAYS_MS && parsed.videos?.length === 3) {
            setYoutubeVideos(parsed.videos);
            return; // 7일 이내 저장된 캐시 데이터가 있으면 네트워크 요청 없이 즉시 사용
          }
        }
      } catch (e) {
        console.error("Cache read error:", e);
      }

      const keywords = [
        { island: "굴업도", query: "굴업도 백패킹" },
        { island: "승봉도", query: "승봉도 백패킹" },
        { island: "자월도", query: "자월도 백패킹" }
      ];

      try {
        const results = await Promise.allSettled(
          keywords.map(kw => fetch(`/api/youtube?query=${encodeURIComponent(kw.query)}`))
        );

        const fetched: any[] = [];

        for (let i = 0; i < results.length; i++) {
          const res = results[i];
          const kw = keywords[i];
          if (res.status === "fulfilled" && res.value.ok) {
            const data = await res.value.json();
            if (data.success && data.videos && data.videos.length > 0) {
              const topVid = data.videos[0];
              fetched.push({
                id: topVid.videoId || `video-${i}`,
                title: topVid.title,
                badgeTitle: `${kw.island} 백패킹`,
                badgeSub: topVid.ownerText || "실제 백패킹 리뷰",
                dur: topVid.lengthText || "영상",
                meta: `${topVid.ownerText || "유튜브"} · ${topVid.viewCountText || "조회수"} · ${topVid.publishedTimeText || ""}`,
                img: topVid.thumbnail || `https://i.ytimg.com/vi/${topVid.videoId}/hqdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${topVid.videoId}?autoplay=1`
              });
            }
          }
        }

        if (fetched.length === 3) {
          setYoutubeVideos(fetched);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              videos: fetched
            }));
          } catch (e) {
            console.error("Cache save error:", e);
          }
        }
      } catch (err) {
        console.error("Error fetching home youtube videos:", err);
      }
    };

    fetchHomeVideos();
  }, []);

  useEffect(() => {
    const el = youtubeGridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setYoutubeVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const starterGuideSteps = [
    {
      step: "01",
      icon: "🪪",
      title: "신분증 지참 필수",
      subtitle: "실물 신분증 또는 모바일 신분증",
      desc: "여객선 승선 시 승선권과 신분증 실물 대조가 100% 의무화되어 있습니다. 미성년자는 주민등록등본이나 가족관계증명서를 꼭 지참하세요.",
      accentBg: "bg-[#FFF8E7]",
      accentText: "text-[#B45309]",
      accentBorder: "border-[#FCD34D]"
    },
    {
      step: "02",
      icon: "🚢",
      title: "가고싶은섬 배표 예매 팁",
      subtitle: "한국해운조합 공식 예약 사이트",
      desc: "주말 및 성수기 인기 섬(굴업도·백령도·덕적도) 승선권은 조기 매진됩니다. 최소 1~2주 전 '가고싶은섬' 앱에서 사전 예매하세요.",
      accentBg: "bg-[#E6FDE5]",
      accentText: "text-[#0F3E17]",
      accentBorder: "border-[#86EFAC]"
    },
    {
      step: "03",
      icon: "🌊",
      title: "물때 & 바다 날씨 확인",
      subtitle: "간조/만조 시각 및 풍랑 주의",
      desc: "풀등(대이작도 모래섬) 관람과 갯벌 체험, 해안 트레킹은 물이 빠지는 '간조' 전후 2시간이 골든타임입니다. 출발 전 기상 악화 시 출항 여부를 확인하세요.",
      accentBg: "bg-[#E7FAFF]",
      accentText: "text-[#0284C7]",
      accentBorder: "border-[#93C5FD]"
    },
    {
      step: "04",
      icon: "🚌",
      title: "섬 내부 이동 수단",
      subtitle: "공영버스 운행 시각 & 렌트 사전예약",
      desc: "백령도·덕적도 등 큰 섬은 여객선 입항 시각에 맞춰 공영버스가 운행됩니다. 대연평·굴업도 등 소형 섬은 도보 트레킹으로 쾌적하게 둘러볼 수 있습니다.",
      accentBg: "bg-[#EDE9FE]",
      accentText: "text-[#5B21B6]",
      accentBorder: "border-[#C4B5FD]"
    },
    {
      step: "05",
      icon: "⛺",
      title: "LNT 클린 캠핑 수칙",
      subtitle: "Leave No Trace - 흔적 남기지 않기",
      desc: "섬은 자체 쓰레기 처리가 매우 어렵습니다. 종량제 봉투를 준비하여 내가 발생시킨 쓰레기는 육지로 되가져오는 클린 섬 여행을 실천해 주세요.",
      accentBg: "bg-[#FFE4E6]",
      accentText: "text-[#9F1239]",
      accentBorder: "border-[#FDA4AF]"
    }
  ];

  const curationThemes = [
    {
      id: "gourmet",
      badge: "🍽️ 미식 & 낚시",
      badgeBg: "bg-[#FFF8E7] text-[#B45309] border-[#FCD34D]",
      title: "해산물 식당가와 선상 낚시 스팟",
      primaryHref: "/explore/jawoldo",
      islands: [
        { name: "자월도", href: "/explore/jawoldo" },
        { name: "승봉도", href: "/explore/seungbongdo" },
      ],
      tags: ["#1박4식 미식", "#선상 낚시"],
      desc: "삼시세끼 해산물 차림을 제공하는 민박과 당일 선상 낚시 포인트가 있는 섬",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "tidal",
      badge: "🦀 갯벌 & 트레킹",
      badgeBg: "bg-[#E7FAFF] text-[#0284C7] border-[#93C5FD]",
      title: "썰물 때 열리는 모래섬과 갯벌 체험장",
      primaryHref: "/explore/daeijakdo",
      islands: [
        { name: "대이작도", href: "/explore/daeijakdo" },
        { name: "소이작도", href: "/explore/soijakdo" },
      ],
      tags: ["#갯벌체험", "#해안 데크길"],
      desc: "하루 두 번 열리는 풀등 모래섬과 경사가 완만해 걷기 쉬운 해안 산책로",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "backpacking",
      badge: "🏕️ 백패킹",
      badgeBg: "bg-[#E6FDE5] text-[#0F3E17] border-[#86EFAC]",
      title: "야영장이 갖춰진 백패킹과 일몰 스팟",
      primaryHref: "/explore/gureopdo",
      islands: [
        { name: "굴업도", href: "/explore/gureopdo" },
        { name: "덕적도", href: "/explore/deokjeokdo" },
      ],
      tags: ["#백패킹", "#일몰 명소"],
      desc: "개머리언덕 능선과 서해 해안 절벽을 따라 걷는 대표 백패킹 코스",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    },
  ];

  // Hero auto rolling
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Subtitle rolling timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSubIdx((prev) => (prev + 1) % rollingSubtitles.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Compute Ferry Routes
  const currentPool = ferryRawData[selectedOri] || [];

  const cheapRoutes = [...currentPool]
    .sort((a, b) => a.one - b.one)
    .slice(0, 3)
    .map((r, i) => ({
      ...r,
      badge: i === 0 ? "최저가" : i === 1 ? "2순위" : "3순위",
      badgeBg: i === 0 ? "#E6FDE5" : "#FFFFFF",
      badgeFg: i === 0 ? "#0F3E17" : "#525252",
      roundStr: (r.one * 2).toLocaleString("ko-KR"),
      durStr: r.min >= 60 ? `${Math.floor(r.min / 60)}시간${r.min % 60 ? ` ${r.min % 60}분` : ""}` : `${r.min}분`,
    }));

  const fastPool = currentPool.filter((r) => r.min <= 60);
  const fastRoutes = [...fastPool]
    .sort((a, b) => a.min - b.min)
    .slice(0, 3)
    .map((r, i) => ({
      ...r,
      badge: i === 0 ? "최단시간" : i === 1 ? "2순위" : "3순위",
      badgeBg: i === 0 ? "#E6FDE5" : "#FFFFFF",
      badgeFg: i === 0 ? "#0F3E17" : "#525252",
      roundStr: (r.one * 2).toLocaleString("ko-KR"),
      durStr: r.min >= 60 ? `${Math.floor(r.min / 60)}시간${r.min % 60 ? ` ${r.min % 60}분` : ""}` : `${r.min}분`,
    }));

  const oriLabels = ["인천 연안여객", "대부도 방아머리", "삼목선착장"];

  return (
    <div id="main-page-container" className="w-full bg-white text-gray-900 font-sans antialiased">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section id="hero-section" data-screen-label="Hero" className="relative w-full h-[100dvh] min-h-[560px] md:h-[780px] overflow-hidden bg-main-900">
        {/* Background Slide Images (Contained Parallax Slide with Motion Blur & Zero Background Gap) */}
        <div id="hero-bg-slider" className="absolute inset-0 z-0 overflow-hidden">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === heroIdx;
            return (
              <div
                key={slide.name}
                id={`hero-slide-${idx}`}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 2 : 1,
                  transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div
                  className="absolute inset-[-40px]"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: isActive ? "scale(1.03) translateX(0%)" : "scale(1.12) translateX(40px)",
                    filter: isActive ? "blur(0px)" : "blur(8px)",
                    transition: isActive
                      ? "transform 7000ms cubic-bezier(0.16, 1, 0.3, 1), filter 1200ms cubic-bezier(0.16, 1, 0.3, 1)"
                      : "transform 1200ms ease-out, filter 1200ms ease-out",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(100deg, rgba(21,29,31,0.82) 0%, rgba(21,29,31,0.58) 42%, rgba(21,29,31,0.12) 78%, rgba(21,29,31,0.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(21,29,31,0.5) 0%, rgba(21,29,31,0) 26%, rgba(21,29,31,0) 60%, rgba(21,29,31,0.45) 100%)",
          }}
        />

        {/* Hero Content (Precisely centered in available space between GNB and Bottom Bar) */}
        <div
          id="hero-content"
          className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-[16px] sm:px-[40px] pt-[64px] sm:pt-[80px] pb-[112px] sm:pb-[80px] flex flex-col justify-center"
        >
          <div className="max-w-[900px]">

            {/* Title */}
            <h1 id="hero-main-title" className="m-0 text-white font-normal leading-none flex flex-col items-start">
              <span className="flex items-center gap-2.5 sm:gap-4 text-[18px] sm:text-[24px] md:text-[32px] text-white/90 font-light mb-2.5 sm:mb-4 leading-[140%]">
                <span className="w-6 sm:w-12 h-[1px] bg-white/60 shrink-0" />
                복잡한 인천 섬 여행 준비,
              </span>
              <span className="block text-[56px] sm:text-[76px] md:text-[88px] font-bold tracking-[-0.035em] text-white leading-[110%] break-keep">
                <span className="relative inline-block text-main-50 mr-2 sm:mr-3">
                  <span className="absolute left-[-4px] right-[-4px] bottom-1 sm:bottom-2 md:bottom-3 h-[14px] sm:h-[18px] md:h-[22px] rounded-full bg-main-50/25 -z-10" />
                  한눈섬길
                </span>
                로 명쾌하게
              </span>
            </h1>

            {/* Rolling Subtitles (Smooth Vertical Slot Ticker) */}
            <div id="hero-subtitle-ticker" className="mt-4 sm:mt-6 h-[58px] sm:h-[48px] overflow-hidden relative max-w-[800px]">
              {rollingSubtitles.map((text, idx) => {
                const isActive = idx === subIdx;
                const prevIdx = (subIdx - 1 + rollingSubtitles.length) % rollingSubtitles.length;
                const isExiting = idx === prevIdx;

                let stateClass = "opacity-0 translate-y-6 pointer-events-none";
                if (isActive) {
                  stateClass = "opacity-100 translate-y-0";
                } else if (isExiting) {
                  stateClass = "opacity-0 -translate-y-6 pointer-events-none";
                }

                return (
                  <p
                    key={text}
                    id={`hero-subtitle-${idx}`}
                    className={`absolute top-0 left-0 m-0 text-gray-100 text-[18px] sm:text-[20px] leading-[150%] font-normal transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${stateClass}`}
                  >
                    {text}
                  </p>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-[16px] mt-[24px] sm:mt-[32px]">
              <Link
                id="hero-cta-explore-btn"
                href="/explore"
                className="inline-flex items-center justify-center gap-[8px] sm:gap-[12px] h-[48px] sm:h-[56px] px-[24px] sm:px-[32px] rounded-[8px] border border-white/40 bg-white/5 hover:bg-white/12 backdrop-blur-sm text-white font-medium text-[16px] sm:text-[18px] transition-all"
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">map</span>
                섬 탐색
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div id="hero-bottom-bar" className="absolute left-0 right-0 bottom-[24px] sm:bottom-[40px] z-10">
          <div className="max-w-[1440px] mx-auto px-[16px] sm:px-[40px] grid grid-cols-12 gap-[16px] items-end">
            {/* Active Slide Name */}
            <div className="col-span-12 sm:col-span-4 flex items-center gap-[8px] sm:gap-[12px] mb-[12px] sm:mb-0">
              <span className="w-[16px] sm:w-[24px] h-[1px] bg-white/60 shrink-0" />
              <span className="text-[12px] font-medium tracking-[0.05em] leading-[100%] text-sub-500 uppercase shrink-0">지금 보이는 곳</span>
              <span id="hero-current-slide-label" className="text-[14px] sm:text-[16px] font-medium leading-[100%] text-white truncate">
                {heroSlides[heroIdx].name}
              </span>
            </div>

            {/* Slide Progress & Controls */}
            <div id="hero-slide-controls" className="col-span-12 sm:col-start-7 sm:col-span-6 flex items-center justify-between sm:justify-end gap-[12px] sm:gap-[16px] w-full mt-[16px] sm:mt-0">
              <span id="hero-slide-counter" className="text-white text-[14px] font-medium tracking-[0.05em] leading-[100%] shrink-0">
                0{heroIdx + 1} / 0{heroSlides.length}
              </span>
              <div id="hero-slide-indicators" className="flex items-center gap-[8px] flex-1 sm:flex-initial">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    id={`hero-slide-btn-${i}`}
                    type="button"
                    onClick={() => setHeroIdx(i)}
                    className="flex-1 sm:flex-initial sm:w-[64px] h-[4px] p-0 border-none rounded-full overflow-hidden bg-white/30 cursor-pointer"
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span
                      className={`block h-full bg-white transition-all duration-300 ${i === heroIdx ? "w-full" : "w-0"
                        }`}
                    />
                  </button>
                ))}
              </div>
              <button
                id="hero-pause-play-btn"
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-full border border-white/40 bg-transparent text-white text-[12px] font-medium leading-[100%] hover:bg-white/10 transition-colors shrink-0"
                aria-label={isPlaying ? "Pause auto slide" : "Play auto slide"}
              >
                {isPlaying ? "❙❙" : "▶"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: 배편 예매부터 신분증까지, 첫 섬 여행 가이드 (5-Step Cards) */}
      {/* ========================================================================= */}
      <section id="starter-guide-section" className="w-full bg-[#FAFAFA] py-[64px] md:py-[100px] border-y border-[#EDEDED]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">

          {/* Header */}
          <div id="starter-guide-header" className="text-center max-w-[760px] mx-auto mb-[36px] md:mb-[56px] flex flex-col items-center">
            <h2 id="starter-guide-main-title" className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-[#282828] mb-3">
              배편 예매부터 신분증까지, 첫 섬 여행 가이드
            </h2>
            <p id="starter-guide-subtitle" className="text-[14px] sm:text-[16px] text-[#6A6A6A] leading-[160%] m-0">
              섬 여행이 처음이라 망설여지시나요? 구체적인 5가지 입문 핵심 수칙을 한눈에 확인하세요.
            </p>
          </div>

          {/* 5-Step Cards Grid */}
          <div
            ref={curationGridRef}
            id="starter-guide-grid"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[18px] sm:gap-[24px]"
          >
            {starterGuideSteps.map((item, idx) => (
              <div
                key={item.step}
                id={`starter-guide-card-${idx + 1}`}
                style={{
                  transitionDelay: curationVisible ? `${idx * 120}ms` : "0ms",
                }}
                className={`flex flex-col rounded-2xl border border-[#E5E5E5] bg-white p-[20px] sm:p-[24px] shadow-sm hover:shadow-md hover:border-[#0F3E17] transition-all duration-500 group relative overflow-hidden ${curationVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[36px]"
                  }`}
              >
                {/* Top Step Number Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${item.accentBg} ${item.accentText} ${item.accentBorder}`}>
                    {item.step}
                  </span>
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                </div>

                {/* Subtitle */}
                <span className="text-xs font-medium text-[#848484] uppercase tracking-wider mb-1 block">
                  {item.subtitle}
                </span>

                {/* Title */}
                <h3 className="text-[18px] sm:text-[19px] font-bold text-[#282828] leading-snug mb-2.5 group-hover:text-[#0F3E17] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] text-[#6A6A6A] leading-[160%] m-0 flex-1 break-all">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 [OPTION 1] 토스 라이브 프로덕트 벤토 (Toss Live Bento with Micro-UIs) */}
      {/* ========================================================================= */}
      <section id="starter-guide-option-1" className="w-full bg-[#F4F6F8] py-[72px] md:py-[110px] border-b border-[#E5E8EB]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          {/* Header */}
          <div className="text-center max-w-[760px] mx-auto mb-[40px] md:mb-[56px] flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-white text-[#0F3E17] border border-[#E5E8EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3.5">
              ✦ OPTION 1 · 토스 라이브 프로덕트 벤토 (Micro-UI 내장)
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,46px)] font-extrabold tracking-[-0.03em] text-[#191F28] mb-3 leading-[1.25]">
              배편 예매부터 신분증까지,<br className="hidden sm:block" /> 실패 없는 5가지 실전 수칙
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#4E5968] leading-[160%] m-0 font-normal">
              앱 화면처럼 직관적인 미니 UI로 구성된 토스 감성의 스마트 가이드입니다.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] md:gap-[24px]">
            {/* Card 1: 신분증 100% 필수 (7 cols) */}
            <div className="lg:col-span-7 rounded-[28px] bg-white p-7 sm:p-9 border border-[#E5E8EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#FFF8E7] text-[#B45309] border border-[#FCD34D]">
                    STEP 01 · 필수 탑승권 수칙
                  </span>
                  <span className="w-12 h-12 rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🪪
                  </span>
                </div>
                <h3 className="text-[22px] sm:text-[25px] font-extrabold text-[#191F28] tracking-tight leading-snug mb-3">
                  신분증 실물 대조는 100% 의무입니다
                </h3>
                <p className="text-[15px] text-[#4E5968] leading-[170%] m-0 mb-6">
                  여객선 승선 시 승선권과 신분증 실물 대조가 법적으로 의무화되어 있습니다. 실물 신분증 또는 정부24·모바일 운전면허증을 준비하세요.
                </p>

                {/* Toss Micro-UI Ticket Badge */}
                <div className="rounded-2xl bg-[#F8F9FA] border border-[#EDEDED] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F3E17] text-white flex items-center justify-center font-bold text-xs font-mono">
                      PASS
                    </div>
                    <div>
                      <span className="text-xs text-[#8B95A1] block font-medium">인천연안여객터미널 ➔ 굴업도</span>
                      <span className="text-sm font-bold text-[#191F28]">승선자 실명 확인증 (정부24 연동)</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6FDE5] text-[#0F3E17]">
                    ✓ 대조 완료
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#F2F4F6]">
                <span className="bg-[#F2F4F6] text-[#333D4B] text-xs font-semibold px-3 py-1.5 rounded-lg">
                  ✓ 주민등록증 / 운전면허증 / 여권
                </span>
                <span className="bg-[#F2F4F6] text-[#333D4B] text-xs font-semibold px-3 py-1.5 rounded-lg">
                  ✓ 미성년자 등본 지참
                </span>
              </div>
            </div>

            {/* Card 2: 배표 사전 예매 (5 cols) */}
            <div className="lg:col-span-5 rounded-[28px] bg-white p-7 sm:p-9 border border-[#E5E8EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#E6FDE5] text-[#0F3E17] border border-[#86EFAC]">
                    STEP 02 · 사전 예매 팁
                  </span>
                  <span className="w-12 h-12 rounded-2xl bg-[#F4FAF4] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🚢
                  </span>
                </div>
                <h3 className="text-[22px] sm:text-[25px] font-extrabold text-[#191F28] tracking-tight leading-snug mb-3">
                  ‘가고싶은섬’ 공식 앱 사전 예매
                </h3>
                <p className="text-[15px] text-[#4E5968] leading-[170%] m-0 mb-6">
                  주말 인기 섬은 조기 매진됩니다. 최소 1~2주 전 한국해운조합 공식 앱에서 잔여석을 확인하고 예매하세요.
                </p>

                {/* Toss Micro-UI Live Seats Badge */}
                <div className="rounded-2xl bg-[#F4FAF4] border border-[#86EFAC] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#0F3E17] font-semibold block">주말 승선권 현황</span>
                    <span className="text-sm font-extrabold text-[#0F3E17]">실시간 잔여 14석 (예매 가능)</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F3E17] text-white">
                    예매하기 →
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F2F4F6]">
                <span className="text-xs text-[#8B95A1]">
                  한국해운조합 공식 예매 시스템(island.hawoon.co.kr) 지원
                </span>
              </div>
            </div>

            {/* Card 3: 물때 & 날씨 (4 cols) */}
            <div className="lg:col-span-4 rounded-[28px] bg-white p-6 sm:p-7 border border-[#E5E8EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#E7FAFF] text-[#0284C7] border border-[#93C5FD]">
                    STEP 03 · 해양 기상
                  </span>
                  <span className="w-11 h-11 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🌊
                  </span>
                </div>
                <h4 className="text-[19px] font-extrabold text-[#191F28] tracking-tight mb-2.5 leading-snug">
                  물때 & 바다 날씨 확인
                </h4>
                <p className="text-[14px] text-[#4E5968] leading-[160%] m-0 mb-4">
                  대이작도 풀등과 해안 트레킹은 물이 빠지는 ‘간조’ 전후 2시간이 골든타임입니다.
                </p>

                {/* Tide Gauge Bar */}
                <div className="bg-[#F0F9FF] rounded-xl p-3 border border-[#BAE6FD]">
                  <div className="flex justify-between text-xs font-bold text-[#0284C7] mb-1.5">
                    <span>간조 골든타임</span>
                    <span>물 빠짐 82%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E0F2FE] overflow-hidden">
                    <div className="w-[82%] h-full bg-[#0284C7] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: 섬 내부 이동 (4 cols) */}
            <div className="lg:col-span-4 rounded-[28px] bg-white p-6 sm:p-7 border border-[#E5E8EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#EDE9FE] text-[#5B21B6] border border-[#C4B5FD]">
                    STEP 04 · 섬내 교통
                  </span>
                  <span className="w-11 h-11 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🚌
                  </span>
                </div>
                <h4 className="text-[19px] font-extrabold text-[#191F28] tracking-tight mb-2.5 leading-snug">
                  섬 내부 이동 수단 파악
                </h4>
                <p className="text-[14px] text-[#4E5968] leading-[160%] m-0 mb-4">
                  대형 섬은 입항 연계 공영버스를 탑승하고, 소형 섬은 쾌적한 도보 트레킹을 즐기세요.
                </p>

                {/* Bus Transfer Pill */}
                <div className="bg-[#F5F3FF] rounded-xl p-3 border border-[#DDD6FE] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5B21B6]">입항 11:20 ➔ 공영버스 11:35</span>
                  <span className="text-[#6D28D9] font-medium">연계 운행</span>
                </div>
              </div>
            </div>

            {/* Card 5: LNT 클린 캠핑 (4 cols) */}
            <div className="lg:col-span-4 rounded-[28px] bg-white p-6 sm:p-7 border border-[#E5E8EB] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#FFE4E6] text-[#9F1239] border border-[#FDA4AF]">
                    STEP 05 · 클린 캠핑
                  </span>
                  <span className="w-11 h-11 rounded-xl bg-[#FFF1F2] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ⛺
                  </span>
                </div>
                <h4 className="text-[19px] font-extrabold text-[#191F28] tracking-tight mb-2.5 leading-snug">
                  LNT 클린 섬 캠핑 수칙
                </h4>
                <p className="text-[14px] text-[#4E5968] leading-[160%] m-0 mb-4">
                  섬은 자체 쓰레기 처리가 어렵습니다. 종량제 봉투에 담아 육지로 되가져오세요.
                </p>

                {/* Eco Badge */}
                <div className="bg-[#FFF1F2] rounded-xl p-3 border border-[#FECDD3] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#9F1239]">Leave No Trace (흔적 남기지 않기)</span>
                  <span className="text-[#BE123C] font-extrabold">100% 회수</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 [OPTION 2] 에디토리얼 비주얼 포토 매거진 (AllTrails / Kinfolk Style) */}
      {/* ========================================================================= */}
      <section id="starter-guide-option-2" className="w-full bg-[#111612] text-white py-[72px] md:py-[110px] border-b border-[#28382A]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          {/* Header */}
          <div className="text-center max-w-[760px] mx-auto mb-[40px] md:mb-[56px] flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-[#1C2E1F] text-[#86EFAC] border border-[#2D5A34] mb-3.5">
              ✦ OPTION 2 · 에디토리얼 비주얼 포토 매거진 (아웃도어 화보 스타일)
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,46px)] font-extrabold tracking-[-0.03em] text-white mb-3 leading-[1.25]">
              섬으로 떠나는 첫 걸음, 5대 여행 수칙
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#A3B8A5] leading-[160%] m-0 font-normal">
              아웃도어 매거진 화보처럼 시원한 비주얼과 함께 떠나는 감성 가이드입니다.
            </p>
          </div>

          {/* Magazine Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] md:gap-[24px]">
            {/* Top Large Visual Card (굴업도 배경 사진 + 신분증 & 배표) */}
            <div className="lg:col-span-12 rounded-[28px] overflow-hidden relative min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-7 sm:p-10 group shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('/images/island/gureopdo/1.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              <div className="relative z-10 max-w-[800px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#E6FDE5] text-[#0F3E17]">
                    KEY GUIDE 01 & 02
                  </span>
                  <span className="text-sm font-semibold text-[#86EFAC]">출항 전 필수 점검</span>
                </div>
                <h3 className="text-[26px] sm:text-[34px] font-extrabold text-white leading-tight mb-3">
                  신분증 실물 지참 & ‘가고싶은섬’ 사전 배표 예매
                </h3>
                <p className="text-white/85 text-[15px] sm:text-[16px] leading-[170%] m-0 mb-5">
                  여객선 승선권과 신분증 실물 대조는 100% 필수입니다. 주말 및 성수기 인기 섬은 조기 매진되므로 최소 1~2주 전 한국해운조합 공식 앱에서 사전 예매하세요.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">✓ 모바일 신분증 허용</span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">✓ 미성년자 등본 지참</span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white font-medium">✓ 가고싶은섬 모바일 예약</span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Photo Cards */}
            {[
              { step: "03", img: "/images/island/daeijakdo/1.jpg", icon: "🌊", title: "물때 & 바다 날씨", subtitle: "대이작도 풀등 모래섬", desc: "물이 빠지는 '간조' 전후 2시간이 골든타임입니다. 출항 전 기상 특보를 꼭 확인하세요." },
              { step: "04", img: "/images/island/baengnyeongdo/1.jpg", icon: "🚌", title: "섬 내부 이동 수단", subtitle: "백령도·덕적도 공영버스", desc: "입항 시각에 맞춘 공영버스와 소형 섬 쾌적한 도보 트레킹 코스를 미리 파악하세요." },
              { step: "05", img: "/images/island/deokjeokdo/1.jpg", icon: "⛺", title: "LNT 클린 캠핑 수칙", subtitle: "Leave No Trace", desc: "섬 쓰레기 처리는 어렵습니다. 종량제 봉투를 준비하여 내가 발생시킨 쓰레기는 육지로 전량 회수하세요." },
            ].map((card) => (
              <div
                key={card.step}
                className="lg:col-span-4 rounded-[24px] overflow-hidden relative min-h-[300px] flex flex-col justify-end p-6 group shadow-md"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url('${card.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#86EFAC]">STEP {card.step}</span>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <span className="text-[11px] text-white/70 block mb-1">{card.subtitle}</span>
                  <h4 className="text-[19px] font-bold text-white mb-2 leading-snug">{card.title}</h4>
                  <p className="text-[13px] text-white/80 leading-[160%] m-0">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 [OPTION 3] 시네마틱 스텝 탭 & 인터랙티브 쇼케이스 (Airbnb / Apple Style) */}
      {/* ========================================================================= */}
      <section id="starter-guide-option-3" className="w-full bg-[#FAFAFA] py-[72px] md:py-[110px] border-b border-[#EDEDED]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          {/* Header */}
          <div className="text-center max-w-[760px] mx-auto mb-[40px] md:mb-[56px] flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-[#E6FDE5] text-[#0F3E17] border border-[#86EFAC] mb-3.5">
              ✦ OPTION 3 · 시네마틱 스텝 탭 & 인터랙티브 쇼케이스 (Apple Style)
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,46px)] font-extrabold tracking-[-0.03em] text-[#191F28] mb-3 leading-[1.25]">
              단계별로 알아보는 완벽한 섬 여행
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#6A6A6A] leading-[160%] m-0 font-normal">
              왼쪽 스텝을 클릭하면 오른쪽에서 사진과 실전 팁이 시네마틱하게 전환됩니다.
            </p>
          </div>

          {/* 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] md:gap-[36px] items-stretch max-w-[1240px] mx-auto">
            {/* Left: Interactive Step Selector */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {starterGuideSteps.map((item, idx) => {
                const isActive = optAStep === idx;
                return (
                  <button
                    key={`opt3-${item.step}`}
                    type="button"
                    onClick={() => setOptAStep(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                      isActive
                        ? "bg-white border-[#0F3E17] shadow-[0_8px_24px_rgba(15,62,23,0.08)] -translate-x-1"
                        : "bg-white/60 border-[#EDEDED] hover:bg-white hover:border-[#D4D4D4]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isActive ? "bg-[#0F3E17] text-white" : "bg-[#F0F0F0] text-[#6A6A6A]"
                      }`}>
                        {item.step}
                      </span>
                      <div>
                        <span className="text-[11px] font-semibold text-[#848484] block mb-0.5">{item.subtitle}</span>
                        <h4 className={`text-[17px] font-bold leading-tight ${isActive ? "text-[#0F3E17]" : "text-[#191F28]"}`}>
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Dynamic Cinematic Card with Photos */}
            <div className="lg:col-span-7 flex">
              <div className="w-full rounded-[28px] bg-white border border-[#EDEDED] p-7 sm:p-9 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold font-mono bg-[#0F3E17] text-white">
                      STEP {starterGuideSteps[optAStep].step} GUIDE
                    </span>
                    <span className="text-4xl">{starterGuideSteps[optAStep].icon}</span>
                  </div>

                  <span className="text-xs font-bold text-[#0F3E17] uppercase tracking-wider block mb-2">
                    {starterGuideSteps[optAStep].subtitle}
                  </span>
                  <h3 className="text-[24px] sm:text-[28px] font-extrabold text-[#191F28] mb-4 leading-snug">
                    {starterGuideSteps[optAStep].title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-[#4E5968] leading-[170%] mb-6">
                    {starterGuideSteps[optAStep].desc}
                  </p>
                </div>

                {/* Interactive Bottom Tip Box */}
                <div className="pt-5 border-t border-[#EDEDED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F8F9FA] -mx-7 sm:-mx-9 -mb-7 sm:-mb-9 p-6 sm:p-7">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F3E17] animate-pulse" />
                    <span className="text-xs font-bold text-[#191F28]">한눈섬길 공식 실전 팁</span>
                  </div>
                  <span className="text-xs text-[#848484] font-medium">
                    {optAStep + 1} / 5 단계 확인 중
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 [OPTION 4] 아웃도어 패스포트 & 실전 체크리스트 (Passport Checklist) */}
      {/* ========================================================================= */}
      <section id="starter-guide-option-4" className="w-full bg-[#F5F3EF] py-[72px] md:py-[110px] border-b border-[#E6E2D8]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          {/* Header */}
          <div className="text-center max-w-[760px] mx-auto mb-[40px] md:mb-[56px] flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-[#E8E3D5] text-[#524B3A] border border-[#D9D3C3] mb-3.5">
              ✦ OPTION 4 · 아웃도어 패스포트 실전 체크보드
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,46px)] font-extrabold tracking-[-0.03em] text-[#2D2A26] mb-3 leading-[1.25]">
              섬 여행 출발 전 패스포트 점검
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#6E695E] leading-[160%] m-0 font-normal">
              직접 하나씩 눌러보며 준비 완료 도장을 찍어보세요.
            </p>
          </div>

          {/* Passport Container */}
          <div className="max-w-[920px] mx-auto rounded-[32px] border-2 border-[#E0DBCF] bg-[#FAF8F5] p-7 sm:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            {/* Stamp Progress Meter */}
            <div className="mb-8 pb-6 border-b border-[#E6E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8C8474] uppercase tracking-wider block mb-1">
                  ISLAND PASSPORT CHECK
                </span>
                <h3 className="text-xl font-extrabold text-[#2D2A26]">나의 섬 여행 준비율</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-36 h-3 rounded-full bg-[#E8E3D5] overflow-hidden">
                  <div
                    className="h-full bg-[#0F3E17] transition-all duration-500 rounded-full"
                    style={{ width: `${(optDChecked.length / starterGuideSteps.length) * 100}%` }}
                  />
                </div>
                <span className="font-mono font-extrabold text-sm text-[#0F3E17]">
                  {optDChecked.length}/{starterGuideSteps.length} STAMPS
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-3">
              {starterGuideSteps.map((item, idx) => {
                const isChecked = optDChecked.includes(idx);
                return (
                  <div
                    key={`opt4-${item.step}`}
                    onClick={() => toggleOptD(idx)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? "bg-[#F0F7F1] border-[#86EFAC] shadow-sm"
                        : "bg-white border-[#EDE9DE] hover:border-[#C4BCAB]"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isChecked ? "bg-[#0F3E17] text-white" : "border-2 border-[#C4BCAB] bg-white"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className={`text-xs font-extrabold font-mono px-2.5 py-0.5 rounded-full border ${item.accentBg} ${item.accentText} ${item.accentBorder}`}>
                          STEP {item.step}
                        </span>
                        <h4 className={`text-[17px] font-bold ${isChecked ? "text-[#0F3E17]" : "text-[#2D2A26]"}`}>
                          {item.title}
                        </h4>
                        <span className="text-2xl ml-auto">{item.icon}</span>
                      </div>
                      <p className="text-[13.5px] text-[#6E695E] leading-[160%] m-0">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>





      {/* ========================================================================= */}
      {/* SECTION 3: 영상으로 보는 섬 백패킹 후기 */}
      {/* ========================================================================= */}
      <section id="youtube-reviews-section" data-screen-label="SCR_000 유튜브 리뷰" className="w-full bg-white mt-[80px] mb-[100px] md:mb-[200px]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div id="youtube-reviews-header" className="text-center max-w-[700px] mx-auto mb-[32px] md:mb-[48px] flex flex-col items-center">
            <h2 className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-gray-900 mb-3">
              영상으로 보는 섬 백패킹 후기
            </h2>
            <p className="text-[14px] sm:text-[16px] text-[#6A6A6A] leading-[160%] m-0">
              백패킹 성지로 꼽히는 대표 섬 3곳의 생생한 영상 후기를 살펴보세요.
            </p>
          </div>

          {/* 3 Video Cards with Staggered Scroll Reveal */}
          <div
            ref={youtubeGridRef}
            id="youtube-cards-grid"
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[32px]"
          >
            {youtubeVideos.map((vid, idx) => (
              <div
                key={vid.id}
                id={`youtube-card-${vid.id}`}
                style={{
                  transitionDelay: youtubeVisible ? `${idx * 180}ms` : "0ms",
                }}
                className={`flex flex-col gap-[16px] group cursor-pointer transition-all duration-700 ease-out ${youtubeVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[48px]"
                  }`}
                onClick={() => setActiveVideo(vid.embedUrl)}
              >
                {/* Video Thumbnail Box */}
                <div className="relative aspect-video w-full rounded-[8px] sm:rounded-[12px] overflow-hidden bg-[#EDEDED] shadow-sm group-hover:shadow-md transition-shadow">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${vid.img}')` }}
                  />
                  <div className="absolute left-4 top-4 right-20 flex flex-col gap-0.5 pointer-events-none">
                    <span className="text-2xl font-bold tracking-tight text-white drop-shadow">
                      {vid.badgeTitle}
                    </span>
                    <span className="text-lg font-bold tracking-tight text-main-50 drop-shadow">
                      {vid.badgeSub}
                    </span>
                  </div>

                  <span className="absolute right-4 bottom-4 inline-flex items-center h-6 px-2 rounded bg-sub-900/80 text-white text-xs font-medium">
                    {vid.dur}
                  </span>

                  {/* White Circular Play Button with Transparent Triangle Cutout (Punched Hole) */}
                  <div
                    id={`youtube-play-btn-${vid.id}`}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                  >
                    <svg
                      className="w-[56px] h-[56px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.22)]"
                      viewBox="0 0 56 56"
                    >
                      <mask id={`play-mask-${vid.id}`}>
                        <rect width="56" height="56" rx="28" fill="white" />
                        <polygon points="23,17 39,28 23,39" fill="black" />
                      </mask>
                      <rect
                        width="56"
                        height="56"
                        rx="28"
                        fill="rgba(255, 255, 255, 0.95)"
                        mask={`url(#play-mask-${vid.id})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Text Info Below Thumbnail */}
                <div className="flex flex-col gap-[6px]">
                  <h3 className="text-[20px] sm:text-[22px] font-bold tracking-[-0.01em] text-[#282828] leading-[130%] group-hover:text-[#0F3E17] transition-colors m-0">
                    {vid.title}
                  </h3>
                  <span className="text-[13px] sm:text-[14px] text-[#6A6A6A] leading-[150%]">{vid.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: 나에게 맞는 첫 번째 여행 섬 찾기 */}
      {/* ========================================================================= */}
      <section id="curation-section" className="w-full bg-white mb-[100px] md:mb-[160px]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">

          {/* Header */}
          <div id="curation-section-header" className="text-center max-w-[700px] mx-auto mb-[32px] md:mb-[48px]">
            <h2 id="curation-main-title" className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-[#282828] mb-3">
              나에게 맞는 첫 번째 여행 섬 찾기
            </h2>
            <p id="curation-subtitle" className="text-[14px] sm:text-[16px] text-[#6A6A6A] leading-[160%] m-0">
              어떤 여행을 꿈꾸시나요? 목적에 맞는 섬을 추천해 드립니다.
            </p>
          </div>

          {/* 3 White Card Type Theme Curation Cards */}
          <div
            id="curation-cards-grid"
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[32px]"
          >
            {curationThemes.map((theme, idx) => (
              <Link
                key={theme.id}
                id={`curation-card-${idx + 1}`}
                href={theme.primaryHref}
                className="flex flex-col rounded-[8px] sm:rounded-[12px] border border-[#D4D4D4] bg-[#FFFFFF] overflow-hidden hover:border-[#0F3E17] hover:shadow-[0_8px_24px_rgba(21,29,31,0.08)] transition-all duration-300 group cursor-pointer"
              >
                {/* Top Image Box */}
                <div className="relative h-[200px] sm:h-[220px] w-full shrink-0 overflow-hidden bg-[#EDEDED]">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Content Area (White Background) */}
                <div className="p-[20px] sm:p-[24px] bg-[#FFFFFF] flex flex-col flex-1 gap-[12px]">
                  {/* Hashtags (Above Title) */}
                  <div className="flex items-center gap-[6px] flex-wrap">
                    {theme.tags.map((tag) => (
                      <span
                        key={tag}
                        className="h-[26px] inline-flex items-center px-[10px] rounded-full text-[12px] font-normal border border-[#EDEDED] bg-[#FFFFFF] text-[#6A6A6A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-[20px] sm:text-[22px] font-bold tracking-[-0.01em] text-[#282828] leading-[130%] group-hover:text-[#0F3E17] transition-colors">
                    {theme.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] sm:text-[15px] text-[#6A6A6A] leading-[150%] m-0 flex-1">
                    {theme.desc}
                  </p>

                  {/* Recommended Islands */}
                  <div className="pt-[14px] mt-[4px] border-t border-[#EDEDED] flex items-center gap-[6px] flex-wrap">
                    <span className="text-[12px] text-[#848484] font-medium mr-[2px]">추천 섬</span>
                    {theme.islands.map((island, i) => {
                      const color = getIslandColor(island.name, idx * 3 + i);
                      return (
                        <span
                          key={island.name}
                          id={`curation-island-badge-${theme.id}-${island.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = island.href;
                          }}
                          className={`h-[26px] inline-flex items-center px-[10px] rounded-full text-[12px] font-bold border ${color.bg} ${color.text} ${color.border} hover:opacity-85 transition-all cursor-pointer`}
                        >
                          {island.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div
          id="youtube-video-modal"
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="youtube-modal-close-btn"
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/80 text-white text-xl font-bold flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>
            <iframe
              src={activeVideo}
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
