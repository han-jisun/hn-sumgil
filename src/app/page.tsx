"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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



export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedOri, setSelectedOri] = useState(0);
  const [activeCurationTab, setActiveCurationTab] = useState<"popular" | "recent">("popular");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [subIdx, setSubIdx] = useState(0);

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
    <div id="main-page-container" className="w-full bg-white text-[#282828] font-sans antialiased">
      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section id="hero-section" data-screen-label="Hero" className="relative w-full h-[100dvh] min-h-[600px] sm:h-[900px] overflow-hidden bg-[#022100]">
        {/* Background Slide Images with Ken Burns & Fade */}
        <div id="hero-bg-slider" className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === heroIdx;
            return (
              <div
                key={slide.name}
                id={`hero-slide-${idx}`}
                className={`absolute inset-0 transition-opacity duration-1400 ease-in-out ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-[9000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                    }`}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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

        {/* Hero Content */}
        <div id="hero-content" className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-5 sm:px-10 pt-12 sm:pt-20 flex flex-col justify-center">
          <div className="max-w-[900px]">

            {/* Title */}
            <h1 id="hero-main-title" className="m-0 text-white font-normal leading-none flex flex-col items-start">
              <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-xl md:text-2xl text-white/88 font-light mb-1.5 sm:mb-2">
                <span className="w-6 sm:w-10 h-[1px] bg-white/55 shrink-0" />
                복잡한 인천 섬 여행 준비,
              </span>
              <span className="block text-[32px] sm:text-6xl md:text-[76px] font-bold tracking-[-0.035em] text-white mt-1 leading-[1.15]">
                <span className="relative inline-block text-[#E6FDE5] mr-2">
                  <span className="absolute left-[-4px] right-[-4px] bottom-1.5 sm:bottom-2.5 h-[10px] sm:h-[14px] rounded-full bg-[#E6FDE5]/22 -z-10" />
                  한눈섬길
                </span>
                로 명쾌하게
              </span>
            </h1>

            {/* Rolling Subtitles (Smooth Vertical Slot Ticker) */}
            <div id="hero-subtitle-ticker" className="mt-4 sm:mt-6 h-[48px] sm:h-[36px] overflow-hidden relative max-w-[800px]">
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
                    className={`absolute top-0 left-0 m-0 text-[#F6F6F6] text-sm sm:text-lg md:text-xl leading-[1.4] font-normal transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${stateClass}`}
                  >
                    {text}
                  </p>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mt-6 sm:mt-8">
              <Link
                id="hero-cta-explore-btn"
                href="/explore"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 h-11 sm:h-14 px-6 sm:px-8 rounded-lg border border-white/40 bg-white/5 hover:bg-white/12 backdrop-blur-sm text-white font-medium text-sm sm:text-lg transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                  <path d="M2 13.2C4.4 8.2 6.9 5.4 9.1 5.4c2.3 0 4.9 2.8 7.3 7.8" />
                  <path d="M2 16.6c1.4 0 1.4 1.2 2.9 1.2s1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.4-1.2 2.9-1.2 1.4 1.2 2.9 1.2" />
                </svg>
                섬 탐색
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div id="hero-bottom-bar" className="absolute left-0 right-0 bottom-10 z-10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 grid grid-cols-12 gap-4 items-end">
            {/* Active Slide Name (Stacked vertically above indicators on mobile) */}
            <div className="col-span-12 sm:col-span-4 flex items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
              <span className="w-4 sm:w-6 h-[1px] bg-white/60 shrink-0" />
              <span className="text-xs font-medium tracking-wider text-[#B6CED5] uppercase shrink-0">지금 보이는 곳</span>
              <span id="hero-current-slide-label" className="text-sm sm:text-base font-medium text-white truncate">
                {heroSlides[heroIdx].name}
              </span>
            </div>

            {/* Slide Progress & Controls */}
            <div id="hero-slide-controls" className="col-span-12 sm:col-start-9 sm:col-span-4 flex items-center justify-end gap-3 sm:gap-4">
              <span id="hero-slide-counter" className="text-white text-xs font-medium tracking-wider">
                0{heroIdx + 1} / 0{heroSlides.length}
              </span>
              <div id="hero-slide-indicators" className="flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    id={`hero-slide-btn-${i}`}
                    type="button"
                    onClick={() => setHeroIdx(i)}
                    className="w-12 sm:w-16 h-1 p-0 border-none rounded-full overflow-hidden bg-white/30 cursor-pointer"
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
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/40 bg-transparent text-white text-xs font-medium hover:bg-white/10 transition-colors"
                aria-label={isPlaying ? "Pause auto slide" : "Play auto slide"}
              >
                {isPlaying ? "❙❙" : "▶"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: 백패킹 인증 성지 컬렉션 */}
      {/* ========================================================================= */}
      <section id="curation-section" data-screen-label="SCR_000 성지 컬렉션" className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Header */}
            <div id="curation-section-header" className="lg:col-span-3 flex flex-col gap-4">
              <span className="text-xs font-medium tracking-wider text-[#626E71] uppercase">
                SCR_000 · 홈 큐레이션 01
              </span>
              <h2 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight text-[#282828] leading-tight">
                백패킹 인증<br className="hidden sm:inline" /> 성지 컬렉션
              </h2>
              <p className="text-base text-[#6A6A6A] leading-relaxed">
                네이버·유튜브·인스타그램 후기 집계 · 최근 3년 10건 이상 코스만
              </p>

              {/* Filter Tabs */}
              <div id="curation-filter-tabs" className="flex flex-col gap-2.5 mt-2">
                <button
                  id="curation-tab-popular"
                  type="button"
                  onClick={() => setActiveCurationTab("popular")}
                  className={`h-12 rounded-lg font-medium text-base transition-colors ${activeCurationTab === "popular"
                    ? "bg-[#0F3E17] text-white"
                    : "bg-[#F6F6F6] text-[#848484] hover:bg-[#EDEDED] hover:text-[#525252]"
                    }`}
                >
                  후기 많은 섬
                </button>
                <button
                  id="curation-tab-recent"
                  type="button"
                  onClick={() => setActiveCurationTab("recent")}
                  className={`h-12 rounded-lg font-medium text-base transition-colors ${activeCurationTab === "recent"
                    ? "bg-[#0F3E17] text-white"
                    : "bg-[#F6F6F6] text-[#848484] hover:bg-[#EDEDED] hover:text-[#525252]"
                    }`}
                >
                  최근 인증 섬
                </button>
              </div>
              <span className="text-xs text-[#848484] mt-2">2026.07.28 갱신</span>
            </div>

            {/* Right 3 Cards Grid */}
            <div id="curation-cards-grid" className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: 굴업도 */}
              <div id="curation-card-gureopdo" className="flex flex-col border border-[#D4D4D4] rounded-lg overflow-hidden bg-white hover:border-[#0F3E17] hover:shadow-lg transition-all">
                <div className="relative h-52 bg-[#EDEDED] shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?fm=jpg&q=80&w=1000&auto=format&fit=crop')",
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#151D1F]/70 via-[#151D1F]/30 to-transparent" />
                  <span className="absolute top-5 right-5 z-10 inline-flex items-center h-7 px-3 rounded-full bg-[#E6FDE5] text-xs font-medium text-[#0F3E17]">
                    후기 최다
                  </span>
                  <div className="absolute left-5 right-5 top-5 flex flex-col gap-1 text-white">
                    <span className="text-2xl font-bold tracking-tight">굴업도</span>
                    <span className="text-xs text-white/95 drop-shadow">개머리언덕 ~ 큰말해변</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#525252]">★★★★★</span>
                    <span className="text-sm font-medium text-[#282828]">4.8</span>
                  </div>
                  <p className="text-base text-[#525252] leading-relaxed line-clamp-2">
                    “개머리언덕 일몰 하나로 다 잊혀요.”
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#F6F6F6]">
                  <span className="flex items-center text-xs text-[#848484]">
                    <span className="font-medium text-[#282828] mr-1">인증</span> +409개
                  </span>
                  <Link id="curation-link-gureopdo" href="/explore/굴업도" className="text-sm font-medium text-[#282828] hover:text-[#0F3E17]">
                    자세히
                  </Link>
                </div>
              </div>

              {/* Card 2: 무의도 */}
              <div id="curation-card-muuido" className="flex flex-col border border-[#D4D4D4] rounded-lg overflow-hidden bg-white hover:border-[#0F3E17] hover:shadow-lg transition-all">
                <div className="relative h-52 bg-[#EDEDED] shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1517824806704-9040b037703b?fm=jpg&q=80&w=1000&auto=format&fit=crop')",
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#151D1F]/70 via-[#151D1F]/30 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex flex-col gap-1 text-white">
                    <span className="text-2xl font-bold tracking-tight">무의도</span>
                    <span className="text-xs text-white/95 drop-shadow">호룡곡산 ~ 하나개해변</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#525252]">★★★★★</span>
                    <span className="text-sm font-medium text-[#282828]">4.5</span>
                  </div>
                  <p className="text-base text-[#525252] leading-relaxed line-clamp-2">
                    “정상 두 시간, 하산길엔 서해 낙조.”
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#F6F6F6]">
                  <span className="flex items-center text-xs text-[#848484]">
                    <span className="font-medium text-[#282828] mr-1">인증</span> +284개
                  </span>
                  <Link id="curation-link-muuido" href="/explore/무의도" className="text-sm font-medium text-[#282828] hover:text-[#0F3E17]">
                    자세히
                  </Link>
                </div>
              </div>

              {/* Card 3: 대이작도 */}
              <div id="curation-card-daeijakdo" className="flex flex-col border border-[#D4D4D4] rounded-lg overflow-hidden bg-white hover:border-[#0F3E17] hover:shadow-lg transition-all">
                <div className="relative h-52 bg-[#EDEDED] shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?fm=jpg&q=80&w=1000&auto=format&fit=crop')",
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#151D1F]/70 via-[#151D1F]/30 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex flex-col gap-1 text-white">
                    <span className="text-2xl font-bold tracking-tight">대이작도</span>
                    <span className="text-xs text-white/95 drop-shadow">부아산 능선 ~ 풀등</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#525252]">★★★★☆</span>
                    <span className="text-sm font-medium text-[#282828]">4.4</span>
                  </div>
                  <p className="text-base text-[#525252] leading-relaxed line-clamp-2">
                    “풀등 다음 능선, 하루가 알차요.”
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#F6F6F6]">
                  <span className="flex items-center text-xs text-[#848484]">
                    <span className="font-medium text-[#282828] mr-1">인증</span> +193개
                  </span>
                  <Link id="curation-link-daeijakdo" href="/explore/대이작도" className="text-sm font-medium text-[#282828] hover:text-[#0F3E17]">
                    자세히
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 배편 최저가 & 최단시간 Top 3 */}
      {/* ========================================================================= */}
      <section 
        id="ferry-comparison-section"
        data-screen-label="SCR_000 배편 최저가" 
        className="w-full bg-[#F4F8F5] bg-[url('/contour.svg')] bg-no-repeat bg-center bg-cover py-24 sm:py-32"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          {/* Header & Departure Tabs */}
          <div id="ferry-comparison-header" className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium tracking-wider text-[#8B9DA2] uppercase">
                SCR_000 · 홈 큐레이션 02
              </span>
              <h2 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight text-[#282828] leading-tight">
                가성비 백패킹 배편 요금 &amp; 시간 최저가 Top 3
              </h2>
              <span className="text-base text-[#6A6A6A]">
                인천항만공사·선사 공시 운임 크롤링 · 2026.07.01 갱신
              </span>
            </div>

            {/* Departure Pills */}
            <div className="flex flex-col items-start md:items-end gap-2.5">
              <span className="text-xs font-medium tracking-wider text-[#848484]">출발지 선택</span>
              <div id="departure-filter-tabs" className="flex flex-wrap items-center gap-2.5">
                {oriLabels.map((label, idx) => {
                  const isActive = selectedOri === idx;
                  return (
                    <button
                      key={label}
                      id={`departure-btn-${idx}`}
                      type="button"
                      onClick={() => setSelectedOri(idx)}
                      className={`h-9 px-5 rounded-full text-sm font-medium border transition-colors ${isActive
                        ? "border-[#0F3E17] bg-[#0F3E17] text-white"
                        : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2 Column Comparison Grid */}
          <div id="ferry-comparison-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: 가장 저렴한 배편 */}
            <div id="cheap-ferry-routes-column" className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-[#282828]">가장 저렴한 배편</span>
                <span className="text-xs text-[#848484]">왕복 · 성인 기준</span>
              </div>
              <div id="cheap-ferry-routes-list" className="flex flex-col gap-4">
                {cheapRoutes.map((r, i) => (
                  <div
                    key={r.island + r.pier}
                    id={`cheap-route-card-${i}`}
                    className="grid grid-cols-1 sm:grid-cols-[76px_1fr_160px] items-center gap-4 p-6 border border-[#D4D4D4] rounded-lg bg-white hover:border-[#0F3E17] hover:shadow-md transition-all"
                  >
                    <span
                      className="inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-medium self-start sm:self-center w-max"
                      style={{ backgroundColor: r.badgeBg, color: r.badgeFg }}
                    >
                      {r.badge}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-medium text-[#282828]">{r.island}</span>
                      <span className="text-xs sm:text-sm text-[#6A6A6A]">
                        {r.pier} · {r.durStr}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-start sm:justify-end gap-1">
                      <span className="text-3xl font-light tracking-tight text-[#282828]">
                        {r.roundStr}
                      </span>
                      <span className="text-sm font-normal text-[#282828]">원~</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 1시간 이내 도착 섬 */}
            <div id="fast-ferry-routes-column" className="flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-[#282828]">1시간 이내 도착 섬</span>
                <span className="text-xs text-[#848484]">왕복 · 성인 기준</span>
              </div>
              <div id="fast-ferry-routes-list" className="flex flex-col gap-4">
                {fastRoutes.length > 0 ? (
                  fastRoutes.map((r, i) => (
                    <div
                      key={r.island + r.pier}
                      id={`fast-route-card-${i}`}
                      className="grid grid-cols-1 sm:grid-cols-[76px_1fr_160px] items-center gap-4 p-6 border border-[#D4D4D4] rounded-lg bg-white hover:border-[#0F3E17] hover:shadow-md transition-all"
                    >
                      <span
                        className="inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-medium self-start sm:self-center w-max"
                        style={{ backgroundColor: r.badgeBg, color: r.badgeFg }}
                      >
                        {r.badge}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-medium text-[#282828]">{r.island}</span>
                        <span className="text-xs sm:text-sm text-[#6A6A6A]">
                          {r.pier} · {r.durStr}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-start sm:justify-end gap-1">
                        <span className="text-3xl font-light tracking-tight text-[#282828]">
                          {r.roundStr}
                        </span>
                        <span className="text-sm font-normal text-[#282828]">원~</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div id="fast-ferry-empty-box" className="flex flex-col justify-center gap-2 p-8 border border-dashed border-[#D4D4D4] rounded-lg bg-white min-h-[160px]">
                    <span className="text-base font-medium text-[#282828]">
                      이 출발지에는 1시간 이내 항로가 없습니다
                    </span>
                    <span className="text-sm text-[#6A6A6A]">
                      대부도 방아머리 또는 삼목선착장을 선택해 보세요
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: 영상으로 보는 섬 백패킹 후기 */}
      {/* ========================================================================= */}
      <section id="youtube-reviews-section" data-screen-label="SCR_000 유튜브 리뷰" className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
          <div id="youtube-reviews-header" className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium tracking-wider text-[#626E71] uppercase">
                SCR_000 · 홈 큐레이션 03
              </span>
              <h2 className="m-0 text-3xl sm:text-4xl font-bold tracking-tight text-[#282828] leading-tight">
                영상으로 보는 섬 백패킹 후기
              </h2>
              <span className="text-base text-[#6A6A6A]">
                유튜브 검색 파싱 데이터 · 옹진군 섬 조회수 상위 3개 · 카드에서 바로 재생
              </span>
            </div>
            <Link
              id="link-more-reviews"
              href="/explore"
              className="inline-flex items-center h-12 px-6 border border-[#0F3E17] rounded-lg text-[#0F3E17] font-medium text-base hover:bg-[#E6FDE5] transition-colors whitespace-nowrap"
            >
              리뷰 더 보기
            </Link>
          </div>

          {/* 3 Video Cards */}
          <div id="youtube-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {youtubeVideos.map((vid) => (
              <div key={vid.id} id={`youtube-card-${vid.id}`} className="flex flex-col gap-4 group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#EDEDED] shadow-sm group-hover:shadow-md transition-shadow">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${vid.img}')` }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#151D1F]/20 via-transparent to-[#151D1F]/60" />

                  <span className="absolute left-4 top-4 inline-flex items-center h-7 px-3 rounded-full bg-white/90 text-xs font-medium text-[#282828]">
                    인라인 재생
                  </span>

                  <div className="absolute left-4 top-14 right-20 flex flex-col gap-0.5 pointer-events-none">
                    <span className="text-2xl font-bold tracking-tight text-white drop-shadow">
                      {vid.badgeTitle}
                    </span>
                    <span className="text-lg font-bold tracking-tight text-[#E6FDE5] drop-shadow">
                      {vid.badgeSub}
                    </span>
                  </div>

                  <span className="absolute right-4 bottom-4 inline-flex items-center h-6 px-2 rounded bg-[#151D1F]/80 text-white text-xs font-medium">
                    {vid.dur}
                  </span>

                  {/* Play Button Overlay */}
                  <button
                    id={`youtube-play-btn-${vid.id}`}
                    type="button"
                    onClick={() => setActiveVideo(vid.embedUrl)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/95 hover:bg-white hover:scale-110 transition-all shadow-lg cursor-pointer"
                    aria-label={`Play ${vid.title}`}
                  >
                    <span className="block w-0 h-0 ml-1 border-l-[16px] border-l-[#0F3E17] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-lg font-medium text-[#282828] leading-snug group-hover:text-[#0F3E17] transition-colors">
                    {vid.title}
                  </span>
                  <span className="text-xs text-[#848484]">{vid.meta}</span>
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
