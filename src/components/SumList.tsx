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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIslands = islands.filter((item) =>
    item.island.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-8 rounded-2xl border border-[#D4D4D4] bg-white shadow-sm">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#282828] mb-1">1. 섬리스트</h2>
        </div>
        <div className="flex gap-2">
          <a 
            href="https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#E6FDE5] border border-[#0F3E17] text-xs px-3.5 py-1.5 rounded-full text-[#0F3E17] font-medium hover:bg-[#BCD2BC] transition-colors"
          >
            원문 페이지 ↗
          </a>
        </div>
      </div>

      <div className="text-sm text-[#6A6A6A] leading-relaxed flex flex-col gap-4">
        <p>해당 데이터는 <strong>인천항만공사</strong> 여객 운임/시간표 정보를 기반으로 구축된 기초 데이터입니다.</p>

        <div className="flex flex-col gap-1 text-[#0F3E17]">
          <p className="flex items-center gap-1.5">
            <span>출처 사이트:</span>
            <a 
              href="https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline font-medium break-all"
            >
              https://www.icpa.or.kr/icferry/content/view.do?menuKey=993&contentKey=52
            </a>
          </p>
        </div>

        <div className="mt-2 pt-3 border-t border-[#EDEDED]">
          <span className="font-semibold text-[#282828] block mb-2">데이터 수집 및 제공 특징</span>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 text-[#6A6A6A]">
            <li><strong>주기적 로컬 캐싱</strong>: 여객선 운임 및 시간표는 변동 주기가 길기 때문에 외부 서버 트래픽 감소 및 빠른 응답 속도를 위해 1달 주기로 로컬 정적 캐시 파일(islands.json)로 업데이트하여 즉각 서비스합니다.</li>
            <li><strong>이동 수단 가이드</strong>: 섬별 입도를 위해 필수적인 항선 정보, 편도 소요 시간, 대인 기준 여객 운임 등의 통합 상세 교통 가이드를 담고 있습니다.</li>
            <li><strong>실시간 즉시 검색</strong>: 전체 섬 목록을 지연 시간(Delay) 없이 검색어 단위로 빠르게 필터링해주는 컴포넌트 편의 기능을 포함하고 있습니다.</li>
          </ul>
        </div>

        {/* islands.json 정보를 islandList 안에 렌더링 */}
        <div id="islandList" className="mt-4 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848484] text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="섬 이름을 검색해 보세요... (예: 굴업도, 덕적도)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F6F6F6] border border-[#D4D4D4] focus:border-[#0F3E17] focus:ring-1 focus:ring-[#0F3E17]/20 outline-none rounded-full py-2.5 pl-9 pr-4 text-xs text-[#282828] placeholder:text-[#848484] transition-all"
            />
          </div>

          {/* Islands Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {filteredIslands.length > 0 ? (
              filteredIslands.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-[#D4D4D4] bg-[#F6F6F6] hover:border-[#0F3E17] transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col gap-1 mb-3">
                      <h3 className="text-sm font-bold text-[#282828] group-hover:text-[#0F3E17] transition-colors">
                        🏝️ {item.island}
                      </h3>
                      <div className="flex flex-col gap-0.5 text-xs text-[#848484]">
                        <span>📍 {item.address}</span>
                        <span>🏷️ 관광공사 코드: {item.areaCode}-{item.sigunguCode}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {item.ferries.map((ferry, fIdx) => (
                        <div key={fIdx} className="bg-white rounded-lg p-3 border border-[#D4D4D4] text-xs flex flex-col gap-1">
                          {item.ferries.length > 1 && (
                            <span className="text-[11px] text-[#0F3E17] font-medium block">
                              경로 옵션 {fIdx + 1}
                            </span>
                          )}
                          <div className="flex justify-between items-center text-[#6A6A6A] whitespace-nowrap break-keep">
                            <span className="shrink-0">⏱️ 소요 시간</span>
                            <span className="font-semibold text-[#282828] whitespace-nowrap break-keep">{ferry.time ? ferry.time.replace(/ /g, "\u00A0") : ""}</span>
                          </div>
                          <div className="flex justify-between items-center text-[#6A6A6A] whitespace-nowrap break-keep">
                            <span className="shrink-0">💰 왕복 요금</span>
                            <span className="font-bold text-[#0F3E17] whitespace-nowrap break-keep">{ferry.fare ? ferry.fare.replace(/ /g, "\u00A0") : ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-[#F6F6F6] border border-dashed border-[#D4D4D4] rounded-xl text-[#848484] text-xs">
                검색 조건에 맞는 섬이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
