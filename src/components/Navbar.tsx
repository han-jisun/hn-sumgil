"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`w-full z-[100] transition-all duration-300 ${
        isHome
          ? "absolute top-0 left-0 right-0 h-[96px] bg-transparent border-none"
          : "sticky top-0 left-0 h-[72px] bg-white/90 backdrop-blur-md border-b border-[#E8E8E8]"
      }`}
    >
      <div
        className={`flex justify-between items-center max-w-[1440px] m-auto px-4 sm:px-10 ${
          isHome ? "h-[96px]" : "h-[72px]"
        }`}
      >
        {/* Logo with Subtitle */}
        <Link href="/" className="flex items-baseline gap-1.5 sm:gap-2 shrink-0 group">
          <span
            className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
              isHome ? "text-white group-hover:text-[#B6CED5]" : "text-[#0F3E17] group-hover:text-[#093712]"
            }`}
          >
            한눈섬길
          </span>
          <span
            className={`text-[10px] sm:text-[12px] font-medium tracking-[0.05em] inline-block ${
              isHome ? "text-[#B6CED5]" : "text-[#626E71]"
            }`}
          >
            INCHEON ISLANDS | EXPLORE
          </span>
        </Link>

        {/* Header Navigation */}
        <nav className="flex items-center gap-3 sm:gap-8 shrink-0">
          <Link
            href="/data"
            className={`text-xs sm:text-base font-medium sm:font-normal transition-colors ${
              isHome
                ? pathname.startsWith("/data") ? "text-[#E6FDE5] font-semibold" : "text-white hover:text-[#B6CED5]"
                : pathname.startsWith("/data") ? "text-[#0F3E17] font-semibold" : "text-[#282828] hover:text-[#0F3E17]"
            }`}
          >
            데이터
          </Link>
          <Link
            href="/explore"
            className={`text-xs sm:text-base font-medium sm:font-normal transition-colors ${
              isHome
                ? pathname.startsWith("/explore") ? "text-[#E6FDE5] font-semibold" : "text-white hover:text-[#B6CED5]"
                : pathname.startsWith("/explore") ? "text-[#0F3E17] font-semibold" : "text-[#282828] hover:text-[#0F3E17]"
            }`}
          >
            한눈 탐색
          </Link>
          <Link
            href="/theme"
            className={`text-xs sm:text-base font-medium sm:font-normal transition-colors ${
              isHome
                ? pathname.startsWith("/theme") ? "text-[#E6FDE5] font-semibold" : "text-white hover:text-[#B6CED5]"
                : pathname.startsWith("/theme") ? "text-[#0F3E17] font-semibold" : "text-[#282828] hover:text-[#0F3E17]"
            }`}
          >
            테마 섬길
          </Link>
        </nav>
      </div>
    </header>
  );
}
