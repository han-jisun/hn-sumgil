"use client";

import React, { useState, useEffect } from "react";
import apiPhotosData from "@/app/data/apiPhotos.json";

interface PhotoItem {
  contentId: string;
  title: string;
  webImageUrl: string;
  createdTime: string;
  photographer: string;
  searchKeyword: string;
  photographyLocation: string;
}

const islandKeywords = [
  { name: "전체 16개 섬 (7개)", query: "" },
  { name: "굴업도", query: "굴업도" },
  { name: "대연평 (연평도)", query: "연평" },
  { name: "대이작도", query: "이작도" },
  { name: "대청도", query: "대청도" },
  { name: "덕적도", query: "덕적도" },
  { name: "문갑도", query: "문갑도" },
  { name: "백령도", query: "백령도" },
  { name: "백아도", query: "백아도" },
  { name: "소연평", query: "소연평" },
  { name: "소이작도", query: "소이작도" },
  { name: "소청도", query: "소청도" },
  { name: "승봉도", query: "승봉도" },
  { name: "울도", query: "울도" },
  { name: "자월도", query: "자월도" },
  { name: "지도", query: "지도" },
  { name: "소야도", query: "소야도" },
];

export default function PhotoGalleryList() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const targetQuery = islandKeywords[selectedIdx]?.query || "";

    if (selectedIdx === 0 || !targetQuery) {
      setPhotos(apiPhotosData as PhotoItem[]);
    } else {
      const filtered = (apiPhotosData as PhotoItem[]).filter((item) => {
        const fullStr = `${item.title} ${item.photographyLocation} ${item.searchKeyword}`;
        return fullStr.includes(targetQuery);
      });
      setPhotos(filtered);
    }
    setLoading(false);
  }, [selectedIdx]);

  const copyToClipboard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Island Filter Pills */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {islandKeywords.map((item, idx) => {
          const isActive = selectedIdx === idx;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "border-[#0F3E17] bg-[#0F3E17] text-white"
                  : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#0F3E17] hover:text-[#0F3E17]"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 text-center border border-dashed border-[#D4D4D4] rounded-lg bg-white">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button
            type="button"
            onClick={() => setSelectedIdx(selectedIdx)}
            className="text-xs text-[#0F3E17] underline hover:text-[#093712]"
          >
            다시 시도하기
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && photos.length === 0 && (
        <div className="p-12 text-center border border-dashed border-[#D4D4D4] rounded-lg bg-white">
          <p className="text-base font-medium text-[#282828] mb-1">
            해당 섬의 등록된 공식 사진갤러리가 없습니다.
          </p>
          <p className="text-xs text-[#848484]">
            다른 섬 카테고리를 선택하거나 전체(인천/옹진 섬) 탭을 확인해 보세요.
          </p>
        </div>
      )}

      {/* Photos Grid */}
      {!loading && !error && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.contentId + photo.title}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square rounded-lg overflow-hidden border border-[#D4D4D4] bg-slate-100 cursor-pointer hover:shadow-xl transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${photo.webImageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* ID Badge on Top Left */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <button
                  type="button"
                  onClick={(e) => copyToClipboard(photo.contentId, e)}
                  className="bg-black/75 hover:bg-[#0F3E17] text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/20 transition-all flex items-center gap-1 backdrop-blur-sm"
                  title="클릭하여 ID 복사"
                >
                  <span>🆔 {photo.contentId}</span>
                  {copiedId === photo.contentId ? (
                    <span className="text-[#E6FDE5] text-[10px]">✓ 복사됨</span>
                  ) : (
                    <span className="opacity-60 text-[10px]">📋</span>
                  )}
                </button>
              </div>

              {/* Content Info at Bottom */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-xs font-semibold text-[#E6FDE5] drop-shadow mb-0.5">
                  📷 {photo.photographer}
                </span>
                <h4 className="text-base font-bold leading-tight line-clamp-2 drop-shadow">
                  {photo.title}
                </h4>
                {photo.searchKeyword && (
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-1">
                    #{photo.searchKeyword.split(",").join(" #")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#151D1F] text-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white font-bold flex items-center justify-center hover:bg-black transition-colors"
            >
              ✕
            </button>

            {/* Photo View */}
            <div className="md:w-2/3 bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] md:max-h-[80vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.webImageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>

            {/* Info View */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between gap-4 overflow-y-auto">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center h-6 px-3 rounded-full bg-[#E6FDE5] text-[#0F3E17] text-xs font-semibold">
                    한국관광공사 사진갤러리
                  </span>
                  
                  {/* Copy ID Button in Modal */}
                  <button
                    type="button"
                    onClick={(e) => copyToClipboard(selectedPhoto.contentId, e)}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-[#0F3E17] text-xs font-mono font-bold text-white border border-white/20 transition-all flex items-center gap-1"
                  >
                    <span>🆔 ID: {selectedPhoto.contentId}</span>
                    {copiedId === selectedPhoto.contentId ? (
                      <span className="text-[#E6FDE5] text-[10px]">✓</span>
                    ) : (
                      <span className="opacity-70 text-[10px]">📋</span>
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {selectedPhoto.title}
                </h3>

                <div className="flex flex-col gap-2 pt-3 border-t border-white/10 text-xs text-[#B6CED5]">
                  <p className="flex justify-between">
                    <span className="text-white/60">콘텐츠 ID:</span>
                    <span className="font-mono font-bold text-[#E6FDE5]">{selectedPhoto.contentId}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-white/60">촬영자:</span>
                    <span className="font-medium text-white">{selectedPhoto.photographer}</span>
                  </p>
                  {selectedPhoto.photographyLocation && (
                    <p className="flex justify-between">
                      <span className="text-white/60">촬영 장소:</span>
                      <span className="font-medium text-white">{selectedPhoto.photographyLocation}</span>
                    </p>
                  )}
                  {selectedPhoto.createdTime && (
                    <p className="flex justify-between">
                      <span className="text-white/60">촬영일자:</span>
                      <span className="font-medium text-white">{selectedPhoto.createdTime}</span>
                    </p>
                  )}
                </div>

                {selectedPhoto.searchKeyword && (
                  <div className="mt-2">
                    <span className="text-xs text-white/60 block mb-1">연관 키워드:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedPhoto.searchKeyword.split(",").map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white/10 text-[11px] text-[#E6FDE5]"
                        >
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                {/* 공공누리 제1유형 공식 출처 표기 */}
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#E6FDE5] text-[#0F3E17] font-semibold text-[11px]">
                      공공누리 제1유형:출처표시
                    </span>
                    <span className="text-[11px] text-[#B6CED5]">출처 표시 | 변형 가능 | 상업적 이용 가능</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/80 m-0">
                    본 저작물은 &apos;{selectedPhoto.photographer?.split(" ")[0] || "한국관광공사/인천광역시"}&apos;에서 {selectedPhoto.createdTime ? `${selectedPhoto.createdTime.slice(0, 4)}년 ` : ""}작성하여 공공누리 제1유형으로 개방한 &apos;{selectedPhoto.title}(작성자:{selectedPhoto.photographer})&apos;을 이용하였으며, 해당 저작물은 <a href="https://www.incheon.go.kr" target="_blank" rel="noopener noreferrer" className="text-[#E6FDE5] underline">인천광역시(www.incheon.go.kr)</a> 및 한국관광공사에서 무료로 다운받으실 수 있습니다.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span>Data Source: KTO PhotoGalleryService1</span>
                  <a
                    href={selectedPhoto.webImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E6FDE5] hover:underline"
                  >
                    원본 사진 보기 ↗
                  </a>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
