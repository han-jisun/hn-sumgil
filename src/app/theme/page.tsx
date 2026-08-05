import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { themeContents, ThemeContent } from "@/magazine/data";

interface PageProps {
  searchParams: Promise<{ id?: string; page?: string }>;
}

export default async function ThemeSumgilPage({ searchParams }: PageProps) {
  const { id, page } = await searchParams;

  // Sort theme contents by date descending (latest first)
  const sortedContents = [...themeContents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Select active content: requested ID or latest item
  const activeContent: ThemeContent =
    (id ? themeContents.find((item) => item.id === id) : null) ||
    sortedContents[0] ||
    themeContents[0];

  // Read HTML file content
  let htmlContent = "";
  if (activeContent?.file_name) {
    try {
      const filePath = path.join(process.cwd(), "src", "magazine", activeContent.file_name);
      if (fs.existsSync(filePath)) {
        htmlContent = fs.readFileSync(filePath, "utf-8");
      }
    } catch (err) {
      console.error(`Failed to read magazine file (${activeContent.file_name}):`, err);
    }
  }

  // Pagination logic (5 items per page)
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(sortedContents.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.max(1, Math.min(Number(page) || 1, totalPages));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContents = sortedContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full bg-[#F6F6F6]/30 text-[#282828] min-h-[85vh] py-10 sm:py-14 px-6 sm:px-10 font-sans antialiased">
      <div className="max-w-[900px] mx-auto flex flex-col gap-10 sm:gap-12">
        
        {/* Active Article Section */}
        <div className="flex flex-col gap-6">
          {/* Article Header (Title & Date) */}
          <div className="bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-md bg-[#0F3E17] text-white text-xs font-bold uppercase tracking-wide">
                {activeContent.id.toUpperCase()}
              </span>
              <span className="text-xs text-[#848484] font-medium">
                {activeContent.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-[#282828] leading-tight">
              {activeContent.title}
            </h1>
          </div>

          {/* HTML Article Content Area */}
          <div className="bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-8 shadow-sm min-h-[300px]">
            {htmlContent ? (
              <div
                className="prose max-w-none text-sm sm:text-base text-[#282828] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div className="py-16 text-center text-[#848484] flex flex-col items-center justify-center gap-3">
                <span className="text-4xl">📖</span>
                <p className="text-sm font-semibold text-[#282828]">
                  아티클 본문 컨텐츠 준비 중입니다.
                </p>
                <p className="text-xs text-[#848484]">
                  {activeContent.file_name} 파일에 작성되는 내용이 이곳에 표출됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Past Themes List Section ("지난 테마 보기" - Clean Vertical List Format) */}
        <div className="pt-8 border-t border-[#EDEDED] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#282828] flex items-center gap-2">
              📜 지난 테마 보기
            </h2>
            <span className="text-xs text-[#848484]">
              전체 {sortedContents.length}개 중 {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedContents.length)}
            </span>
          </div>

          {/* Vertical List */}
          <div className="bg-white border border-[#D4D4D4] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#EDEDED]">
            {paginatedContents.map((item) => {
              const isSelected = item.id === activeContent.id;
              return (
                <Link
                  key={item.id}
                  href={`/theme?id=${item.id}&page=${currentPage}`}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 transition-colors ${
                    isSelected
                      ? "bg-[#E6FDE5]/40 font-semibold"
                      : "hover:bg-[#F6F6F6]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase shrink-0 ${
                        isSelected
                          ? "bg-[#0F3E17] text-white"
                          : "bg-[#EDEDED] text-[#525252]"
                      }`}
                    >
                      {item.id.toUpperCase()}
                    </span>
                    <span className="text-sm sm:text-base text-[#282828] truncate">
                      {item.title}
                    </span>
                  </div>

                  <div className="text-xs text-[#848484] shrink-0 self-end sm:self-auto">
                    <span>{item.date}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Link
                href={`/theme?id=${activeContent.id}&page=${Math.max(1, currentPage - 1)}`}
                className={`h-9 px-3.5 rounded-lg border text-xs font-medium flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "border-[#EDEDED] text-[#D4D4D4] pointer-events-none"
                    : "border-[#D4D4D4] text-[#282828] hover:border-[#0F3E17] hover:text-[#0F3E17] bg-white"
                }`}
              >
                이전
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/theme?id=${activeContent.id}&page=${p}`}
                  className={`w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-colors ${
                    p === currentPage
                      ? "border-[#0F3E17] bg-[#0F3E17] text-white"
                      : "border-[#D4D4D4] text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17] bg-white"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={`/theme?id=${activeContent.id}&page=${Math.min(totalPages, currentPage + 1)}`}
                className={`h-9 px-3.5 rounded-lg border text-xs font-medium flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? "border-[#EDEDED] text-[#D4D4D4] pointer-events-none"
                    : "border-[#D4D4D4] text-[#282828] hover:border-[#0F3E17] hover:text-[#0F3E17] bg-white"
                }`}
              >
                다음
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
