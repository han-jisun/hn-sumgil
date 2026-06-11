const fs = require('fs');
const path = require('path');

const islandGroups = {
  "993": "백령도ㆍ대청도ㆍ소청도",
  "996": "대연평도ㆍ소연평도",
  "998": "덕적도",
  "999": "자월도ㆍ이작도ㆍ승봉도",
  "1002": "대부도ㆍ육도ㆍ풍도",
  "1292": "굴업도",
};

const targetIslands = [
  { name: '굴업도', time: '2시간 30분', match: '굴업', address: '인천 옹진군 덕적면 굴업리', areaCode: 2, sigunguCode: 10 },
  { name: '대연평', time: '2시간', match: '대연평도', address: '인천 옹진군 연평면 연평리', areaCode: 2, sigunguCode: 10 },
  { name: '대이작도', time: '1시간 40분', match: '이작도', isSpecial: true, address: '인천 옹진군 자월면 이작리', areaCode: 2, sigunguCode: 10 },
  { name: '대청도', time: '3시간 40분', match: '대청도', address: '인천 옹진군 대청면 대청리', areaCode: 2, sigunguCode: 10 },
  { name: '덕적도', time: '1시간 10분', match: '덕적도', address: '인천 옹진군 덕적면 진리', areaCode: 2, sigunguCode: 10 },
  { name: '문갑도', time: '1시간 30분', match: '문갑도', address: '인천 옹진군 덕적면 문갑리', areaCode: 2, sigunguCode: 10 },
  { name: '백령도', time: '4시간', match: '백령도', address: '인천 옹진군 백령면 진촌리', areaCode: 2, sigunguCode: 10 },
  { name: '백아도', time: '2시간 40분', match: '백아', address: '인천 옹진군 덕적면 백아리', areaCode: 2, sigunguCode: 10 },
  { name: '소연평', time: '1시간 40분', match: '소연평도', address: '인천 옹진군 연평면 연평리', areaCode: 2, sigunguCode: 10 },
  { name: '소이작도', time: '1시간 30분', match: '이작도', isSpecial: true, address: '인천 옹진군 자월면 이작리', areaCode: 2, sigunguCode: 10 },
  { name: '소청도', time: '3시간 20분', match: '소청도', address: '인천 옹진군 대청면 소청리', areaCode: 2, sigunguCode: 10 },
  { name: '승봉도', time: '1시간 20분', match: '이작도', isSpecial: true, address: '인천 옹진군 자월면 승봉리', areaCode: 2, sigunguCode: 10 },
  { name: '울도', time: '3시간 20분', match: '울도', address: '인천 옹진군 덕적면 울도리', areaCode: 2, sigunguCode: 10 },
  { name: '자월도', time: '1시간', match: '자월도', address: '인천 옹진군 자월면 자월리', areaCode: 2, sigunguCode: 10 },
  { name: '지도', time: '2시간', match: '지도', address: '인천 옹진군 덕적면 백아리', areaCode: 2, sigunguCode: 10 },
  { name: '소야도', time: '1시간 10분', match: '덕적도', isSpecial: true, address: '인천 옹진군 덕적면 소야리', areaCode: 2, sigunguCode: 10 }
];

function parseTable(html, groupName) {
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

    // Ship
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

    // Route
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

    // Division
    const divisionCell = cells[cellIndex++];
    const division = divisionCell ? divisionCell.content : "";

    // Fares
    const fares = [];
    for (let i = 0; i < 8; i++) {
      const cell = cells[cellIndex++];
      fares.push(cell ? cell.content : "0");
    }

    // Contact
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
      fare: fares[0] || "0", 
      contact,
      group: groupName,
    });
  }

  return parsedRoutes;
}

async function run() {
  console.log("Starting ferry data crawler...");
  try {
    const keys = Object.keys(islandGroups);
    const allRoutes = [];
    
    for (const key of keys) {
      const url = `https://www.icpa.or.kr/icferry/main.do?menuKey=${key}`;
      console.log(`Crawling: ${islandGroups[key]} (${url})`);
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
      });
      if (!response.ok) {
        throw new Error(`Fetch failed for ${key}`);
      }
      const html = await response.text();
      const routes = parseTable(html, islandGroups[key]);
      allRoutes.push(...routes);
    }
    
    const roundTrips = allRoutes.filter(r => r.division === "왕복");
    console.log(`Successfully crawled ${roundTrips.length} round trip routes.`);
    
    // Map to the 16 target islands
    const mappedIslands = targetIslands.map(island => {
      let matches = [];
      if (island.name === '소야도') {
        matches = roundTrips.filter(r => r.route.includes('덕적도'));
      } else if (island.isSpecial) {
        matches = roundTrips.filter(r => r.route.includes(island.match));
      } else {
        matches = roundTrips.filter(r => r.route.includes(island.match) || r.ship.includes(island.match));
      }
      
      const ferries = matches.map(m => {
        let time = island.time;
        if (island.name === '덕적도' || island.name === '소야도') {
          time = m.ship.includes('차도선') || m.ship.includes('카훼리') ? '2시간 40분' : '1시간 10분';
        } else if (island.name === '대이작도') {
          time = m.ship.includes('차도선') || m.ship.includes('페리호') ? '2시간 20분' : '1시간 40분';
        } else if (island.name === '소이작도') {
          time = m.ship.includes('차도선') || m.ship.includes('페리호') ? '2시간 10분' : '1시간 30분';
        } else if (island.name === '승봉도') {
          time = m.ship.includes('차도선') || m.ship.includes('페리호') ? '2시간' : '1시간 20분';
        } else if (island.name === '자월도') {
          time = m.ship.includes('차도선') || m.ship.includes('페리호') ? '1시간 20분' : '1시간';
        }
        
        return {
          time,
          fare: m.fare + '원'
        };
      });
      
      if (ferries.length === 0) {
        ferries.push({
          time: island.time,
          fare: "정보 없음"
        });
      }
      
      return {
        island: island.name,
        address: island.address,
        areaCode: island.areaCode,
        sigunguCode: island.sigunguCode,
        ferries
      };
    });
    
    const outputPath = path.join(__dirname, '../src/app/data/islands.json');
    fs.writeFileSync(outputPath, JSON.stringify(mappedIslands, null, 2), 'utf-8');
    console.log(`Saved updated data to ${outputPath}`);
  } catch (error) {
    console.error("Scraping failed:", error);
    process.exit(1);
  }
}

run();
