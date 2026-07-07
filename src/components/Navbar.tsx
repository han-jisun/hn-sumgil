"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 left-0 w-full z-[100] bg-nav-bg backdrop-blur-md border-b border-card-border transition-all duration-300">
      <div className="flex justify-between items-center h-[72px] container m-auto">
        <Link href="/" className="flex items-center gap-2 text-[1.4rem] font-bold text-text-primary tracking-tight">
          <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#0ea5e9]"></span>
          인천 한눈섬길
        </Link>
        <nav>
          <ul className="flex gap-8 items-center list-none">
            <li>
              <Link 
                href="/" 
                className={`text-[0.95rem] font-medium py-2 relative hover:text-text-primary transition-colors duration-300 ${
                  pathname === "/" ? "text-primary font-semibold" : "text-text-secondary"
                }`}
              >
                홈
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                href="/explore" 
                className={`text-[0.95rem] font-medium py-2 relative hover:text-text-primary transition-colors duration-300 ${
                  pathname.startsWith("/explore") ? "text-primary font-semibold" : "text-text-secondary"
                }`}
              >
                탐색하기
                {pathname.startsWith("/explore") && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                href="/checklist" 
                className={`text-[0.95rem] font-medium py-2 relative hover:text-text-primary transition-colors duration-300 ${
                  pathname.startsWith("/checklist") ? "text-primary font-semibold" : "text-text-secondary"
                }`}
              >
                체크리스트
                {pathname.startsWith("/checklist") && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-[2px] shadow-[0_0_6px_#0ea5e9]"></span>
                )}
              </Link>
            </li>
            <li className="ml-2">
              <Link 
                href="/data" 
                className={`text-[0.8rem] font-medium py-1.5 px-3 rounded-lg border transition-all duration-300 ${
                  pathname.startsWith("/data") 
                    ? "bg-white/5 border-white/10 text-text-secondary font-semibold" 
                    : "border-transparent text-text-muted hover:text-text-secondary opacity-50 hover:opacity-90"
                }`}
              >
                데이터 확인 ⚙️
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
