import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  
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
