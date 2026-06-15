"use client";

import SumList from "@/components/SumList";
import BackpackingCheck from "@/components/BackpackingCheck";
import CampingList from "@/components/CampingList";
import RestaurantList from "@/components/RestaurantList";
import LodgeList from "@/components/lodgeList";
import EtcList from "@/components/etc";
import YoutubeList from "@/components/YoutubeList";

export default function DataPage() {
  return (
    <div className="py-12 px-6 container m-auto min-h-[80vh] relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>

      {/* Header Section */}
      <section className="text-center max-w-[700px] m-auto mb-16">
        <h1 className="text-[2.5rem] font-bold tracking-tight mb-4 text-text-primary">
          섬 데이터 <span className="bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent">검증</span>
        </h1>
      </section>

      {/* Data Modules List */}
      <div className="flex flex-col gap-10 max-w-[1000px] m-auto">
        
        {/* Item 1: 섬리스트 (SumList 컴포넌트 호출) */}
        <SumList />

        {/* Item 2: 섬 별 백패킹 가능 여부 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">2. 섬 별 백패킹 가능 여부</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 네이버 검색 api를 통해 블로그 정보를 불러옵니다.</p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">아래 조건이 일치하면 백패킹이 가능한 섬이라 판단합니다.</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 이름 + 백패킹 검색어가 네이버 블로그 제목에 정확히 포함이 되는 글</li>
                <li>위 최근 3년간 10건 이상일 때</li>
              </ul>
            </div>
          </div>
          {/* 백패킹 기능 로드 */}
          <BackpackingCheck />
        </div>

        {/* Item 3: 공식 캠핑장 여부 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">3. 공식 캠핑장 여부</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 한국관광공사 고캠핑 api를 통해 가져올 예정입니다.</p>
            <p className="flex items-center gap-1.5 text-secondary">
              <span>url :</span>
              <a 
                href="https://www.data.go.kr/iim/api/selectAPIAcountView.do"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-secondary font-medium break-all"
              >
                https://www.data.go.kr/iim/api/selectAPIAcountView.do
              </a>
            </p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">표출할 데이터</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 별 공식 야영장 정보</li>
              </ul>
            </div>
          </div>
          {/* 캠핑장 기능 로드 */}
          <CampingList />
        </div>

        {/* Item 4: 주변 음식점 정보 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">4. 주변 음식점 정보</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 공공데이터포털의 일반음식점 현황 API를 통해 가져옵니다.</p>
            <p className="flex items-center gap-1.5 text-secondary">
              <span>endpoint :</span>
              <span className="text-secondary font-medium break-all">api.odcloud.kr/api</span>
            </p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">표출할 데이터</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 별 주변 일반음식점 현황 (업소명, 업태, 주소, 연락처)</li>
              </ul>
            </div>
          </div>
          {/* 음식점 기능 로드 */}
          <RestaurantList />
        </div>

        {/* Item 5: 섬 별 숙박업소 현황 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">5. 섬 별 숙박업소 현황</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 공공데이터포털의 숙박업소 현황 API를 통해 가져옵니다.</p>
            <p className="flex items-center gap-1.5 text-secondary">
              <span>endpoint :</span>
              <span className="text-secondary font-medium break-all">api.odcloud.kr/api</span>
            </p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">표출할 데이터</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 별 숙박시설 현황 (상호명, 주소, 객실 수, 대표자명)</li>
              </ul>
            </div>
          </div>
          {/* 숙박 시설 기능 로드 */}
          <LodgeList />
        </div>

        {/* Item 6: 섬 내 가볼 만한 명소/관광지 목록 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">6. 섬 내 가볼 만한 명소/관광지 목록</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 한국관광공사 국문 관광정보 서비스(KorService2) API를 통해 가져옵니다.</p>
            <p className="flex items-center gap-1.5 text-secondary">
              <span>endpoint :</span>
              <span className="text-secondary font-medium break-all">KorService2/areaBasedList2</span>
            </p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">표출할 데이터</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 별 가볼 만한 명소, 문화시설 및 레포츠 정보 (명소명, 구분, 주소, 이미지 등)</li>
              </ul>
            </div>
          </div>
          {/* 관광지/명소 기능 로드 */}
          <EtcList />
        </div>

        {/* Item 7: 섬 별 인기 유튜브 영상 */}
        <div className="w-full p-8 glass-panel border border-card-border shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-text-primary mb-4">7. 섬 별 인기 유튜브 영상</h2>
          <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-3 mb-8">
            <p>해당 데이터는 유튜브 검색 결과를 파싱하여 노출하며, 섬별 인기 여행/리뷰 동영상 3개를 가져옵니다.</p>
            <p className="flex items-center gap-1.5 text-secondary">
              <span>endpoint :</span>
              <span className="text-secondary font-medium break-all">youtube.com/results?search_query</span>
            </p>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">표출할 데이터</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li>섬 별 유튜브 동영상 정보 및 채널명, 조회수, 업로드일 정보 (인라인 플레이어로 재생 가능)</li>
              </ul>
            </div>
          </div>
          {/* 유튜브 목록 기능 로드 */}
          <YoutubeList />
        </div>

      </div>
    </div>
  );
}
