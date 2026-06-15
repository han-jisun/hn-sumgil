import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  const id = "15127508";
  const uddi = "uddi:027eb566-91d9-4a1e-94e2-b0dedfa08d71";
  
  // Request 1000 items from the API to cover all lodging facilities in Ongjin-gun
  const odcloudUrl = `https://api.odcloud.kr/api/${id}/v1/${uddi}?page=1&perPage=1000&serviceKey=${serviceKey}`;
  
  try {
    const response = await fetch(odcloudUrl, {
      next: { revalidate: 86400 }, // Cache data for 1 day
    });

    if (!response.ok) {
      throw new Error(`ODCloud API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response indicates error
    if (data.code === -3 || !data.data || !Array.isArray(data.data)) {
      throw new Error(data.msg || "ODCloud API returned registration/format error.");
    }

    // Map K-fields to standard ones
    const items = data.data.map((item: any) => ({
      bsshNm: item["상호명"] || "",
      addr: item["주소"] || "",
      rooms: item["객실수"] || 0,
      ceo: item["대표자명"] || "",
      bizArea: item["주소"] ? item["주소"].split(" ").slice(2, 4).join(" ") : ""
    }));

    return NextResponse.json({
      success: true,
      items: items
    });
  } catch (error: any) {
    console.error("Error in ODCloud lodge proxy route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lodging information", message: error.message },
      { status: 500 }
    );
  }
}
