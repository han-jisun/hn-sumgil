"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-[100] bg-nav-bg backdrop-blur-md border-b border-card-border transition-all duration-300">
        <div className="flex justify-between items-center h-[60px] md:h-[72px] container m-auto px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 text-[0.95rem] sm:text-[1.1rem] md:text-[1.4rem] font-bold text-text-primary tracking-tight shrink-0">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full shadow-[0_0_10px_#0ea5e9]"></span>
            인천 한눈섬길
          </Link>
          
          {/* Header Navigation (Highly responsive, compact on mobile to prevent overflow) */}
          <nav>
            <ul className="flex gap-3 sm:gap-4 md:gap-8 items-center list-none m-0 p-0">
              <li>
                <Link 
                  href="/" 
                  className={`text-[0.78rem] md:text-[0.95rem] font-bold py-1.5 relative hover:text-text-primary transition-all duration-300 ${
                    pathname === "/" ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  홈
                  {pathname === "/" && (
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  href="/explore" 
                  className={`text-[0.78rem] md:text-[0.95rem] font-bold py-1.5 relative hover:text-text-primary transition-all duration-300 ${
                    pathname.startsWith("/explore") ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  <span className="sm:hidden">탐색</span>
                  <span className="hidden sm:inline">탐색하기</span>
                  {pathname.startsWith("/explore") && (
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  href="/checklist" 
                  className={`text-[0.78rem] md:text-[0.95rem] font-bold py-1.5 relative hover:text-text-primary transition-all duration-300 ${
                    pathname.startsWith("/checklist") ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  체크리스트
                  {pathname.startsWith("/checklist") && (
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                  )}
                </Link>
              </li>
              <li className="ml-1 sm:ml-2">
                <Link 
                  href="/data" 
                  className={`text-[0.72rem] md:text-[0.8rem] font-semibold py-1 px-2 md:py-1.5 md:px-3 rounded-lg border transition-all duration-300 shrink-0 ${
                    pathname.startsWith("/data") 
                      ? "bg-white/10 border-white/20 text-text-secondary font-bold" 
                      : "border-transparent text-text-muted hover:text-text-secondary opacity-50 hover:opacity-90"
                  }`}
                  title="데이터 확인 (관리자)"
                >
                  <span className="hidden md:inline">데이터 확인 ⚙️</span>
                  <span className="md:hidden">⚙️</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Keep for premium native mobile feel, synced with top nav) */}
      <div className="fixed bottom-0 left-0 w-full z-[99] md:hidden bg-nav-bg/95 backdrop-blur-lg border-t border-white/5 py-3 px-6 flex justify-around items-center shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1.5 text-[0.68rem] font-extrabold tracking-tight transition-all duration-300 ${
            pathname === "/" ? "text-primary scale-105" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <span className="text-lg leading-none">🏠</span>
          홈
        </Link>
        <Link 
          href="/explore" 
          className={`flex flex-col items-center gap-1.5 text-[0.68rem] font-extrabold tracking-tight transition-all duration-300 ${
            pathname.startsWith("/explore") ? "text-primary scale-105" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <span className="text-lg leading-none">🧭</span>
          탐색하기
        </Link>
        <Link 
          href="/checklist" 
          className={`flex flex-col items-center gap-1.5 text-[0.68rem] font-extrabold tracking-tight transition-all duration-300 ${
            pathname.startsWith("/checklist") ? "text-primary scale-105" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <span className="text-lg leading-none">🎒</span>
          체크리스트
        </Link>
      </div>
    </>
  );
}
