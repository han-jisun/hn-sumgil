import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      next: { revalidate: 3600 } // Cache search results for 1 hour
    });

    if (!response.ok) {
      throw new Error(`YouTube returned status ${response.status}`);
    }

    const html = await response.text();
    const regex = /ytInitialData\s*=\s*({.+?});/;
    const match = html.match(regex);

    if (!match) {
      throw new Error("Could not find ytInitialData in YouTube response");
    }

    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnBrowseResultsRenderer
      ? data.contents.twoColumnBrowseResultsRenderer.tabs?.[0]?.content?.sectionListRenderer?.contents
      : data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;

    if (!contents) {
      throw new Error("YouTube contents tree structure not found");
    }

    const videos: any[] = [];
    for (const section of contents) {
      const itemSection = section.itemSectionRenderer;
      if (!itemSection || !itemSection.contents) continue;

      for (const item of itemSection.contents) {
        const videoRenderer = item.videoRenderer;
        if (!videoRenderer) continue;

        const videoId = videoRenderer.videoId;
        const title = videoRenderer.title?.runs?.[0]?.text || videoRenderer.title?.simpleText || "";
        const thumbnail = videoRenderer.thumbnail?.thumbnails?.[0]?.url || "";
        const viewCountText = videoRenderer.viewCountText?.simpleText || videoRenderer.viewCountText?.runs?.[0]?.text || "조회수 없음";
        const publishedTimeText = videoRenderer.publishedTimeText?.simpleText || "";
        const lengthText = videoRenderer.lengthText?.simpleText || "Shorts";
        const ownerText = videoRenderer.ownerText?.runs?.[0]?.text || "";

        videos.push({
          videoId,
          title,
          thumbnail,
          viewCountText,
          publishedTimeText,
          lengthText,
          ownerText,
          url: `https://www.youtube.com/watch?v=${videoId}`
        });

        if (videos.length >= 3) break;
      }
      if (videos.length >= 3) break;
    }

    return NextResponse.json({
      success: true,
      videos
    });
  } catch (error: any) {
    console.error("Error in YouTube proxy route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube videos", message: error.message },
      { status: 500 }
    );
  }
}
