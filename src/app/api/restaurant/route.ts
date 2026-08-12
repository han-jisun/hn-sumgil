import { NextResponse } from "next/server";
import naverRestaurants from "@/app/data/naverRestaurants.json";

export async function GET() {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  const uddi = "uddi:a4fb9876-daf9-4e95-8e9b-ed01a99cdb14";
  
  // Request 1000 items from the API to cover all restaurants in Ongjin-gun
  const odcloudUrl = `https://api.odcloud.kr/api/15035885/v1/${uddi}?page=1&perPage=1000&serviceKey=${serviceKey}`;
  
  let odcloudItems: any[] = [];
  
  try {
    const response = await fetch(odcloudUrl, {
      next: { revalidate: 86400 }, // Cache data for 1 day
    });

    if (response.ok) {
      const data = await response.json();
      
      // Check if the response indicates error
      if (data.code !== -3 && data.data && Array.isArray(data.data)) {
        // Map K-fields to standard ones (handling potential changes in the API response format)
        odcloudItems = data.data.map((item: any) => {
          const addr = item["도로명주소"] || item["지번주소"] || item["소재지(도로명)"] || item["소재지(지번)"] || "";
          const jibunAddr = item["지번주소"] || item["소재지(지번)"] || "";
          return {
            bsshNm: item["사업장명"] || item["업소명"] || "",
            addr: addr,
            tel: item["전화번호"] || item["소재지전화"] || "",
            type: item["업종명"] || item["업태명"] || item["업태구분명"] || "일반음식점",
            bizArea: jibunAddr ? jibunAddr.split(" ").slice(2, 4).join(" ") : ""
          };
        });

        // Self-diagnostic check to detect silent API schema changes
        if (odcloudItems.length > 0) {
          const invalidCount = odcloudItems.filter((item: any) => !item.bsshNm || !item.addr).length;
          if (invalidCount / odcloudItems.length > 0.8) {
            console.error(
              `🚨 [ODCloud Restaurant API Alert] High mapping failure rate (${((invalidCount / odcloudItems.length) * 100).toFixed(1)}%). Schema might have changed. Sample item:`,
              data.data[0]
            );
          }
        }
      } else {
        console.warn("ODCloud API returned registration/format error. Using Naver data only.", data.msg || "");
      }
    } else {
      console.warn(`ODCloud API returned status ${response.status}. Using Naver data only.`);
    }
  } catch (error: any) {
    console.error("Error in ODCloud restaurant proxy route. Falling back to Naver data only:", error);
  }

  // Merge ODCloud items and Naver Search items, de-duplicating by business name
  const mergedItems = [...naverRestaurants];
  const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();

  for (const odItem of odcloudItems) {
    if (!odItem.bsshNm) continue;
    
    // Check if the item already exists in Naver's results
    const exists = mergedItems.some(
      (naverItem) => normalize(naverItem.bsshNm) === normalize(odItem.bsshNm)
    );
    
    if (!exists) {
      mergedItems.push(odItem);
    }
  }

  return NextResponse.json({
    success: true,
    items: mergedItems
  });
}
