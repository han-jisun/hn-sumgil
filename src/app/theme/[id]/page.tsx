import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { themeContents } from "@/magazine/data";
import { notFound } from "next/navigation";

import MagazineViewer from "@/components/MagazineViewer";

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
      htmlContent = fs.readFileSync(filePath, "utf-8");
    }
  } catch (err) {
    console.error("Failed to read magazine file:", err);
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Back Link */}
        <Link
          href="/theme"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F3E17] hover:underline mb-6 px-4 sm:px-8 pt-6"
        >
          ← 목록으로 돌아가기
        </Link>

        {/* HTML Article Content */}
        <div className="w-full">
          {htmlContent ? (
            <MagazineViewer html={htmlContent} isFullLayout={true} />
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
