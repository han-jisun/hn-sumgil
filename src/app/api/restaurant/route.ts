import { NextResponse } from "next/server";

// Realistic mock restaurant data for the 16 target islands in Ongjin-gun
const mockRestaurants = [
  {
    bsshNm: "굴업도 민박식당",
    addr: "인천광역시 옹진군 덕적면 굴업리 15",
    tel: "032-831-7200",
    type: "한식",
    bizArea: "덕적면 굴업리"
  },
  {
    bsshNm: "굴업도 고씨네식당",
    addr: "인천광역시 옹진군 덕적면 굴업남로 12",
    tel: "032-831-2808",
    type: "한식 / 백반",
    bizArea: "덕적면 굴업리"
  },
  {
    bsshNm: "덕적식당",
    addr: "인천광역시 옹진군 덕적면 덕적남로 12",
    tel: "032-831-5060",
    type: "한식",
    bizArea: "덕적면 진리"
  },
  {
    bsshNm: "바다회식당",
    addr: "인천광역시 옹진군 덕적면 덕적북로 34",
    tel: "032-831-5585",
    type: "회 / 해물",
    bizArea: "덕적면 서포리"
  },
  {
    bsshNm: "덕적 훼미리횟집",
    addr: "인천광역시 옹진군 덕적면 서포리길 78",
    tel: "032-831-8862",
    type: "회 / 매운탕",
    bizArea: "덕적면 서포리"
  },
  {
    bsshNm: "자월도 해바라기식당",
    addr: "인천광역시 옹진군 자월면 자월동로 115",
    tel: "032-831-5077",
    type: "한식 / 매운탕",
    bizArea: "자월면 자월리"
  },
  {
    bsshNm: "달빛바람 분식",
    addr: "인천광역시 옹진군 자월면 자월서로 42",
    tel: "032-832-0050",
    type: "분식 / 라면",
    bizArea: "자월면 자월리"
  },
  {
    bsshNm: "이작도 팽나무횟집",
    addr: "인천광역시 옹진군 자월면 이작로 212",
    tel: "032-831-6288",
    type: "회 / 꽃게탕",
    bizArea: "자월면 이작리"
  },
  {
    bsshNm: "이작 힐링식당",
    addr: "인천광역시 옹진군 자월면 이작남로 8",
    tel: "032-831-0980",
    type: "한식 / 백반",
    bizArea: "자월면 이작리"
  },
  {
    bsshNm: "승봉도 이일레식당",
    addr: "인천광역시 옹진군 자월면 승봉로 89",
    tel: "032-831-3560",
    type: "한식",
    bizArea: "자월면 승봉리"
  },
  {
    bsshNm: "승봉 숯불갈비",
    addr: "인천광역시 옹진군 자월면 승봉동로 14",
    tel: "032-831-4112",
    type: "육류 / 갈비",
    bizArea: "자월면 승봉리"
  },
  {
    bsshNm: "백령도 사곶냉면",
    addr: "인천광역시 옹진군 백령면 백령남로 15",
    tel: "032-836-0559",
    type: "냉면 / 빈대떡",
    bizArea: "백령면 진촌리"
  },
  {
    bsshNm: "백령 신화횟집",
    addr: "인천광역시 옹진군 백령면 두무진길 8",
    tel: "032-836-5154",
    type: "회 / 자연산스페셜",
    bizArea: "백령면 연지리"
  },
  {
    bsshNm: "연평식당",
    addr: "인천광역시 옹진군 연평면 연평로 45",
    tel: "032-831-1250",
    type: "한식 / 백반",
    bizArea: "연평면 연평리"
  },
  {
    bsshNm: "연평도 꽃게마을",
    addr: "인천광역시 옹진군 연평면 연평남로 88",
    tel: "032-831-8800",
    type: "꽃게 요리",
    bizArea: "연평면 연평리"
  },
  {
    bsshNm: "대청도 모래울횟집",
    addr: "인천광역시 옹진군 대청면 대청북로 21",
    tel: "032-836-2244",
    type: "회 / 매운탕",
    bizArea: "대청면 대청리"
  },
  {
    bsshNm: "소야도 부두횟집",
    addr: "인천광역시 옹진군 덕적면 소야로 112",
    tel: "032-831-3315",
    type: "회 / 해산물",
    bizArea: "덕적면 소야리"
  }
];

export async function GET() {
  const serviceKey = "4369f9db6162243492f66da1d8255bf8611fb890b7c48656485aaa6c9006ac48";
  const uddi = "uddi:6f690159-2f37-4752-99c2-b51e1fa35101";
  
  // Request 1000 items from the API to cover all restaurants in Ongjin-gun
  const odcloudUrl = `https://api.odcloud.kr/api/15053424/v1/${uddi}?page=1&perPage=1000&serviceKey=${serviceKey}`;
  
  try {
    const response = await fetch(odcloudUrl, {
      next: { revalidate: 86400 }, // Cache data for 1 day
    });

    if (!response.ok) {
      throw new Error(`ODCloud API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response indicates unregistered service or error
    if (data.code === -3 || !data.data || !Array.isArray(data.data)) {
      console.warn("ODCloud API returned registration/format error. Falling back to mock data.");
      return NextResponse.json({
        success: true,
        isMock: true,
        items: mockRestaurants
      });
    }

    // Map K-fields to standard ones
    const items = data.data.map((item: any) => ({
      bsshNm: item["업소명"] || "",
      addr: item["소재지(도로명)"] || item["소재지(지번)"] || "",
      tel: item["전화번호"] || "",
      type: item["업태명"] || item["업태구분명"] || "일반음식점",
      bizArea: item["소재지(지번)"] ? item["소재지(지번)"].split(" ").slice(2, 4).join(" ") : ""
    }));

    return NextResponse.json({
      success: true,
      isMock: false,
      items: items
    });
  } catch (error: any) {
    console.error("Error in ODCloud restaurant proxy route, using mock fallback:", error);
    return NextResponse.json({
      success: true,
      isMock: true,
      items: mockRestaurants,
      message: error.message
    });
  }
}
