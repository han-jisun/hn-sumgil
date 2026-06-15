import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  const uddi = "uddi:a4fb9876-daf9-4e95-8e9b-ed01a99cdb14";
  
  // Request 1000 items from the API to cover all restaurants in Ongjin-gun
  const odcloudUrl = `https://api.odcloud.kr/api/15035885/v1/${uddi}?page=1&perPage=1000&serviceKey=${serviceKey}`;
  
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
      bsshNm: item["업소명"] || "",
      addr: item["소재지(도로명)"] || item["소재지(지번)"] || "",
      tel: item["소재지전화"] || item["전화번호"] || "",
      type: item["업태명"] || item["업태구분명"] || "일반음식점",
      bizArea: item["소재지(지번)"] ? item["소재지(지번)"].split(" ").slice(2, 4).join(" ") : ""
    }));

    return NextResponse.json({
      success: true,
      items: items
    });
  } catch (error: any) {
    console.error("Error in ODCloud restaurant proxy route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurant information", message: error.message },
      { status: 500 }
    );
  }
}
