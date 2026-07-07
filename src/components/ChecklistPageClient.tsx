"use client";

import React, { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  custom?: boolean;
}

interface ChecklistCategory {
  key: string;
  title: string;
  icon: string;
  description: string;
  defaultItems: string[];
}

const defaultCategories: ChecklistCategory[] = [
  {
    key: "essentials",
    title: "필수 준비물",
    icon: "🪪",
    description: "여객선 탑승 및 섬 여행 시 반드시 지참해야 하는 생존 필수품",
    defaultItems: [
      "신분증 (모바일 신분증 포함 - 여객선 탑승 시 필수!)",
      "여객선 승선권 (온라인 예매 확인증)",
      "비상금 및 신용카드 (섬 내 일부 상점 카드 불가 대비)",
      "휴대폰 및 보조 배터리 (충전선 포함)",
      "개인 상비약 (멀미약 - 탑승 30분 전 복용 필수!)",
      "생수 및 간단한 행동식 (초콜릿, 에너지바)"
    ]
  },
  {
    key: "camping",
    title: "야영/백패킹 장비",
    icon: "⛺",
    description: "섬 내 야영장 혹은 노지에서 쾌적한 하룻밤을 위한 취침 장비",
    defaultItems: [
      "백패킹 배낭 (레인커버 포함)",
      "경량 텐트 (팩, 폴대, 그라운드시트 필수)",
      "침낭 (계절 및 섬 기온에 맞는 스펙)",
      "매트리스 (롤 매트 또는 에어매트)",
      "헤드랜턴 또는 텐트 조명 (여분 배터리)",
      "멀티툴 및 아웃도어 나이프",
      "캠핑 의자 및 미니 테이블"
    ]
  },
  {
    key: "cooking",
    title: "취사 및 식음료",
    icon: "🍳",
    description: "화기 사용 가능 지역에서의 자급자족 식사를 위한 준비물",
    defaultItems: [
      "경량 버너 (스토브) 및 이소가스 (섬 내 구매 제한적)",
      "코펠 및 식기 세트 (수저 포함)",
      "비상식량 및 전투식량 (발열팩 전투식량 추천)",
      "쓰레기 봉투 (LNT - 자기 쓰레기 되가져가기 필수!)",
      "음식 보관용 지퍼백 및 보온보냉백",
      "소형 드립백 커피 또는 티백"
    ]
  },
  {
    key: "clothing",
    title: "의류 및 개인 위생",
    icon: "🥾",
    description: "변덕스러운 해상 날씨와 체온 유지를 방어하기 위한 의복류",
    defaultItems: [
      "방풍 자켓 및 기능성 바람막이 (섬 기온 변화 방어)",
      "우의/판초우의 (우천 대비)",
      "트레킹화 또는 등산화 (해안가 자갈밭 보호)",
      "여분 의류 및 양말 (땀/바닷물 대비)",
      "모자, 선글라스 및 쿨토시",
      "선크림 및 모기퇴치제 (해충 방어)",
      "물티슈 및 소형 타월, 세면도구"
    ]
  }
];

export default function ChecklistPageClient() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [items, setItems] = useState<Record<string, ChecklistItem[]>>({});
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({
    essentials: "",
    camping: "",
    cooking: "",
    clothing: ""
  });
  const [mounted, setMounted] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const loadedItems: Record<string, ChecklistItem[]> = {};
    
    defaultCategories.forEach(cat => {
      const saved = localStorage.getItem(`hn_checklist_${cat.key}`);
      if (saved) {
        try {
          loadedItems[cat.key] = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse checklist items:", e);
        }
      }
      
      // Fallback to defaults if empty or not saved
      if (!loadedItems[cat.key] || loadedItems[cat.key].length === 0) {
        loadedItems[cat.key] = cat.defaultItems.map((text, idx) => ({
          id: `${cat.key}_default_${idx}`,
          text,
          checked: false
        }));
      }
    });

    setItems(loadedItems);
    setMounted(true);
  }, []);

  // Save to LocalStorage helper
  const saveCategoryItems = (key: string, newItems: ChecklistItem[]) => {
    setItems(prev => {
      const updated = { ...prev, [key]: newItems };
      localStorage.setItem(`hn_checklist_${key}`, JSON.stringify(newItems));
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
      id: `${categoryKey}_custom_${Date.now()}`,
      text,
      checked: false,
      custom: true
    };

    saveCategoryItems(categoryKey, [...catItems, newItem]);
    setNewItemTexts(prev => ({ ...prev, [categoryKey]: "" }));
  };

  const handleDeleteItem = (categoryKey: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling checkbox
    const catItems = items[categoryKey] || [];
    const updated = catItems.filter(item => item.id !== itemId);
    saveCategoryItems(categoryKey, updated);
  };

  const handleReset = () => {
    if (window.confirm("모든 체크리스트 기록을 초기화하고 기본 준비물로 되돌리시겠습니까?")) {
      const resetItems: Record<string, ChecklistItem[]> = {};
      defaultCategories.forEach(cat => {
        const defaultList = cat.defaultItems.map((text, idx) => ({
          id: `${cat.key}_default_${idx}`,
          text,
          checked: false
        }));
        resetItems[cat.key] = defaultList;
        localStorage.setItem(`hn_checklist_${cat.key}`, JSON.stringify(defaultList));
      });
      setItems(resetItems);
    }
  };

  // Progress metrics
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
        <p className="text-xs text-text-muted">준비물 리스트를 로드하는 중...</p>
      </div>
    );
  }

  const { total, checked, percent } = getProgressStats();

  return (
    <div className="py-10 pb-[100px] container m-auto px-6 max-w-[1000px]">
      
      {/* Page Header */}
      <section className="mb-10 text-center">
        <h1 className="text-[2.2rem] font-bold mb-3 tracking-tight bg-gradient-to-br from-white to-text-secondary bg-clip-text text-transparent">
          🎒 섬 여행 체크리스트
        </h1>
        <p className="text-xs text-text-secondary max-w-[600px] m-auto leading-relaxed">
          인천의 보물 같은 섬으로의 여정을 떠나기 전, 누락하기 쉬운 필수 아웃도어/생활 준비물을 검토하세요. 
          체크리스트 상태는 자동으로 브라우저에 저장됩니다.
        </p>
      </section>

      {/* Progress & Control Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-card-border bg-[#0a0a0f]/60 glass-panel flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex flex-col gap-2 flex-1 w-full text-center md:text-left">
          <span className="text-[0.7rem] text-text-muted font-bold tracking-wider uppercase">전체 체크율</span>
          <div className="flex items-baseline gap-2.5 justify-center md:justify-start">
            <span className="text-3xl font-extrabold text-primary">{percent}%</span>
            <span className="text-xs text-text-secondary">({checked} / {total} 개 완료)</span>
          </div>
          {/* Progress bar container */}
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 mt-1.5">
            <div 
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-[600ms] ease-out shadow-[0_0_10px_rgba(14,165,233,0.3)]"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 shadow-md shrink-0 cursor-pointer"
        >
          🔄 전체 리스트 초기화
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 pb-2 border-b border-white/5">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
            activeTab === "all"
              ? "bg-primary text-black shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
              : "bg-white/3 text-text-secondary hover:text-text-primary hover:bg-white/8"
          }`}
        >
          🔍 전체 보기
        </button>
        {defaultCategories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === cat.key
                ? "bg-primary text-black shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
                : "bg-white/3 text-text-secondary hover:text-text-primary hover:bg-white/8"
            }`}
          >
            <span>{cat.icon}</span> {cat.title}
          </button>
        ))}
      </div>

      {/* Categories Grid/List */}
      <div className="flex flex-col gap-8">
        {defaultCategories
          .filter(cat => activeTab === "all" || activeTab === cat.key)
          .map(cat => {
            const catItems = items[cat.key] || [];
            const catChecked = catItems.filter(i => i.checked).length;
            const catTotal = catItems.length;
            const catPercent = catTotal > 0 ? Math.round((catChecked / catTotal) * 100) : 0;

            return (
              <div 
                key={cat.key} 
                className="rounded-2xl border border-card-border bg-[#0a0a0f]/40 glass-panel overflow-hidden transition-all duration-300"
              >
                {/* Category Header */}
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#030712]/45">
                  <div className="flex items-start gap-3.5">
                    <span className="text-2xl bg-white/5 p-2 rounded-xl border border-white/5 shrink-0">{cat.icon}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2">
                        {cat.title}
                      </h3>
                      <p className="text-[0.7rem] text-text-secondary max-w-[500px] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Category Progress Stats */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="text-xs font-semibold text-text-secondary">
                      {catChecked} / {catTotal} 완료 ({catPercent}%)
                    </span>
                    <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${catPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 md:p-8 flex flex-col gap-3">
                  <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                    {catItems.map(item => (
                      <li key={item.id} className="w-full">
                        <div
                          onClick={() => toggleCheck(cat.key, item.id)}
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
                                  ? "border-primary bg-primary text-black" 
                                  : "border-text-muted bg-transparent"
                              }`}
                            >
                              {item.checked && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            {/* Item Text */}
                            <span
                              className={`text-[0.8rem] transition-all duration-300 ${
                                item.checked ? "text-text-muted line-through" : "text-text-secondary font-medium"
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>

                          {/* Delete Action button for Custom Items */}
                          {item.custom && (
                            <button
                              onClick={(e) => handleDeleteItem(cat.key, item.id, e)}
                              className="text-text-muted hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors shrink-0 outline-none border-none cursor-pointer"
                              title="준비물 항목 삭제"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Add Custom Item Form */}
                  <form 
                    onSubmit={(e) => handleAddItem(cat.key, e)}
                    className="flex gap-2 mt-2 pt-2 border-t border-white/5"
                  >
                    <input
                      type="text"
                      placeholder={`새로운 ${cat.title} 추가...`}
                      value={newItemTexts[cat.key] || ""}
                      onChange={(e) => setNewItemTexts(prev => ({ ...prev, [cat.key]: e.target.value }))}
                      className="flex-1 bg-[#09090f]/60 border border-white/5 hover:border-white/10 focus:border-primary outline-none rounded-xl py-2 px-3.5 text-xs text-text-primary placeholder:text-text-muted transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/5 hover:bg-primary hover:text-black border border-white/5 font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer shrink-0"
                    >
                      추가
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
