import { NextRequest, NextResponse } from "next/server";

// Deterministic tide simulator based on lunar cycles for Incheon area islands
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const island = searchParams.get("island") || "대이작도";
  const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const startDate = new Date(dateStr);
  const tides = [];

  // Deterministic seed based on date and island name to make the values stable
  const getSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const islandSeed = getSeed(island);

  for (let d = 0; d < 3; d++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + d);
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Reference Date: New Moon (e.g., 2026-02-17 is a New Moon)
    // Let's use 2026-01-01 as a baseline to calculate days
    const baseDate = new Date("2026-01-01");
    const diffTime = currentDate.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Lunar cycle: 29.53 days. Lunar age (음력 날짜) approx:
    const lunarAge = (diffDays + 12.5) % 29.53; // 12.5 is offset for 2026-01-01
    const lunarDay = Math.floor(lunarAge) + 1;

    // Shift in tide times: ~50.4 minutes per day
    const timeShiftMinutes = (diffDays * 50.47) % (12 * 60 + 25);
    
    // Base High Tide times on New Moon day
    // In Incheon, on New Moon, High Tide is roughly around 04:30 and 17:00
    const baseHigh1 = 4 * 60 + 30; // 04:30
    const baseLow1 = 10 * 60 + 45; // 10:45
    const baseHigh2 = 16 * 60 + 55; // 16:55
    const baseLow2 = 23 * 60 + 10; // 23:10

    const formatMinutesToTime = (min: number) => {
      const hours = Math.floor((min % (24 * 60)) / 60);
      const minutes = Math.floor(min % 60);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    // Calculate times with shift
    const tHigh1 = (baseHigh1 + timeShiftMinutes) % (24 * 60);
    const tLow1 = (baseLow1 + timeShiftMinutes) % (24 * 60);
    const tHigh2 = (baseHigh2 + timeShiftMinutes) % (24 * 60);
    const tLow2 = (baseLow2 + timeShiftMinutes) % (24 * 60);

    // Calculate height (tide height variation based on lunar day - Spring/Neap tide (사리/조금))
    // Spring tide (사리) is around lunar day 15 (Full Moon) and 1 (New Moon)
    // Neap tide (조금) is around lunar day 8 (First Quarter) and 23 (Last Quarter)
    const rad = (lunarAge / 29.53) * 2 * Math.PI * 2; // two cycles of spring/neap per lunar month
    const tideRangeCoeff = (Math.cos(rad) + 1) / 2; // 0 to 1

    // Incheon max range is ~900cm, min range is ~300cm
    const maxHigh = 650 + Math.floor(tideRangeCoeff * 200) + (islandSeed % 30);
    const minLow = 100 + Math.floor((1 - tideRangeCoeff) * 150) + (islandSeed % 15);

    const tideEvents = [
      { time: formatMinutesToTime(tHigh1), type: "고조", height: `+${maxHigh}` },
      { time: formatMinutesToTime(tLow1), type: "저조", height: `+${minLow}` },
      { time: formatMinutesToTime(tHigh2), type: "고조", height: `+${maxHigh - 20}` },
      { time: formatMinutesToTime(tLow2), type: "저조", height: `+${minLow + 15}` }
    ].sort((a, b) => a.time.localeCompare(b.time));

    tides.push({
      date: formattedDate,
      lunarDate: `음력 ${mm}월 ${String(lunarDay).padStart(2, "0")}일`,
      tideTime: tideEvents,
      waterLevel: lunarDay >= 13 && lunarDay <= 18 ? "사리 (물때 7물~12물, 조차 큼)" : 
                  lunarDay >= 28 || lunarDay <= 3 ? "조금 (물때 1물~2물, 조차 작음)" : "사리/조금 사이"
    });
  }

  return NextResponse.json({
    success: true,
    island,
    tides
  });
}
