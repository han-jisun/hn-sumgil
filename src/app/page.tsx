"use client";

import React, { useState, useEffect } from "react";
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



export default function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedOri, setSelectedOri] = useState(0);
  const [activeCurationTab, setActiveCurationTab] = useState<"popular" | "recent">("popular");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [subIdx, setSubIdx] = useState(0);
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);

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
      <section id="hero-section" data-screen-label="Hero" className="relative w-full h-[100dvh] min-h-[600px] sm:h-[780px] overflow-hidden bg-main-900">
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
      <section id="curation-section" className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">

          {/* Header */}
          <div id="curation-section-header" className="text-center max-w-[700px] mx-auto mb-12 sm:mb-16">
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
          <div id="curation-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[32px]">
            {curationThemes.map((theme, idx) => (
              <Link
                key={theme.id}
                id={`curation-card-${idx + 1}`}
                href={theme.primaryHref}
                className="flex flex-col rounded-[8px] sm:rounded-[12px] border border-[#D4D4D4] bg-[#FFFFFF] overflow-hidden hover:border-[#0F3E17] hover:shadow-[0_8px_24px_rgba(21,29,31,0.08)] transition-all duration-200 group cursor-pointer"
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
                  {/* Subtle Image Top Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(21,29,31,0.6) 0%, rgba(21,29,31,0.2) 40%, rgba(21,29,31,0) 100%)",
                    }}
                  />

                  {/* Badges on Image */}
                  <div className="absolute left-[16px] top-[16px] right-[16px] flex items-center justify-between gap-[8px]">
                    <span className={`px-[10px] py-[3px] rounded-full text-[12px] font-bold shadow-sm border ${theme.badgeBg}`}>
                      {theme.badge}
                    </span>
                    <div className="flex items-center gap-[4px]">
                      {theme.tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-black/40 backdrop-blur-sm text-white px-[8px] py-[2px] rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Content Area (White Background) */}
                <div className="p-[20px] sm:p-[24px] bg-[#FFFFFF] flex flex-col flex-1 gap-[12px]">
                  {/* Title */}
                  <h3 className="text-[20px] sm:text-[22px] font-bold tracking-[-0.01em] text-[#282828] leading-[130%] group-hover:text-[#0F3E17] transition-colors">
                    {theme.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] sm:text-[15px] text-[#6A6A6A] leading-[150%] m-0 flex-1">
                    {theme.desc}
                  </p>

                  {/* Recommended Island Chips */}
                  <div className="pt-[16px] mt-[8px] border-t border-[#EDEDED] flex flex-wrap items-center justify-between gap-[8px]">
                    <div className="flex flex-wrap items-center gap-[6px]">
                      <span className="text-[12px] text-[#848484] font-medium mr-[2px]">추천 섬</span>
                      {theme.islands.map((island) => (
                        <span
                          key={island.name}
                          id={`curation-island-link-${theme.id}-${island.name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = island.href;
                          }}
                          className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-[6px] bg-[#F6F6F6] hover:bg-[#E6FDE5] text-[#282828] hover:text-[#0F3E17] text-[12px] font-medium transition-colors"
                        >
                          <span>{island.name}</span>
                          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        </span>
                      ))}
                    </div>
                    <span className="text-[13px] font-medium text-[#0F3E17] group-hover:underline inline-flex items-center gap-[2px]">
                      자세히
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
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
      <section id="youtube-reviews-section" data-screen-label="SCR_000 유튜브 리뷰" className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">
          <div id="youtube-reviews-header" className="text-center max-w-[700px] mx-auto mb-12 sm:mb-16 flex flex-col items-center">
            <span className="text-xs font-semibold tracking-wider text-sub-700 uppercase mb-2 block">
              SCR_000 · 홈 큐레이션 03
            </span>
            <h2 className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-gray-900 mb-3">
              영상으로 보는 섬 백패킹 후기
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0 mb-6">
              유튜브 검색 파싱 데이터 · 옹진군 섬 조회수 상위 3개 · 카드에서 바로 재생
            </p>
            <Link
              id="link-more-reviews"
              href="/explore"
              className="inline-flex items-center gap-2 text-main-500 font-medium text-base hover:text-main-700 transition-colors"
            >
              리뷰 더 보기
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>

          {/* 3 Video Cards */}
          <div id="youtube-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {youtubeVideos.map((vid) => (
              <div key={vid.id} id={`youtube-card-${vid.id}`} className="flex flex-col gap-4 group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${vid.img}')` }}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-sub-900/20 via-transparent to-sub-900/60" />

                  <span className="absolute left-4 top-4 inline-flex items-center h-7 px-3 rounded-full bg-white/90 text-xs font-medium text-gray-900">
                    인라인 재생
                  </span>

                  <div className="absolute left-4 top-14 right-20 flex flex-col gap-0.5 pointer-events-none">
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

                  {/* Play Button Overlay */}
                  <button
                    id={`youtube-play-btn-${vid.id}`}
                    type="button"
                    onClick={() => setActiveVideo(vid.embedUrl)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/95 hover:bg-white hover:scale-110 transition-all shadow-lg cursor-pointer"
                    aria-label={`Play ${vid.title}`}
                  >
                    <span className="block w-0 h-0 ml-1 border-l-[16px] border-l-main-500 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-lg font-medium text-gray-900 leading-snug group-hover:text-main-500 transition-colors">
                    {vid.title}
                  </span>
                  <span className="text-xs text-gray-500">{vid.meta}</span>
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
