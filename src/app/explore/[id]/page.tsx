import { notFound } from "next/navigation";
import islandsData from "@/app/data/islands.json";
import IslandDetailClient from "@/components/IslandDetailClient";

interface IslandData {
  island: string;
}

const islandIdMap: Record<string, string> = {
  "굴업도": "gureopdo",
  "대연평": "daeyeonpyeong",
  "대이작도": "daeijakdo",
  "대청도": "daecheongdo",
  "덕적도": "deokjeokdo",
  "문갑도": "mungapdo",
  "백령도": "baengnyeongdo",
  "백아도": "baegado",
  "소연평": "soyeonpyeong",
  "소이작도": "soijakdo",
  "소청도": "socheongdo",
  "승봉도": "seungbongdo",
  "울도": "uldo",
  "자월도": "jawoldo",
  "지도": "jido",
  "소야도": "soyado"
};

const islandNameMap: Record<string, string> = Object.entries(islandIdMap).reduce(
  (acc, [name, id]) => ({ ...acc, [id]: name }),
  {} as Record<string, string>
);

export async function generateStaticParams() {
  return Object.values(islandIdMap).map((id) => ({
    id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IslandDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Resolve Korean name from safe alphanumeric ID, fallback to decoded parameter
  const islandName = islandNameMap[id] || decodeURIComponent(id);

  const islandExists = (islandsData as IslandData[]).some(
    (i) => i.island === islandName
  );

  if (!islandExists) {
    notFound();
  }

  return <IslandDetailClient islandName={islandName} />;
}
