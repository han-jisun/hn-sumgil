import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "한눈섬길 여행";
  const display = searchParams.get("display") || "12";
  const start = searchParams.get("start") || "1";

  const clientId = "yYEwqEldIjq7ZBsfDCxw";
  const clientSecret = "OhyBpsgyAh";

  try {
    const naverApiUrl = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;
    
    const response = await fetch(naverApiUrl, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
        "Content-Type": "application/json",
      },
      next: { revalidate: 1209600 },
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => "");
      console.error("Naver API failed:", response.status, errorData);
      return NextResponse.json(
        { error: "Naver API request failed", status: response.status, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Internal server error in blog api:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
