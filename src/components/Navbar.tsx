"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      id="main-navbar"
      className={`w-full z-[100] transition-colors duration-200 ${
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
        <Link id="nav-logo-link" href="/" className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2.5 shrink-0 group">
          <span
            className={`text-xl sm:text-2xl font-bold tracking-tight leading-none transition-colors ${
              isHome ? "text-white group-hover:text-[#B6CED5]" : "text-[#0F3E17] group-hover:text-[#093712]"
            }`}
          >
            한눈섬길
          </span>
          <span
            className={`text-[9px] sm:text-[12px] font-medium tracking-[0.05em] leading-none inline-block mt-0.5 sm:mt-0 ${
              isHome ? "text-[#B6CED5]" : "text-[#626E71]"
            }`}
          >
            INCHEON ISLANDS | EXPLORE
          </span>
        </Link>

        {/* Header Navigation */}
        <nav id="nav-menu" className="flex items-center gap-4 sm:gap-8 shrink-0">
          <Link
            id="nav-link-explore"
            href="/explore"
            className={`text-xs sm:text-base font-medium sm:font-normal leading-none transition-colors ${
              isHome
                ? pathname.startsWith("/explore") ? "text-[#E6FDE5] font-semibold" : "text-white hover:text-[#B6CED5]"
                : pathname.startsWith("/explore") ? "text-[#0F3E17] font-semibold" : "text-[#282828] hover:text-[#0F3E17]"
            }`}
          >
            한눈 탐색
          </Link>
          <Link
            id="nav-link-theme"
            href="/theme"
            className={`text-xs sm:text-base font-medium sm:font-normal leading-none transition-colors ${
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
