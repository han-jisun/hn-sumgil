import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://hn-sumgil.vercel.app"),
  title: {
    default: "한눈섬길 | 복잡한 섬 여행 준비, 한눈에 명쾌하게",
    template: "%s | 한눈섬길",
  },
  description:
    "인천 섬 트레킹, 백패킹, 배 시간표, 물때표, 제철 섬 먹거리 정보까지 한눈에! 굴업도, 자월도, 대청도, 승봉도, 무의도, 덕적도 여행 완벽 가이드.",
  keywords: [
    "한눈섬길",
    "인천섬여행",
    "섬트레킹",
    "섬백패킹",
    "굴업도 백패킹",
    "자월도 백패킹",
    "대청도 트레킹",
    "승봉도 민박",
    "덕적도 배시간",
    "물때표",
    "인천연안여객터미널",
    "서해 섬 여행",
  ],
  authors: [{ name: "한눈섬길 크루" }],
  creator: "한눈섬길",
  publisher: "한눈섬길",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg?v=10",
    shortcut: "/icon.svg?v=10",
    apple: "/icon.svg?v=10",
  },
  openGraph: {
    title: "한눈섬길 | 복잡한 섬 여행 준비, 한눈에 명쾌하게",
    description:
      "인천 섬 트레킹 — 배 시간, 물때, 일몰까지 겹쳐 계산해 오늘 갈 수 있는지부터 알려드립니다.",
    url: "https://hn-sumgil.vercel.app",
    siteName: "한눈섬길 (HN-Sumgil)",
    images: [
      {
        url: "/images/magazin/vol2/top.jpg",
        width: 1200,
        height: 630,
        alt: "한눈섬길 - 인천 섬 트레킹 가이드",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "한눈섬길 | 인천 섬 트레킹·백패킹 종합가이드",
    description:
      "인천 섬 트레킹 — 배 시간, 물때, 일몰까지 겹쳐 계산해 오늘 갈 수 있는지부터 알려드립니다.",
    images: ["/images/magazin/vol2/top.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "한눈섬길",
    alternateName: ["HN-Sumgil", "인천섬길"],
    url: "https://hn-sumgil.vercel.app",
    description:
      "인천 섬 트레킹, 백패킹, 배시간표, 물때 정보를 한눈에 제공하는 섬 여행 가이드",
    inLanguage: "ko-KR",
  };

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icon.svg?v=10" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=10" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=10" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-[#282828] font-sans antialiased min-h-screen min-w-[320px] flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer
          id="main-footer"
          className="w-full border-t border-[#EDEDED] bg-white py-8 mt-auto"
        >
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
