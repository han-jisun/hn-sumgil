import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { trails } from "@/data";
import Checklist from "@/components/Checklist";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrailDetailPage({ params }: PageProps) {
  const { id } = await params;
  const trail = trails.find((t) => t.id === id);

  if (!trail) {
    notFound();
  }

  return (
    <div className="py-10 pb-[100px] container m-auto">
      {/* Back Button */}
      <Link href="/explore" className="inline-flex items-center gap-2 text-text-secondary text-[0.9rem] mb-8 py-2 px-4 bg-white/3 border border-card-border rounded-full hover:text-primary hover:bg-primary/5 hover:border-primary/30 hover:-translate-x-1 transition-all duration-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        목록으로 돌아가기
      </Link>

      {/* Hero Header Section */}
      <section className="relative w-full h-[480px] rounded-[24px] overflow-hidden mb-12 border border-card-border">
        <Image 
          src={trail.image} 
          alt={trail.title} 
          fill 
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#030307]/95 via-[#030307]/40 to-transparent flex flex-col justify-end p-12 max-[480px]:p-6">
          <span className="self-start bg-primary/15 text-primary border border-primary/30 py-1.5 px-3.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-[4px]">{trail.categoryLabel}</span>
          <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-bold mb-3 tracking-[-1px]">{trail.title}</h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[800px] leading-normal">{trail.subtitle}</p>
        </div>
      </section>

      {/* Detail Layout */}
      <div className="grid grid-cols-[7fr_5fr] gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        {/* Left Column - Core Info */}
        <section className="flex flex-col gap-12">
          {/* Detailed Story */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[1.6rem] font-bold border-b border-white/8 pb-3 tracking-tight">길 이야기</h2>
            <p className="text-[1.05rem] leading-relaxed text-text-secondary whitespace-pre-line">{trail.details}</p>
          </div>

          {/* Traveler Checklist */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[1.6rem] font-bold border-b border-white/8 pb-3 tracking-tight">탐방 준비물 체크리스트</h2>
            <p className="text-[1.05rem] leading-relaxed text-text-secondary whitespace-pre-line" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              출발하기 전 필요한 준비물을 체크해보세요.
            </p>
            <Checklist items={trail.checklist} />
          </div>

          {/* User Reviews */}
          <div className="flex flex-col gap-5">
            <h2 className="text-[1.6rem] font-bold border-b border-white/8 pb-3 tracking-tight">방문자 리뷰</h2>
            <div className="flex flex-col gap-5">
              {trail.reviews.map((review, index) => (
                <div key={index} className="p-6 rounded-[16px] border border-card-border bg-white/2">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-[0.95rem]">{review.name}</span>
                      <span className="text-xs text-text-muted">{review.date}</span>
                    </div>
                    <span className="text-[#fbbf24] text-[0.9rem]">
                      {"★".repeat(Math.floor(review.rating))}
                      {review.rating % 1 !== 0 ? "☆" : ""}
                      <span style={{ marginLeft: 4, fontWeight: 6 }}>{review.rating}</span>
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column - Sidebar info */}
        <aside className="flex flex-col gap-8">
          <div className="sticky top-24 flex flex-col gap-8 max-[900px]:static">
            {/* Spec Card */}
            <div className="p-7 border border-card-border glass-panel">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">총 거리</span>
                  <span className="text-[1.1rem] font-semibold text-text-primary">{trail.distance}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">소요 시간</span>
                  <span className="text-[1.1rem] font-semibold text-text-primary">{trail.duration}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">난이도</span>
                  <span className={`badge ${
                    trail.difficulty === "쉬움" ? "badge-easy" : 
                    trail.difficulty === "보통" ? "badge-medium" : "badge-hard"
                  }`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    {trail.difficulty}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-text-muted font-medium">추천 계절</span>
                  <span className="text-[1.1rem] font-semibold text-text-primary" style={{ fontSize: '0.95rem' }}>{trail.season}</span>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="p-7 border border-card-border bg-gradient-to-br from-primary/3 to-transparent glass-panel">
              <h3 className="text-[1.1rem] font-bold mb-4 flex items-center gap-2 text-primary">💡 알짜배기 탐방 팁</h3>
              <ul className="flex flex-col gap-3 list-none">
                {trail.tips.map((tip, index) => (
                  <li key={index} className="text-[0.85rem] leading-relaxed text-text-secondary relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Location Map */}
            <div className="p-6 border border-card-border glass-panel">
              <h3 className="text-[1.1rem] font-bold mb-3 flex items-center gap-2">📍 지도 및 위치 정보</h3>
              <div className="w-full h-[180px] rounded-[12px] bg-[#0f1015] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden mb-4">
                <div className="absolute w-[150%] h-[150%] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] -rotate-10"></div>
                {/* Simulated Map Trail Path SVG */}
                <svg className="w-[120px] h-[60px] relative z-[1]" viewBox="0 0 100 50">
                  <path 
                    d="M 10 40 Q 30 10 50 30 T 90 20" 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                </svg>
                <div className="w-3 h-3 bg-primary border-[3px] border-white rounded-full absolute top-[30%] left-1/2 shadow-[0_0_10px_#10b981] animate-pulse-glow z-[2]"></div>
              </div>
              <p className="text-[0.85rem] text-text-secondary leading-normal">
                <strong>주소:</strong><br />
                {trail.location}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
