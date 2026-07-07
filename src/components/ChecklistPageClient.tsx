"use client";

import React, { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  custom?: boolean;
}

interface CategoryDefinition {
  key: string;
  title: string;
  icon: string;
  description: string;
  defaultItems: string[];
}

const mainTabs = [
  { key: "my", title: "나의 체크리스트", icon: "📝", desc: "나만의 맞춤형 준비물과 섬 여행 계획을 자유롭게 기록하세요." },
  { key: "pre_travel", title: "여행전 체크항목", icon: "🚢", desc: "여객선 승선 전 및 섬 입도 전에 반드시 확인해야 할 사전 체크사항" },
  { key: "preparations", title: "준비물", icon: "🎒", desc: "섬 여행 스타일별 추천 준비물 정보" }
];

const prepSubTabs = [
  { key: "common", title: "공통 준비물", icon: "📍" },
  { key: "day", title: "당일치기", icon: "👟" },
  { key: "trek", title: "트레킹", icon: "🥾" },
  { key: "camp", title: "캠핑", icon: "⛺" },
  { key: "mud", title: "갯벌체험", icon: "🐚" }
];

const defaultPreTravelItems = [
  "날씨 및 풍랑 특보 확인하기 (기상 악화 시 결항 여부 확인)",
  "여객선 운항 시간 및 터미널 결항 정보 최종 확인",
  "실시간 물때 정보(만조/간조 시간) 확인 (특히 갯벌체험/해안 트레킹 시)",
  "신분증(모바일 또는 실물) 지참 확인 (미지참 시 여객선 승선 절대 불가!)",
  "멀미약 복용 및 지참 (여객선 출항 30분~1시간 전 미리 복용 권장)",
  "비상용 현금 지참 (섬 내 매점/식당 중 카드 결제가 안 되는 곳 대비)",
  "스마트폰 및 스마트 기기 보조배터리 완충 여부 확인",
  "출발 전 가정 내 가스 밸브 잠금 및 대기 전력 차단 확인"
];

const defaultPrepCommon = [
  "신분증 및 신용카드/현금 지갑",
  "충분한 양의 마실 물 (생수)",
  "개인 물티슈 및 휴지",
  "선크림 및 모자, 자외선 차단 장비",
  "기본 구급약품 (밴드, 소독약, 지혈제, 모기퇴치제)",
  "개인 쓰레기 보관 봉투 (LNT 실천용)"
];

const defaultPrepDay = [
  "편안하고 가벼운 당일용 백팩",
  "오래 걸어도 발이 편안한 운동화",
  "가벼운 돗자리 (해변 및 야외 휴식용)",
  "손수건 또는 소형 타월",
  "보존 및 휴대가 편리한 간단한 행동식 (에너지바 등)",
  "휴대용 미니 선풍기 또는 핫팩 (계절 맞춤)"
];

const defaultPrepTrek = [
  "미끄럼 방지 등산화 또는 트레킹화",
  "체력 안배용 접이식 등산 스틱",
  "체온 유지를 위한 기능성 바람막이 자켓",
  "땀 흡수 및 건조가 빠른 기능성 의류",
  "도보 중 물집을 예방하는 등산용 양말",
  "수분 및 전해질 보충용 이온 음료"
];

const defaultPrepCamp = [
  "경량 백패킹용 텐트 (팩, 폴대 포함)",
  "지면의 냉기를 차단해 줄 에어매트 또는 폼매트",
  "섬 야간 기온 변화에 정합하는 침낭",
  "밤길 및 텐트 내부용 캠핑 랜턴",
  "휴대용 소형 버너 및 코펠 세트 (이소가스)",
  "개인용 수저 및 시에라 컵",
  "방한용 겉옷 (경량패딩) 및 밤샘 보온용 핫팩"
];

const defaultPrepMud = [
  "바닷물과 진흙 범벅에 대비한 여벌 옷 및 속옷",
  "발을 보호할 갯벌 장화 또는 밀착형 아쿠아슈즈 (슬리퍼 불가)",
  "맛조개 채취용 맛소금 및 소금 소분 통",
  "조개 채취용 호미 또는 갯벌 갈퀴",
  "수확한 조개를 담을 소형 지퍼백 또는 플라스틱 통",
  "체험 후 진흙을 닦아낼 수건 및 세정제"
];

const defaultMyItems = [
  "나만의 섬 여행 특별 준비물을 적어보세요! (예: 낚싯대, 카메라, 블루투스 스피커)",
  "이번 섬에서 꼭 방문해 보고 싶은 명소 기록하기",
  "섬 입도 후 먹고 싶은 시그니처 메뉴 적어두기"
];

export default function ChecklistPageClient() {
  const [activeTab, setActiveTab] = useState<string>("my");
  const [activeSubTab, setActiveSubTab] = useState<string>("common");
  const [items, setItems] = useState<Record<string, ChecklistItem[]>>({});
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({
    my: "",
    pre_travel: "",
    preparations_common: "",
    preparations_day: "",
    preparations_trek: "",
    preparations_camp: "",
    preparations_mud: ""
  });
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const loadedItems: Record<string, ChecklistItem[]> = {};

    const loadCategory = (key: string, defaults: string[]) => {
      const saved = localStorage.getItem(`hn_chk_${key}`);
      if (saved) {
        try {
          loadedItems[key] = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse", key, e);
        }
      }
      if (!loadedItems[key] || loadedItems[key].length === 0) {
        loadedItems[key] = defaults.map((text, idx) => ({
          id: `${key}_def_${idx}`,
          text,
          checked: false
        }));
      }
    };

    loadCategory("my", defaultMyItems);
    loadCategory("pre_travel", defaultPreTravelItems);
    loadCategory("preparations_common", defaultPrepCommon);
    loadCategory("preparations_day", defaultPrepDay);
    loadCategory("preparations_trek", defaultPrepTrek);
    loadCategory("preparations_camp", defaultPrepCamp);
    loadCategory("preparations_mud", defaultPrepMud);

    setItems(loadedItems);
    setMounted(true);
  }, []);

  // Save to LocalStorage helper
  const saveCategoryItems = (key: string, newItems: ChecklistItem[]) => {
    setItems(prev => {
      const updated = { ...prev, [key]: newItems };
      localStorage.setItem(`hn_chk_${key}`, JSON.stringify(newItems));
      return updated;
    });
  };

  const toggleCheck = (categoryKey: string, itemId: string) => {
    const catItems = items[categoryKey] || [];
    const updated = catItems.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    saveCategoryItems(categoryKey, updated);
  };

  const handleAddItem = (categoryKey: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newItemTexts[categoryKey]?.trim();
    if (!text) return;

    const catItems = items[categoryKey] || [];
    const newItem: ChecklistItem = {
      id: `${categoryKey}_cust_${Date.now()}`,
      text,
      checked: false,
      custom: true
    };

    saveCategoryItems(categoryKey, [...catItems, newItem]);
    setNewItemTexts(prev => ({ ...prev, [categoryKey]: "" }));
  };

  const handleDeleteItem = (categoryKey: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const catItems = items[categoryKey] || [];
    const updated = catItems.filter(item => item.id !== itemId);
    saveCategoryItems(categoryKey, updated);
  };

  const handleReset = () => {
    if (window.confirm("모든 기록을 초기화하고 기본 세팅으로 되돌리시겠습니까?")) {
      const resetItems: Record<string, ChecklistItem[]> = {};

      const resetCategory = (key: string, defaults: string[]) => {
        const defaultList = defaults.map((text, idx) => ({
          id: `${key}_def_${idx}`,
          text,
          checked: false
        }));
        resetItems[key] = defaultList;
        localStorage.setItem(`hn_chk_${key}`, JSON.stringify(defaultList));
      };

      resetCategory("my", defaultMyItems);
      resetCategory("pre_travel", defaultPreTravelItems);
      resetCategory("preparations_common", defaultPrepCommon);
      resetCategory("preparations_day", defaultPrepDay);
      resetCategory("preparations_trek", defaultPrepTrek);
      resetCategory("preparations_camp", defaultPrepCamp);
      resetCategory("preparations_mud", defaultPrepMud);

      setItems(resetItems);
    }
  };

  // Progress metrics helper
  const getProgressStats = () => {
    let total = 0;
    let checked = 0;

    Object.keys(items).forEach(key => {
      items[key].forEach(item => {
        total++;
        if (item.checked) checked++;
      });
    });

    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, percent };
  };

  if (!mounted) {
    return (
      <div className="container m-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin m-auto mb-4"></div>
        <p className="text-xs text-text-muted">리스트 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const { total, checked, percent } = getProgressStats();

  // Helper to resolve currently visible item database key based on state
  const getCurrentCategoryKey = () => {
    if (activeTab === "my") return "my";
    if (activeTab === "pre_travel") return "pre_travel";
    return `preparations_${activeSubTab}`;
  };

  const currentKey = getCurrentCategoryKey();
  const currentItems = items[currentKey] || [];
  const currentTitle = activeTab === "preparations" 
    ? `${mainTabs.find(t => t.key === activeTab)?.title} - ${prepSubTabs.find(s => s.key === activeSubTab)?.title}`
    : mainTabs.find(t => t.key === activeTab)?.title || "";

  return (
    <div className="py-10 pb-[100px] container m-auto px-6 max-w-[900px]">
      
      {/* Page Header */}
      <section className="mb-10 text-center">
        <h1 className="text-[2.2rem] font-bold mb-3 tracking-tight bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent">
          🎒 섬 여행 체크리스트
        </h1>
        <p className="text-xs text-text-secondary max-w-[600px] m-auto leading-relaxed">
          여객선 승선 전 검토사항부터 당일치기, 트레킹, 백패킹 캠핑, 갯벌 활동 맞춤형 준비물까지 한눈에 체크하세요.
        </p>
      </section>

      {/* Progress & Shortcuts Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex flex-col gap-2 flex-1 w-full text-center md:text-left">
          <span className="text-[0.7rem] text-text-muted font-bold tracking-wider uppercase">전체 체크 상태</span>
          <div className="flex items-baseline gap-2.5 justify-center md:justify-start">
            <span className="text-3xl font-extrabold text-primary">{percent}%</span>
            <span className="text-xs text-text-secondary">({checked} / {total} 개 완료)</span>
          </div>
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 mt-1.5">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-[600ms] ease-out shadow-[0_0_10px_rgba(14,165,233,0.3)]"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons: Reset and Go to My Checklist Shortcut */}
        <div className="flex flex-wrap gap-2.5 shrink-0 justify-center">
          {activeTab !== "my" && (
            <button 
              onClick={() => setActiveTab("my")}
              className="px-4.5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              🎯 나의 체크리스트 바로가기
            </button>
          )}
          <button 
            onClick={handleReset}
            className="px-4.5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 shadow-md cursor-pointer"
            title="모든 항목 기본 상태로 초기화"
          >
            🔄 전체 리셋
          </button>
        </div>
      </div>

      {/* High-Level Tabs Menu */}
      <div className="flex gap-2 justify-center mb-6 pb-2 border-b border-white/5">
        {mainTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === tab.key
                ? "bg-primary text-black shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
                : "bg-white/3 text-text-secondary hover:text-text-primary hover:bg-white/8"
            }`}
          >
            <span>{tab.icon}</span> {tab.title}
          </button>
        ))}
      </div>

      {/* Sub-Tabs Menu (Only visible when 'preparations' is active) */}
      {activeTab === "preparations" && (
        <div className="flex flex-wrap gap-2 justify-center mb-8 bg-white/2 border border-white/5 p-2 rounded-2xl max-w-lg m-auto animate-fadeIn">
          {prepSubTabs.map(subTab => (
            <button
              key={subTab.key}
              onClick={() => setActiveSubTab(subTab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-[0.7rem] font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                activeSubTab === subTab.key
                  ? "bg-secondary text-black"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              }`}
            >
              <span>{subTab.icon}</span> {subTab.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Checklist Card Display */}
      <div className="rounded-2xl border border-card-border bg-[#0a0a0f]/40 glass-panel overflow-hidden transition-all duration-300">
        
        {/* Category Header Card */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-[#030712]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-2xl bg-white/5 p-2 rounded-xl border border-white/5 shrink-0">
              {activeTab === "preparations" 
                ? prepSubTabs.find(s => s.key === activeSubTab)?.icon 
                : mainTabs.find(t => t.key === activeTab)?.icon}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[1.15rem] font-bold text-text-primary">
                {currentTitle}
              </h3>
              <p className="text-[0.7rem] text-text-secondary max-w-[500px] leading-relaxed">
                {activeTab === "preparations" 
                  ? `${prepSubTabs.find(s => s.key === activeSubTab)?.title}을 위한 최적의 추천 장비 리스트입니다.`
                  : mainTabs.find(t => t.key === activeTab)?.desc}
              </p>
            </div>
          </div>

          {/* Local statistics */}
          <div className="flex flex-col items-end shrink-0 gap-1.5 text-xs text-text-secondary font-semibold">
            <span>
              {currentItems.filter(i => i.checked).length} / {currentItems.length} 완료
            </span>
            <div className="w-20 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ 
                  width: `${currentItems.length > 0 
                    ? Math.round((currentItems.filter(i => i.checked).length / currentItems.length) * 100) 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Checklist Content Items */}
        <div className="p-6 md:p-8 flex flex-col gap-4">
          
          {/* Add custom item form (Visible in ALL views to allow maximum flexibility, especially for 'my' checklist) */}
          <form 
            onSubmit={(e) => handleAddItem(currentKey, e)}
            className="flex gap-2 bg-[#09090f]/40 border border-white/5 p-2.5 rounded-xl mb-2"
          >
            <input
              type="text"
              placeholder={activeTab === "my" 
                ? "나의 체크리스트에 직접 준비물이나 계획을 입력하고 추가해보세요..." 
                : `현재 '${currentTitle}'에 개별 준비물 직접 입력 추가...`}
              value={newItemTexts[currentKey] || ""}
              onChange={(e) => setNewItemTexts(prev => ({ ...prev, [currentKey]: e.target.value }))}
              className="flex-1 bg-transparent outline-none border-none px-2 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
            />
            <button
              type="submit"
              className="px-4.5 py-1.5 bg-primary text-black font-bold text-xs rounded-lg transition-all duration-300 cursor-pointer shrink-0 hover:bg-primary/90 hover:scale-[1.02] shadow-[0_2px_8px_rgba(14,165,233,0.2)]"
            >
              직접 추가
            </button>
          </form>

          {/* Checklist Loop */}
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <li key={item.id} className="w-full">
                  <div
                    onClick={() => toggleCheck(currentKey, item.id)}
                    className={`flex items-center justify-between py-3.5 px-4.5 cursor-pointer rounded-xl border transition-all duration-300 bg-[#12121e]/50 hover:bg-[#12121e]/80 ${
                      item.checked 
                        ? "border-primary/20 bg-primary/2" 
                        : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Check Box */}
                      <div
                        className={`w-5 h-5 border-2 rounded-[6px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                          item.checked 
                            ? "border-primary bg-primary text-black animate-scaleIn" 
                            : "border-text-muted bg-transparent"
                        }`}
                      >
                        {item.checked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {/* Text */}
                      <span
                        className={`text-[0.8rem] transition-all duration-300 ${
                          item.checked ? "text-text-muted line-through" : "text-text-secondary font-medium"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>

                    {/* Delete Custom button (allow custom deletions in any category) */}
                    {(item.custom || activeTab === "my") && (
                      <button
                        onClick={(e) => handleDeleteItem(currentKey, item.id, e)}
                        className="text-text-muted hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors shrink-0 outline-none border-none cursor-pointer"
                        title="준비물 제거"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-10 bg-white/2 border border-dashed border-white/5 rounded-xl text-text-muted text-xs">
                리스트가 비어 있습니다. 상단에서 직접 새로운 할 일이나 준비물을 추가해 보세요!
              </div>
            )}
          </ul>

        </div>

      </div>

    </div>
  );
}
