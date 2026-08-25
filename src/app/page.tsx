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

  // Framer Tabs Card Active State & Continuous Auto Rolling (4.5s)
  const [activeGuideTab, setActiveGuideTab] = useState(0);

  // Starter Guide Auto-rolling timer (4.5s, resets on tab click so user gets full duration)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGuideTab((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeGuideTab]);

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
      tag: "필수 지참",
      title: "신분증 지참 필수",
      subtitle: "실물 신분증 또는 정부24 모바일 신분증",
      desc: "여객선 승선 시 승선권과 신분증 실물 대조가 100% 법적 의무화되어 있습니다. 미성년자는 주민등록등본 또는 가족관계증명서를 반드시 준비하세요.",
      image: "/images/guide/step1-id.png",
      pos: "bg-[position:center_10px] sm:bg-[position:center_14px]",
      badge: "정부24 · 모바일 신분증 100% 허용",
      tip: "💡 터미널 현장 무인민원발급기에서 등본 즉시 발급 가능"
    },
    {
      step: "02",
      icon: "🚢",
      tag: "사전 예매",
      title: "가고싶은섬 배표 예매 팁",
      subtitle: "한국해운조합 공식 예약 사이트",
      desc: "주말 및 성수기 인기 섬(굴업도·백령도·덕적도)은 승선권이 조기 매진됩니다. 최소 1~2주 전 한국해운조합 '가고싶은섬' 공식 앱에서 사전 예매하세요.",
      image: "/images/guide/step2-ferry.png",
      pos: "bg-[position:center_10px] sm:bg-[position:center_14px]",
      badge: "주말 조기 매진 주의 · 공식 사전 예매",
      tip: "🚢 차량 선적(카페리)은 온라인 예매 불가 시 현장 선착순 접수"
    },
    {
      step: "03",
      icon: "🌊",
      tag: "해양 기상",
      title: "물때 & 바다 날씨 확인",
      subtitle: "간조/만조 시각 및 풍랑 특보",
      desc: "대이작도 풀등 모래섬과 해안 트레킹, 갯벌 체험은 물이 빠지는 '간조' 전후 2시간이 골든타임입니다. 출발 당일 아침 출항 여부를 꼭 확인하세요.",
      image: "/images/guide/step3-tide.png",
      pos: "bg-[position:center_36px] sm:bg-[position:center_26px]",
      badge: "간조 전후 2시간 골든타임",
      tip: "🌊 국립해양조사원 물때표 및 바다날씨 실시간 연동"
    },
    {
      step: "04",
      icon: "🚌",
      tag: "섬내 교통",
      title: "섬 내부 이동 수단 파악",
      subtitle: "입항 연계 공영버스 & 도보 코스",
      desc: "백령도·덕적도 등 큰 섬은 여객선 입항 시각에 맞춰 공영버스가 운행됩니다. 대연평·굴업도 등 소형 섬은 여유로운 도보 트레킹으로 충분히 둘러볼 수 있습니다.",
      image: "/images/guide/step4-bus.png",
      pos: "bg-[position:center_10px] sm:bg-[position:center_14px]",
      badge: "여객선 입항 연계 공영버스",
      tip: "🚌 배 도착 시간에 맞춰 선착장 앞 버스 바로 대기"
    },
    {
      step: "05",
      icon: "⛺",
      tag: "클린 캠핑",
      title: "LNT 클린 섬 캠핑 수칙",
      subtitle: "Leave No Trace - 흔적 남기지 않기",
      desc: "섬은 자체 쓰레기 처리가 어렵습니다. 종량제 봉투를 준비하여 발생한 모든 쓰레기는 육지로 전량 되가져오는 성숙한 클린 백패킹을 실천해 주세요.",
      image: "/images/guide/step5-camping.png",
      pos: "bg-[position:center_32px] sm:bg-[position:center_24px]",
      badge: "쓰레기 100% 육지 되가져오기",
      tip: "⛺ 지정된 야영장 이용 및 화기 사용 시 안전 철저"
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
      {/* SECTION 1: 배편 예매부터 신분증까지, 첫 섬 여행 가이드 (Framer Tabs Card UI) */}
      {/* ========================================================================= */}
      <section id="starter-guide-section" className="w-full bg-white py-[64px] md:py-[100px] border-t border-[#EDEDED]">
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,4vw,40px)]">

          {/* Header */}
          <div id="starter-guide-header" className="text-center max-w-[700px] mx-auto mb-[32px] md:mb-[48px]">
            <h2 id="starter-guide-main-title" className="m-0 text-[clamp(28px,3.6vw,48px)] font-bold tracking-tight text-[#191F28] mb-3">
              첫 여행자 필독 가이드
            </h2>
            <p id="starter-guide-subtitle" className="text-[14px] sm:text-[16px] text-[#6A6A6A] leading-[160%] m-0">
              배편 예매부터 신분증까지, 첫 섬 여행 가이드
            </p>
          </div>

          {/* Framer Tabs-Card Container (No outer box wrapper) */}
          <div className="max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">

              {/* Mobile Only: 1~5 Single Row Number Bar (번호만 노출) */}
              <div className="lg:hidden col-span-1 flex flex-col gap-2 w-full mb-1">
                <div className="grid grid-cols-5 gap-2 w-full">
                  {starterGuideSteps.map((item, idx) => {
                    const isActive = activeGuideTab === idx;
                    return (
                      <button
                        key={`mobile-guide-tab-${item.step}`}
                        type="button"
                        onClick={() => {
                          setActiveGuideTab(idx); // 클릭한 탭으로 즉시 이동 후 4.5초 뒤 다음으로 자동 롤링 계속
                        }}
                        className={`h-[42px] flex items-center justify-center rounded-[12px] transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#0F3E17] text-white border border-[#0F3E17] font-bold shadow-sm"
                            : "bg-[#F8FAF9] text-[#64748B] hover:bg-[#F1F5F3] border border-[#E5E7EB] font-medium"
                        }`}
                      >
                        <span className="font-mono text-[16px] leading-none">{item.step}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Only: 5 Vertical Tabs (좌측 세로 선 없이 깔끔한 1px 테두리 디자인) */}
              <div className="hidden lg:flex lg:col-span-5 flex-col gap-2.5 w-full">
                {starterGuideSteps.map((item, idx) => {
                  const isActive = activeGuideTab === idx;
                  return (
                    <button
                      key={`framer-tab-${item.step}`}
                      type="button"
                      onClick={() => {
                        setActiveGuideTab(idx);
                      }}
                      onMouseEnter={() => {
                        setActiveGuideTab(idx);
                      }}
                      className={`text-left px-5 py-3.5 rounded-[18px] transition-all duration-200 flex items-center justify-between cursor-pointer w-full ${
                        isActive
                          ? "bg-white shadow-[0_4px_20px_rgba(15,62,23,0.08)] border border-[#0F3E17] -translate-y-0.5"
                          : "bg-[#F8FAF9] hover:bg-[#F1F5F3] border border-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Step Number Badge */}
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 shrink-0 ${
                            isActive
                              ? "bg-[#0F3E17] text-white"
                              : "bg-[#E2E8F0] text-[#64748B]"
                          }`}
                        >
                          {item.step}
                        </span>

                        <div className="min-w-0">
                          <span
                            className={`text-[11px] font-semibold block uppercase tracking-wider transition-colors truncate ${
                              isActive ? "text-[#0F3E17]" : "text-[#94A3B8]"
                            }`}
                          >
                            {item.tag} · {item.subtitle}
                          </span>
                          <h4
                            className={`text-[16px] lg:text-[17px] font-bold leading-snug transition-colors truncate ${
                              isActive ? "text-[#0F3E17]" : "text-[#1E293B]"
                            }`}
                          >
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Icon */}
                      <span className={`text-2xl shrink-0 transition-transform duration-200 ml-2 ${isActive ? "scale-110" : "opacity-50"}`}>
                        {item.icon}
                      </span>
                    </button>
                  );
                })}

              </div>

              {/* Right Column: Full-Bleed 3D Showcase Card with Transparent PNG Cutout */}
              <div className="lg:col-span-7 flex">
                <div className="w-full rounded-[24px] sm:rounded-[28px] overflow-hidden relative border border-[#E2E8F0] min-h-[420px] sm:min-h-[500px] flex flex-col justify-between p-5 sm:p-7 bg-[#F9FBFA] group shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                  {/* 3D Transparent Cutout Object (Custom position per step) */}
                  <div
                    key={`bg-img-${activeGuideTab}`}
                    className={`absolute inset-0 bg-contain ${starterGuideSteps[activeGuideTab].pos} bg-no-repeat transition-all duration-700 ease-out transform group-hover:scale-105 p-4 sm:p-6`}
                    style={{ backgroundImage: `url('${starterGuideSteps[activeGuideTab].image}')` }}
                  />

                  {/* Soft bottom fade to ensure perfect text contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-[48%] sm:h-[42%] bg-gradient-to-t from-[#F9FBFA] via-[#F9FBFA]/90 to-transparent pointer-events-none" />

                  {/* Top Green Rounded Pill Badge */}
                  <div className="relative z-10 flex items-center justify-start pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[14px] font-bold bg-[#E6FDE5] text-[#0F3E17] border border-[#86EFAC] shadow-sm">
                      ✓ {starterGuideSteps[activeGuideTab].badge}
                    </span>
                  </div>

                  {/* Bottom Text & Tip Area */}
                  <div className="relative z-10">
                    <h3 className="text-[19px] sm:text-[23px] font-extrabold text-[#191F28] tracking-tight leading-snug mb-1.5 sm:mb-2">
                      {starterGuideSteps[activeGuideTab].title}
                    </h3>
                    <p className="text-[13px] sm:text-[14.5px] text-[#475569] leading-[160%] mb-3 max-w-[560px] font-medium">
                      {starterGuideSteps[activeGuideTab].desc}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#0F3E17]">
                      <span>{starterGuideSteps[activeGuideTab].tip}</span>
                    </div>
                  </div>

                </div>
              </div>

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
