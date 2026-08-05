import Link from "next/link";

export default function ThemeSumgilPage() {
  return (
    <div className="w-full bg-white text-[#282828] min-h-[80vh] py-16 px-6 sm:px-10 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6FDE5] border border-[#0F3E17]/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#0F3E17]" />
          <span className="text-xs font-semibold text-[#0F3E17] tracking-wider uppercase">
            한눈섬길 · 테마 섬길
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#282828] mb-4">
          테마 섬길
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#525252] max-w-[600px] leading-relaxed mb-10">
          인천 섬의 다양한 테마별 추천 코스를 준비 중입니다.<br />
          곧 더욱 풍성한 테마 섬길 콘텐츠로 찾아뵙겠습니다.
        </p>

        {/* Empty Placeholder Card */}
        <div className="w-full max-w-[800px] p-12 rounded-2xl border border-dashed border-[#D4D4D4] bg-[#F6F6F6] flex flex-col items-center justify-center gap-4">
          <span className="text-4xl">🏝️</span>
          <p className="text-sm font-medium text-[#848484]">
            새로운 테마 섬길 페이지가 이곳에 구성될 예정입니다.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#0F3E17] text-white text-sm font-medium hover:bg-[#093712] transition-colors"
          >
            코스 탐색 하러 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
