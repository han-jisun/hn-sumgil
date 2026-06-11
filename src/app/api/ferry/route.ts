import { NextResponse } from "next/server";

const islandGroups: Record<string, string> = {
  "993": "백령도ㆍ대청도ㆍ소청도",
  "996": "대연평도ㆍ소연평도",
  "998": "덕적도",
  "999": "자월도ㆍ이작도ㆍ승봉도",
  "1002": "대부도ㆍ육도ㆍ풍도",
  "1292": "굴업도",
};

function parseTable(html: string, groupName: string) {
  const tbodyRegex = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i;
  const tbodyMatch = tbodyRegex.exec(html);
  if (!tbodyMatch) return [];

  const tbodyHtml = tbodyMatch[1];
  
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  const rowsHtml = [];
  while ((trMatch = trRegex.exec(tbodyHtml)) !== null) {
    rowsHtml.push(trMatch[1]);
  }

  const parsedRoutes = [];
  
  let currentShip = "";
  let shipRowspanLeft = 0;
  
  let currentRoute = "";
  let routeRowspanLeft = 0;
  
  let currentContact = "";
  let contactRowspanLeft = 0;

  for (const rowHtml of rowsHtml) {
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    const cells = [];
    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      const content = tdMatch[1].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
      const rowspanMatch = /rowspan="(\d+)"/i.exec(tdMatch[0]);
      const rowspan = rowspanMatch ? parseInt(rowspanMatch[1]) : 1;
      cells.push({ content, rowspan });
    }

    if (cells.length === 0) continue;

    let cellIndex = 0;

    // 1. Ship Name cell
    let ship = "";
    if (shipRowspanLeft > 0) {
      ship = currentShip;
      shipRowspanLeft--;
    } else {
      const cell = cells[cellIndex++];
      if (cell) {
        ship = cell.content;
        if (cell.rowspan > 1) {
          currentShip = ship;
          shipRowspanLeft = cell.rowspan - 1;
        }
      }
    }

    // 2. Route cell
    let route = "";
    if (routeRowspanLeft > 0) {
      route = currentRoute;
      routeRowspanLeft--;
    } else {
      const cell = cells[cellIndex++];
      if (cell) {
        route = cell.content;
        if (cell.rowspan > 1) {
          currentRoute = route;
          routeRowspanLeft = cell.rowspan - 1;
        }
      }
    }

    // 3. Division cell
    const divisionCell = cells[cellIndex++];
    const division = divisionCell ? divisionCell.content : "";

    // 4. Fares: general (adult, youth, senior, child), incheon citizen (adult, youth, senior, child)
    const fares = [];
    for (let i = 0; i < 8; i++) {
      const cell = cells[cellIndex++];
      fares.push(cell ? cell.content : "0");
    }

    // 5. Contact Cell
    let contact = "";
    if (contactRowspanLeft > 0) {
      contact = currentContact;
      contactRowspanLeft--;
    } else {
      const cell = cells[cellIndex++];
      if (cell) {
        contact = cell.content;
        if (cell.rowspan > 1) {
          currentContact = contact;
          contactRowspanLeft = cell.rowspan - 1;
        }
      }
    }

    parsedRoutes.push({
      ship,
      route,
      division,
      fares: {
        general: {
          adult: fares[0] || "0",
          youth: fares[1] || "0",
          senior: fares[2] || "0",
          child: fares[3] || "0",
        },
        incheon: {
          adult: fares[4] || "0",
          youth: fares[5] || "0",
          senior: fares[6] || "0",
          child: fares[7] || "0",
        }
      },
      contact,
      group: groupName,
    });
  }

  return parsedRoutes;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetGroup = searchParams.get("group"); 

  try {
    const keysToFetch = targetGroup && islandGroups[targetGroup] ? [targetGroup] : Object.keys(islandGroups);
    
    const promises = keysToFetch.map(async (key) => {
      const url = `https://www.icpa.or.kr/icferry/main.do?menuKey=${key}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 3600 }, 
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menuKey ${key}`);
      }

      const html = await response.text();
      return parseTable(html, islandGroups[key]);
    });

    const results = await Promise.all(promises);
    const flatResults = results.flat();
    console.log(`[Server API] 크롤링 완료 - 총 ${flatResults.length}개의 여객선 경로 데이터를 수집했습니다.`);

    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      routes: flatResults,
    });
  } catch (error: any) {
    console.error("Error in ferry api route:", error);
    return NextResponse.json(
      { success: false, error: "Ferry routes data collection failed", message: error.message },
      { status: 500 }
    );
  }
}
