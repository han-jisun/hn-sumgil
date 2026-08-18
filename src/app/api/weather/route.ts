import { NextRequest, NextResponse } from "next/server";

const islandCoordinates: Record<string, { lat: number; lng: number }> = {
  "굴업도": { lat: 37.1947, lng: 125.9389 },
  "대연평": { lat: 37.6698, lng: 125.6967 },
  "대이작도": { lat: 37.1912, lng: 126.2415 },
  "대청도": { lat: 37.8286, lng: 124.7075 },
  "덕적도": { lat: 37.2289, lng: 126.1558 },
  "문갑도": { lat: 37.2267, lng: 126.0278 },
  "백령도": { lat: 37.9547, lng: 124.6736 },
  "백아도": { lat: 37.1356, lng: 125.9989 },
  "소연평": { lat: 37.6067, lng: 125.7489 },
  "소이작도": { lat: 37.1856, lng: 126.2731 },
  "소청도": { lat: 37.7656, lng: 124.7431 },
  "승봉도": { lat: 37.1706, lng: 126.3125 },
  "울도": { lat: 37.0392, lng: 125.9967 },
  "자월도": { lat: 37.2536, lng: 126.3283 },
  "지도": { lat: 37.1089, lng: 126.0467 },
  "소야도": { lat: 37.2028, lng: 126.1778 }
};

const getWeatherInfo = (code: number) => {
  if (code === 0) return { label: "맑음", icon: "☀️" };
  if (code === 1) return { label: "대체로 맑음", icon: "🌤️" };
  if (code === 2) return { label: "구름 조금", icon: "⛅" };
  if (code === 3) return { label: "흐림", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "안개/해무", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "이슬비", icon: "🌦️" };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: "비", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "눈", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { label: "천둥번개", icon: "⛈️" };
  return { label: "맑음", icon: "🌤️" };
};

const formatTimeAmPm = (isoStr: string) => {
  if (!isoStr) return "";
  const parts = isoStr.split("T");
  if (parts.length < 2) return isoStr;
  const [hourStr, minStr] = parts[1].split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minStr} ${ampm}`;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const island = searchParams.get("island") || "굴업도";
  const coords = islandCoordinates[island] || { lat: 37.2289, lng: 126.1558 };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Asia%2FSeoul`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Weather fetch failed");

    const data = await res.json();
    const daily = data.daily;
    const currentTemp = data.current ? Math.round(data.current.temperature_2m) : null;

    const weatherList = daily.time.slice(0, 3).map((date: string, idx: number) => {
      const code = daily.weather_code[idx];
      const info = getWeatherInfo(code);
      const tempMax = Math.round(daily.temperature_2m_max[idx]);
      const tempMin = Math.round(daily.temperature_2m_min[idx]);
      const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0;
      const sunrise = daily.sunrise ? formatTimeAmPm(daily.sunrise[idx]) : "5:50 am";
      const sunset = daily.sunset ? formatTimeAmPm(daily.sunset[idx]) : "7:21 pm";

      return {
        date,
        weather: info.label,
        icon: info.icon,
        tempCurrent: idx === 0 && currentTemp !== null ? `${currentTemp}°` : `${tempMax}°`,
        tempMax: `${tempMax}°`,
        tempMin: `${tempMin}°`,
        tempMinNum: tempMin,
        tempMaxNum: tempMax,
        sunrise,
        sunset,
        pop: pop !== null ? `${pop}%` : "0%"
      };
    });

    return NextResponse.json({
      success: true,
      island,
      weather: weatherList
    });
  } catch (err: any) {
    // Fallback deterministic seasonal weather data
    const today = new Date();
    const fallbackList = [0, 1, 2].map((d) => {
      const curr = new Date(today);
      curr.setDate(today.getDate() + d);
      const date = curr.toISOString().split("T")[0];
      return {
        date,
        weather: "맑음",
        icon: "🌤️",
        tempCurrent: "30°",
        tempMax: "30°",
        tempMin: "23°",
        tempMinNum: 23,
        tempMaxNum: 30,
        sunrise: "5:50 am",
        sunset: "7:21 pm",
        pop: "1%"
      };
    });

    return NextResponse.json({
      success: true,
      island,
      weather: fallbackList
    });
  }
}
