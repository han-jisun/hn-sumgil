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
          : "sticky top-0 left-0 h-[64px] sm:h-[80px] bg-white/90 backdrop-blur-md border-none"
      }`}
    >
      <div
        className="flex justify-between items-center max-w-[1440px] m-auto px-[16px] sm:px-[40px] h-[64px] sm:h-[80px]"
      >
        {/* Logo (Symbol + Wordmark) */}
        <Link
          id="nav-logo-link"
          href="/"
          className="flex items-center gap-[8px] sm:gap-[10px] shrink-0 select-none py-1"
        >
          {/* Symbol (Hidden on <=420px mobile screens) */}
          <img
            src={isHome ? "/symbol-white.svg" : "/symbol.svg"}
            alt="한눈섬길 심볼"
            className="hidden min-[421px]:block h-[28px] sm:h-[34px] w-auto object-contain shrink-0"
          />

          {/* Wordmark (40px on <=420px mobile, 42px on desktop) */}
          <img
            src={isHome ? "/wordmark-white.svg" : "/wordmark.svg"}
            alt="한눈섬길 INCHEON ISLANDS"
            className="h-[40px] min-[421px]:h-[34px] sm:h-[42px] w-auto object-contain shrink-0"
          />
        </Link>

        {/* Header Navigation */}
        <nav id="nav-menu" className="flex items-center gap-[16px] min-[421px]:gap-[24px] sm:gap-[32px] shrink-0">
          {/* 한눈 탐색 */}
          <Link
            id="nav-link-explore"
            href="/explore"
            className={`group relative inline-flex items-center gap-[6px] text-[16px] min-[421px]:text-[18px] leading-[100%] transition-colors py-[4px] ${
              isHome
                ? pathname.startsWith("/explore")
                  ? "text-[#E6FDE5] font-bold"
                  : "text-white hover:text-[#E6FDE5] font-medium"
                : pathname.startsWith("/explore")
                ? "text-[#0F3E17] font-bold"
                : "text-[#282828] hover:text-[#0F3E17] font-medium"
            }`}
          >
            {/* Capsule Underlay Highlighter (형광펜 효과) */}
            <span
              className={`absolute left-[-4px] right-[-4px] bottom-[2px] h-[10px] rounded-full -z-10 transition-all duration-300 pointer-events-none ${
                isHome
                  ? pathname.startsWith("/explore")
                    ? "bg-[#E6FDE5]/25 opacity-100 scale-100"
                    : "bg-[#E6FDE5]/20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  : pathname.startsWith("/explore")
                  ? "bg-[#E6FDE5] opacity-100 scale-100"
                  : "bg-[#E6FDE5]/80 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
              }`}
            />
            <svg
              className="hidden min-[421px]:block w-[20px] h-[20px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 21C5.5 18.5 14 18 22 21" />
              <path d="M13 19.5C12.5 15 11 11 10 9" />
              <path d="M10 9C7 8.5 4 10.5 3 14" />
              <path d="M10 9C11 6 14 5.5 17 7" />
              <path d="M10 9C13 10 17 11.5 19 15" />
              <circle cx="5" cy="6.5" r="2" />
            </svg>
            <span>한눈 탐색</span>
          </Link>

          {/* 테마 섬길 */}
          <Link
            id="nav-link-theme"
            href="/theme"
            className={`group relative inline-flex items-center gap-[6px] text-[16px] min-[421px]:text-[18px] leading-[100%] transition-colors py-[4px] ${
              isHome
                ? pathname.startsWith("/theme")
                  ? "text-[#E6FDE5] font-bold"
                  : "text-white hover:text-[#E6FDE5] font-medium"
                : pathname.startsWith("/theme")
                ? "text-[#0F3E17] font-bold"
                : "text-[#282828] hover:text-[#0F3E17] font-medium"
            }`}
          >
            {/* Capsule Underlay Highlighter (형광펜 효과) */}
            <span
              className={`absolute left-[-4px] right-[-4px] bottom-[2px] h-[10px] rounded-full -z-10 transition-all duration-300 pointer-events-none ${
                isHome
                  ? pathname.startsWith("/theme")
                    ? "bg-[#E6FDE5]/25 opacity-100 scale-100"
                    : "bg-[#E6FDE5]/20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  : pathname.startsWith("/theme")
                  ? "bg-[#E6FDE5] opacity-100 scale-100"
                  : "bg-[#E6FDE5]/80 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
              }`}
            />
            <svg
              className="hidden min-[421px]:block w-[20px] h-[20px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 4.5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
              <path d="M22 4.5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>테마 섬길</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
