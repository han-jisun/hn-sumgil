import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { themeContents } from "@/magazine/data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return themeContents.map((item) => ({
    id: item.id,
  }));
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const content = themeContents.find((item) => item.id === id);

  if (!content) {
    notFound();
  }

  let htmlContent = "";
  try {
    const filePath = path.join(process.cwd(), "src", "magazine", content.file_name);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const match = raw.match(/<article[\s\S]*<\/article>/i);
      htmlContent = match ? match[0] : raw;
    }
  } catch (err) {
    console.error("Failed to read magazine file:", err);
  }

  return (
    <div className="w-full bg-[#F6F6F6]/30 text-[#282828] min-h-[85vh] py-12 sm:py-16 px-6 sm:px-10 font-sans antialiased">
      <div className="max-w-[900px] mx-auto">
        {/* Back Link */}
        <Link
          href="/theme"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F3E17] hover:underline mb-8"
        >
          ← 목록으로 돌아가기
        </Link>

        {/* Article Header */}
        <div className="bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-10 shadow-sm mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-[#0F3E17]/10 text-[#0F3E17] text-xs font-bold uppercase tracking-wide">
              {content.id.toUpperCase()}
            </span>
            <span className="text-xs text-[#848484] font-medium">
              📅 {content.date}
            </span>
            <span className="text-xs text-[#848484] font-medium">
              ✍️ {content.writer}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#282828] leading-tight">
            {content.title}
          </h1>
        </div>

        {/* HTML Article Content / Fallback */}
        <div className="bg-white border border-[#D4D4D4] rounded-2xl p-6 sm:p-10 shadow-sm leading-relaxed">
          {htmlContent ? (
            <div
              className="prose max-w-none text-sm sm:text-base text-[#282828]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div className="py-12 text-center text-[#848484] flex flex-col gap-2">
              <span className="text-3xl">📖</span>
              <p className="text-sm font-medium">상세 아티클 내용을 작성 중입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
