import Link from "next/link";
import Image from "next/image";
import { trails } from "@/data";

export default function Home() {
  // Show first 2 trails as featured
  const featuredTrails = trails.slice(0, 2);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center min-h-[80vh] py-20 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.15] mb-5 tracking-[-1.5px]">
          섬들의 아름다움을 걷다<br />
          <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">섬길 (Seomgil)</span>
        </h1>
        <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[600px] leading-relaxed mb-10">
          고요한 숲터널, 붉게 물드는 해안선, 오랜 이야기를 품은 돌담길까지. 
          바쁜 일상에서 벗어나 아름다운 섬의 온전한 쉼을 찾아 떠나는 특별한 산책길 큐레이션.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/explore" className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-[#059669] text-white py-3.5 px-7 rounded-full font-semibold text-base shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(16,185,129,0.5)] transition-all duration-300">
            길 탐색하기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#featured" className="inline-flex items-center bg-white/4 border border-card-border text-text-primary py-3.5 px-7 rounded-full font-medium text-base hover:bg-white/8 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300">
            추천 코스 보기
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container">
        <h2 className="text-[1.8rem] font-bold mb-3 tracking-tight">테마별 섬길</h2>
        <p className="text-[0.95rem] text-text-secondary mb-9">오늘 당신의 마음에 닿는 길은 어디인가요?</p>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
          <Link href="/explore?category=nature" className="flex flex-col p-8 text-left border border-card-border relative overflow-hidden group hover:border-card-hover-border hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] transition-all duration-300 glass-panel">
            <span className="absolute top-0 left-0 w-1 h-full bg-card-border group-hover:bg-primary transition-all duration-300"></span>
            <span className="text-3xl mb-5">🌲</span>
            <h3 className="text-[1.2rem] font-semibold mb-2">숲 / 자연</h3>
            <p className="text-[0.85rem] text-text-secondary leading-relaxed">초록빛 가득한 숲에서 내쉬는 상쾌한 피톤치드와 치유의 시간.</p>
          </Link>

          <Link href="/explore?category=ocean" className="flex flex-col p-8 text-left border border-card-border relative overflow-hidden group hover:border-card-hover-border hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] transition-all duration-300 glass-panel">
            <span className="absolute top-0 left-0 w-1 h-full bg-card-border group-hover:bg-primary transition-all duration-300"></span>
            <span className="text-3xl mb-5">🌊</span>
            <h3 className="text-[1.2rem] font-semibold mb-2">바다길</h3>
            <p className="text-[0.85rem] text-text-secondary leading-relaxed">끝없이 펼쳐진 푸른 수평선과 붉게 타오르는 저녁 노을길.</p>
          </Link>

          <Link href="/explore?category=alley" className="flex flex-col p-8 text-left border border-card-border relative overflow-hidden group hover:border-card-hover-border hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] transition-all duration-300 glass-panel">
            <span className="absolute top-0 left-0 w-1 h-full bg-card-border group-hover:bg-primary transition-all duration-300"></span>
            <span className="text-3xl mb-5">🧱</span>
            <h3 className="text-[1.2rem] font-semibold mb-2">숨은 골목</h3>
            <p className="text-[0.85rem] text-text-secondary leading-relaxed">따뜻한 돌담과 고즈넉한 한옥 너머로 흐르는 오랜 시간의 흔적.</p>
          </Link>

          <Link href="/explore?category=culture" className="flex flex-col p-8 text-left border border-card-border relative overflow-hidden group hover:border-card-hover-border hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] transition-all duration-300 glass-panel">
            <span className="absolute top-0 left-0 w-1 h-full bg-card-border group-hover:bg-primary transition-all duration-300"></span>
            <span className="text-3xl mb-5">📚</span>
            <h3 className="text-[1.2rem] font-semibold mb-2">문화 / 예술</h3>
            <p className="text-[0.85rem] text-text-secondary leading-relaxed">책 향기와 잔잔한 커피 향이 어우러지는 나만의 작은 아지트.</p>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-20 bg-gradient-to-b from-transparent to-[rgba(16,185,129,0.02)]">
        <div className="container m-auto">
          <h2 className="text-[1.8rem] font-bold mb-3 tracking-tight">이달의 인기 섬길</h2>
          <p className="text-[0.95rem] text-text-secondary mb-9">여행자들이 가장 사랑한 고요하고 고즈넉한 코스들을 만나보세요.</p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-8 max-[480px]:grid-cols-1">
            {featuredTrails.map((trail) => (
              <Link href={`/explore/${trail.id}`} key={trail.id} className="flex flex-col rounded-[20px] overflow-hidden border border-card-border bg-card-bg hover:-translate-y-2 hover:border-card-hover-border hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.05)] group transition-all duration-300">
                <div className="relative w-full h-[240px] overflow-hidden">
                  <Image 
                    src={trail.image} 
                    alt={trail.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#030307]/70 backdrop-blur-[4px] py-1.5 px-3 rounded-full text-xs font-medium text-primary border border-primary/20">{trail.categoryLabel}</span>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-[1.3rem] font-semibold mb-2">{trail.title}</h3>
                  <p className="text-sm text-text-secondary leading-normal mb-5 line-clamp-2">{trail.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 mt-auto border-t border-white/5 text-xs text-text-muted">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        ⏱️ {trail.duration}
                      </span>
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        📏 {trail.distance}
                      </span>
                    </div>
                    <div className="text-primary flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      <span className={`badge ${
                        trail.difficulty === "쉬움" ? "badge-easy" : 
                        trail.difficulty === "보통" ? "badge-medium" : "badge-hard"
                      }`}>
                        {trail.difficulty}
                      </span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
