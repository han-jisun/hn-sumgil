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
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(14,165,233,0.06)_0%,transparent_70%)] -z-10 pointer-events-none blur-[40px]"></div>

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
            <p>해당 데이터는 <strong>네이버 블로그 검색 API</strong>를 실시간 연동하여 블로그 게시글 정보를 바탕으로 판별합니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>네이버 API:</span>
                <span className="text-secondary font-medium break-all">openapi.naver.com/v1/search/blog.json</span>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">백패킹 가능 판별 기준 및 데이터 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>소셜 데이터 분석</strong>: 단순 행정 구역 지정 여부를 넘어 실제 백패커들의 방문 후기와 경험담 데이터를 토대로 실질적인 야영 여부를 유추합니다.</li>
                <li><strong>최근성 및 신뢰성 유지</strong>: 시의성 있는 유효 정보 제공을 위해 과거 아카이브 글이 아닌 최근 3년 내 작성된 포스팅 정보만을 기준으로 판정합니다.</li>
                <li><strong>정밀 키워드 매칭</strong>: 광고성 글이나 무관한 검색 결과를 필터링하기 위해 블로그 제목에 섬 이름과 '백패킹' 키워드가 정확히 매칭되는 건수가 10건 이상일 때만 가능으로 분류합니다.</li>
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
            <p>해당 데이터는 <strong>한국관광공사 고캠핑(GoCamping) API</strong>를 실시간 호출하여 가져옵니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>공공데이터포털 API:</span>
                <a 
                  href="https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15052981"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-secondary font-medium break-all"
                >
                  apis.data.go.kr/B551011/GoCamping/searchList
                </a>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 제공 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>공신력 있는 시설 검증</strong>: 문화체육관광부와 한국관광공사가 인증 및 관리하는 전국 등록 야영장(일반캠핑, 글램핑, 카라반 등) 정보만 필터링하여 안전하고 공신력 높은 정보를 제공합니다.</li>
                <li><strong>상세 스펙 연동</strong>: 야영장의 전체 주소, 주요 편도 부대시설 정보(전기, 온수, 무선인터넷, 놀이터 등), 예약 방법(전화/홈페이지), 야영장 소개글 및 대표 썸네일 이미지를 상세 매핑합니다.</li>
                <li><strong>1일 단위 API 캐싱</strong>: 한국관광공사 오픈 API의 호출 속도 개선 및 과도한 요청 방지를 위해 하루 동안 응답 결과를 서버 캐시(`revalidate: 86400`)로 관리합니다.</li>
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
            <p>해당 데이터는 <strong>네이버 지역 검색 API (캐시 데이터)</strong>와 <strong>공공데이터포털(ODCloud)의 일반음식점 현황 API</strong>를 실시간으로 조합하여 제공합니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>네이버 데이터:</span>
                <span className="text-secondary font-medium break-all">openapi.naver.com/v1/search/local.json (로컬 캐시 연동)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>공공데이터 API:</span>
                <span className="text-secondary font-medium break-all">api.odcloud.kr/api</span>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 병합 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>정보 완전성 보완</strong>: 공공데이터포털 API의 누락 정보(예: 대이작도 등 신규 인허가 데이터에 없는 기존 주요 맛집)를 보완하기 위해 각 섬별 네이버 검색 맛집 데이터를 병합합니다.</li>
                <li><strong>자동 중복 제거</strong>: 상호명 기준 중복 필터링을 적용해 동일 음식점이 중복 노출되지 않도록 제어합니다.</li>
                <li><strong>고가용성 장애 대응(Fallback)</strong>: 공공데이터포털 API 장애 또는 포맷 변경 등의 예외 발생 시, 캐시된 네이버 데이터 단독으로 목록을 표출하여 서비스 중단이 발생하지 않도록 조치되었습니다.</li>
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
            <p>해당 데이터는 <strong>공공데이터포털(ODCloud)의 옹진군 숙박업소(민박) 현황 API</strong>를 통해 로드합니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>공공데이터 API:</span>
                <span className="text-secondary font-medium break-all">api.odcloud.kr/api/15127508/v1</span>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 제공 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>공식 인허가 데이터 연동</strong>: 옹진군 관할청에 인허가 및 적법하게 등록된 정식 민박, 펜션, 숙박시설 데이터를 표출하므로 숙소 안정성이 높습니다.</li>
                <li><strong>섬별 자동 분류 시스템</strong>: 공공데이터의 전체 숙박업소 주소록을 파싱하여, 각 섬별(예: 굴업도, 자월도, 덕적도 등) 주소에 해당하는 숙소 리스트로 자동 가공하여 분류 제공합니다.</li>
                <li><strong>정보 모니터링 경보</strong>: 공공 API 구조가 변동되는 등의 비정상 응답이 감지되는 경우, 서버 내부에서 자가진단 에러 로그를 남겨 이슈에 즉각적으로 대응할 수 있게 개발되었습니다.</li>
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
            <p>해당 데이터는 <strong>한국관광공사 국문 관광정보 서비스(KorService2) API</strong>를 실시간 활용합니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>공공데이터 API:</span>
                <span className="text-secondary font-medium break-all">apis.data.go.kr/B551011/KorService2/areaBasedList2</span>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 제공 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>테마형 컨텐츠 추출</strong>: 수많은 관광정보 중 섬 여행객의 니즈에 맞추어 관광지(12), 문화시설(14), 레포츠(28) 등 아웃도어/관광에 특화된 성격의 정보군만 세밀하게 선별하여 제공합니다.</li>
                <li><strong>상세 백과식 정보 동적 로드</strong>: 메인 목록 카드에서 개별 관광지 요소를 클릭할 시, 해당 관광지의 상세 소개(소개글/Overview), 현지 문의 전화번호, 공식 웹사이트 경로 등을 동적으로 추가 조회합니다.</li>
                <li><strong>정적 이미지 필터링</strong>: 한국관광공사가 제공하는 고화질 랜드마크 이미지를 기반으로 리스트를 렌더링하고, 이미지가 부재한 경우에도 깨짐이 없도록 예외 이미지 가드 로직을 탑재했습니다.</li>
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
            <p>해당 데이터는 <strong>유튜브 공식 검색 엔진 결과</strong>를 연동하여 가공 노출합니다.</p>
            <div className="flex flex-col gap-1 text-secondary">
              <p className="flex items-center gap-1.5">
                <span>연동 방식:</span>
                <span className="text-secondary font-medium break-all">youtube.com/results?search_query=섬이름+여행 (실시간 메타 정보 3건 추출)</span>
              </p>
            </div>
            <div className="mt-2 pt-3 border-t border-white/5">
              <span className="font-semibold text-text-primary block mb-2">데이터 수집 및 제공 특징</span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-text-secondary">
                <li><strong>미디어 트렌드 실시간 반영</strong>: 정적인 텍스트 정보를 넘어, 실제 최근 섬 크리에이터들이 올린 영상(조회수, 업로드 일자 포함)을 연동함으로써 시각적이고 생생한 가이드를 제공합니다.</li>
                <li><strong>인라인 모달 플레이어 지원</strong>: 사용자가 유튜브 웹이나 앱으로 이동하지 않고도 모달 또는 내장형 아이프레임(iFrame) 플레이어를 구현해 사이트 내에서 영상을 즉시 시청할 수 있습니다.</li>
                <li><strong>섬 중심 콘텐츠 가드</strong>: 검색 노이즈를 막고 여행/캠핑/도보 여행 목적에 가장 잘 어울리는 리뷰 영상이 상위에 필터링되도록 검색 쿼리 파라미터를 최적화했습니다.</li>
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
