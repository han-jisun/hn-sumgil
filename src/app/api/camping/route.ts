import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 });
  }

  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  
  try {
    const gocampingUrl = `https://apis.data.go.kr/B551011/GoCamping/searchList?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&keyword=${encodeURIComponent(query)}`;
    
    const response = await fetch(gocampingUrl, {
      next: { revalidate: 86400 }, // Cache data for 1 day
    });

    if (!response.ok) {
      throw new Error(`KTO GoCamping API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if KTO API returned successfully
    const header = data.response?.header;
    if (header && header.resultCode !== "0000") {
      throw new Error(`KTO GoCamping API error: ${header.resultMsg}`);
    }

    const rawItems = data.response?.body?.items?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    return NextResponse.json({
      success: true,
      items: items.map((item: any) => ({
        contentId: item.contentId,
        facltNm: item.facltNm,
        intro: item.intro,
        addr1: item.addr1,
        addr2: item.addr2,
        mapX: item.mapX,
        mapY: item.mapY,
        tel: item.tel,
        homepage: item.homepage,
        firstImageUrl: item.firstImageUrl,
        induty: item.induty,
        resveUrl: item.resveUrl,
        resveCl: item.resveCl,
        sbrsCl: item.sbrsCl
      }))
    });
  } catch (error: any) {
    console.error("Error in KTO GoCamping proxy route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campsite information", message: error.message },
      { status: 500 }
    );
  }
}
