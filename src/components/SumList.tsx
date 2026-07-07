"use client";

import { useState } from "react";
import islandsData from "@/app/data/islands.json";

interface IslandFerry {
  time: string;
  fare: string;
}

interface IslandData {
  island: string;
  address: string;
  areaCode: number;
  sigunguCode: number;
  ferries: IslandFerry[];
}

const islands: IslandData[] = islandsData as IslandData[];

export default function SumList() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter islands based on search query
  const filteredIslands = islands.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">1. 섬리스트</h2>
        </div>
        <div className="flex gap-2">
          <a 
            href="https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-xs px-3.5 py-1.5 rounded-full text-secondary transition duration-300"
          >
            원문 페이지 ↗
          </a>
        </div>
      </div>

      <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-4">
        <p>해당 데이터는 <strong>인천항만공사</strong> 여객 운임/시간표 정보를 기반으로 구축된 기초 데이터입니다.</p>

        <div className="flex flex-col gap-1 text-secondary">
          <p className="flex items-center gap-1.5">
            <span>출처 사이트:</span>
            <a 
              href="https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline text-secondary font-medium break-all"
            >
              https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52
            </a>
          </p>
        </div>

        <div className="mt-2 pt-3 border-t border-white/5">
          <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 제공 특징</span>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
            <li><strong>주기적 로컬 캐싱</strong>: 여객선 운임 및 시간표는 변동 주기가 길기 때문에 외부 서버 트래픽 감소 및 빠른 응답 속도를 위해 1달 주기로 로컬 정적 캐시 파일(islands.json)로 업데이트하여 즉각 서비스합니다.</li>
            <li><strong>이동 수단 가이드</strong>: 섬별 입도를 위해 필수적인 항선 정보, 편도 소요 시간, 대인 기준 여객 운임 등의 통합 상세 교통 가이드를 담고 있습니다.</li>
            <li><strong>실시간 즉시 검색</strong>: 전체 섬 목록을 지연 시간(Delay) 없이 검색어 단위로 빠르게 필터링해주는 컴포넌트 편의 기능을 포함하고 있습니다.</li>
          </ul>
        </div>

        {/* islands.json 정보를 islandList 안에 렌더링 */}
        <div id="islandList" className="mt-4 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="섬 이름을 검색해 보세요... (예: 굴업도, 덕적도)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d18]/60 border border-card-border hover:border-white/15 focus:border-secondary focus:ring-1 focus:ring-secondary/30 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
            />
          </div>

          {/* Islands Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {filteredIslands.length > 0 ? (
              filteredIslands.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-card-border bg-[#0a0a0f]/60 hover:border-card-hover-border hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    {/* Island Name & Address */}
                    <div className="flex flex-col gap-1.5 mb-3.5">
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-secondary transition-colors duration-300">
                        🏝️ {item.island}
                      </h3>
                      <div className="flex flex-col gap-0.5 text-[0.65rem] text-text-muted">
                        <span>📍 {item.address}</span>
                        <span>🏷️ 관광공사 코드: {item.areaCode}-{item.sigunguCode}</span>
                      </div>
                    </div>
                    
                    {/* Ferry Details */}
                    <div className="flex flex-col gap-2">
                      {item.ferries.map((ferry, fIdx) => (
                        <div key={fIdx} className="bg-white/2 rounded-xl p-3 border border-white/5 text-[0.7rem] flex flex-col gap-1.5">
                          {item.ferries.length > 1 && (
                            <span className="text-[0.6rem] text-secondary font-medium block">
                              경로 옵션 {fIdx + 1}
                            </span>
                          )}
                          <div className="flex justify-between items-center text-text-secondary">
                            <span>⏱️ 소요 시간</span>
                            <span className="font-medium text-text-primary">{ferry.time}</span>
                          </div>
                          <div className="flex justify-between items-center text-text-secondary">
                            <span>💰 왕복 요금</span>
                            <span className="font-semibold text-secondary">{ferry.fare}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-white/1 border border-card-border rounded-xl text-text-muted text-xs">
                검색 조건에 맞는 섬이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
