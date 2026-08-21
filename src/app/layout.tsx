import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "한눈섬길 | 복잡한 섬 여행 준비, 한눈에 명쾌하게",
  description: "인천 섬 트레킹 — 배 시간, 물때, 일몰까지 겹쳐 계산해 오늘 갈 수 있는지부터 알려드립니다.",
  keywords: ["한눈섬길", "인천섬", "굴업도", "승봉도", "무의도", "대이작도", "섬트레킹", "백패킹"],
  icons: {
    icon: "/icon.svg?v=10",
    shortcut: "/icon.svg?v=10",
    apple: "/icon.svg?v=10",
  },
  openGraph: {
    title: "한눈섬길 | 복잡한 섬 여행 준비, 한눈에 명쾌하게",
    description: "인천 섬 트레킹 — 배 시간, 물때, 일몰까지 겹쳐 계산해 오늘 갈 수 있는지부터 알려드립니다.",
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
      <head>
        <link rel="icon" href="/icon.svg?v=10" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=10" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=10" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="bg-white text-[#282828] font-sans antialiased min-h-screen min-w-[320px] flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer id="main-footer" className="w-full border-t border-[#EDEDED] bg-white py-8 mt-auto">
          <div className="max-w-[1440px] m-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <img
                src="/wordmark.svg"
                alt="한눈섬길 INCHEON ISLANDS"
                className="h-[32px] w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#848484]">
              &copy; {new Date().getFullYear()} 한눈섬길. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
