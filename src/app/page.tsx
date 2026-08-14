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
    img: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "scr3-video-2",
    title: "무의도 호룡곡산 종주 후 하나개해변 노지 캠핑",
    badgeTitle: "호룡곡산 종주",
    badgeSub: "하나개 노지캠핑",
    dur: "12:07",
    meta: "주말섬로그 · 조회수 11만회 · 2026.05.30",
    img: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  },
  {
    id: "scr3-video-3",
    title: "초보 섬백패킹은 승봉도 | 배 시간·물때 정리",
    badgeTitle: "초보 섬백패킹",
    badgeSub: "배시간·물때 정리",
    dur: "09:51",
    meta: "백패킹하는남자 · 조회수 8.7만회 · 2026.07.05",
    img: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
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

  useEffect(() => {
    const el = curationGridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCurationVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = youtubeGridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setYoutubeVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      {/* SECTION 1: 나에게 맞는 첫 번째 인천 섬 찾기 (와이드 매거진 커버 3-카드) */}
      {/* ========================================================================= */}
      <section id="curation-section" className="w-full bg-white mt-[64px] md:mt-[120px] mb-[64px] md:mb-[120px]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">

          {/* Header */}
          <div id="curation-section-header" className="text-center max-w-[700px] mx-auto mb-[32px] md:mb-[48px]">
            <span className="text-xs font-semibold tracking-wider text-main-500 uppercase mb-2 block">
              ISLAND THEME CURATION
            </span>
            <h2 id="curation-main-title" className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-gray-900 mb-3">
              나에게 맞는 첫 번째 여행 섬 찾기
            </h2>
            <p id="curation-subtitle" className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
              어떤 여행을 꿈꾸시나요? 목적에 맞는 섬을 추천해 드립니다.
            </p>
          </div>

          {/* 3 White Card Type Theme Curation Cards */}
          <div
            ref={curationGridRef}
            id="curation-cards-grid"
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[32px]"
          >
            {curationThemes.map((theme, idx) => (
              <Link
                key={theme.id}
                id={`curation-card-${idx + 1}`}
                href={theme.primaryHref}
                style={{
                  transitionDelay: curationVisible ? `${idx * 180}ms` : "0ms",
                }}
                className={`flex flex-col rounded-[8px] sm:rounded-[12px] border border-[#D4D4D4] bg-[#FFFFFF] overflow-hidden hover:border-[#0F3E17] hover:shadow-[0_8px_24px_rgba(21,29,31,0.08)] transition-all duration-700 ease-out group cursor-pointer ${
                  curationVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[48px]"
                }`}
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

                  {/* Recommended Islands (Flat Capsule Badge Style, At Bottom Divider Area) */}
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





      {/* ========================================================================= */}
      {/* SECTION 3: 영상으로 보는 섬 백패킹 후기 */}
      {/* ========================================================================= */}
      <section id="youtube-reviews-section" data-screen-label="SCR_000 유튜브 리뷰" className="w-full bg-white mb-[100px] md:mb-[200px]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div id="youtube-reviews-header" className="text-center max-w-[700px] mx-auto mb-[32px] md:mb-[48px] flex flex-col items-center">
            <span className="text-xs font-semibold tracking-wider text-sub-700 uppercase mb-2 block">
              SCR_000 · 홈 큐레이션 03
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-gray-900 mb-3">
              영상으로 보는 섬 백패킹 후기
            </h2>
            <p className="text-[14px] sm:text-[16px] text-[#6A6A6A] leading-[160%] m-0">
              유튜브 검색 파싱 데이터 · 옹진군 섬 조회수 상위 3개 · 카드에서 바로 재생
            </p>
          </div>

          {/* 3 Video Cards with Identical Staggered Scroll Reveal & Card Structure */}
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
                className={`flex flex-col rounded-[8px] sm:rounded-[12px] border border-[#D4D4D4] bg-[#FFFFFF] overflow-hidden hover:border-[#0F3E17] hover:shadow-[0_8px_24px_rgba(21,29,31,0.08)] transition-all duration-700 ease-out group cursor-pointer ${
                  youtubeVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[48px]"
                }`}
                onClick={() => setActiveVideo(vid.embedUrl)}
              >
                {/* Top Image Thumbnail Box */}
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#EDEDED]">
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

                {/* Bottom Content Area (White Background) */}
                <div className="p-[20px] sm:p-[24px] bg-[#FFFFFF] flex flex-col flex-1 gap-[8px]">
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
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white text-xl font-bold flex items-center justify-center hover:bg-black transition-colors"
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
