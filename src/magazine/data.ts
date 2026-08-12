export interface ThemeContent {
  date: string;
  writer: string;
  id: string;
  title: string;
  file_name: string;
}

export const themeContents: ThemeContent[] = [
  {
    date: "2026-07-25",
    writer: "한지선",
    id: "vol1",
    title: "여름 섬의 낭만: 대청도 비경부터 힐링 해변과 플레이리스트",
    file_name: "vol1.html"
  },
  {
    date: "2026-09-20",
    writer: "한지선",
    id: "vol2",
    title: "백패커의 낭만, 자월도 밤바다와 제철 밥상",
    file_name: "vol2.html"
  }
];

export default themeContents;
