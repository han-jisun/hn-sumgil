import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Initial mock clicks to provide realistic baseline metrics for all 16 islands
let inMemoryClicks: Record<string, number> = {
  "굴업도": 142,
  "대청도": 98,
  "대이작도": 87,
  "덕적도": 74,
  "백령도": 65,
  "소이작도": 53,
  "승봉도": 42,
  "소야도": 38,
  "자월도": 35,
  "문갑도": 29,
  "백아도": 24,
  "대연평": 18,
  "소연평": 15,
  "소청도": 12,
  "울도": 8,
  "지도": 5
};

const getFilePath = () => {
  return path.join(process.cwd(), "src/app/data/clicks.json");
};

// Reads the click counts from file, falling back to memory
const readClicks = (): Record<string, number> => {
  const filePath = getFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      // Merge file data over in-memory default to ensure we have all 16 islands covered
      const parsed = JSON.parse(data);
      return { ...inMemoryClicks, ...parsed };
    }
  } catch (err) {
    console.warn("[Clicks API] Failed to read clicks.json, using in-memory store:", err);
  }
  return inMemoryClicks;
};

// Writes the click counts to file
const writeClicks = (clicks: Record<string, number>) => {
  inMemoryClicks = clicks; // Sync memory cache
  const filePath = getFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(clicks, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("[Clicks API] Failed to write clicks.json (expected in read-only serverless environment):", err);
    return false;
  }
};

export async function GET() {
  const clicks = readClicks();
  return NextResponse.json({ success: true, clicks });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { island } = body;

    if (!island) {
      return NextResponse.json(
        { success: false, error: "Island parameter is required" },
        { status: 400 }
      );
    }

    const clicks = readClicks();
    clicks[island] = (clicks[island] || 0) + 1;
    writeClicks(clicks);

    console.log(`[Clicks API] 클릭 카운트 증가 - ${island}: ${clicks[island]}회`);

    return NextResponse.json({ success: true, clicks });
  } catch (error: any) {
    console.error("[Clicks API] Error handling POST request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment click count", message: error.message },
      { status: 500 }
    );
  }
}
