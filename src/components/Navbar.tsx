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
          ? "absolute top-0 left-0 right-0 h-[64px] sm:h-[80px] bg-transparent border-none"
          : "sticky top-0 left-0 h-[64px] sm:h-[80px] bg-white/90 backdrop-blur-md border-b border-[#E8E8E8]"
      }`}
    >
      <div
        className="flex justify-between items-center max-w-[1440px] m-auto px-[16px] sm:px-[40px] h-[64px] sm:h-[80px]"
      >
        {/* Logo with Subtitle */}
        <Link id="nav-logo-link" href="/" className="flex items-center gap-[10px] shrink-0 group">
          <span
            className={`text-[24px] font-bold tracking-[-0.02em] leading-[100%] transition-colors ${
              isHome ? "text-white group-hover:text-[#B6CED5]" : "text-[#0F3E17] group-hover:text-[#093712]"
            }`}
          >
            한눈섬길
          </span>
          <span
            className={`hidden sm:inline-block text-[12px] font-medium tracking-[0.05em] leading-[100%] ${
              isHome ? "text-[#B6CED5]" : "text-[#626E71]"
            }`}
          >
            INCHEON ISLANDS | EXPLORE
          </span>
        </Link>

        {/* Header Navigation */}
        <nav id="nav-menu" className="flex items-center gap-[24px] sm:gap-[32px] shrink-0">
          <Link
            id="nav-link-explore"
            href="/explore"
            className={`text-[18px] font-medium leading-[100%] transition-colors ${
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
            className={`text-[18px] font-medium leading-[100%] transition-colors ${
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
