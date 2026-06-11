import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import "@/firebase";

export const metadata: Metadata = {
  title: "한눈섬길 | 섬의 아름다운 길을 걷다",
  description: "아름다운 섬들의 비경과 조용한 산책로를 발견하고 특별한 여정을 떠나보세요.",
  keywords: ["한눈섬길", "산책로", "비밀의숲", "제주돌담길", "제주노을길", "독립서점", "힐링여행"],
  openGraph: {
    title: "한눈섬길 | 섬의 아름다운 길을 걷다",
    description: "아름다운 섬들의 비경과 조용한 산책로를 발견해보세요.",
    type: "website",
    locale: "ko_KR",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-[#020205] border-t border-card-border py-12 mt-auto text-text-secondary text-sm">
          <div className="flex flex-col items-center gap-6 text-center container m-auto">
            <div className="text-lg font-bold text-text-primary flex items-center gap-1.5">
              <span className="w-1.5 height-1.5 bg-primary rounded-full shadow-[0_0_8px_#10b981]" style={{ height: 6 }}></span>
              한눈섬길
            </div>
            <ul className="flex gap-6 list-none">
              <li>
                <a href="/" className="text-text-secondary hover:text-primary transition-colors duration-300">홈</a>
              </li>
              <li>
                <a href="/explore" className="text-text-secondary hover:text-primary transition-colors duration-300">탐색하기</a>
              </li>
              <li>
                <a href="/data" className="text-text-secondary hover:text-primary transition-colors duration-300">데이터 확인</a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors duration-300">소개</a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors duration-300">문의하기</a>
              </li>
            </ul>
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} 한눈섬길. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
