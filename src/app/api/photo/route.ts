import { NextRequest, NextResponse } from "next/server";

const EXCLUDE_KEYWORDS = [
  "송도", "인천대교", "공항", "아시아드", "시청", "지하철", "도심", "시내", "컨벤시아", "스카이타워", "드림파크",
  "서울", "강원", "경상", "전라", "대구", "대전", "충청", "제주", "부산", "광주", "울산", "경기", "양평",
  "칠지도", "안내도", "지도모형", "종단철도", "대한민국 지도", "박지도", "담양지도", "제주도 지도", "고지도", "약도", "서울도보여행"
];

const ALL_ISLAND_NAMES = [
  "굴업도", "연평도", "대이작도", "대청도", "덕적도", "문갑도", "백령도",
  "백아도", "소연평", "소이작도", "소청도", "승봉도", "울도", "자월도",
  "지도", "소야도"
];

export async function GET(request: NextRequest) {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "옹진군";
  const pageNo = searchParams.get("pageNo") || "1";
  const numOfRows = searchParams.get("numOfRows") || "40";

  // Korea Tourism Organization PhotoGalleryService1 (Strict Public Official API)
  const fetchPhotoGallery = async (kw: string) => {
    const encodedKeyword = encodeURIComponent(kw);
    const url = `https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&keyword=${encodedKeyword}`;
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) return [];
      const data = await res.json();
      const header = data.response?.header;
      if (header && header.resultCode !== "0000") return [];
      const rawItems = data.response?.body?.items?.item;
      return Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    } catch {
      return [];
    }
  };

  try {
    const items = await fetchPhotoGallery(keyword);

    const isSpecificIsland = !["전체", "옹진군", "인천 섬", "인천"].includes(keyword);
    const otherIslands = isSpecificIsland
      ? ALL_ISLAND_NAMES.filter(
          (name) => name !== keyword && !name.includes(keyword.replace("도", ""))
        )
      : [];

    // Filter out non-Incheon regions, map homonyms, and mismatched island photos
    const filteredItems = items
      .filter((item: any) => {
        const title = (item.galTitle || "").toLowerCase();
        const tags = (item.galSearchKeyword || "").toLowerCase();
        const location = (item.galPhotographyLocation || "").toLowerCase();

        const combinedText = `${title} ${tags} ${location}`;

        // 1. Filter out urban / non-Incheon regions & map homonym keywords
        if (EXCLUDE_KEYWORDS.some((ex) => combinedText.includes(ex))) {
          return false;
        }

        // 2. Reject photos belonging to a different island
        if (isSpecificIsland) {
          if (otherIslands.some((other) => combinedText.includes(other.toLowerCase()))) {
            return false;
          }
        }

        return true;
      })
      .map((item: any) => ({
        contentId: item.galContentId,
        title: item.galTitle || "사진",
        webImageUrl: item.galWebImageUrl || "",
        createdTime: item.galCreatedtime || "",
        photographer: item.galPhotographer || "한국관광공사",
        searchKeyword: item.galSearchKeyword || "",
        photographyLocation: item.galPhotographyLocation || "",
      }));

    return NextResponse.json({
      success: true,
      totalCount: filteredItems.length,
      items: filteredItems,
    });
  } catch (error: any) {
    console.error("Error fetching photo gallery data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch photo gallery", message: error.message },
      { status: 500 }
    );
  }
}
