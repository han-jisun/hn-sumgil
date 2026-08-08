import gulup1 from "@/images/main/gulup_1.jpg";
import duckjuck2 from "@/images/main/duckjuck_2.jpg";
import daeijack3 from "@/images/main/daeijack_3.jpg";
import seongbong4 from "@/images/main/seongbong_4.jpg";

export interface HeroSlide {
  name: string;
  image: string;
  placeholder: string;
}

export const heroSlidesData: HeroSlide[] = [
  {
    name: "굴업도 개머리언덕",
    image: gulup1.src,
    placeholder: "히어로 1 — 굴업도 개머리언덕",
  },
  {
    name: "덕적도 능동자갈마당",
    image: duckjuck2.src,
    placeholder: "히어로 2 — 덕적도 능동자갈마당",
  },
  {
    name: "대이작도 해안산책로",
    image: daeijack3.src,
    placeholder: "히어로 3 — 대이작도 해안산책로",
  },
  {
    name: "승봉도 촛대바위",
    image: seongbong4.src,
    placeholder: "히어로 4 — 승봉도 촛대바위",
  },
];

export const rollingSubtitles: string[] = [
  "백패킹과 1박 4식 미식을 담은 인천 섬 테마 정보",
  "떠나기 전 꼭 필요한 인천 16개 섬 맞춤 가이드",
  "트래킹·낚시·갯벌체험 스팟도 한눈섬길에서 한번에",
];
