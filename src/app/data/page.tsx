import Link from "next/link";

export default function DataPage() {
  return (
    <div className="py-20 px-6 container m-auto flex flex-col justify-center items-center min-h-[70vh] text-center relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>
      
      {/* Premium Card Container */}
      <div className="max-w-[560px] w-full p-10 glass-panel border border-card-border shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-full flex items-center justify-center m-auto mb-6 border border-secondary/30 relative">
          <span className="text-3xl relative z-10">📊</span>
          <span className="absolute inset-0 bg-secondary/10 rounded-full animate-pulse blur-[4px]"></span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-4 text-text-primary">
          데이터 확인 <span className="bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent">(Data Check)</span>
        </h1>
        
        <p className="text-text-secondary leading-relaxed mb-8 text-[0.95rem]">
          이 페이지는 데이터 확인을 위한 빈 페이지 공간입니다.<br />
          추후 데이터베이스와 연동하거나 추가 콘텐츠를 렌더링할 예정입니다.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/" className="inline-flex items-center bg-white/4 border border-card-border text-text-primary py-3 px-6 rounded-full font-medium text-sm hover:bg-white/8 hover:border-white/20 transition-all duration-300">
            홈으로 이동
          </Link>
          <Link href="/explore" className="inline-flex items-center bg-gradient-to-br from-primary to-[#059669] text-white py-3 px-6 rounded-full font-semibold text-sm shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all duration-300">
            길 탐색하기
          </Link>
        </div>
      </div>
    </div>
  );
}
