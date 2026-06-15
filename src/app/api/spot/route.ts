import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");

  if (contentId) {
    // Proxy detailCommon2 to get the detailed description (overview), homepage, etc.
    const detailUrl = `https://apis.data.go.kr/B551011/KorService2/detailCommon2?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}`;
    
    try {
      const response = await fetch(detailUrl, {
        next: { revalidate: 86400 }, // Cache detail data for 1 day
      });

      if (!response.ok) {
        throw new Error(`KorService2 API returned status ${response.status}`);
      }

      const data = await response.json();
      const header = data.response?.header;
      if (header && header.resultCode !== "0000") {
        throw new Error(`KorService2 API error: ${header.resultMsg}`);
      }

      const rawItem = data.response?.body?.items?.item;
      const item = Array.isArray(rawItem) ? rawItem[0] : rawItem;

      if (!item) {
        return NextResponse.json(
          { success: false, error: "Spot detail not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        detail: {
          contentId: item.contentid,
          overview: item.overview || "설명 정보가 등록되어 있지 않습니다.",
          homepage: item.homepage || "",
          tel: item.tel || "",
          telname: item.telname || ""
        }
      });
    } catch (error: any) {
      console.error("Error in KorService2 detail proxy route:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch spot detail", message: error.message },
        { status: 500 }
      );
    }
  }
  
  // Request up to 500 rows to ensure we retrieve all spots in Ongjin-gun
  const url = `https://apis.data.go.kr/B551011/KorService2/areaBasedList2?serviceKey=${serviceKey}&numOfRows=500&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&areaCode=2&sigunguCode=9`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache data for 1 day
    });

    if (!response.ok) {
      throw new Error(`KorService2 API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the KTO API returned successfully
    const header = data.response?.header;
    if (header && header.resultCode !== "0000") {
      throw new Error(`KorService2 API error: ${header.resultMsg}`);
    }

    const rawItems = data.response?.body?.items?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    // Filter to only include Tourist Attractions (12), Cultural Facilities (14), and Leisure/Sports (28)
    const filteredItems = items.filter((item: any) => 
      item.contenttypeid === "12" || item.contenttypeid === "14" || item.contenttypeid === "28"
    );

    const mappedItems = filteredItems.map((item: any) => ({
      contentId: item.contentid,
      title: item.title,
      addr: item.addr1 || item.addr2 || "",
      firstImage: item.firstimage || item.firstimage2 || "",
      contentTypeId: item.contenttypeid,
      mapX: item.mapx,
      mapY: item.mapy
    }));

    return NextResponse.json({
      success: true,
      items: mappedItems
    });
  } catch (error: any) {
    console.error("Error in KorService2 spot proxy route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch spot information", message: error.message },
      { status: 500 }
    );
  }
}
